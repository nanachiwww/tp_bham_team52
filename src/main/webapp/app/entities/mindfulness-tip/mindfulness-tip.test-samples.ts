import dayjs from 'dayjs/esm';

import { IMindfulnessTip, NewMindfulnessTip } from './mindfulness-tip.model';

export const sampleWithRequiredData: IMindfulnessTip = {
  id: 38388,
  createdDate: dayjs('2024-03-03'),
  title: 'blue clear-thinking',
  content: '../fake-data/blob/hipster.txt',
};

export const sampleWithPartialData: IMindfulnessTip = {
  id: 76536,
  createdDate: dayjs('2024-03-03'),
  title: 'override Unbranded platforms',
  content: '../fake-data/blob/hipster.txt',
};

export const sampleWithFullData: IMindfulnessTip = {
  id: 16320,
  createdDate: dayjs('2024-03-03'),
  title: 'Usability',
  content: '../fake-data/blob/hipster.txt',
};

export const sampleWithNewData: NewMindfulnessTip = {
  createdDate: dayjs('2024-03-03'),
  title: 'deliverables Plastic',
  content: '../fake-data/blob/hipster.txt',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
