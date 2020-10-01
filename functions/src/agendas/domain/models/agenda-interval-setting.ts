import { Moment } from 'moment';

export interface AgendaIntervalSetting {
  dayOfWeek: number;
  day: string;
  from: Moment;
  to: Moment;
}
