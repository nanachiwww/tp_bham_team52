import { IUserProfile } from 'app/entities/user-profile/user-profile.model';

export interface ICustomGoal {
  id: number;
  name?: string | null;
  description?: string | null;
  userProfile?: Pick<IUserProfile, 'id'> | null;
}

export type NewCustomGoal = Omit<ICustomGoal, 'id'> & { id: null };
