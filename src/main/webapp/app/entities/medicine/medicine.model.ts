import dayjs from 'dayjs/esm';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { SupplementTypeEnum } from 'app/entities/enumerations/supplement-type-enum.model';

export interface IMedicine {
  id: number;
  date?: dayjs.Dayjs | null;
  name?: string | null;
  description?: string | null;
  subjectiveEffect?: string | null;
  supplementType?: SupplementTypeEnum | null;
  userProfile?: Pick<IUserProfile, 'id'> | null;
}

export type NewMedicine = Omit<IMedicine, 'id'> & { id: null };
