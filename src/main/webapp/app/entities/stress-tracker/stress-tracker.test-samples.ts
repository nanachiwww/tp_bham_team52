import dayjs from 'dayjs/esm';

import { IStressTracker, NewStressTracker } from './stress-tracker.model';

export const sampleWithRequiredData: IStressTracker = {
  id: 48161,
  date: dayjs('2024-03-02'),
  level: 7,
};

export const sampleWithPartialData: IStressTracker = {
  id: 91125,
  date: dayjs('2024-03-03'),
  level: 8,
};

export const sampleWithFullData: IStressTracker = {
  id: 19860,
  date: dayjs('2024-03-02'),
  level: 7,
  note: '../fake-data/blob/hipster.txt',
};

export const sampleWithNewData: NewStressTracker = {
  date: dayjs('2024-03-03'),
  level: 9,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
