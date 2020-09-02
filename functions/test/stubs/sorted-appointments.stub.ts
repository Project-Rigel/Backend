import { AppointmentInterval } from '../../src/models/appointment-interval';
import * as moment from 'moment';

export class SortedAppointmentsStub {
  static getOneAppointmentMorningOneEvening(duration: number): AppointmentInterval[] {
    const firstAppointmentStartMoment = moment
      .utc()
      .hours(11)
      .minutes(0)
      .seconds(0)
      .milliseconds(0);
    const firstAppointmentEndMoment = moment(firstAppointmentStartMoment).add(duration, 'minutes');

    const secondAppointmentStartMoment = moment(firstAppointmentEndMoment).utc().add(5, 'hours');
    const secondAppointmentEndMoment = moment(secondAppointmentStartMoment)
      .utc()
      .add(duration, 'minutes');

    return [
      {
        from: firstAppointmentStartMoment.utc(),
        to: firstAppointmentEndMoment.utc(),
      },

      {
        from: secondAppointmentStartMoment.utc(),
        to: secondAppointmentEndMoment.utc(),
      },
    ];
  }
}
