import dayjs from 'dayjs/esm';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { Mood } from 'app/entities/enumerations/mood.model';

export interface IMoodTracker {
  id: number;
  date?: dayjs.Dayjs | null;
  mood?: Mood | null;
  note?: string | null;
  userProfile?: Pick<IUserProfile, 'id'> | null;
}

export type NewMoodTracker = Omit<IMoodTracker, 'id'> & { id: null };
