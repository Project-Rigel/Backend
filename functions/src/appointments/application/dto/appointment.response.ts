import { Appointment } from '../../domain/models/appointment';

export class AppointmentResponse {
  /**
   * startDate of the appointment in ISOString UTC
   */
  startDate: string;

  /**
   * endDate of the appointment in ISOString UTC
   */
  endDate: string;

  /**
   * customer's full name
   */
  customerName: string;

  productName: string;

  customerId: string;

  /**
   * appointment id
   */
  id: string;

  /**
   * duration of the appointment in MINUTES
   */
  duration: number;

  constructor(
    startDate: string,
    endDate: string,
    customerName: string,
    productName: string,
    customerId: string,
    id: string,
    duration: number,
  ) {
    this.startDate = startDate;
    this.endDate = endDate;
    this.customerName = customerName;
    this.productName = productName;
    this.customerId = customerId;
    this.id = id;
    this.duration = duration;
  }

  static fromAppointment(appointment: Appointment): AppointmentResponse {
    return new AppointmentResponse(
      appointment.startDate.toISOString(),
      appointment.endDate.toISOString(),
      appointment.customerName,
      appointment.name,
      appointment.customerId,
      appointment.id,
      appointment.duration,
    );
  }
}
