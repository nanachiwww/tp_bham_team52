import dayjs from 'dayjs/esm';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';

export interface ISleepRecord {
  id: number;
  startTime?: dayjs.Dayjs | null;
  endTime?: dayjs.Dayjs | null;
  rating?: number | null;
  userProfile?: Pick<IUserProfile, 'id'> | null;
}

export type NewSleepRecord = Omit<ISleepRecord, 'id'> & { id: null };
