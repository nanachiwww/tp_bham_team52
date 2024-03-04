import { MuscleGroupEnum } from 'app/entities/enumerations/muscle-group-enum.model';

import { IExercise, NewExercise } from './exercise.model';

export const sampleWithRequiredData: IExercise = {
  id: 13640,
  name: 'calculating bypass open-source',
};

export const sampleWithPartialData: IExercise = {
  id: 22527,
  name: 'withdrawal',
  sets: 78452,
  muscleGroup: MuscleGroupEnum['CARDIO'],
};

export const sampleWithFullData: IExercise = {
  id: 17835,
  name: 'optical PNG',
  description: 'transmitting',
  reps: 44780,
  sets: 46527,
  muscleGroup: MuscleGroupEnum['ARMS'],
};

export const sampleWithNewData: NewExercise = {
  name: 'Wallis Dynamic heuristic',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
