import { computeIntervals } from '../../src/utils/intervals-computer';
import { AvaliableIntervalsStub } from '../stubs/avaliable-intervals.stub';
import { SortedAppointmentsStub } from '../stubs/sorted-appointments.stub';
import * as moment from 'moment';
import anything = jasmine.anything;

test('it should compute correctly intervals', () => {
  let response: { from: string; to: string }[] = [];
  const avaliableIntervals = AvaliableIntervalsStub.getBusinessDayIntervals(moment.utc().day());
  const sortedAppointments = SortedAppointmentsStub.getOneAppointmentMorningOneEvening(120);
  console.log(avaliableIntervals);
  console.log(sortedAppointments);
  computeIntervals(avaliableIntervals, sortedAppointments, response);
  console.log(response);
  expect(response).toBe(anything());
});
