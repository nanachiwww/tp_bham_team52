import { IDashboard, NewDashboard } from './dashboard.model';

export const sampleWithRequiredData: IDashboard = {
  id: 18869,
};

export const sampleWithPartialData: IDashboard = {
  id: 47283,
};

export const sampleWithFullData: IDashboard = {
  id: 66722,
  overview: '../fake-data/blob/hipster.txt',
};

export const sampleWithNewData: NewDashboard = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
