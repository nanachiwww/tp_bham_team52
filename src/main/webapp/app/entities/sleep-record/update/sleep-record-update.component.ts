import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { SleepRecordFormService, SleepRecordFormGroup } from './sleep-record-form.service';
import { ISleepRecord } from '../sleep-record.model';
import { SleepRecordService } from '../service/sleep-record.service';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';

@Component({
  selector: 'jhi-sleep-record-update',
  templateUrl: './sleep-record-update.component.html',
})
export class SleepRecordUpdateComponent implements OnInit {
  isSaving = false;
  sleepRecord: ISleepRecord | null = null;

  userProfilesSharedCollection: IUserProfile[] = [];

  editForm: SleepRecordFormGroup = this.sleepRecordFormService.createSleepRecordFormGroup();

  constructor(
    protected sleepRecordService: SleepRecordService,
    protected sleepRecordFormService: SleepRecordFormService,
    protected userProfileService: UserProfileService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUserProfile = (o1: IUserProfile | null, o2: IUserProfile | null): boolean => this.userProfileService.compareUserProfile(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sleepRecord }) => {
      this.sleepRecord = sleepRecord;
      if (sleepRecord) {
        this.updateForm(sleepRecord);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const sleepRecord = this.sleepRecordFormService.getSleepRecord(this.editForm);
    if (sleepRecord.id !== null) {
      this.subscribeToSaveResponse(this.sleepRecordService.update(sleepRecord));
    } else {
      this.subscribeToSaveResponse(this.sleepRecordService.create(sleepRecord));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISleepRecord>>): void {
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

  protected updateForm(sleepRecord: ISleepRecord): void {
    this.sleepRecord = sleepRecord;
    this.sleepRecordFormService.resetForm(this.editForm, sleepRecord);

    this.userProfilesSharedCollection = this.userProfileService.addUserProfileToCollectionIfMissing<IUserProfile>(
      this.userProfilesSharedCollection,
      sleepRecord.userProfile
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userProfileService
      .query()
      .pipe(map((res: HttpResponse<IUserProfile[]>) => res.body ?? []))
      .pipe(
        map((userProfiles: IUserProfile[]) =>
          this.userProfileService.addUserProfileToCollectionIfMissing<IUserProfile>(userProfiles, this.sleepRecord?.userProfile)
        )
      )
      .subscribe((userProfiles: IUserProfile[]) => (this.userProfilesSharedCollection = userProfiles));
  }
}
