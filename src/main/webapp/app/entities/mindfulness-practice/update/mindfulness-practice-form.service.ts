import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IMindfulnessPractice, NewMindfulnessPractice } from '../mindfulness-practice.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IMindfulnessPractice for edit and NewMindfulnessPracticeFormGroupInput for create.
 */
type MindfulnessPracticeFormGroupInput = IMindfulnessPractice | PartialWithRequiredKeyOf<NewMindfulnessPractice>;

type MindfulnessPracticeFormDefaults = Pick<NewMindfulnessPractice, 'id'>;

type MindfulnessPracticeFormGroupContent = {
  id: FormControl<IMindfulnessPractice['id'] | NewMindfulnessPractice['id']>;
  date: FormControl<IMindfulnessPractice['date']>;
  activityType: FormControl<IMindfulnessPractice['activityType']>;
  duration: FormControl<IMindfulnessPractice['duration']>;
  note: FormControl<IMindfulnessPractice['note']>;
  mindfulnessTip: FormControl<IMindfulnessPractice['mindfulnessTip']>;
  userProfile: FormControl<IMindfulnessPractice['userProfile']>;
};

export type MindfulnessPracticeFormGroup = FormGroup<MindfulnessPracticeFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MindfulnessPracticeFormService {
  createMindfulnessPracticeFormGroup(mindfulnessPractice: MindfulnessPracticeFormGroupInput = { id: null }): MindfulnessPracticeFormGroup {
    const mindfulnessPracticeRawValue = {
      ...this.getFormDefaults(),
      ...mindfulnessPractice,
    };
    return new FormGroup<MindfulnessPracticeFormGroupContent>({
      id: new FormControl(
        { value: mindfulnessPracticeRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      date: new FormControl(mindfulnessPracticeRawValue.date, {
        validators: [Validators.required],
      }),
      activityType: new FormControl(mindfulnessPracticeRawValue.activityType, {
        validators: [Validators.required],
      }),
      duration: new FormControl(mindfulnessPracticeRawValue.duration, {
        validators: [Validators.required, Validators.min(1)],
      }),
      note: new FormControl(mindfulnessPracticeRawValue.note),
      mindfulnessTip: new FormControl(mindfulnessPracticeRawValue.mindfulnessTip),
      userProfile: new FormControl(mindfulnessPracticeRawValue.userProfile),
    });
  }

  getMindfulnessPractice(form: MindfulnessPracticeFormGroup): IMindfulnessPractice | NewMindfulnessPractice {
    return form.getRawValue() as IMindfulnessPractice | NewMindfulnessPractice;
  }

  resetForm(form: MindfulnessPracticeFormGroup, mindfulnessPractice: MindfulnessPracticeFormGroupInput): void {
    const mindfulnessPracticeRawValue = { ...this.getFormDefaults(), ...mindfulnessPractice };
    form.reset(
      {
        ...mindfulnessPracticeRawValue,
        id: { value: mindfulnessPracticeRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): MindfulnessPracticeFormDefaults {
    return {
      id: null,
    };
  }
}
