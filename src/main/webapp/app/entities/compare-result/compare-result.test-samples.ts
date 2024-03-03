import dayjs from 'dayjs/esm';

import { ICompareResult, NewCompareResult } from './compare-result.model';

export const sampleWithRequiredData: ICompareResult = {
  id: 39457,
};

export const sampleWithPartialData: ICompareResult = {
  id: 2002,
  resultDetails: 'non-volatile',
  dietaryGoalComplete: false,
  workoutGoalAchieved: true,
};

export const sampleWithFullData: ICompareResult = {
  id: 32539,
  resultDetails: 'payment Tactics',
  timestamp: dayjs('2024-03-03T15:01'),
  dietaryGoalComplete: false,
  moodGoalAchieved: true,
  workoutGoalAchieved: false,
  sleepGoalAchieved: true,
};

export const sampleWithNewData: NewCompareResult = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
