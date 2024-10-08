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
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'jhi-medicine',
  templateUrl: './medicine.component.html',
  styleUrls: ['./medicine.component.scss'],
})
export class MedicineComponent implements OnInit {
  private autoScrollInterval: any;
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
  private overallChart?: Chart;
  private specificChart?: Chart;
  notes: string = '';
  types = ['SUPPLEMENT', 'PRESCRIPTION', 'OTHER'];

  carouselItems = [
    {
      id: 1,
      title: 'Vitamin D',
      description: 'Supplement for bone health and immune function',
      imageUrl: 'content/images/supplements/vitD.jpg',
    },
    {
      id: 2,
      title: 'Ibuprofen',
      description: 'Pain reliever and anti-inflammatory medication',
      imageUrl: 'content/images/supplements/ibuprofen.png',
    },
    {
      id: 3,
      title: 'Amoxicillin',
      description: 'Antibiotic used to treat various bacterial infections',
      imageUrl: 'content/images/supplements/amox.png',
    },
    {
      id: 4,
      title: 'Metformin',
      description: 'Medication used to treat type 2 diabetes',
      imageUrl: 'content/images/supplements/metformin.png',
    },
    {
      id: 5,
      title: 'Omega-3 Fatty Acids',
      description: 'Supplement for heart health and cholesterol management',
      imageUrl: 'content/images/supplements/omega3.jpg',
    },
    {
      id: 6,
      title: 'Lisinopril',
      description: 'Medication for treating hypertension',
      imageUrl: 'content/images/supplements/lisin.png',
    },
    {
      id: 7,
      title: 'Simvastatin',
      description: 'Medication used to control high cholesterol',
      imageUrl: 'content/images/supplements/Sim.png',
    },
    {
      id: 8,
      title: 'Aspirin',
      description: 'Used to reduce pain, fever, and inflammation',
      imageUrl: 'content/images/supplements/aspirin.png',
    },
    {
      id: 9,
      title: 'Calcium',
      description: 'Supplement for bone health and nerve function',
      imageUrl: 'content/images/supplements/Calcium.png',
    },
    {
      id: 10,
      title: 'Probiotic',
      description: 'Supplement to support digestive and immune health',
      imageUrl: 'content/images/supplements/inulin.png',
    },
  ];

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
    { id: 'SUPPLEMENT', name: 'SUPPLEMENT', checked: true },
    { id: 'PRESCRIPTION', name: 'PRESCRIPTION', checked: true },
    { id: 'OTHER', name: 'OTHER', checked: true },
  ];

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    protected medicineService: MedicineService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    protected modalService: NgbModal
  ) {
    Chart.register(...registerables);
  }

  saveNotes() {
    const userId = 1; // Replace with actual user ID
    this.http.post('/api/users/' + userId + '/notes', { notes: this.notes }).subscribe({
      next: response => console.log('Notes saved successfully', response),
      error: error => console.error('Error saving notes', error),
    });
  }

  filterItemsByToday() {
    const today = new Date().toISOString().split('T')[0];
    this.todaySupplements = this.filterByToday(this.supplements);
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
    this.startAutoScroll();
  }

  ngOnDestroy(): void {
    this.stopAutoScroll();
  }

  startAutoScroll(): void {
    this.autoScrollInterval = setInterval(() => {
      this.moveSlide(1);
    }, 4500); // Adjust time here for 4.5 seconds
  }

  stopAutoScroll(): void {
    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
    }
  }

  loadItems() {
    this.medicineService.getMedicines().subscribe(
      data => {
        this.medicines = data;
        this.updateVisibleItems(); // Call this function to update the view based on filters
      },
      error => {
        console.error('Failed to load medicines', error);
      }
    );
  }

  updateVisibleItems() {
    this.supplements = this.filters.find(f => f.id === 'SUPPLEMENT')?.checked
      ? this.medicines.filter(medicine => medicine.supplementType === 'SUPPLEMENT')
      : [];
    this.prescriptions = this.filters.find(f => f.id === 'PRESCRIPTION')?.checked
      ? this.medicines.filter(medicine => medicine.supplementType === 'PRESCRIPTION')
      : [];
    this.otherItems = this.filters.find(f => f.id === 'OTHER')?.checked
      ? this.medicines.filter(medicine => medicine.supplementType === 'OTHER')
      : [];
    this.filterItemsByToday();
    this.updateCharts();
  }

  updateCharts() {
    this.createOverallUsageChart();
    this.createSpecificUsageChart();
    this.cdr.detectChanges(); // Manually trigger change detection
    this.showSlides(1);
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

  slideIndex = 0;

  moveSlide(n: any): any {
    this.showSlides((this.slideIndex += n));
    console.log('Slide Index:', this.slideIndex);
  }

  showSlides(n: any): any {
    let i;
    const slides = document.getElementsByClassName('carousel-supplement-item') as HTMLCollectionOf<HTMLElement>;
    if (n >= slides.length) this.slideIndex = 0;
    if (n < 0) this.slideIndex = slides.length - 1;

    for (i = 0; i < slides.length; i++) {
      slides[i].style.transform = `translateX(-${this.slideIndex * 100}%)`;
    }
  }

  getOverallGraphData(): any {
    const labels = this.getLast12Months();
    const supplementCounts = this.countItemsByMonth(this.supplements);
    const prescriptionCounts = this.countItemsByMonth(this.prescriptions);
    const otherCounts = this.countItemsByMonth(this.otherItems);

    return {
      labels: labels,
      datasets: [
        {
          label: 'Supplements',
          data: supplementCounts,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        },
        {
          label: 'Prescriptions',
          data: prescriptionCounts,
          fill: false,
          borderColor: 'rgb(192, 75, 75)',
          tension: 0.1,
        },
        {
          label: 'Other Items',
          data: otherCounts,
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
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Destroy the existing chart if it exists
    if (this.overallChart) {
      this.overallChart.destroy();
    }

    // Create a new chart instance and assign it to the overallChart property
    this.overallChart = new Chart(ctx, {
      type: 'line',
      data: this.getOverallGraphData(),
      options: {
        scales: {
          y: {
            beginAtZero: true, // Ensure that y-axis starts at 0
            min: 0, // Explicitly set the minimum to 0
          },
        },
      }, // Add any necessary options
    });
  }

  createSpecificUsageChart(): void {
    const canvas = document.getElementById('specific-chart') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Destroy the existing chart if it exists
    if (this.specificChart) {
      this.specificChart.destroy();
    }

    // Create a new chart instance and assign it to the specificChart property
    this.specificChart = new Chart(ctx, {
      type: 'line',
      data: this.getSpecificGraphData(),
      options: {
        scales: {
          y: {
            beginAtZero: true, // Ensure that y-axis starts at 0
            min: 0, // Explicitly set the minimum to 0
          },
        },
      }, // Add any necessary options
    });
  }
}
