import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { EnergyIntakeResultFormService, EnergyIntakeResultFormGroup } from './energy-intake-result-form.service';
import { IEnergyIntakeResult } from '../energy-intake-result.model';
import { EnergyIntakeResultService } from '../service/energy-intake-result.service';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';

@Component({
  selector: 'jhi-energy-intake-result-update',
  templateUrl: './energy-intake-result-update.component.html',
})
export class EnergyIntakeResultUpdateComponent implements OnInit {
  isSaving = false;
  energyIntakeResult: IEnergyIntakeResult | null = null;

  userProfilesSharedCollection: IUserProfile[] = [];

  editForm: EnergyIntakeResultFormGroup = this.energyIntakeResultFormService.createEnergyIntakeResultFormGroup();

  constructor(
    protected energyIntakeResultService: EnergyIntakeResultService,
    protected energyIntakeResultFormService: EnergyIntakeResultFormService,
    // protected userProfileService: UserProfileService,
    protected activatedRoute: ActivatedRoute
  ) {}

  // compareUserProfile = (o1: IUserProfile | null, o2: IUserProfile | null): boolean => this.userProfileService.compareUserProfile(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ energyIntakeResult }) => {
      this.energyIntakeResult = energyIntakeResult;
      if (energyIntakeResult) {
        this.updateForm(energyIntakeResult);
      }

      // this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const energyIntakeResult = this.energyIntakeResultFormService.getEnergyIntakeResult(this.editForm);
    if (energyIntakeResult.id !== null) {
      this.subscribeToSaveResponse(this.energyIntakeResultService.update(energyIntakeResult));
    } else {
      this.subscribeToSaveResponse(this.energyIntakeResultService.create(energyIntakeResult));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEnergyIntakeResult>>): void {
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

  protected updateForm(energyIntakeResult: IEnergyIntakeResult): void {
    this.energyIntakeResult = energyIntakeResult;
    this.energyIntakeResultFormService.resetForm(this.editForm, energyIntakeResult);

    // this.userProfilesSharedCollection = this.userProfileService.addUserProfileToCollectionIfMissing<IUserProfile>(
    //   this.userProfilesSharedCollection,
    //   energyIntakeResult.userProfile
    // );
  }

  //   protected loadRelationshipsOptions(): void {
  //     this.userProfileService
  //       .query()
  //       .pipe(map((res: HttpResponse<IUserProfile[]>) => res.body ?? []))
  //       .pipe(
  //         map((userProfiles: IUserProfile[]) =>
  //           this.userProfileService.addUserProfileToCollectionIfMissing<IUserProfile>(userProfiles, this.energyIntakeResult?.userProfile)
  //         )
  //       )
  //       .subscribe((userProfiles: IUserProfile[]) => (this.userProfilesSharedCollection = userProfiles));
  //   }
}
