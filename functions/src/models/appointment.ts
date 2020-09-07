import { Moment } from 'moment';

export interface Appointment {
  startDate: Moment;
  endDate: Moment;
  name: string;
  customerId: string;
  customerName: string;
  id: string;
  duration: number;
}
