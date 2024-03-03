import dayjs from 'dayjs/esm';

export interface IMindfulnessTip {
  id: number;
  createdDate?: dayjs.Dayjs | null;
  title?: string | null;
  content?: string | null;
}

export type NewMindfulnessTip = Omit<IMindfulnessTip, 'id'> & { id: null };
