import { AvailableInterval } from '../../src/models/available-interval';
import moment = require('moment');

export class AvaliableIntervalsStub {
  public static getBusinessDayIntervals(dayOfWeek: number): AvailableInterval[] {
    return [
      {
        day: null,
        dayOfWeek: dayOfWeek,
        from: moment.utc().hours(9).minutes(0).seconds(0).milliseconds(0),
        to: moment.utc().hours(14).minutes(0).seconds(0).milliseconds(0),
      },
      {
        day: null,
        dayOfWeek: dayOfWeek,
        from: moment.utc().hours(16).minutes(0).seconds(0).milliseconds(0),
        to: moment.utc().hours(20).minutes(0).seconds(0).milliseconds(0),
      },
    ];
  }
}
