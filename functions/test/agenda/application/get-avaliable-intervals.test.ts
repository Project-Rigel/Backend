import * as moment from 'moment';
import { AvailableIntervalsComputer } from '../../../src/appointments/application/available-intervals-computer';
import { AvaliableIntervalsStub } from '../../stubs/avaliable-intervals.stub';
import { ProductStub } from '../../stubs/product.stub';
import { SortedAppointmentsStub } from '../../stubs/sorted-appointments.stub';

describe('it should compute correctly intervals', () => {
  test('09-14/16-20 : 2 Appointments: 11-13 18-20', () => {
    const avaliableIntervals = AvaliableIntervalsStub.getBusinessDayIntervals(
      moment.utc().day(),
    );
    const sortedAppointments = SortedAppointmentsStub.getOneAppointmentMorningOneEvening(
      120,
      11,
      18,
    );
    const product = ProductStub.getProduct(120);

    const intervals = new AvailableIntervalsComputer().invoke(
      avaliableIntervals,
      sortedAppointments,
      product,
    );

    expect(intervals).toStrictEqual([
      {
        from: moment
          .utc()
          .set({ hours: 9, minutes: 0, seconds: 0, milliseconds: 0 })
          .toISOString(),
        to: moment
          .utc()
          .set({ hours: 11, minutes: 0, seconds: 0, milliseconds: 0 })
          .toISOString(),
      },
      {
        from: moment
          .utc()
          .set({ hours: 16, minutes: 0, seconds: 0, milliseconds: 0 })
          .toISOString(),
        to: moment
          .utc()
          .set({ hours: 18, minutes: 0, seconds: 0, milliseconds: 0 })
          .toISOString(),
      },
    ]);
  });

  test('09-14/16-20 : 2 Appointments: 09-11 16-18', () => {
    const avaliableIntervals = AvaliableIntervalsStub.getBusinessDayIntervals(
      moment.utc().day(),
    );
    const sortedAppointments = SortedAppointmentsStub.getOneAppointmentMorningOneEvening(
      120,
      9,
      16,
    );
    const product = ProductStub.getProduct(120);

    const intervals = new AvailableIntervalsComputer().invoke(
      avaliableIntervals,
      sortedAppointments,
      product,
    );

    expect(intervals).toStrictEqual([
      {
        from: moment
          .utc()
          .set({ hours: 11, minutes: 0, seconds: 0, milliseconds: 0 })
          .toISOString(),
        to: moment
          .utc()
          .set({ hours: 13, minutes: 0, seconds: 0, milliseconds: 0 })
          .toISOString(),
      },
      {
        from: moment
          .utc()
          .set({ hours: 18, minutes: 0, seconds: 0, milliseconds: 0 })
          .toISOString(),
        to: moment
          .utc()
          .set({ hours: 20, minutes: 0, seconds: 0, milliseconds: 0 })
          .toISOString(),
      },
    ]);
  });

  test('09-14/16-20 : 3 Appointments: 09-11 12-14 16-18', () => {
    const avaliableIntervals = AvaliableIntervalsStub.getBusinessDayIntervals(
      moment.utc().day(),
    );
    const sortedAppointments = SortedAppointmentsStub.getTwoAppointmentMorningOneEvening(
      120,
      9,
      12,
      16,
    );
    const product = ProductStub.getProduct(120);

    const intervals = new AvailableIntervalsComputer().invoke(
      avaliableIntervals,
      sortedAppointments,
      product,
    );

    expect(intervals).toStrictEqual([
      {
        from: moment
          .utc()
          .set({ hours: 18, minutes: 0, seconds: 0, milliseconds: 0 })
          .toISOString(),
        to: moment
          .utc()
          .set({ hours: 20, minutes: 0, seconds: 0, milliseconds: 0 })
          .toISOString(),
      },
    ]);
  });
});
