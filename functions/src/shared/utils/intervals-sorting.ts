import { Appointment } from '../../appointments/domain/models/appointment';

export function appointmentComparer(a: Appointment, b: Appointment) {
  if (a.startDate < b.startDate) {
    return -1;
  }
  if (a.endDate > b.endDate) {
    return 1;
  }
  return 0;
}
