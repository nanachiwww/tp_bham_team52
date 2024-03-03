export interface IDashboard {
  id: number;
  overview?: string | null;
}

export type NewDashboard = Omit<IDashboard, 'id'> & { id: null };
