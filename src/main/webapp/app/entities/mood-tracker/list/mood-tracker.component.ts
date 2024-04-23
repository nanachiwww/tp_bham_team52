import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Chart, registerables } from 'chart.js';
import dayjs from 'dayjs/esm';
import { IMoodTracker } from '../mood-tracker.model';
import { NewMoodTracker } from '../mood-tracker.model';
import { ASC, DEFAULT_SORT_DATA, DESC, ITEM_DELETED_EVENT, SORT } from 'app/config/navigation.constants';
import { EntityArrayResponseType, MoodTrackerService } from '../service/mood-tracker.service';
import { MoodTrackerDeleteDialogComponent } from '../delete/mood-tracker-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';
import { SortService } from 'app/shared/sort/sort.service';
import { Mood } from '../../enumerations/mood.model';
import { HttpClient } from '@angular/common/http';
import { HttpResponse } from '@angular/common/http';
import { MindfulnessPracticeService } from '../../mindfulness-practice/service/mindfulness-practice.service';

Chart.register(...registerables);

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

  // Define the five moods with emojis
  moods = [
    { mood: 'VERY_SAD', emoji: '😞' },
    { mood: 'SAD', emoji: '😔' },
    { mood: 'NEUTRAL', emoji: '😐' },
    { mood: 'HAPPY', emoji: '😊' },
    { mood: 'VERY_HAPPY', emoji: '😄' },
  ];

  selectedMoodIndex: number | null = null;

  moodChartData = {
    labels: ['Very Sad', 'Sad', 'Neutral', 'Happy', 'Very Happy'],
    datasets: [
      {
        label: 'Mood Counts',
        data: [0, 0, 0, 0, 0],
        backgroundColor: ['#DC143C', '#FFA07A', '#00FFFF', '#ADFF2F', '#FFD700'],
      },
    ],
  };

  stressChartData = {
    labels: [] as string[],
    datasets: [
      {
        label: 'Stress Level',
        data: [] as number[],
        fill: false,
        borderColor: '#007bff',
      },
    ],
  };

  mindfulnessTips: string[] = [
    'Get a massage.',
    'Plant flowers.',
    'Do yoga.',
    'Take a hike in the woods.',
    'Go fishing.',
    'Sit by a roaring fire.',
    'Curl up with a good book.',
    'Eat lunch outside.',
    'Take a pottery class.',
    'Treat yourself to a pedicure or manicure.',
    'Walk the dog.',
    'Knit or crochet.',
    'Join a book club with friends.',
    'Savor a cup of tea.',
    'Do a hands-on craft (woodworking or painting).',
    'Go camping under the stars.',
    'Write in your journal.',
    'Watch the sunrise or sunset.',
    'Go for a swim.',
    'Listen to classical music.',
  ];

  selectedMindfulnessTip: string | null = null;

  constructor(
    private http: HttpClient,
    protected moodTrackerService: MoodTrackerService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    protected dataUtils: DataUtils,
    protected modalService: NgbModal
  ) {}

  trackId = (_index: number, item: IMoodTracker): number => {
    return item.id ?? -1; // Fallback to a default value
  };

  ngOnInit(): void {
    this.load();
    this.fetchMoodChartData();
    this.pickRandomTip();
    this.loadStressData();
  }

  ngAfterViewInit(): void {
    this.renderMoodChart();
    this.renderStressChart();
  }

  moodChart!: Chart;
  stressChart!: Chart;
  // Render mood chart based on moodChartData
  renderMoodChart(): void {
    const moodChartCanvas = document.getElementById('moodChart') as HTMLCanvasElement;
    if (moodChartCanvas) {
      this.moodChart = new Chart(moodChartCanvas, {
        type: 'bar',
        data: this.moodChartData,
        options: {
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1,
              },
              title: {
                display: true,
                text: 'Mood Counts',
              },
            },
          },
          plugins: {
            legend: {
              display: true,
            },
            tooltip: {
              callbacks: {
                title: tooltipItems => {
                  return `Mood: ${tooltipItems[0].label}`;
                },
              },
            },
          },
        },
      });
    }
  }

  renderStressChart(): void {
    const stressChartCanvas = document.getElementById('stressChart') as HTMLCanvasElement;
    if (stressChartCanvas) {
      this.stressChart = new Chart(stressChartCanvas, {
        type: 'line',
        data: this.stressChartData,
        options: {
          scales: {
            y: {
              beginAtZero: true,
              min: 0,
              max: 10,
              ticks: {
                stepSize: 1,
              },
            },
          },
        },
      });
    }
  }

  // Record mood based on user input
  recordMood(mood: string): void {
    const newMoodTracker: NewMoodTracker = {
      id: null,
      date: dayjs(),
      mood: mood as Mood,
    };

    this.http.post<NewMoodTracker>('/api/mood-trackers', newMoodTracker).subscribe({
      next: () => {
        console.log('Mood tracker created successfully');
        this.fetchMoodChartData(); // Refresh data after creation
      },
      error: err => {
        console.error('Error creating mood tracker', err);
      },
    });
  }

  // Fetch mood data and update the chart
  fetchMoodChartData(): void {
    this.http.get<IMoodTracker[]>('/api/mood-trackers/latest').subscribe(
      data => {
        console.log('Fetched mood trackers:', data);
        this.moodTrackers = data;
        const moodCounts = [0, 0, 0, 0, 0];
        const validMoods: Mood[] = [Mood.VERY_SAD, Mood.SAD, Mood.NEUTRAL, Mood.HAPPY, Mood.VERY_HAPPY];

        this.moodTrackers.forEach(tracker => {
          const moodIndex = validMoods.indexOf(tracker.mood as Mood);
          if (moodIndex >= 0) {
            moodCounts[moodIndex]++;
          }
        });

        this.moodChartData.datasets[0].data = moodCounts;
        this.moodChart.update();
      },
      error => {
        console.error('Error fetching mood trackers', error);
      }
    );
  }

  storeStressData(): void {
    const stressData = {
      labels: this.stressChartData.labels,
      data: this.stressChartData.datasets[0].data,
    };
    localStorage.setItem('stressData', JSON.stringify(stressData));
  }

  // Load stress data from localStorage
  loadStressData(): void {
    const storedStressData = localStorage.getItem('stressData');
    if (storedStressData) {
      const parsedData = JSON.parse(storedStressData);
      this.stressChartData.labels = parsedData.labels;
      this.stressChartData.datasets[0].data = parsedData.data;
    }
  }

  // Update stress level and store data
  updateStressLevel(): void {
    const stressData = [...this.stressChartData.datasets[0].data];
    const stressLabels = [...this.stressChartData.labels];

    const newLabel = dayjs().format('MM/DD');
    stressData.push(this.currentStressLevel);
    stressLabels.push(newLabel);

    if (stressData.length > 14) {
      stressData.shift();
      stressLabels.shift();
    }

    this.stressChartData.datasets[0].data = stressData;
    this.stressChartData.labels = stressLabels;

    this.storeStressData();

    if (this.stressChart) {
      this.stressChart.update();
    }
  }

  pickRandomTip(): void {
    const randomIndex = Math.floor(Math.random() * this.mindfulnessTips.length);
    this.selectedMindfulnessTip = this.mindfulnessTips[randomIndex];
  }

  currentStressLevel = 5; // Example initialization

  userProgressData = {
    goal: 'Complete daily mindfulness exercises',
    progress: 75,
  };

  fetchUserProgressData(): void {
    this.userProgressData.progress = 75;
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

  navigateToMindfulness(activityType: string): void {
    // Navigate to the Mindfulness Practice section with a query parameter
    this.router.navigate(['/mindfulness-practice'], { queryParams: { type: activityType } });
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

  protected queryBackend(predicate?: string, ascending?: boolean): Observable<HttpResponse<IMoodTracker[]>> {
    this.isLoading = true;
    const queryObject = {
      sort: this.getSortQueryParam(predicate, ascending),
    };

    return this.http
      .get<IMoodTracker[]>('/api/mood-trackers', {
        params: queryObject,
        observe: 'response', // This ensures we get a full HttpResponse
      })
      .pipe(
        tap(() => (this.isLoading = false)),
        filter(response => !!response.body) // Ensure the response has a body
      );
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
