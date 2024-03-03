import { IDashboard } from 'app/entities/dashboard/dashboard.model';
import { ICompareResult } from 'app/entities/compare-result/compare-result.model';
import { Gender } from 'app/entities/enumerations/gender.model';

export interface IUserProfile {
  id: number;
  username?: string | null;
  email?: string | null;
  password?: string | null;
  name?: string | null;
  age?: number | null;
  gender?: Gender | null;
  dashboard?: Pick<IDashboard, 'id'> | null;
  compareResult?: Pick<ICompareResult, 'id'> | null;
}

export type NewUserProfile = Omit<IUserProfile, 'id'> & { id: null };
