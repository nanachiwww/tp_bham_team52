import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IMedicine } from '../medicine.model';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType, MedicineService } from '../service/medicine.service';
import { MedicineDeleteDialogComponent } from '../delete/medicine-delete-dialog.component';
import { SortService } from 'app/shared/sort/sort.service';
import { Chart, registerables } from 'chart.js';
@Component({
  selector: 'jhi-medicine',
  templateUrl: './medicine.component.html',
  styleUrls: ['./medicine.component.scss'],
})
export class MedicineComponent implements OnInit {
  private chartInitialized = false;
  medicines: IMedicine[] = [];
  supplements: IMedicine[] = [];
  prescriptions: IMedicine[] = [];
  otherItems: IMedicine[] = [];
  isSecondPartVisible: boolean = false;

  showSecondPart() {
    this.isSecondPartVisible = true;
    this.createLineChart();
  }

  interactions = [{ detail: 'Interaction 1 details here...' }, { detail: 'Interaction 2 details here...' }];

  isLoading = false;
  predicate = 'id';
  ascending = true;

  constructor(
    protected medicineService: MedicineService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    protected modalService: NgbModal
  ) {
    Chart.register(...registerables);
  }

  trackId = (_index: number, item: IMedicine): number => this.medicineService.getMedicineIdentifier(item);

  ngOnInit(): void {
    this.loadItems();
    this.load();
  }

  loadItems() {
    this.medicineService.getMedicines().subscribe(data => {
      this.medicines = data;
      this.supplements = this.medicines.filter(medicine => medicine.supplementType === 'SUPPLEMENT');
      this.prescriptions = this.medicines.filter(medicine => medicine.supplementType === 'PRESCRIPTION');
      this.otherItems = this.medicines.filter(medicine => medicine.supplementType === 'OTHER');
    });
  }

  delete(medicine: IMedicine): void {
    const modalRef = this.modalService.open(MedicineDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.medicine = medicine;
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
    this.medicines = this.refineData(dataFromBody);
  }

  protected refineData(data: IMedicine[]): IMedicine[] {
    return data.sort(this.sortService.startSort(this.predicate, this.ascending ? 1 : -1));
  }

  protected fillComponentAttributesFromResponseBody(data: IMedicine[] | null): IMedicine[] {
    return data ?? [];
  }

  protected queryBackend(predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject = {
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.medicineService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
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

  createLineChart(): void {
    const canvas = document.getElementById('line-chart') as HTMLCanvasElement;
    if (!canvas) return; // Exit the function if the canvas is not found

    const ctx = canvas.getContext('2d');
    if (!ctx) return; // Exit the function if the context is not obtained

    const lineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
          {
            label: 'Demo Line Dataset',
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          },
          {
            label: 'Demo Line Dataset',
            data: [65, 40, 80, 81, 56, 55, 40],
            fill: false,
            borderColor: 'rgb(75, 155, 192)',
            tension: 0.1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
}
