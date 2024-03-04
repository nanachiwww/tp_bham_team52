import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ExerciseFormService, ExerciseFormGroup } from './exercise-form.service';
import { IExercise } from '../exercise.model';
import { ExerciseService } from '../service/exercise.service';
import { MuscleGroupEnum } from 'app/entities/enumerations/muscle-group-enum.model';

@Component({
  selector: 'jhi-exercise-update',
  templateUrl: './exercise-update.component.html',
})
export class ExerciseUpdateComponent implements OnInit {
  isSaving = false;
  exercise: IExercise | null = null;
  muscleGroupEnumValues = Object.keys(MuscleGroupEnum);

  editForm: ExerciseFormGroup = this.exerciseFormService.createExerciseFormGroup();

  constructor(
    protected exerciseService: ExerciseService,
    protected exerciseFormService: ExerciseFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ exercise }) => {
      this.exercise = exercise;
      if (exercise) {
        this.updateForm(exercise);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const exercise = this.exerciseFormService.getExercise(this.editForm);
    if (exercise.id !== null) {
      this.subscribeToSaveResponse(this.exerciseService.update(exercise));
    } else {
      this.subscribeToSaveResponse(this.exerciseService.create(exercise));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IExercise>>): void {
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

  protected updateForm(exercise: IExercise): void {
    this.exercise = exercise;
    this.exerciseFormService.resetForm(this.editForm, exercise);
  }
}
