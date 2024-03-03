import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IStressTracker, NewStressTracker } from '../stress-tracker.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IStressTracker for edit and NewStressTrackerFormGroupInput for create.
 */
type StressTrackerFormGroupInput = IStressTracker | PartialWithRequiredKeyOf<NewStressTracker>;

type StressTrackerFormDefaults = Pick<NewStressTracker, 'id'>;

type StressTrackerFormGroupContent = {
  id: FormControl<IStressTracker['id'] | NewStressTracker['id']>;
  date: FormControl<IStressTracker['date']>;
  level: FormControl<IStressTracker['level']>;
  note: FormControl<IStressTracker['note']>;
  userProfile: FormControl<IStressTracker['userProfile']>;
};

export type StressTrackerFormGroup = FormGroup<StressTrackerFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class StressTrackerFormService {
  createStressTrackerFormGroup(stressTracker: StressTrackerFormGroupInput = { id: null }): StressTrackerFormGroup {
    const stressTrackerRawValue = {
      ...this.getFormDefaults(),
      ...stressTracker,
    };
    return new FormGroup<StressTrackerFormGroupContent>({
      id: new FormControl(
        { value: stressTrackerRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      date: new FormControl(stressTrackerRawValue.date, {
        validators: [Validators.required],
      }),
      level: new FormControl(stressTrackerRawValue.level, {
        validators: [Validators.required, Validators.min(1), Validators.max(10)],
      }),
      note: new FormControl(stressTrackerRawValue.note),
      userProfile: new FormControl(stressTrackerRawValue.userProfile),
    });
  }

  getStressTracker(form: StressTrackerFormGroup): IStressTracker | NewStressTracker {
    return form.getRawValue() as IStressTracker | NewStressTracker;
  }

  resetForm(form: StressTrackerFormGroup, stressTracker: StressTrackerFormGroupInput): void {
    const stressTrackerRawValue = { ...this.getFormDefaults(), ...stressTracker };
    form.reset(
      {
        ...stressTrackerRawValue,
        id: { value: stressTrackerRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): StressTrackerFormDefaults {
    return {
      id: null,
    };
  }
}
