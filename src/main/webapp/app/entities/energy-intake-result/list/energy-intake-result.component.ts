import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IEnergyIntakeResult } from '../energy-intake-result.model';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType, EnergyIntakeResultService } from '../service/energy-intake-result.service';
import { EnergyIntakeResultDeleteDialogComponent } from '../delete/energy-intake-result-delete-dialog.component';
import { SortService } from 'app/shared/sort/sort.service';
import { IMedicine } from '../../medicine/medicine.model';

@Component({
  selector: 'jhi-energy-intake-result',
  templateUrl: './energy-intake-result.component.html',
})
export class EnergyIntakeResultComponent implements OnInit {
  breakfast: IEnergyIntakeResult[] = [];
  lunch: IEnergyIntakeResult[] = [];
  dinner: IEnergyIntakeResult[] = [];

  energyIntakeResults?: IEnergyIntakeResult[];
  isLoading = false;

  predicate = 'id';
  ascending = true;

  constructor(
    protected energyIntakeResultService: EnergyIntakeResultService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    protected modalService: NgbModal
  ) {}

  trackId = (_index: number, item: IEnergyIntakeResult): number => this.energyIntakeResultService.getEnergyIntakeResultIdentifier(item);

  ngOnInit(): void {
    this.load();
  }

  delete(energyIntakeResult: IEnergyIntakeResult): void {
    const modalRef = this.modalService.open(EnergyIntakeResultDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.energyIntakeResult = energyIntakeResult;
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
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.energyIntakeResults = this.refineData(dataFromBody);
  }

  protected refineData(data: IEnergyIntakeResult[]): IEnergyIntakeResult[] {
    return data.sort(this.sortService.startSort(this.predicate, this.ascending ? 1 : -1));
  }

  protected fillComponentAttributesFromResponseBody(data: IEnergyIntakeResult[] | null): IEnergyIntakeResult[] {
    return data ?? [];
  }

  protected queryBackend(predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject = {
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.energyIntakeResultService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
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
