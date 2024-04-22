import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { CustomGoalFormService, CustomGoalFormGroup, CustomGoalsService } from './custom-goal-form.service';
import { ICustomGoal } from '../custom-goal.model';
import { CustomGoalService } from '../service/custom-goal.service';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';
import { SharedDataService } from 'app/shared/data/shared-data.service';
import { Mood } from 'app/entities/enumerations/mood.model';
import { IMoodTracker } from '../../mood-tracker/mood-tracker.model';

@Component({
  selector: 'jhi-custom-goal-update',
  templateUrl: './custom-goal-update.component.html',
})
export class CustomGoalUpdateComponent implements OnInit {
  isSaving = false;

  customGoal: ICustomGoal | null = null;
  moodTracker: IMoodTracker | null = null;
  moodValues = Object.keys(Mood);

  userProfilesSharedCollection: IUserProfile[] = [];

  editForm: CustomGoalFormGroup = this.customGoalFormService.createCustomGoalFormGroup();

  constructor(
    protected customGoalService: CustomGoalService,
    protected customGoalFormService: CustomGoalFormService,
    protected userProfileService: UserProfileService,
    protected activatedRoute: ActivatedRoute,
    private sharedDataService: SharedDataService,
    private differentgoalsService: CustomGoalsService
  ) {}

  getSelectedValue(): string {
    return this.sharedDataService.getSelectedValue();
  }

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
      next: response => {
        const customGoal = response.body;
        const selectedValue = this.sharedDataService.getSelectedValue();
        if (selectedValue === 'Value1') {
          this.differentgoalsService.customGoalsValue1.push(<ICustomGoal>customGoal);
        } else if (selectedValue === 'Value2') {
          this.differentgoalsService.customGoalsValue2.push(<ICustomGoal>customGoal);
        } else if (selectedValue === 'Value3') {
          this.differentgoalsService.customGoalsValue3.push(<ICustomGoal>customGoal);
        } else if (selectedValue === 'Value4') {
          this.differentgoalsService.customGoalsValue4.push(<ICustomGoal>customGoal);
        } else {
          console.error('Custom goal is null or undefined.');
        }
        this.onSaveSuccess();
      },
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
    this.editForm.controls['name'].setValue('Sleeping Goal');
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
