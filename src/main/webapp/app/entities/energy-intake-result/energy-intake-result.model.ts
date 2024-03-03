import dayjs from 'dayjs/esm';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { IItem } from 'app/entities/item/item.model';

export interface IEnergyIntakeResult {
  id: number;
  goalComplete?: boolean | null;
  details?: string | null;
  date?: dayjs.Dayjs | null;
  userProfile?: Pick<IUserProfile, 'id'> | null;
  items?: Pick<IItem, 'id'>[] | null;
}

export type NewEnergyIntakeResult = Omit<IEnergyIntakeResult, 'id'> & { id: null };
