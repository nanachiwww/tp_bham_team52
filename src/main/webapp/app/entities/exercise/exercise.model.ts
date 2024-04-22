import { IWorkout } from 'app/entities/workout/workout.model';
import { MuscleGroupEnum } from 'app/entities/enumerations/muscle-group-enum.model';

export interface IExercise {
  id: number;
  name?: string | null;
  description?: string | null;
  reps?: number | null;
  sets?: number | null;
  muscleGroup?: MuscleGroupEnum | null;
  workouts?: Pick<IWorkout, 'id' | 'name'>[] | null;
}

export type NewExercise = Omit<IExercise, 'id'> & { id: null };
