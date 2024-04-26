import dayjs from 'dayjs/esm';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { IItem } from 'app/entities/item/item.model';

export interface IEnergyIntakeResult {
  id: number;
  lunch?: string | null;
  dinner?: string | null;
  breakfirst?: string | null;
  createTime?: dayjs.Dayjs | null;
  // items?: Pick<IItem, 'id'>[] | null;
}

export type NewEnergyIntakeResult = Omit<IEnergyIntakeResult, 'id'> & { id: null };
