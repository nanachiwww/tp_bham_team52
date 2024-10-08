import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ICustomGoal } from '../custom-goal.model';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType, CustomGoalService } from '../service/custom-goal.service';
import { CustomGoalDeleteDialogComponent } from '../delete/custom-goal-delete-dialog.component';
import { SortService } from 'app/shared/sort/sort.service';
import { SharedDataService } from 'app/shared/data/shared-data.service';
import { CustomGoalsService } from '../update/custom-goal-form.service';
@Component({
  selector: 'jhi-custom-goal',
  templateUrl: './custom-goal.component.html',
  styleUrls: ['./custom-goal.component.scss'],
})
export class CustomGoalComponent implements OnInit {
  customGoals?: ICustomGoal[];

  isLoading = false;

  predicate = 'id';
  ascending = true;

  constructor(
    protected customGoalService: CustomGoalService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    protected modalService: NgbModal,
    private sharedDataService: SharedDataService,
    protected differentGoalsService: CustomGoalsService
  ) {}
  updateSelectedValue(value: string): void {
    this.sharedDataService.setSelectedValue(value);
  }

  trackId = (_index: number, item: ICustomGoal): number => this.customGoalService.getCustomGoalIdentifier(item);

  ngOnInit(): void {
    this.load();
  }

  delete(customGoal: ICustomGoal): void {
    const modalRef = this.modalService.open(CustomGoalDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.customGoal = customGoal;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        switchMap(() => this.loadFromBackendWithRouteInformations())
      )
      .subscribe({
        next: (res: EntityArrayResponseType) => {
          this.onResponseSuccess(res);
        },
      });
  }

  load(): void {
    this.loadFromBackendWithRouteInformations().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
      },
    });
  }

  navigateToWithComponentValues(): void {
    this.handleNavigation(this.predicate, this.ascending);
  }

  protected loadFromBackendWithRouteInformations(): Observable<EntityArrayResponseType> {
    return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
      tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
      switchMap(() => this.queryBackend(this.predicate, this.ascending))
    );
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    const sort = (params.get(SORT) ?? data[DEFAULT_SORT_DATA]).split(',');
    this.predicate = sort[0];
    this.ascending = sort[1] === ASC;
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    this.differentGoalsService = new CustomGoalsService();
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.customGoals = this.refineData(dataFromBody);
    this.customGoals.forEach(e => {
      if (e.type === '1') {
        this.differentGoalsService.customGoalsValue1.push(e);
      }
      if (e.type === '2') {
        this.differentGoalsService.customGoalsValue2.push(e);
      }
      if (e.type === '3') {
        this.differentGoalsService.customGoalsValue3.push(e);
      }
      if (e.type === '4') {
        this.differentGoalsService.customGoalsValue4.push(e);
      }
    });
  }

  protected refineData(data: ICustomGoal[]): ICustomGoal[] {
    return data.sort(this.sortService.startSort(this.predicate, this.ascending ? 1 : -1));
  }

  protected fillComponentAttributesFromResponseBody(data: ICustomGoal[] | null): ICustomGoal[] {
    return data ?? [];
  }

  protected queryBackend(predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject = {
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.customGoalService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected handleNavigation(predicate?: string, ascending?: boolean): void {
    const queryParamsObj = {
      sort: this.getSortQueryParam(predicate, ascending),
    };

    this.router.navigate(['./'], {
      relativeTo: this.activatedRoute,
      queryParams: queryParamsObj,
    });
  }

  protected getSortQueryParam(predicate = this.predicate, ascending = this.ascending): string[] {
    const ascendingQueryParam = ascending ? ASC : DESC;
    if (predicate === '') {
      return [];
    } else {
      return [predicate + ',' + ascendingQueryParam];
    }
  }
}
