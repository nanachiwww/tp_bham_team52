import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IMoodTracker, NewMoodTracker } from '../mood-tracker.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IMoodTracker for edit and NewMoodTrackerFormGroupInput for create.
 */
type MoodTrackerFormGroupInput = IMoodTracker | PartialWithRequiredKeyOf<NewMoodTracker>;

type MoodTrackerFormDefaults = Pick<NewMoodTracker, 'id'>;

type MoodTrackerFormGroupContent = {
  id: FormControl<IMoodTracker['id'] | NewMoodTracker['id']>;
  date: FormControl<IMoodTracker['date']>;
  mood: FormControl<IMoodTracker['mood']>;
  note: FormControl<IMoodTracker['note']>;
  userProfile: FormControl<IMoodTracker['userProfile']>;
};

export type MoodTrackerFormGroup = FormGroup<MoodTrackerFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MoodTrackerFormService {
  createMoodTrackerFormGroup(moodTracker: MoodTrackerFormGroupInput = { id: null }): MoodTrackerFormGroup {
    const moodTrackerRawValue = {
      ...this.getFormDefaults(),
      ...moodTracker,
    };
    return new FormGroup<MoodTrackerFormGroupContent>({
      id: new FormControl(
        { value: moodTrackerRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      date: new FormControl(moodTrackerRawValue.date, {
        validators: [Validators.required],
      }),
      mood: new FormControl(moodTrackerRawValue.mood, {
        validators: [Validators.required],
      }),
      note: new FormControl(moodTrackerRawValue.note),
      userProfile: new FormControl(moodTrackerRawValue.userProfile),
    });
  }

  getMoodTracker(form: MoodTrackerFormGroup): IMoodTracker | NewMoodTracker {
    return form.getRawValue() as IMoodTracker | NewMoodTracker;
  }

  resetForm(form: MoodTrackerFormGroup, moodTracker: MoodTrackerFormGroupInput): void {
    const moodTrackerRawValue = { ...this.getFormDefaults(), ...moodTracker };
    form.reset(
      {
        ...moodTrackerRawValue,
        id: { value: moodTrackerRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): MoodTrackerFormDefaults {
    return {
      id: null,
    };
  }
}
