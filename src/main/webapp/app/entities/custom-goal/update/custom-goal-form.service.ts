import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ICustomGoal, NewCustomGoal } from '../custom-goal.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICustomGoal for edit and NewCustomGoalFormGroupInput for create.
 */
type CustomGoalFormGroupInput = ICustomGoal | PartialWithRequiredKeyOf<NewCustomGoal>;

type CustomGoalFormDefaults = Pick<NewCustomGoal, 'id'>;

type CustomGoalFormGroupContent = {
  id: FormControl<ICustomGoal['id'] | NewCustomGoal['id']>;
  name: FormControl<ICustomGoal['name']>;
  description: FormControl<ICustomGoal['description']>;
  userProfile: FormControl<ICustomGoal['userProfile']>;
};

export type CustomGoalFormGroup = FormGroup<CustomGoalFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CustomGoalFormService {
  createCustomGoalFormGroup(customGoal: CustomGoalFormGroupInput = { id: null }): CustomGoalFormGroup {
    const customGoalRawValue = {
      ...this.getFormDefaults(),
      ...customGoal,
    };
    return new FormGroup<CustomGoalFormGroupContent>({
      id: new FormControl(
        { value: customGoalRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(customGoalRawValue.name, {
        validators: [Validators.required],
      }),
      description: new FormControl(customGoalRawValue.description),
      userProfile: new FormControl(customGoalRawValue.userProfile),
    });
  }

  getCustomGoal(form: CustomGoalFormGroup): ICustomGoal | NewCustomGoal {
    return form.getRawValue() as ICustomGoal | NewCustomGoal;
  }

  resetForm(form: CustomGoalFormGroup, customGoal: CustomGoalFormGroupInput): void {
    const customGoalRawValue = { ...this.getFormDefaults(), ...customGoal };
    form.reset(
      {
        ...customGoalRawValue,
        id: { value: customGoalRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): CustomGoalFormDefaults {
    return {
      id: null,
    };
  }
}
