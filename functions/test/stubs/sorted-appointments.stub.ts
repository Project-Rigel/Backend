import * as moment from 'moment';
import { Appointment } from '../../src/appointments/domain/models/appointment';

export class SortedAppointmentsStub {
  static getOneAppointmentMorningOneEvening(
    duration: number,
    startHourFirstAppointment: number,
    startHourSecondAppointment: number,
  ): Appointment[] {
    const firstAppointmentStartMoment = moment()
      .utcOffset(0)
      .hours(startHourFirstAppointment)
      .minutes(0)
      .seconds(0)
      .milliseconds(0);
    const firstAppointmentEndMoment = moment(firstAppointmentStartMoment).add(duration, 'minutes');

    const secondAppointmentStartMoment = moment(firstAppointmentEndMoment)
      .utcOffset(0)
      .hours(startHourSecondAppointment)
      .minutes(0)
      .seconds(0)
      .milliseconds(0);
    const secondAppointmentEndMoment = moment(secondAppointmentStartMoment).add(
      duration,
      'minutes',
    );

    return [
      {
        startDate: firstAppointmentStartMoment.utc(),
        endDate: firstAppointmentEndMoment.utc(),
        customerName: 'a',
        customerId: 'a',
        name: 'hell',
        duration: 30,
        id: 'a',
      },

      {
        startDate: secondAppointmentStartMoment.utc(),
        endDate: secondAppointmentEndMoment.utc(),
        customerName: 'a',
        customerId: 'a',
        name: 'hell',
        duration: 30,
        id: 'a',
      },
    ];
  }

  static getTwoAppointmentMorningOneEvening(
    duration: number,
    startHourFirstAppointment: number,
    startHourSecondAppointment: number,
    startHourThirdAppointment: number,
  ): Appointment[] {
    const firstAppointmentStartMoment = moment()
      .utcOffset(0)
      .hours(startHourFirstAppointment)
      .minutes(0)
      .seconds(0)
      .milliseconds(0);
    const firstAppointmentEndMoment = moment(firstAppointmentStartMoment).add(duration, 'minutes');

    const secondAppointmentStartMoment = moment()
      .utcOffset(0)
      .hours(startHourSecondAppointment)
      .minutes(0)
      .seconds(0)
      .milliseconds(0);

    const secondAppointmentEndMoment = moment(secondAppointmentStartMoment)
      .utc()
      .add(duration, 'minutes');

    const thirdAppointmentStartMoment = moment()
      .utcOffset(0)
      .hours(startHourThirdAppointment)
      .minutes(0)
      .seconds(0)
      .milliseconds(0);

    const thirdAppointmentEndMoment = moment(thirdAppointmentStartMoment)
      .utc()
      .add(duration, 'minutes');

    return [
      {
        startDate: firstAppointmentStartMoment.utc(),
        endDate: firstAppointmentEndMoment.utc(),
        customerName: 'a',
        customerId: 'a',
        name: 'hell',
        duration: 30,
        id: 'a',
      },
      {
        startDate: secondAppointmentStartMoment.utc(),
        endDate: secondAppointmentEndMoment.utc(),
        customerName: 'a',
        customerId: 'a',
        name: 'hell',
        duration: 30,
        id: 'a',
      },
      {
        startDate: thirdAppointmentStartMoment.utc(),
        endDate: thirdAppointmentEndMoment.utc(),
        customerName: 'a',
        customerId: 'a',
        name: 'hell',
        duration: 30,
        id: 'a',
      },
    ];
  }
}
