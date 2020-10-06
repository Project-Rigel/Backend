import { AppointmentResponse } from '../../src/appointments/application/dto/appointment.response';
import { TestIdGenerator } from './test-id-generator';
import moment = require('moment');

export class AppointmentResponseObjectMother {
  public static getRandom(value = '1'): AppointmentResponse {
    return new AppointmentResponse(value, value, value, value, value, value, 1);
  }

  public static get(
    startDate: Date,
    duration: number,
    customerName: string,
    productName: string,
  ): AppointmentResponse {
    return new AppointmentResponse(
      startDate.toISOString(),
      moment(startDate).add(duration, 'minutes').toISOString(),
      customerName,
      productName,
      new TestIdGenerator().generate(),
      new TestIdGenerator().generate(),
      duration,
    );
  }
}
