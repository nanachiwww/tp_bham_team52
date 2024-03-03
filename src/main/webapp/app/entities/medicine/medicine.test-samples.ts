import dayjs from 'dayjs/esm';

import { SupplementTypeEnum } from 'app/entities/enumerations/supplement-type-enum.model';

import { IMedicine, NewMedicine } from './medicine.model';

export const sampleWithRequiredData: IMedicine = {
  id: 76533,
  date: dayjs('2024-03-03'),
  name: 'quantify',
};

export const sampleWithPartialData: IMedicine = {
  id: 57933,
  date: dayjs('2024-03-02'),
  name: 'fuchsia',
  description: 'Rustic',
  subjectiveEffect: 'Front-line Small',
};

export const sampleWithFullData: IMedicine = {
  id: 68738,
  date: dayjs('2024-03-03'),
  name: 'maximized Michigan Account',
  description: 'time-frame Ford Shirt',
  subjectiveEffect: 'bus synergy',
  supplementType: SupplementTypeEnum['OTHER'],
};

export const sampleWithNewData: NewMedicine = {
  date: dayjs('2024-03-02'),
  name: 'Estates',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
