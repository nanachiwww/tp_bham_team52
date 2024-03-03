import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { StressTrackerFormService, StressTrackerFormGroup } from './stress-tracker-form.service';
import { IStressTracker } from '../stress-tracker.model';
import { StressTrackerService } from '../service/stress-tracker.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';

@Component({
  selector: 'jhi-stress-tracker-update',
  templateUrl: './stress-tracker-update.component.html',
})
export class StressTrackerUpdateComponent implements OnInit {
  isSaving = false;
  stressTracker: IStressTracker | null = null;

  userProfilesSharedCollection: IUserProfile[] = [];

  editForm: StressTrackerFormGroup = this.stressTrackerFormService.createStressTrackerFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected stressTrackerService: StressTrackerService,
    protected stressTrackerFormService: StressTrackerFormService,
    protected userProfileService: UserProfileService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUserProfile = (o1: IUserProfile | null, o2: IUserProfile | null): boolean => this.userProfileService.compareUserProfile(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ stressTracker }) => {
      this.stressTracker = stressTracker;
      if (stressTracker) {
        this.updateForm(stressTracker);
      }

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('teamprojectApp.error', { message: err.message })),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const stressTracker = this.stressTrackerFormService.getStressTracker(this.editForm);
    if (stressTracker.id !== null) {
      this.subscribeToSaveResponse(this.stressTrackerService.update(stressTracker));
    } else {
      this.subscribeToSaveResponse(this.stressTrackerService.create(stressTracker));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IStressTracker>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(stressTracker: IStressTracker): void {
    this.stressTracker = stressTracker;
    this.stressTrackerFormService.resetForm(this.editForm, stressTracker);

    this.userProfilesSharedCollection = this.userProfileService.addUserProfileToCollectionIfMissing<IUserProfile>(
      this.userProfilesSharedCollection,
      stressTracker.userProfile
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userProfileService
      .query()
      .pipe(map((res: HttpResponse<IUserProfile[]>) => res.body ?? []))
      .pipe(
        map((userProfiles: IUserProfile[]) =>
          this.userProfileService.addUserProfileToCollectionIfMissing<IUserProfile>(userProfiles, this.stressTracker?.userProfile)
        )
      )
      .subscribe((userProfiles: IUserProfile[]) => (this.userProfilesSharedCollection = userProfiles));
  }
}
