import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ItemFormService, ItemFormGroup } from './item-form.service';
import { IItem } from '../item.model';
import { ItemService } from '../service/item.service';
import { IEnergyIntakeResult } from 'app/entities/energy-intake-result/energy-intake-result.model';
import { EnergyIntakeResultService } from 'app/entities/energy-intake-result/service/energy-intake-result.service';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';
import { CategoriesEnum } from 'app/entities/enumerations/categories-enum.model';

@Component({
  selector: 'jhi-item-update',
  templateUrl: './item-update.component.html',
})
export class ItemUpdateComponent implements OnInit {
  isSaving = false;
  item: IItem | null = null;
  categoriesEnumValues = Object.keys(CategoriesEnum);

  energyIntakeResultsSharedCollection: IEnergyIntakeResult[] = [];
  userProfilesSharedCollection: IUserProfile[] = [];

  editForm: ItemFormGroup = this.itemFormService.createItemFormGroup();

  constructor(
    protected itemService: ItemService,
    protected itemFormService: ItemFormService,
    protected energyIntakeResultService: EnergyIntakeResultService,
    protected userProfileService: UserProfileService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareEnergyIntakeResult = (o1: IEnergyIntakeResult | null, o2: IEnergyIntakeResult | null): boolean =>
    this.energyIntakeResultService.compareEnergyIntakeResult(o1, o2);

  compareUserProfile = (o1: IUserProfile | null, o2: IUserProfile | null): boolean => this.userProfileService.compareUserProfile(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ item }) => {
      this.item = item;
      if (item) {
        this.updateForm(item);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const item = this.itemFormService.getItem(this.editForm);
    if (item.id !== null) {
      this.subscribeToSaveResponse(this.itemService.update(item));
    } else {
      this.subscribeToSaveResponse(this.itemService.create(item));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IItem>>): void {
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

  protected updateForm(item: IItem): void {
    this.item = item;
    this.itemFormService.resetForm(this.editForm, item);

    this.energyIntakeResultsSharedCollection =
      this.energyIntakeResultService.addEnergyIntakeResultToCollectionIfMissing<IEnergyIntakeResult>(
        this.energyIntakeResultsSharedCollection,
        ...(item.energyIntakeResults ?? [])
      );
    this.userProfilesSharedCollection = this.userProfileService.addUserProfileToCollectionIfMissing<IUserProfile>(
      this.userProfilesSharedCollection,
      item.userProfile
    );
  }

  protected loadRelationshipsOptions(): void {
    this.energyIntakeResultService
      .query()
      .pipe(map((res: HttpResponse<IEnergyIntakeResult[]>) => res.body ?? []))
      .pipe(
        map((energyIntakeResults: IEnergyIntakeResult[]) =>
          this.energyIntakeResultService.addEnergyIntakeResultToCollectionIfMissing<IEnergyIntakeResult>(
            energyIntakeResults,
            ...(this.item?.energyIntakeResults ?? [])
          )
        )
      )
      .subscribe((energyIntakeResults: IEnergyIntakeResult[]) => (this.energyIntakeResultsSharedCollection = energyIntakeResults));

    this.userProfileService
      .query()
      .pipe(map((res: HttpResponse<IUserProfile[]>) => res.body ?? []))
      .pipe(
        map((userProfiles: IUserProfile[]) =>
          this.userProfileService.addUserProfileToCollectionIfMissing<IUserProfile>(userProfiles, this.item?.userProfile)
        )
      )
      .subscribe((userProfiles: IUserProfile[]) => (this.userProfilesSharedCollection = userProfiles));
  }
}
