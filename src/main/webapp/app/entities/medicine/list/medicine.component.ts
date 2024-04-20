import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IMedicine } from '../medicine.model';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType, MedicineService } from '../service/medicine.service';
import { MedicineDeleteDialogComponent } from '../delete/medicine-delete-dialog.component';
import { SortService } from 'app/shared/sort/sort.service';
import { Chart, registerables } from 'chart.js';
import { Dayjs } from 'dayjs'; // Ensure Dayjs is correctly imported
import dayjs from 'dayjs'; // Import dayjs directly
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
  todaySupplements: any[] = [];
  todayPrescriptions: any[] = [];
  todayOtherItems: any[] = [];
  searchTerm: string = '';
  types = ['SUPPLEMENT', 'PRESCRIPTION', 'OTHER'];

  showSecondPart() {
    this.isSecondPartVisible = true;
    setTimeout(() => {
      this.createOverallUsageChart();
      this.createSpecificUsageChart();
    }, 0); // Timeout might need adjustment based on actual behavior
  }
  showFirstPart() {
    this.isSecondPartVisible = false;
  }

  interactions = [{ detail: 'Interaction 1 details here...' }, { detail: 'Interaction 2 details here...' }];

  isLoading = false;
  predicate = 'id';
  ascending = true;
  filters = [
    { id: 'vitaminC', name: 'Vitamin C', checked: true },
    { id: 'zinc', name: 'Zinc', checked: false },
    // add other filters as necessary
  ];

  constructor(
    protected medicineService: MedicineService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    protected modalService: NgbModal
  ) {
    Chart.register(...registerables);
  }

  filterItemsByToday() {
    const today = new Date().toISOString().split('T')[0];
    console.log("Today's date: ", today);
    this.todaySupplements = this.filterByToday(this.supplements);
    console.log("Today's supplements: ", this.todaySupplements); // Verify the filtered data
    this.todayPrescriptions = this.filterByToday(this.prescriptions);
    this.todayOtherItems = this.filterByToday(this.otherItems);
  }

  private filterByToday(items: any[]): any[] {
    const today = new Date().toISOString().split('T')[0];
    return items.filter(item => item.date === today);
  }

  trackId = (_index: number, item: IMedicine): number => this.medicineService.getMedicineIdentifier(item);

  ngOnInit(): void {
    this.loadItems();
    this.load();
  }

  loadItems() {
    this.medicineService.getMedicines().subscribe(
      data => {
        this.medicines = data;
        this.supplements = this.medicines.filter(medicine => medicine.supplementType === 'SUPPLEMENT');
        this.prescriptions = this.medicines.filter(medicine => medicine.supplementType === 'PRESCRIPTION');
        this.otherItems = this.medicines.filter(medicine => medicine.supplementType === 'OTHER');
        this.filterItemsByToday(); // Ensure this is called after data is loaded
      },
      error => {
        console.error('Failed to load medicines', error);
      }
    );
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

  filterData() {}
  updateChartFilters() {}

  getOverallGraphData(): any {
    const labels = this.getLast12Months();
    const medicineCounts = this.countItemsByMonth(this.medicines);
    const supplementCounts = this.countItemsByMonth(this.supplements);
    const prescriptionCounts = this.countItemsByMonth(this.prescriptions);

    return {
      labels: labels,
      datasets: [
        {
          label: 'Medicines',
          data: medicineCounts,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        },
        {
          label: 'Supplements',
          data: supplementCounts,
          fill: false,
          borderColor: 'rgb(192, 75, 75)',
          tension: 0.1,
        },
        {
          label: 'Prescriptions',
          data: prescriptionCounts,
          fill: false,
          borderColor: 'rgb(75, 75, 192)',
          tension: 0.1,
        },
      ],
    };
  }

  getSpecificGraphData(): any {
    const labels = this.getLast12Months();
    const supplementCounts = this.countItemsByMonth(this.todaySupplements);
    const prescriptionCounts = this.countItemsByMonth(this.todayPrescriptions);
    const otherCounts = this.countItemsByMonth(this.todayOtherItems);

    return {
      labels: labels,
      datasets: [
        {
          label: 'Supplements',
          data: supplementCounts,
          fill: false,
          borderColor: 'rgb(192, 75, 75)',
          tension: 0.1,
        },
        {
          label: 'Prescriptions',
          data: prescriptionCounts,
          fill: false,
          borderColor: 'rgb(75, 75, 192)',
          tension: 0.1,
        },
        {
          label: 'Other Items',
          data: otherCounts,
          fill: false,
          borderColor: 'rgb(75, 192, 75)',
          tension: 0.1,
        },
      ],
    };
  }

  countItemsByMonth(items: any): number[] {
    const counts = Array(12).fill(0);
    const today = dayjs();
    items.forEach((item: any) => {
      const monthDifference = today.diff(dayjs(item.date), 'month');
      if (monthDifference >= 0 && monthDifference < 12) {
        counts[11 - monthDifference]++;
      }
    });
    return counts;
  }

  getLast12Months(): string[] {
    return Array.from({ length: 12 }, (_, i) => dayjs().subtract(i, 'month').format('MMMM YYYY')).reverse();
  }

  createOverallUsageChart(): void {
    const canvas = document.getElementById('overall-chart') as HTMLCanvasElement;
    if (!canvas) return; // Exit the function if the canvas is not found
    const ctx = canvas.getContext('2d');

    if (!ctx) return; // Exit the function if the context is not obtained

    const lineChart = new Chart(ctx, {
      type: 'line',
      data: this.getOverallGraphData(),
    });
  }

  createSpecificUsageChart(): void {
    const canvas = document.getElementById('specific-chart') as HTMLCanvasElement;
    if (!canvas) return; // Exit the function if the canvas is not found
    const ctx = canvas.getContext('2d');

    if (!ctx) return; // Exit the function if the context is not obtained

    const lineChart = new Chart(ctx, {
      type: 'line',
      data: this.getSpecificGraphData(),
    });
  }
}
