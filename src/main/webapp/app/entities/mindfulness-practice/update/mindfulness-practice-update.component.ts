import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { MindfulnessPracticeFormService, MindfulnessPracticeFormGroup } from './mindfulness-practice-form.service';
import { IMindfulnessPractice } from '../mindfulness-practice.model';
import { MindfulnessPracticeService } from '../service/mindfulness-practice.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IMindfulnessTip } from 'app/entities/mindfulness-tip/mindfulness-tip.model';
import { MindfulnessTipService } from 'app/entities/mindfulness-tip/service/mindfulness-tip.service';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';
import { MindfulnessActivityType } from 'app/entities/enumerations/mindfulness-activity-type.model';

@Component({
  selector: 'jhi-mindfulness-practice-update',
  templateUrl: './mindfulness-practice-update.component.html',
})
export class MindfulnessPracticeUpdateComponent implements OnInit {
  isSaving = false;
  mindfulnessPractice: IMindfulnessPractice | null = null;
  mindfulnessActivityTypeValues = Object.keys(MindfulnessActivityType);

  mindfulnessTipsSharedCollection: IMindfulnessTip[] = [];
  userProfilesSharedCollection: IUserProfile[] = [];

  editForm: MindfulnessPracticeFormGroup = this.mindfulnessPracticeFormService.createMindfulnessPracticeFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected mindfulnessPracticeService: MindfulnessPracticeService,
    protected mindfulnessPracticeFormService: MindfulnessPracticeFormService,
    protected mindfulnessTipService: MindfulnessTipService,
    protected userProfileService: UserProfileService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareMindfulnessTip = (o1: IMindfulnessTip | null, o2: IMindfulnessTip | null): boolean =>
    this.mindfulnessTipService.compareMindfulnessTip(o1, o2);

  compareUserProfile = (o1: IUserProfile | null, o2: IUserProfile | null): boolean => this.userProfileService.compareUserProfile(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ mindfulnessPractice }) => {
      this.mindfulnessPractice = mindfulnessPractice;
      if (mindfulnessPractice) {
        this.updateForm(mindfulnessPractice);
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
    const mindfulnessPractice = this.mindfulnessPracticeFormService.getMindfulnessPractice(this.editForm);
    if (mindfulnessPractice.id !== null) {
      this.subscribeToSaveResponse(this.mindfulnessPracticeService.update(mindfulnessPractice));
    } else {
      this.subscribeToSaveResponse(this.mindfulnessPracticeService.create(mindfulnessPractice));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMindfulnessPractice>>): void {
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

  protected updateForm(mindfulnessPractice: IMindfulnessPractice): void {
    this.mindfulnessPractice = mindfulnessPractice;
    this.mindfulnessPracticeFormService.resetForm(this.editForm, mindfulnessPractice);

    this.mindfulnessTipsSharedCollection = this.mindfulnessTipService.addMindfulnessTipToCollectionIfMissing<IMindfulnessTip>(
      this.mindfulnessTipsSharedCollection,
      mindfulnessPractice.mindfulnessTip
    );
    this.userProfilesSharedCollection = this.userProfileService.addUserProfileToCollectionIfMissing<IUserProfile>(
      this.userProfilesSharedCollection,
      mindfulnessPractice.userProfile
    );
  }

  protected loadRelationshipsOptions(): void {
    this.mindfulnessTipService
      .query()
      .pipe(map((res: HttpResponse<IMindfulnessTip[]>) => res.body ?? []))
      .pipe(
        map((mindfulnessTips: IMindfulnessTip[]) =>
          this.mindfulnessTipService.addMindfulnessTipToCollectionIfMissing<IMindfulnessTip>(
            mindfulnessTips,
            this.mindfulnessPractice?.mindfulnessTip
          )
        )
      )
      .subscribe((mindfulnessTips: IMindfulnessTip[]) => (this.mindfulnessTipsSharedCollection = mindfulnessTips));

    this.userProfileService
      .query()
      .pipe(map((res: HttpResponse<IUserProfile[]>) => res.body ?? []))
      .pipe(
        map((userProfiles: IUserProfile[]) =>
          this.userProfileService.addUserProfileToCollectionIfMissing<IUserProfile>(userProfiles, this.mindfulnessPractice?.userProfile)
        )
      )
      .subscribe((userProfiles: IUserProfile[]) => (this.userProfilesSharedCollection = userProfiles));
  }
}
