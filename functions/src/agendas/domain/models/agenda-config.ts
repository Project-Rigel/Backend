import { DayOfWeek } from '../../application/dto/add-schedule-settings.dto';
import { Interval } from './agenda-interval';
import moment = require('moment');

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

  public isConfigValid(): boolean {
    if (this.expirationDate) {
      return this.expirationDate.getTime() >= new Date().getTime();
    }
    return true;
  }

  public isEquals(otherConfig: AgendaConfig): boolean {
    if (
      this.dayOfWeek &&
      otherConfig.dayOfWeek &&
      this.dayOfWeek === otherConfig.dayOfWeek
    ) {
      return true;
    }
    return (
      this.specificDate &&
      otherConfig.specificDate &&
      this.specificDate.getTime() === otherConfig.specificDate.getTime()
    );
  }

  isEqualsToSpecificDate(startDate: Date) {
    const adjustedStartDate = moment(startDate).set({
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    });

    return (
      this.specificDate &&
      this.specificDate.getTime() === adjustedStartDate.toDate().getTime()
    );
  }
}
