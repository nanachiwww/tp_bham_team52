import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { UserProfileFormService, UserProfileFormGroup } from './user-profile-form.service';
import { IUserProfile } from '../user-profile.model';
import { UserProfileService } from '../service/user-profile.service';
import { IDashboard } from 'app/entities/dashboard/dashboard.model';
import { DashboardService } from 'app/entities/dashboard/service/dashboard.service';
import { ICompareResult } from 'app/entities/compare-result/compare-result.model';
import { CompareResultService } from 'app/entities/compare-result/service/compare-result.service';
import { Gender } from 'app/entities/enumerations/gender.model';

@Component({
  selector: 'jhi-user-profile-update',
  templateUrl: './user-profile-update.component.html',
})
export class UserProfileUpdateComponent implements OnInit {
  isSaving = false;
  userProfile: IUserProfile | null = null;
  genderValues = Object.keys(Gender);

  dashboardsSharedCollection: IDashboard[] = [];
  compareResultsCollection: ICompareResult[] = [];

  editForm: UserProfileFormGroup = this.userProfileFormService.createUserProfileFormGroup();

  constructor(
    protected userProfileService: UserProfileService,
    protected userProfileFormService: UserProfileFormService,
    protected dashboardService: DashboardService,
    protected compareResultService: CompareResultService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareDashboard = (o1: IDashboard | null, o2: IDashboard | null): boolean => this.dashboardService.compareDashboard(o1, o2);

  compareCompareResult = (o1: ICompareResult | null, o2: ICompareResult | null): boolean =>
    this.compareResultService.compareCompareResult(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userProfile }) => {
      this.userProfile = userProfile;
      if (userProfile) {
        this.updateForm(userProfile);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const userProfile = this.userProfileFormService.getUserProfile(this.editForm);
    if (userProfile.id !== null) {
      this.subscribeToSaveResponse(this.userProfileService.update(userProfile));
    } else {
      this.subscribeToSaveResponse(this.userProfileService.create(userProfile));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserProfile>>): void {
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

  protected updateForm(userProfile: IUserProfile): void {
    this.userProfile = userProfile;
    this.userProfileFormService.resetForm(this.editForm, userProfile);

    this.dashboardsSharedCollection = this.dashboardService.addDashboardToCollectionIfMissing<IDashboard>(
      this.dashboardsSharedCollection,
      userProfile.dashboard
    );
    this.compareResultsCollection = this.compareResultService.addCompareResultToCollectionIfMissing<ICompareResult>(
      this.compareResultsCollection,
      userProfile.compareResult
    );
  }

  protected loadRelationshipsOptions(): void {
    this.dashboardService
      .query()
      .pipe(map((res: HttpResponse<IDashboard[]>) => res.body ?? []))
      .pipe(
        map((dashboards: IDashboard[]) =>
          this.dashboardService.addDashboardToCollectionIfMissing<IDashboard>(dashboards, this.userProfile?.dashboard)
        )
      )
      .subscribe((dashboards: IDashboard[]) => (this.dashboardsSharedCollection = dashboards));

    this.compareResultService
      .query({ filter: 'userprofile-is-null' })
      .pipe(map((res: HttpResponse<ICompareResult[]>) => res.body ?? []))
      .pipe(
        map((compareResults: ICompareResult[]) =>
          this.compareResultService.addCompareResultToCollectionIfMissing<ICompareResult>(compareResults, this.userProfile?.compareResult)
        )
      )
      .subscribe((compareResults: ICompareResult[]) => (this.compareResultsCollection = compareResults));
  }
}
