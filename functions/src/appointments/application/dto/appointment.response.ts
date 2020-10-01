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
}
