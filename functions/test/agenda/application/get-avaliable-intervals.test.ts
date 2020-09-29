import { AvaliableIntervalsStub } from '../../stubs/avaliable-intervals.stub';
import { SortedAppointmentsStub } from '../../stubs/sorted-appointments.stub';
import * as moment from 'moment';
import { AvailableIntervalsComputer } from '../../../src/appointments/application/available-intervals-computer';
import { ProductStub } from '../../stubs/product.stub';

describe('it should compute correctly intervals', () => {
  test('09-14/16-20 : 2 Appointments: 11-13 18-20', () => {
    const avaliableIntervals = AvaliableIntervalsStub.getBusinessDayIntervals(moment.utc().day());
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
      { from: '09:00', to: '11:00' },
      { from: '16:00', to: '18:00' },
    ]);
  });

  test('09-14/16-20 : 2 Appointments: 09-11 16-18', () => {
    const avaliableIntervals = AvaliableIntervalsStub.getBusinessDayIntervals(moment.utc().day());
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
      { from: '11:00', to: '13:00' },
      { from: '18:00', to: '20:00' },
    ]);
  });

  test('09-14/16-20 : 3 Appointments: 09-11 12-14 16-18', () => {
    const avaliableIntervals = AvaliableIntervalsStub.getBusinessDayIntervals(moment.utc().day());
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
    expect(intervals).toStrictEqual([{ from: '18:00', to: '20:00' }]);
  });
});
