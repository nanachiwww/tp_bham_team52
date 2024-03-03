import { ExerciseCategoryEnum } from 'app/entities/enumerations/exercise-category-enum.model';

import { IExercise, NewExercise } from './exercise.model';

export const sampleWithRequiredData: IExercise = {
  id: 13640,
  name: 'calculating bypass open-source',
};

export const sampleWithPartialData: IExercise = {
  id: 22527,
  name: 'withdrawal',
  sets: 78452,
  category: ExerciseCategoryEnum['FLEXIBILITY'],
};

export const sampleWithFullData: IExercise = {
  id: 17835,
  name: 'optical PNG',
  description: 'transmitting',
  reps: 44780,
  sets: 46527,
  category: ExerciseCategoryEnum['STRENGTH'],
};

export const sampleWithNewData: NewExercise = {
  name: 'Wallis Dynamic heuristic',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
