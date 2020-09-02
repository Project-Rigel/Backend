import { AppointmentInterval } from '../../src/models/appointment-interval';
import * as moment from 'moment';

export class SortedAppointmentsStub {
  static getOneAppointmentMorningOneEvening(duration: number): AppointmentInterval[] {
    const startMoment = moment.utc().hours(9).minutes(0).seconds(0).milliseconds(0);

    const secondAppointmentStartMoment = startMoment.utc().add(7, 'hours');

    return [
      {
        from: startMoment.utc(),
        to: startMoment.utc().(120, 'minutes'),
      },

      {
        from: secondAppointmentStartMoment.utc(),
        to: secondAppointmentStartMoment.utc().add(120, 'minutes'),
      },
    ];
  }
}
