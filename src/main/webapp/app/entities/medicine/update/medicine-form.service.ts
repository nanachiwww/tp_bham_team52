import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IMedicine, NewMedicine } from '../medicine.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IMedicine for edit and NewMedicineFormGroupInput for create.
 */
type MedicineFormGroupInput = IMedicine | PartialWithRequiredKeyOf<NewMedicine>;

type MedicineFormDefaults = Pick<NewMedicine, 'id'>;

type MedicineFormGroupContent = {
  id: FormControl<IMedicine['id'] | NewMedicine['id']>;
  date: FormControl<IMedicine['date']>;
  name: FormControl<IMedicine['name']>;
  description: FormControl<IMedicine['description']>;
  subjectiveEffect: FormControl<IMedicine['subjectiveEffect']>;
  supplementType: FormControl<IMedicine['supplementType']>;
  userProfile: FormControl<IMedicine['userProfile']>;
};

export type MedicineFormGroup = FormGroup<MedicineFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MedicineFormService {
  createMedicineFormGroup(medicine: MedicineFormGroupInput = { id: null }): MedicineFormGroup {
    const medicineRawValue = {
      ...this.getFormDefaults(),
      ...medicine,
    };
    return new FormGroup<MedicineFormGroupContent>({
      id: new FormControl(
        { value: medicineRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      date: new FormControl(medicineRawValue.date, {
        validators: [Validators.required],
      }),
      name: new FormControl(medicineRawValue.name, {
        validators: [Validators.required],
      }),
      description: new FormControl(medicineRawValue.description),
      subjectiveEffect: new FormControl(medicineRawValue.subjectiveEffect),
      supplementType: new FormControl(medicineRawValue.supplementType),
      userProfile: new FormControl(medicineRawValue.userProfile),
    });
  }

  getMedicine(form: MedicineFormGroup): IMedicine | NewMedicine {
    return form.getRawValue() as IMedicine | NewMedicine;
  }

  resetForm(form: MedicineFormGroup, medicine: MedicineFormGroupInput): void {
    const medicineRawValue = { ...this.getFormDefaults(), ...medicine };
    form.reset(
      {
        ...medicineRawValue,
        id: { value: medicineRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): MedicineFormDefaults {
    return {
      id: null,
    };
  }
}
