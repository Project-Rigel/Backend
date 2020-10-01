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

  public isConfigValid(): boolean {
    return this.expirationDate.getTime() >= new Date().getTime();
  }

  public isEquals(otherConfig: AgendaConfig): boolean {
    if (otherConfig.dayOfWeek === this.dayOfWeek && otherConfig.expirationDate === this.expirationDate && otherConfig.specificDate === this.specificDate) {
      return true;
    }

    if (this.intervals.length === otherConfig.intervals.length && this.areTheSameIntervals(otherConfig.intervals)) {
      return true;
    }

    return false;
  }

  private areTheSameIntervals(otherIntervals: Interval[]): boolean {
    let areTheSame = false;
    this.intervals.map(interval => {
      return new Interval(interval.startHour, interval.endHour);
    })
      .forEach((interval: Interval, index: number) => {
        if (interval.isEquals(otherIntervals[index])) {
          areTheSame = true;
          return;
        }
      });
    return areTheSame;
  }
}
