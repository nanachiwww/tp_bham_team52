import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// Import the dumbbell icon
import { faDumbbell } from '@fortawesome/free-solid-svg-icons';

import { IExercise } from '../exercise.model';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType, ExerciseService } from '../service/exercise.service';
import { ExerciseDeleteDialogComponent } from '../delete/exercise-delete-dialog.component';
import { SortService } from 'app/shared/sort/sort.service';

interface MuscleGroup {
  id: number;
  name: string;
  selected: boolean;
}

@Component({
  selector: 'jhi-exercise',
  templateUrl: './exercise.component.html',
  styleUrls: ['./exercise.component.scss'],
})
export class ExerciseComponent implements OnInit {
  exercises?: IExercise[];
  isLoading = false;
  filteredExercises: IExercise[] = [];
  muscleGroups: MuscleGroup[] = [
    { id: 1, name: 'CHEST', selected: false },
    { id: 2, name: 'BACK', selected: false },
    { id: 3, name: 'LEGS', selected: false },
    { id: 4, name: 'ARMS', selected: false },
    { id: 5, name: 'SHOULDERS', selected: false },
    { id: 6, name: 'ABS', selected: false },
    { id: 7, name: 'CARDIO', selected: false },
    { id: 8, name: 'OTHER', selected: false },
  ];

  predicate = 'id';
  ascending = true;

  // Assign the imported icon to a variable
  faDumbbell = faDumbbell;

  constructor(
    protected exerciseService: ExerciseService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    protected modalService: NgbModal
  ) {}

  trackId = (_index: number, item: IExercise): number => this.exerciseService.getExerciseIdentifier(item);

  ngOnInit(): void {
    this.load();
  }

  delete(exercise: IExercise): void {
    const modalRef = this.modalService.open(ExerciseDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.exercise = exercise;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        switchMap(() => this.loadFromBackendWithRouteInformations())
      )
      .subscribe({
        next: (res: EntityArrayResponseType) => {
          this.onResponseSuccess(res);
          // Filter exercises after deletion
          this.filterExercises();
        },
      });
  }

  load(): void {
    this.loadFromBackendWithRouteInformations().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
        // Filter exercises after loading
        this.filterExercises();
      },
    });
  }

  filterExercises(): void {
    // If no categories selected, display all exercises
    if (!this.exercises || this.selectedCategories.length === 0) {
      this.filteredExercises = this.exercises ?? [];
      return;
    }

    // Filter exercises based on selected categories
    this.filteredExercises = this.exercises.filter(exercise => exercise && this.selectedCategories.includes(exercise.muscleGroup ?? ''));
  }

  navigateToWithComponentValues(): void {
    this.handleNavigation(this.predicate, this.ascending);
  }

  onCategoryChange(): void {
    // Filter exercises whenever a category selection changes
    this.filterExercises();
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
    this.exercises = this.refineData(dataFromBody);
  }

  protected refineData(data: IExercise[]): IExercise[] {
    return data.sort(this.sortService.startSort(this.predicate, this.ascending ? 1 : -1));
  }

  protected fillComponentAttributesFromResponseBody(data: IExercise[] | null): IExercise[] {
    return data ?? [];
  }

  protected queryBackend(predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject = {
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.exerciseService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
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

  get selectedCategories(): string[] {
    return this.muscleGroups.filter(category => category.selected).map(category => category.name);
  }
}
