import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IExercise, NewExercise } from '../exercise.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IExercise for edit and NewExerciseFormGroupInput for create.
 */
type ExerciseFormGroupInput = IExercise | PartialWithRequiredKeyOf<NewExercise>;

type ExerciseFormDefaults = Pick<NewExercise, 'id'>;

type ExerciseFormGroupContent = {
  id: FormControl<IExercise['id'] | NewExercise['id']>;
  name: FormControl<IExercise['name']>;
  description: FormControl<IExercise['description']>;
  reps: FormControl<IExercise['reps']>;
  sets: FormControl<IExercise['sets']>;
  category: FormControl<IExercise['category']>;
};

export type ExerciseFormGroup = FormGroup<ExerciseFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ExerciseFormService {
  createExerciseFormGroup(exercise: ExerciseFormGroupInput = { id: null }): ExerciseFormGroup {
    const exerciseRawValue = {
      ...this.getFormDefaults(),
      ...exercise,
    };
    return new FormGroup<ExerciseFormGroupContent>({
      id: new FormControl(
        { value: exerciseRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(exerciseRawValue.name, {
        validators: [Validators.required],
      }),
      description: new FormControl(exerciseRawValue.description),
      reps: new FormControl(exerciseRawValue.reps),
      sets: new FormControl(exerciseRawValue.sets),
      category: new FormControl(exerciseRawValue.category),
    });
  }

  getExercise(form: ExerciseFormGroup): IExercise | NewExercise {
    return form.getRawValue() as IExercise | NewExercise;
  }

  resetForm(form: ExerciseFormGroup, exercise: ExerciseFormGroupInput): void {
    const exerciseRawValue = { ...this.getFormDefaults(), ...exercise };
    form.reset(
      {
        ...exerciseRawValue,
        id: { value: exerciseRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ExerciseFormDefaults {
    return {
      id: null,
    };
  }
}
