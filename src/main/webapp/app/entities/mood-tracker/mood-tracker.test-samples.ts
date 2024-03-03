import dayjs from 'dayjs/esm';

import { Mood } from 'app/entities/enumerations/mood.model';

import { IMoodTracker, NewMoodTracker } from './mood-tracker.model';

export const sampleWithRequiredData: IMoodTracker = {
  id: 50632,
  date: dayjs('2024-03-03'),
  mood: Mood['VERY_HAPPY'],
};

export const sampleWithPartialData: IMoodTracker = {
  id: 87453,
  date: dayjs('2024-03-02'),
  mood: Mood['SAD'],
  note: '../fake-data/blob/hipster.txt',
};

export const sampleWithFullData: IMoodTracker = {
  id: 97395,
  date: dayjs('2024-03-02'),
  mood: Mood['HAPPY'],
  note: '../fake-data/blob/hipster.txt',
};

export const sampleWithNewData: NewMoodTracker = {
  date: dayjs('2024-03-03'),
  mood: Mood['SAD'],
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
