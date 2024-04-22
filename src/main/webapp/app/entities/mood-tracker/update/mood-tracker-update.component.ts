import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { MoodTrackerFormService, MoodTrackerFormGroup } from './mood-tracker-form.service';
import { IMoodTracker } from '../mood-tracker.model';
import { NewMoodTracker } from '../mood-tracker.model';
import { MoodTrackerService } from '../service/mood-tracker.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';
import { Mood } from 'app/entities/enumerations/mood.model';

@Component({
  selector: 'jhi-mood-tracker-update',
  templateUrl: './mood-tracker-update.component.html',
})
export class MoodTrackerUpdateComponent implements OnInit {
  isSaving = false;
  moodTracker: IMoodTracker | null = null;
  moodValues = Object.keys(Mood);

  userProfilesSharedCollection: IUserProfile[] = [];

  editForm: MoodTrackerFormGroup = this.moodTrackerFormService.createMoodTrackerFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected moodTrackerService: MoodTrackerService,
    protected moodTrackerFormService: MoodTrackerFormService,
    protected userProfileService: UserProfileService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUserProfile = (o1: IUserProfile | null, o2: IUserProfile | null): boolean => this.userProfileService.compareUserProfile(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ moodTracker }) => {
      this.moodTracker = moodTracker;
      if (moodTracker) {
        this.updateForm(moodTracker);
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
    const moodTracker = this.moodTrackerFormService.getMoodTracker(this.editForm);

    if (moodTracker.id === null) {
      const newMoodTracker: NewMoodTracker = {
        ...moodTracker,
        id: null,
      };

      this.subscribeToSaveResponse(this.moodTrackerService.create(newMoodTracker));
    } else {
      this.subscribeToSaveResponse(this.moodTrackerService.update(moodTracker));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMoodTracker>>): void {
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

  protected updateForm(moodTracker: IMoodTracker): void {
    this.moodTracker = moodTracker;
    this.moodTrackerFormService.resetForm(this.editForm, moodTracker);

    this.userProfilesSharedCollection = this.userProfileService.addUserProfileToCollectionIfMissing<IUserProfile>(
      this.userProfilesSharedCollection,
      moodTracker.userProfile
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userProfileService
      .query()
      .pipe(map((res: HttpResponse<IUserProfile[]>) => res.body ?? []))
      .pipe(
        map((userProfiles: IUserProfile[]) =>
          this.userProfileService.addUserProfileToCollectionIfMissing<IUserProfile>(userProfiles, this.moodTracker?.userProfile)
        )
      )
      .subscribe((userProfiles: IUserProfile[]) => (this.userProfilesSharedCollection = userProfiles));
  }
}
