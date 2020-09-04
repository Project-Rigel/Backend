import { AppointmentInterval } from '../../src/models/appointment-interval';
import * as moment from 'moment';

export class SortedAppointmentsStub {
  static getOneAppointmentMorningOneEvening(
    duration: number,
    startHourFirstAppointment: number,
    startHourSecondAppointment: number,
  ): AppointmentInterval[] {
    const firstAppointmentStartMoment = moment
      .utc()
      .hours(startHourFirstAppointment)
      .minutes(0)
      .seconds(0)
      .milliseconds(0);
    const firstAppointmentEndMoment = moment(firstAppointmentStartMoment).add(duration, 'minutes');

    const secondAppointmentStartMoment = moment(firstAppointmentEndMoment)
      .utc()
      .hours(startHourSecondAppointment)
      .minutes(0)
      .seconds(0)
      .milliseconds(0);
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

  static getTwoAppointmentMorningOneEvening(
    duration: number,
    startHourFirstAppointment: number,
    startHourSecondAppointment: number,
    startHourThirdAppointment: number,
  ): AppointmentInterval[] {
    const firstAppointmentStartMoment = moment
      .utc()
      .hours(startHourFirstAppointment)
      .minutes(0)
      .seconds(0)
      .milliseconds(0);
    const firstAppointmentEndMoment = moment(firstAppointmentStartMoment).add(duration, 'minutes');

    const secondAppointmentStartMoment = moment
      .utc()
      .hours(startHourSecondAppointment)
      .minutes(0)
      .seconds(0)
      .milliseconds(0);

    const secondAppointmentEndMoment = moment(secondAppointmentStartMoment)
      .utc()
      .add(duration, 'minutes');

    const thirdAppointmentStartMoment = moment
      .utc()
      .hours(startHourThirdAppointment)
      .minutes(0)
      .seconds(0)
      .milliseconds(0);

    const thirdAppointmentEndMoment = moment(thirdAppointmentStartMoment)
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

      {
        from: thirdAppointmentStartMoment.utc(),
        to: thirdAppointmentEndMoment.utc(),
      },
    ];
  }
}
