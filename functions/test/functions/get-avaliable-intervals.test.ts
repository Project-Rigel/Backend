import { computeIntervals } from '../../src/utils/intervals-computer';
import { AvaliableIntervalsStub } from '../stubs/avaliable-intervals.stub';
import { SortedAppointmentsStub } from '../stubs/sorted-appointments.stub';
import * as moment from 'moment';

describe('it should compute correctly intervals', () => {
  test('09-14/16-20 : 2 Appointments: 11-13 18-20', () => {
    let response: { from: string; to: string }[] = [];
    const avaliableIntervals = AvaliableIntervalsStub.getBusinessDayIntervals(moment.utc().day());
    const sortedAppointments = SortedAppointmentsStub.getOneAppointmentMorningOneEvening(120);
    computeIntervals(avaliableIntervals, sortedAppointments, response);
    expect(response).toStrictEqual([
      { from: '09:00', to: '11:00' },
      { from: '16:00', to: '18:00' },
    ]);
  });
});
