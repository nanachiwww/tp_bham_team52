import dayjs from 'dayjs/esm';

import { IEnergyIntakeResult, NewEnergyIntakeResult } from './energy-intake-result.model';

export const sampleWithRequiredData: IEnergyIntakeResult = {
  id: 32720,
  date: dayjs('2024-03-03'),
};

export const sampleWithPartialData: IEnergyIntakeResult = {
  id: 43347,
  date: dayjs('2024-03-03'),
};

export const sampleWithFullData: IEnergyIntakeResult = {
  id: 96022,
  goalComplete: false,
  details: 'sensor generate',
  date: dayjs('2024-03-03'),
};

export const sampleWithNewData: NewEnergyIntakeResult = {
  date: dayjs('2024-03-03'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
