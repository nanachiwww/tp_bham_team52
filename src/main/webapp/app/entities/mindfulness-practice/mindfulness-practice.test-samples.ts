import dayjs from 'dayjs/esm';

import { MindfulnessActivityType } from 'app/entities/enumerations/mindfulness-activity-type.model';

import { IMindfulnessPractice, NewMindfulnessPractice } from './mindfulness-practice.model';

export const sampleWithRequiredData: IMindfulnessPractice = {
  id: 42889,
  date: dayjs('2024-03-03'),
  activityType: MindfulnessActivityType['YOGA'],
  duration: 30983,
};

export const sampleWithPartialData: IMindfulnessPractice = {
  id: 58871,
  date: dayjs('2024-03-03'),
  activityType: MindfulnessActivityType['BREATHING_EXERCISES'],
  duration: 40562,
  note: '../fake-data/blob/hipster.txt',
};

export const sampleWithFullData: IMindfulnessPractice = {
  id: 86489,
  date: dayjs('2024-03-02'),
  activityType: MindfulnessActivityType['YOGA'],
  duration: 99220,
  note: '../fake-data/blob/hipster.txt',
};

export const sampleWithNewData: NewMindfulnessPractice = {
  date: dayjs('2024-03-02'),
  activityType: MindfulnessActivityType['MEDITATION'],
  duration: 70050,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
