import { Moment } from 'moment';

export class Appointment {
  startDate: Moment;
  endDate: Moment;
  name: string;
  customerId: string;
  customerName: string;
  id: string;
  duration: number;

  constructor(
    startDate: moment.Moment,
    endDate: moment.Moment,
    name: string,
    customerId: string,
    customerName: string,
    id: string,
    duration: number,
  ) {
    this.startDate = startDate;
    this.endDate = endDate;
    this.name = name;
    this.customerId = customerId;
    this.customerName = customerName;
    this.id = id;
    this.duration = duration;
  }
}
