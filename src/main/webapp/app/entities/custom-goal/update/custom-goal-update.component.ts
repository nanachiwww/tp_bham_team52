import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { CustomGoalFormService, CustomGoalFormGroup } from './custom-goal-form.service';
import { ICustomGoal } from '../custom-goal.model';
import { CustomGoalService } from '../service/custom-goal.service';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';

@Component({
  selector: 'jhi-custom-goal-update',
  templateUrl: './custom-goal-update.component.html',
})
export class CustomGoalUpdateComponent implements OnInit {
  isSaving = false;
  customGoal: ICustomGoal | null = null;

  userProfilesSharedCollection: IUserProfile[] = [];

  editForm: CustomGoalFormGroup = this.customGoalFormService.createCustomGoalFormGroup();

  constructor(
    protected customGoalService: CustomGoalService,
    protected customGoalFormService: CustomGoalFormService,
    protected userProfileService: UserProfileService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUserProfile = (o1: IUserProfile | null, o2: IUserProfile | null): boolean => this.userProfileService.compareUserProfile(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ customGoal }) => {
      this.customGoal = customGoal;
      if (customGoal) {
        this.updateForm(customGoal);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const customGoal = this.customGoalFormService.getCustomGoal(this.editForm);
    if (customGoal.id !== null) {
      this.subscribeToSaveResponse(this.customGoalService.update(customGoal));
    } else {
      this.subscribeToSaveResponse(this.customGoalService.create(customGoal));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICustomGoal>>): void {
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

  protected updateForm(customGoal: ICustomGoal): void {
    this.customGoal = customGoal;
    this.customGoalFormService.resetForm(this.editForm, customGoal);

    this.userProfilesSharedCollection = this.userProfileService.addUserProfileToCollectionIfMissing<IUserProfile>(
      this.userProfilesSharedCollection,
      customGoal.userProfile
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userProfileService
      .query()
      .pipe(map((res: HttpResponse<IUserProfile[]>) => res.body ?? []))
      .pipe(
        map((userProfiles: IUserProfile[]) =>
          this.userProfileService.addUserProfileToCollectionIfMissing<IUserProfile>(userProfiles, this.customGoal?.userProfile)
        )
      )
      .subscribe((userProfiles: IUserProfile[]) => (this.userProfilesSharedCollection = userProfiles));
  }
}
