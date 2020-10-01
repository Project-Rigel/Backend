import { AgendaIntervalSetting } from '../../src/agendas/domain/models/agenda-interval-setting';
import moment = require('moment');

export class AvaliableIntervalsStub {
  public static getBusinessDayIntervals(dayOfWeek: number): AgendaIntervalSetting[] {
    return [
      {
        day: null,
        dayOfWeek: dayOfWeek,
        from: moment().utcOffset(0).hours(9).minutes(0).seconds(0).milliseconds(0).utc(),
        to: moment().utcOffset(0).hours(14).minutes(0).seconds(0).milliseconds(0).utc(),
      },
      {
        day: null,
        dayOfWeek: dayOfWeek,
        from: moment().utcOffset(0).hours(16).minutes(0).seconds(0).milliseconds(0).utc(),
        to: moment().utcOffset(0).hours(20).minutes(0).seconds(0).milliseconds(0).utc(),
      },
    ];
  }
}
