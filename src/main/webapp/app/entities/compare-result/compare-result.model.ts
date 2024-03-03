import dayjs from 'dayjs/esm';

export interface ICompareResult {
  id: number;
  resultDetails?: string | null;
  timestamp?: dayjs.Dayjs | null;
  dietaryGoalComplete?: boolean | null;
  moodGoalAchieved?: boolean | null;
  workoutGoalAchieved?: boolean | null;
  sleepGoalAchieved?: boolean | null;
}

export type NewCompareResult = Omit<ICompareResult, 'id'> & { id: null };
