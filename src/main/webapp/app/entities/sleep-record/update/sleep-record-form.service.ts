import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ISleepRecord, NewSleepRecord } from '../sleep-record.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISleepRecord for edit and NewSleepRecordFormGroupInput for create.
 */
type SleepRecordFormGroupInput = ISleepRecord | PartialWithRequiredKeyOf<NewSleepRecord>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ISleepRecord | NewSleepRecord> = Omit<T, 'startTime' | 'endTime'> & {
  startTime?: string | null;
  endTime?: string | null;
};

type SleepRecordFormRawValue = FormValueOf<ISleepRecord>;

type NewSleepRecordFormRawValue = FormValueOf<NewSleepRecord>;

type SleepRecordFormDefaults = Pick<NewSleepRecord, 'id' | 'startTime' | 'endTime'>;

type SleepRecordFormGroupContent = {
  id: FormControl<SleepRecordFormRawValue['id'] | NewSleepRecord['id']>;
  startTime: FormControl<SleepRecordFormRawValue['startTime']>;
  endTime: FormControl<SleepRecordFormRawValue['endTime']>;
  rating: FormControl<SleepRecordFormRawValue['rating']>;
  userProfile: FormControl<SleepRecordFormRawValue['userProfile']>;
};

export type SleepRecordFormGroup = FormGroup<SleepRecordFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SleepRecordFormService {
  createSleepRecordFormGroup(sleepRecord: SleepRecordFormGroupInput = { id: null }): SleepRecordFormGroup {
    const sleepRecordRawValue = this.convertSleepRecordToSleepRecordRawValue({
      ...this.getFormDefaults(),
      ...sleepRecord,
    });
    return new FormGroup<SleepRecordFormGroupContent>({
      id: new FormControl(
        { value: sleepRecordRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      startTime: new FormControl(sleepRecordRawValue.startTime, {
        validators: [Validators.required],
      }),
      endTime: new FormControl(sleepRecordRawValue.endTime, {
        validators: [Validators.required],
      }),
      rating: new FormControl(sleepRecordRawValue.rating),
      userProfile: new FormControl(sleepRecordRawValue.userProfile),
    });
  }

  getSleepRecord(form: SleepRecordFormGroup): ISleepRecord | NewSleepRecord {
    return this.convertSleepRecordRawValueToSleepRecord(form.getRawValue() as SleepRecordFormRawValue | NewSleepRecordFormRawValue);
  }

  resetForm(form: SleepRecordFormGroup, sleepRecord: SleepRecordFormGroupInput): void {
    const sleepRecordRawValue = this.convertSleepRecordToSleepRecordRawValue({ ...this.getFormDefaults(), ...sleepRecord });
    form.reset(
      {
        ...sleepRecordRawValue,
        id: { value: sleepRecordRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): SleepRecordFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      startTime: currentTime,
      endTime: currentTime,
    };
  }

  private convertSleepRecordRawValueToSleepRecord(
    rawSleepRecord: SleepRecordFormRawValue | NewSleepRecordFormRawValue
  ): ISleepRecord | NewSleepRecord {
    return {
      ...rawSleepRecord,
      startTime: dayjs(rawSleepRecord.startTime, DATE_TIME_FORMAT),
      endTime: dayjs(rawSleepRecord.endTime, DATE_TIME_FORMAT),
    };
  }

  private convertSleepRecordToSleepRecordRawValue(
    sleepRecord: ISleepRecord | (Partial<NewSleepRecord> & SleepRecordFormDefaults)
  ): SleepRecordFormRawValue | PartialWithRequiredKeyOf<NewSleepRecordFormRawValue> {
    return {
      ...sleepRecord,
      startTime: sleepRecord.startTime ? sleepRecord.startTime.format(DATE_TIME_FORMAT) : undefined,
      endTime: sleepRecord.endTime ? sleepRecord.endTime.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
