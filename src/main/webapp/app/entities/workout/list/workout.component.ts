import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IWorkout } from '../workout.model';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType, WorkoutService } from '../service/workout.service';
import { WorkoutDeleteDialogComponent } from '../delete/workout-delete-dialog.component';
import { SortService } from 'app/shared/sort/sort.service';

interface IntensityLevel {
  id: number;
  name: string;
  selected: boolean;
}

@Component({
  selector: 'jhi-workout',
  templateUrl: './workout.component.html',
  styleUrls: ['./workout.component.scss'],
})
export class WorkoutComponent implements OnInit {
  workouts?: IWorkout[];
  isLoading = false;
  filteredWorkouts: IWorkout[] = [];
  intensityLevels: IntensityLevel[] = [
    { id: 1, name: 'LOW', selected: false },
    { id: 2, name: 'MODERATE', selected: false },
    { id: 3, name: 'HIGH', selected: false },
  ];

  predicate = 'id';
  ascending = true;

  searchName: string = ''; // Variable to store the search input
  similarWorkouts: IWorkout[] = []; // Array to store similar workouts for suggestions

  constructor(
    protected workoutService: WorkoutService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    protected modalService: NgbModal
  ) {}

  trackId = (_index: number, item: IWorkout): number => this.workoutService.getWorkoutIdentifier(item);

  ngOnInit(): void {
    this.load();
    this.onSearchChange(); // Trigger initial filtering
  }

  delete(workout: IWorkout): void {
    const modalRef = this.modalService.open(WorkoutDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.workout = workout;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        switchMap(() => this.loadFromBackendWithRouteInformations())
      )
      .subscribe({
        next: (res: EntityArrayResponseType) => {
          this.onResponseSuccess(res);
          // Filter workouts after deletion
          this.filterWorkouts();
        },
      });
  }

  load(): void {
    this.loadFromBackendWithRouteInformations().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
        // Filter workouts after loading
        this.filterWorkouts();
      },
    });
  }
  filterWorkouts(): void {
    if (!this.workouts) {
      this.filteredWorkouts = [];
      return;
    }

    // Check if none of the intensity levels are selected
    const isAnyLevelSelected = this.intensityLevels.some(level => level.selected);

    if (!isAnyLevelSelected) {
      // If none of the intensity levels are selected, show all workouts
      this.filteredWorkouts = this.workouts;
    } else {
      // Filter workouts based on selected intensity levels
      this.filteredWorkouts = this.workouts.filter(workout => {
        if (!workout.intensityLevel) return false;
        return this.intensityLevels.some(level => level.selected && level.name === workout.intensityLevel);
      });
    }
  }

  navigateToWithComponentValues(): void {
    this.handleNavigation(this.predicate, this.ascending);
  }

  onIntensityChange(): void {
    // Filter workouts whenever intensity selection changes
    this.filterWorkouts();
  }

  onSearchChange(): void {
    if (!this.workouts || !this.searchName) {
      this.filteredWorkouts = this.workouts ?? [];
      return;
    }

    // Filter workouts based on search input (case-insensitive)
    this.filteredWorkouts = this.workouts.filter(
      workout => workout && workout.name && workout.name.toLowerCase().includes(this.searchName.toLowerCase())
    );

    // Find similar workouts for suggestions
    this.similarWorkouts = this.workouts.filter(
      workout =>
        workout && workout.name && workout.name.toLowerCase().startsWith(this.searchName.toLowerCase()) && workout.name !== this.searchName
    );
  }

  selectSimilarWorkout(workout: IWorkout): void {
    this.searchName = workout.name || ''; // Set the search input to the selected workout name
    this.onSearchChange(); // Filter workouts based on the selected workout name
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
    this.workouts = this.refineData(dataFromBody);
  }

  protected refineData(data: IWorkout[]): IWorkout[] {
    return data.sort(this.sortService.startSort(this.predicate, this.ascending ? 1 : -1));
  }

  protected fillComponentAttributesFromResponseBody(data: IWorkout[] | null): IWorkout[] {
    return data ?? [];
  }

  protected queryBackend(predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject = {
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.workoutService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
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

  get selectedIntensity(): string[] {
    return this.intensityLevels.filter(level => level.selected).map(level => level.name);
  }
}
