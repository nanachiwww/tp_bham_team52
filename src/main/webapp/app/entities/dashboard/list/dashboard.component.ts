import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IDashboard } from '../dashboard.model';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType, DashboardService } from '../service/dashboard.service';
import { DashboardDeleteDialogComponent } from '../delete/dashboard-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';
import { SortService } from 'app/shared/sort/sort.service';

import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'jhi-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  dashboards?: IDashboard[];
  isLoading = false;

  predicate = 'id';
  ascending = true;
  userMetrics = {
    sleepData: {
      totalHours: 8,
      sleepQuality: 'Good',
    },
    dietaryData: {
      caloriesConsumed: 2200,
      caloriesGoal: 2500,
    },
    workoutData: {
      activitiesCompleted: 5,
      goalActivities: 7,
    },
    mentalHealthData: {
      mood: 'Happy',
      stressLevel: 'Low',
    },
    goalTrackingData: {
      goalsSet: 3,
      goalsAchieved: 2,
    },
    medicationData: {
      supplementsTaken: 4,
      supplementsTotal: 5,
    },
  };

  constructor(
    protected dashboardService: DashboardService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    protected dataUtils: DataUtils,
    protected modalService: NgbModal
  ) {
    Chart.register(...registerables);
  }

  trackId = (_index: number, item: IDashboard): number => this.dashboardService.getDashboardIdentifier(item);

  ngOnInit(): void {
    this.load();
    this.createSleepChart();
    this.createCalorieChart();
    this.createMoodChart();
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(dashboard: IDashboard): void {
    const modalRef = this.modalService.open(DashboardDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.dashboard = dashboard;
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
    this.dashboards = this.refineData(dataFromBody);
  }

  protected refineData(data: IDashboard[]): IDashboard[] {
    return data.sort(this.sortService.startSort(this.predicate, this.ascending ? 1 : -1));
  }

  protected fillComponentAttributesFromResponseBody(data: IDashboard[] | null): IDashboard[] {
    return data ?? [];
  }

  protected queryBackend(predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject = {
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.dashboardService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
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

  createSleepChart(): void {
    const canvas = document.getElementById('sleep-chart') as HTMLCanvasElement;
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

  createCalorieChart(): void {
    const canvas = document.getElementById('calorie-chart') as HTMLCanvasElement;
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

  createMoodChart(): void {
    const canvas = document.getElementById('mood-chart') as HTMLCanvasElement;
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
