import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { MedicineFormService, MedicineFormGroup } from './medicine-form.service';
import { IMedicine } from '../medicine.model';
import { MedicineService } from '../service/medicine.service';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';
import { SupplementTypeEnum } from 'app/entities/enumerations/supplement-type-enum.model';

@Component({
  selector: 'jhi-medicine-update',
  templateUrl: './medicine-update.component.html',
  styleUrls: ['./medicine-update.component.scss'],
})
export class MedicineUpdateComponent implements OnInit {
  isSaving = false;
  medicine: IMedicine | null = null;
  supplementTypeEnumValues = Object.keys(SupplementTypeEnum);

  userProfilesSharedCollection: IUserProfile[] = [];

  editForm: MedicineFormGroup = this.medicineFormService.createMedicineFormGroup();

  constructor(
    protected medicineService: MedicineService,
    protected medicineFormService: MedicineFormService,
    protected userProfileService: UserProfileService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUserProfile = (o1: IUserProfile | null, o2: IUserProfile | null): boolean => this.userProfileService.compareUserProfile(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ medicine }) => {
      this.medicine = medicine;
      if (medicine) {
        this.updateForm(medicine);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const medicine = this.medicineFormService.getMedicine(this.editForm);
    if (medicine.id !== null) {
      this.subscribeToSaveResponse(this.medicineService.update(medicine));
    } else {
      this.subscribeToSaveResponse(this.medicineService.create(medicine));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMedicine>>): void {
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

  protected updateForm(medicine: IMedicine): void {
    this.medicine = medicine;
    this.medicineFormService.resetForm(this.editForm, medicine);

    this.userProfilesSharedCollection = this.userProfileService.addUserProfileToCollectionIfMissing<IUserProfile>(
      this.userProfilesSharedCollection,
      medicine.userProfile
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userProfileService
      .query()
      .pipe(map((res: HttpResponse<IUserProfile[]>) => res.body ?? []))
      .pipe(
        map((userProfiles: IUserProfile[]) =>
          this.userProfileService.addUserProfileToCollectionIfMissing<IUserProfile>(userProfiles, this.medicine?.userProfile)
        )
      )
      .subscribe((userProfiles: IUserProfile[]) => (this.userProfilesSharedCollection = userProfiles));
  }
}
