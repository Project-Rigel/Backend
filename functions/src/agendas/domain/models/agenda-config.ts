//TODO move to another file
import { DayOfWeek } from '../../application/dto/add-schedule-settings.dto';
import { Interval } from './agenda-interval';

export class AgendaConfig {
  expirationDate: Date | null;
  specificDate: Date | null;
  dayOfWeek: DayOfWeek | null;
  intervals: Interval[];

  constructor(
    expirationDate: Date | null = null,
    specificDate: Date | null = null,
    dayOfWeek: DayOfWeek | null = null,
    intervals: Interval[] = null,
  ) {
    this.expirationDate = expirationDate;
    this.specificDate = specificDate;
    this.dayOfWeek = dayOfWeek;
    this.intervals = intervals;
  }
}
