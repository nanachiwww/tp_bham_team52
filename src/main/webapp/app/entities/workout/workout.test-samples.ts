import { IntensityLevelEnum } from 'app/entities/enumerations/intensity-level-enum.model';

import { IWorkout, NewWorkout } from './workout.model';

export const sampleWithRequiredData: IWorkout = {
  id: 88410,
  name: 'bluetooth Computers AI',
};

export const sampleWithPartialData: IWorkout = {
  id: 99020,
  name: 'Account Mountains indexing',
  duration: 17484,
};

export const sampleWithFullData: IWorkout = {
  id: 38971,
  name: 'digital',
  description: 'XML Borders',
  duration: 92248,
  intensityLevel: IntensityLevelEnum['LOW'],
};

export const sampleWithNewData: NewWorkout = {
  name: 'user forecast',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
