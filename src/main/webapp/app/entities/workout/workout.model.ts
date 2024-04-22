import { IExercise } from 'app/entities/exercise/exercise.model';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { IntensityLevelEnum } from 'app/entities/enumerations/intensity-level-enum.model';

export interface IWorkout {
  id: number;
  name?: string | null;
  description?: string | null;
  duration?: number | null;
  intensityLevel?: IntensityLevelEnum | null;
  exercises?: Pick<IExercise, 'id' | 'name'>[] | null;
  userProfile?: Pick<IUserProfile, 'id'> | null;
}

export type NewWorkout = Omit<IWorkout, 'id'> & { id: null };
