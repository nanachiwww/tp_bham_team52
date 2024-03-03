import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IMindfulnessTip, NewMindfulnessTip } from '../mindfulness-tip.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IMindfulnessTip for edit and NewMindfulnessTipFormGroupInput for create.
 */
type MindfulnessTipFormGroupInput = IMindfulnessTip | PartialWithRequiredKeyOf<NewMindfulnessTip>;

type MindfulnessTipFormDefaults = Pick<NewMindfulnessTip, 'id'>;

type MindfulnessTipFormGroupContent = {
  id: FormControl<IMindfulnessTip['id'] | NewMindfulnessTip['id']>;
  createdDate: FormControl<IMindfulnessTip['createdDate']>;
  title: FormControl<IMindfulnessTip['title']>;
  content: FormControl<IMindfulnessTip['content']>;
};

export type MindfulnessTipFormGroup = FormGroup<MindfulnessTipFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MindfulnessTipFormService {
  createMindfulnessTipFormGroup(mindfulnessTip: MindfulnessTipFormGroupInput = { id: null }): MindfulnessTipFormGroup {
    const mindfulnessTipRawValue = {
      ...this.getFormDefaults(),
      ...mindfulnessTip,
    };
    return new FormGroup<MindfulnessTipFormGroupContent>({
      id: new FormControl(
        { value: mindfulnessTipRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      createdDate: new FormControl(mindfulnessTipRawValue.createdDate, {
        validators: [Validators.required],
      }),
      title: new FormControl(mindfulnessTipRawValue.title, {
        validators: [Validators.required],
      }),
      content: new FormControl(mindfulnessTipRawValue.content, {
        validators: [Validators.required],
      }),
    });
  }

  getMindfulnessTip(form: MindfulnessTipFormGroup): IMindfulnessTip | NewMindfulnessTip {
    return form.getRawValue() as IMindfulnessTip | NewMindfulnessTip;
  }

  resetForm(form: MindfulnessTipFormGroup, mindfulnessTip: MindfulnessTipFormGroupInput): void {
    const mindfulnessTipRawValue = { ...this.getFormDefaults(), ...mindfulnessTip };
    form.reset(
      {
        ...mindfulnessTipRawValue,
        id: { value: mindfulnessTipRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): MindfulnessTipFormDefaults {
    return {
      id: null,
    };
  }
}
