import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ICompareResult, NewCompareResult } from '../compare-result.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICompareResult for edit and NewCompareResultFormGroupInput for create.
 */
type CompareResultFormGroupInput = ICompareResult | PartialWithRequiredKeyOf<NewCompareResult>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ICompareResult | NewCompareResult> = Omit<T, 'timestamp'> & {
  timestamp?: string | null;
};

type CompareResultFormRawValue = FormValueOf<ICompareResult>;

type NewCompareResultFormRawValue = FormValueOf<NewCompareResult>;

type CompareResultFormDefaults = Pick<
  NewCompareResult,
  'id' | 'timestamp' | 'dietaryGoalComplete' | 'moodGoalAchieved' | 'workoutGoalAchieved' | 'sleepGoalAchieved'
>;

type CompareResultFormGroupContent = {
  id: FormControl<CompareResultFormRawValue['id'] | NewCompareResult['id']>;
  resultDetails: FormControl<CompareResultFormRawValue['resultDetails']>;
  timestamp: FormControl<CompareResultFormRawValue['timestamp']>;
  dietaryGoalComplete: FormControl<CompareResultFormRawValue['dietaryGoalComplete']>;
  moodGoalAchieved: FormControl<CompareResultFormRawValue['moodGoalAchieved']>;
  workoutGoalAchieved: FormControl<CompareResultFormRawValue['workoutGoalAchieved']>;
  sleepGoalAchieved: FormControl<CompareResultFormRawValue['sleepGoalAchieved']>;
};

export type CompareResultFormGroup = FormGroup<CompareResultFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CompareResultFormService {
  createCompareResultFormGroup(compareResult: CompareResultFormGroupInput = { id: null }): CompareResultFormGroup {
    const compareResultRawValue = this.convertCompareResultToCompareResultRawValue({
      ...this.getFormDefaults(),
      ...compareResult,
    });
    return new FormGroup<CompareResultFormGroupContent>({
      id: new FormControl(
        { value: compareResultRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      resultDetails: new FormControl(compareResultRawValue.resultDetails),
      timestamp: new FormControl(compareResultRawValue.timestamp),
      dietaryGoalComplete: new FormControl(compareResultRawValue.dietaryGoalComplete),
      moodGoalAchieved: new FormControl(compareResultRawValue.moodGoalAchieved),
      workoutGoalAchieved: new FormControl(compareResultRawValue.workoutGoalAchieved),
      sleepGoalAchieved: new FormControl(compareResultRawValue.sleepGoalAchieved),
    });
  }

  getCompareResult(form: CompareResultFormGroup): ICompareResult | NewCompareResult {
    return this.convertCompareResultRawValueToCompareResult(form.getRawValue() as CompareResultFormRawValue | NewCompareResultFormRawValue);
  }

  resetForm(form: CompareResultFormGroup, compareResult: CompareResultFormGroupInput): void {
    const compareResultRawValue = this.convertCompareResultToCompareResultRawValue({ ...this.getFormDefaults(), ...compareResult });
    form.reset(
      {
        ...compareResultRawValue,
        id: { value: compareResultRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): CompareResultFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      timestamp: currentTime,
      dietaryGoalComplete: false,
      moodGoalAchieved: false,
      workoutGoalAchieved: false,
      sleepGoalAchieved: false,
    };
  }

  private convertCompareResultRawValueToCompareResult(
    rawCompareResult: CompareResultFormRawValue | NewCompareResultFormRawValue
  ): ICompareResult | NewCompareResult {
    return {
      ...rawCompareResult,
      timestamp: dayjs(rawCompareResult.timestamp, DATE_TIME_FORMAT),
    };
  }

  private convertCompareResultToCompareResultRawValue(
    compareResult: ICompareResult | (Partial<NewCompareResult> & CompareResultFormDefaults)
  ): CompareResultFormRawValue | PartialWithRequiredKeyOf<NewCompareResultFormRawValue> {
    return {
      ...compareResult,
      timestamp: compareResult.timestamp ? compareResult.timestamp.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
