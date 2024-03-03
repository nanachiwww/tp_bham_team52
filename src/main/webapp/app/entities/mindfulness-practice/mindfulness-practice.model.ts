import dayjs from 'dayjs/esm';
import { IMindfulnessTip } from 'app/entities/mindfulness-tip/mindfulness-tip.model';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { MindfulnessActivityType } from 'app/entities/enumerations/mindfulness-activity-type.model';

export interface IMindfulnessPractice {
  id: number;
  date?: dayjs.Dayjs | null;
  activityType?: MindfulnessActivityType | null;
  duration?: number | null;
  note?: string | null;
  mindfulnessTip?: Pick<IMindfulnessTip, 'id'> | null;
  userProfile?: Pick<IUserProfile, 'id'> | null;
}

export type NewMindfulnessPractice = Omit<IMindfulnessPractice, 'id'> & { id: null };
