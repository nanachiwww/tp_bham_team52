import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IEnergyIntakeResult, NewEnergyIntakeResult } from '../energy-intake-result.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IEnergyIntakeResult for edit and NewEnergyIntakeResultFormGroupInput for create.
 */
type EnergyIntakeResultFormGroupInput = IEnergyIntakeResult | PartialWithRequiredKeyOf<NewEnergyIntakeResult>;

type EnergyIntakeResultFormDefaults = Pick<NewEnergyIntakeResult, 'id' | 'lunch' | 'breakfirst' | 'dinner' | 'createTime'>;

type EnergyIntakeResultFormGroupContent = {
  id: FormControl<IEnergyIntakeResult['id'] | NewEnergyIntakeResult['id']>;
  lunch: FormControl<IEnergyIntakeResult['lunch']>;
  breakfirst: FormControl<IEnergyIntakeResult['breakfirst']>;
  createTime: FormControl<IEnergyIntakeResult['createTime']>;
  dinner: FormControl<IEnergyIntakeResult['dinner']>;
  // items: FormControl<IEnergyIntakeResult['items']>;
};

export type EnergyIntakeResultFormGroup = FormGroup<EnergyIntakeResultFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class EnergyIntakeResultFormService {
  createEnergyIntakeResultFormGroup(energyIntakeResult: EnergyIntakeResultFormGroupInput = { id: null }): EnergyIntakeResultFormGroup {
    const energyIntakeResultRawValue = {
      ...this.getFormDefaults(),
      ...energyIntakeResult,
    };
    return new FormGroup<EnergyIntakeResultFormGroupContent>({
      id: new FormControl(
        { value: energyIntakeResultRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      lunch: new FormControl(energyIntakeResultRawValue.lunch),
      breakfirst: new FormControl(energyIntakeResultRawValue.breakfirst),
      dinner: new FormControl(energyIntakeResultRawValue.dinner),
      createTime: new FormControl(energyIntakeResultRawValue.createTime),
      // goalComplete: new FormControl(energyIntakeResultRawValue.goalComplete),
      // details: new FormControl(energyIntakeResultRawValue.details),
      // date: new FormControl(energyIntakeResultRawValue.date, {
      //   validators: [Validators.required],
      // }),
      // userProfile: new FormControl(energyIntakeResultRawValue.userProfile),
      // items: new FormControl(energyIntakeResultRawValue.items ?? []),
    });
  }

  getEnergyIntakeResult(form: EnergyIntakeResultFormGroup): IEnergyIntakeResult | NewEnergyIntakeResult {
    return form.getRawValue() as IEnergyIntakeResult | NewEnergyIntakeResult;
  }

  resetForm(form: EnergyIntakeResultFormGroup, energyIntakeResult: EnergyIntakeResultFormGroupInput): void {
    const energyIntakeResultRawValue = { ...this.getFormDefaults(), ...energyIntakeResult };
    form.reset(
      {
        ...energyIntakeResultRawValue,
        id: { value: energyIntakeResultRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): EnergyIntakeResultFormDefaults {
    return {
      id: null,
      lunch: '',
      breakfirst: '',
      dinner: '',
      createTime: null,
    };
  }
}
