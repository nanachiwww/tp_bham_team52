import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

import { IMoodTracker } from '../mood-tracker.model';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType, MoodTrackerService } from '../service/mood-tracker.service';
import { MoodTrackerDeleteDialogComponent } from '../delete/mood-tracker-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';
import { SortService } from 'app/shared/sort/sort.service';

interface ChartData {
  labels: string[];
  datasets: Dataset[];
}

interface Dataset {
  data: number[];
  backgroundColor?: string[];
  fill?: boolean;
  borderColor?: string;
  label?: string;
}

@Component({
  selector: 'jhi-mood-tracker',
  templateUrl: './mood-tracker.component.html',
  styleUrls: ['./mood-tracker.component.scss'],
})
export class MoodTrackerComponent implements OnInit, AfterViewInit {
  moodTrackers?: IMoodTracker[];
  isLoading = false;
  predicate = 'id';
  ascending = true;
  moods = [
    { mood: 'VERY SAD', emoji: '☹' },
    { mood: 'SAD', emoji: '😔' },
    { mood: 'NEUTRAL', emoji: '😐' },
    { mood: 'HAPPY', emoji: '😊' },
    { mood: 'VERY HAPPY', emoji: '😄' },
  ];
  selectedMoodIndex: number | null = null;
  currentStressLevel = 5;
  moodChartData: ChartData = {
    labels: ['', 'Neutral', 'Very Happy', 'Happy', 'Very Sad', 'Sad', ''],
    datasets: [
      {
        data: [0, 3, 5, 4, 1, 2, 0],
        backgroundColor: [
          'rgba(0, 0, 0, 0)',
          '#00FFFF', // Neutral
          '#ADFF2F', // Happy
          '#FFD700', // Very Happy
          '#DC143C', // Very Sad
          '#FFA07A', // Sad
          'rgba(0, 0, 0, 0)',
        ],
      },
    ],
  };
  stressChartData: ChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Stress Level',
        data: [3, 4, 6, 4, 5, 7, 4], // Example data
        fill: false,
        borderColor: '#007bff',
      },
    ],
  };
  mindfulnessActivities = [{ name: 'Guided meditation' }, { name: 'Breathing Exercises' }, { name: 'Mindfulness Tips' }];

  constructor(
    protected moodTrackerService: MoodTrackerService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    protected dataUtils: DataUtils,
    protected modalService: NgbModal
  ) {}

  trackId = (_index: number, item: IMoodTracker): number => this.moodTrackerService.getMoodTrackerIdentifier(item);

  ngAfterViewInit(): void {
    this.renderMoodChart();
    this.renderStressChart();
  }

  renderMoodChart(): void {
    const moodChartCanvas = document.getElementById('moodChartCanvas') as HTMLCanvasElement;
    if (moodChartCanvas) {
      const moodChartCtx = moodChartCanvas.getContext('2d');
      if (moodChartCtx) {
        const moodChart = new Chart(moodChartCtx, {
          type: 'bar',
          data: this.moodChartData,
          options: {
            scales: {
              y: {
                beginAtZero: false,
                min: 1,
                max: 5,
                ticks: {
                  stepSize: 1,
                },
                title: {
                  display: true,
                  text: 'Mood Level',
                },
              },
            },
          },
        });
      } else {
        console.error('Could not get 2D context from canvas');
      }
    } else {
      console.error('Could not find canvas element');
    }
  }

  renderStressChart(): void {
    new Chart('stressChart', {
      type: 'line',
      data: this.stressChartData,
      options: {
        // Configuration options as needed
      },
    });
  }

  ngOnInit(): void {
    this.load();
    this.fetchMoodChartData();
    this.fetchStressChartData();
    this.fetchUserProgressData();
  }

  // Methods to handle mood recording, stress tracking, and mindfulness activities
  recordMood(mood: any, index: number): void {
    this.selectedMoodIndex = index;
    // Logic to handle mood recording
  }

  adjustStressLevel(): void {
    // Logic to handle stress level adjustment
  }

  startActivity(activity: any): void {
    // Logic to start selected mindfulness activity
  }

  // Method to fetch and process mood data (simplified)
  fetchMoodChartData(): void {
    const moodChartCanvas = document.getElementById('moodChart') as HTMLCanvasElement;
    const moodChart = new Chart(moodChartCanvas, {
      type: 'bar',
      data: this.moodChartData,
      options: {
        scales: {
          y: {
            beginAtZero: false,
            min: 0,
            max: 5,
            ticks: {
              stepSize: 1,
              callback: (val, index) => {
                return index % 6 === 0 ? '' : val;
              },
            },
          },
          x: {
            display: false,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              title: function (tooltipItems) {
                return `${tooltipItems[0].label}`;
              },
            },
          },
        },
      },
    });
  }

  fetchStressChartData(): void {
    this.stressChartData.datasets[0].data = [3, 4, 6, 4, 5, 7, 4]; // Example dynamic data
  }

  userProgressData = {
    goal: 'Complete daily mindfulness exercises',
    progress: 75, // Representing 75% progress
  };

  fetchUserProgressData(): void {
    this.userProgressData.progress = 75; // Example dynamic update
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(moodTracker: IMoodTracker): void {
    const modalRef = this.modalService.open(MoodTrackerDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.moodTracker = moodTracker;
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
    this.moodTrackers = this.refineData(dataFromBody);
  }

  protected refineData(data: IMoodTracker[]): IMoodTracker[] {
    return data.sort(this.sortService.startSort(this.predicate, this.ascending ? 1 : -1));
  }

  protected fillComponentAttributesFromResponseBody(data: IMoodTracker[] | null): IMoodTracker[] {
    return data ?? [];
  }

  protected queryBackend(predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject = {
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.moodTrackerService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
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
