//TODO move to another file
export class Interval {
  startHour: string;
  endHour: string;

  constructor(startHour: string, endHour: string) {
    this.startHour = startHour;
    this.endHour = endHour;
  }

  isEquals(otherInterval: Interval): boolean {
    return this.startHour === otherInterval.startHour && this.endHour === otherInterval.endHour;
  }
}
