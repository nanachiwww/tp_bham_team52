import dayjs from 'dayjs/esm';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';

export interface IStressTracker {
  id: number;
  date?: dayjs.Dayjs | null;
  level?: number | null;
  note?: string | null;
  userProfile?: Pick<IUserProfile, 'id'> | null;
}

export type NewStressTracker = Omit<IStressTracker, 'id'> & { id: null };
