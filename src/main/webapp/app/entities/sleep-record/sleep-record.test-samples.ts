import dayjs from 'dayjs/esm';

import { ISleepRecord, NewSleepRecord } from './sleep-record.model';

export const sampleWithRequiredData: ISleepRecord = {
  id: 93819,
  startTime: dayjs('2024-03-02T19:03'),
  endTime: dayjs('2024-03-02T18:26'),
};

export const sampleWithPartialData: ISleepRecord = {
  id: 83696,
  startTime: dayjs('2024-03-02T22:09'),
  endTime: dayjs('2024-03-03T09:10'),
};

export const sampleWithFullData: ISleepRecord = {
  id: 44339,
  startTime: dayjs('2024-03-02T20:45'),
  endTime: dayjs('2024-03-03T13:09'),
  rating: 61170,
};

export const sampleWithNewData: NewSleepRecord = {
  startTime: dayjs('2024-03-02T22:20'),
  endTime: dayjs('2024-03-03T02:10'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
