import { CategoriesEnum } from 'app/entities/enumerations/categories-enum.model';

import { IItem, NewItem } from './item.model';

export const sampleWithRequiredData: IItem = {
  id: 89800,
  itemName: 'Bedfordshire input',
};

export const sampleWithPartialData: IItem = {
  id: 49177,
  itemName: 'Account Investor',
};

export const sampleWithFullData: IItem = {
  id: 77433,
  itemName: 'grow Intelligent',
  category: CategoriesEnum['DINNER'],
};

export const sampleWithNewData: NewItem = {
  itemName: 'content-based next-generation Tasty',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
