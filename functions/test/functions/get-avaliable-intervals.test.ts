import { computeIntervals } from '../../src/utils/intervals-computer';
import { AvaliableIntervalsStub } from '../stubs/avaliable-intervals.stub';
import { SortedAppointmentsStub } from '../stubs/sorted-appointments.stub';
import * as moment from 'moment';

describe('it should compute correctly intervals', () => {
  test('09-14/16-20 : 2 Appointments: 11-13 18-20', () => {
    let response: { from: string; to: string }[] = [];
    const avaliableIntervals = AvaliableIntervalsStub.getBusinessDayIntervals(moment.utc().day());
    const sortedAppointments = SortedAppointmentsStub.getOneAppointmentMorningOneEvening(
      120,
      11,
      18,
    );
    computeIntervals(avaliableIntervals, sortedAppointments, response);
    expect(response).toStrictEqual([
      { from: '09:00', to: '11:00' },
      { from: '16:00', to: '18:00' },
    ]);
  });

  test('09-14/16-20 : 2 Appointments: 09-11 16-18', () => {
    let response: { from: string; to: string }[] = [];
    const avaliableIntervals = AvaliableIntervalsStub.getBusinessDayIntervals(moment.utc().day());
    const sortedAppointments = SortedAppointmentsStub.getOneAppointmentMorningOneEvening(
      120,
      9,
      16,
    );
    computeIntervals(avaliableIntervals, sortedAppointments, response);
    expect(response).toStrictEqual([
      { from: '11:00', to: '14:00' },
      { from: '18:00', to: '20:00' },
    ]);
  });

  test('09-14/16-20 : 3 Appointments: 09-11 12-14 16-18', () => {
    let response: { from: string; to: string }[] = [];
    const avaliableIntervals = AvaliableIntervalsStub.getBusinessDayIntervals(moment.utc().day());
    const sortedAppointments = SortedAppointmentsStub.getTwoAppointmentMorningOneEvening(
      120,
      9,
      12,
      16,
    );
    computeIntervals(avaliableIntervals, sortedAppointments, response);
    expect(response).toStrictEqual([
      { from: '11:00', to: '12:00' },
      { from: '18:00', to: '20:00' },
    ]);
  });
});
