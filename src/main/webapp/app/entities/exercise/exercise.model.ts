import { ExerciseCategoryEnum } from 'app/entities/enumerations/exercise-category-enum.model';

export interface IExercise {
  id: number;
  name?: string | null;
  description?: string | null;
  reps?: number | null;
  sets?: number | null;
  category?: ExerciseCategoryEnum | null;
}

export type NewExercise = Omit<IExercise, 'id'> & { id: null };
