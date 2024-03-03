import { IEnergyIntakeResult } from 'app/entities/energy-intake-result/energy-intake-result.model';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { CategoriesEnum } from 'app/entities/enumerations/categories-enum.model';

export interface IItem {
  id: number;
  itemName?: string | null;
  category?: CategoriesEnum | null;
  energyIntakeResults?: Pick<IEnergyIntakeResult, 'id'>[] | null;
  userProfile?: Pick<IUserProfile, 'id'> | null;
}

export type NewItem = Omit<IItem, 'id'> & { id: null };
