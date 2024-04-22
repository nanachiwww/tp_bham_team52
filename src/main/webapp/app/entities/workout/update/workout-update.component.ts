import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { WorkoutFormService, WorkoutFormGroup } from './workout-form.service';
import { IWorkout } from '../workout.model';
import { WorkoutService } from '../service/workout.service';
import { IExercise } from 'app/entities/exercise/exercise.model';
import { ExerciseService } from 'app/entities/exercise/service/exercise.service';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';
import { IntensityLevelEnum } from 'app/entities/enumerations/intensity-level-enum.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'jhi-workout-update',
  templateUrl: './workout-update.component.html',
  styleUrls: ['./workout-update.component.scss'],
})
export class WorkoutUpdateComponent implements OnInit {
  isSaving = false;
  workout: IWorkout | null = null;
  intensityLevelEnumValues = Object.keys(IntensityLevelEnum);

  exercisesSharedCollection: IExercise[] = [];
  userProfilesSharedCollection: IUserProfile[] = [];

  editForm: WorkoutFormGroup = this.workoutFormService.createWorkoutFormGroup();

  filteredExercises: IExercise[] = [];
  allExercises: IExercise[] = [];
  selectedExercises: IExercise[] = [];

  constructor(
    protected workoutService: WorkoutService,
    protected workoutFormService: WorkoutFormService,
    protected exerciseService: ExerciseService,
    protected userProfileService: UserProfileService,
    protected activatedRoute: ActivatedRoute,
    private http: HttpClient
  ) {}

  compareExercise = (o1: IExercise | null, o2: IExercise | null): boolean => this.exerciseService.compareExercise(o1, o2);

  compareUserProfile = (o1: IUserProfile | null, o2: IUserProfile | null): boolean => this.userProfileService.compareUserProfile(o1, o2);

  ngOnInit(): void {
    this.loadAllExercises();
    this.activatedRoute.data.subscribe(({ workout }) => {
      this.workout = workout;
      if (workout) {
        this.updateForm(workout);
      }

      this.loadRelationshipsOptions();
    });
  }

  loadAllExercises(): void {
    this.exerciseService.query().subscribe((res: HttpResponse<IExercise[]>) => {
      this.allExercises = res.body ?? [];
      this.filteredExercises = this.allExercises;
    });
  }

  filterExercises(event: Event): void {
    const target = event.target as HTMLInputElement;
    const keyword = target.value.trim();
    if (keyword === '') {
      this.filteredExercises = this.allExercises;
      return;
    }
    this.filteredExercises = this.allExercises.filter(
      exercise => exercise.name && keyword && exercise.name.toLowerCase().includes(keyword.toLowerCase())
    );
    this.editForm.get('exercises')!.setValue(this.selectedExercises);
  }

  toggleExerciseSelection(exercise: IExercise): void {
    const index = this.selectedExercises.findIndex(e => e.id === exercise.id);
    if (index > -1) {
      this.selectedExercises.splice(index, 1);
    } else {
      this.selectedExercises.push(exercise);
    }
    this.editForm.get('exercises')!.setValue(this.selectedExercises);
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    const workout = this.createFromForm();
    if (workout.id !== undefined) {
      this.subscribeToSaveResponse(this.workoutService.update(workout));
      this.addExercisesToWorkout(
        workout.id,
        workout.exercises?.map((exercise: IExercise) => exercise.id)
      ).subscribe();
    } else {
      const newWorkout = {
        ...workout,
        id: null,
      };
      this.subscribeToSaveResponse(this.workoutService.create(newWorkout));
    }
  }

  createFromForm(): IWorkout {
    return {
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      description: this.editForm.get(['description'])!.value,
      duration: this.editForm.get(['duration'])!.value,
      intensityLevel: this.editForm.get(['intensityLevel'])!.value,
      exercises: this.editForm.get(['exercises'])!.value,
      userProfile: this.editForm.get(['userProfile'])!.value,
    };
  }

  addExercisesToWorkout(workoutId: number, exerciseIds: number[] | undefined): Observable<HttpResponse<IWorkout>> {
    return this.http.post<IWorkout>(`api/workouts/{id}/exercises`, exerciseIds, { observe: 'response' });
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IWorkout>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(workout: IWorkout): void {
    this.workout = workout;
    this.workoutFormService.resetForm(this.editForm, workout);

    this.exercisesSharedCollection = this.exerciseService.addExerciseToCollectionIfMissing<IExercise>(
      this.exercisesSharedCollection,
      ...(workout.exercises ?? [])
    );
    this.userProfilesSharedCollection = this.userProfileService.addUserProfileToCollectionIfMissing<IUserProfile>(
      this.userProfilesSharedCollection,
      workout.userProfile
    );
  }

  protected loadRelationshipsOptions(): void {
    this.exerciseService
      .query()
      .pipe(map((res: HttpResponse<IExercise[]>) => res.body ?? []))
      .pipe(
        map((exercises: IExercise[]) =>
          this.exerciseService.addExerciseToCollectionIfMissing<IExercise>(exercises, ...(this.workout?.exercises ?? []))
        )
      )
      .subscribe((exercises: IExercise[]) => (this.exercisesSharedCollection = exercises));

    this.userProfileService
      .query()
      .pipe(map((res: HttpResponse<IUserProfile[]>) => res.body ?? []))
      .pipe(
        map((userProfiles: IUserProfile[]) =>
          this.userProfileService.addUserProfileToCollectionIfMissing<IUserProfile>(userProfiles, this.workout?.userProfile)
        )
      )
      .subscribe((userProfiles: IUserProfile[]) => (this.userProfilesSharedCollection = userProfiles));
  }
}
