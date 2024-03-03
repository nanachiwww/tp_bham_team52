import { ICustomGoal, NewCustomGoal } from './custom-goal.model';

export const sampleWithRequiredData: ICustomGoal = {
  id: 42401,
  name: 'methodologies',
};

export const sampleWithPartialData: ICustomGoal = {
  id: 62269,
  name: 'Implemented Sleek New',
};

export const sampleWithFullData: ICustomGoal = {
  id: 9941,
  name: 'Mouse Practical Wooden',
  description: 'Account bluetooth',
};

export const sampleWithNewData: NewCustomGoal = {
  name: 'infrastructures',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
