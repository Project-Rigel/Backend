import * as admin from 'firebase-admin';
import { getFormattedDateDMY } from '../../shared/utils/date';
import { appointmentComparer } from '../../shared/utils/intervals-sorting';
import { Appointment } from '../domain/models/appointment';
import moment = require('moment');

export class AppointmentService {
  public getAppointment(id: string) {}

  public async getSortedAppointmentsForDay(
    agendaId: string,
    timestamp: string,
  ): Promise<Appointment[]> {
    const appointmentsDocs = await admin
      .firestore()
      .doc(
        `agendas/${agendaId}/appointments/${getFormattedDateDMY(
          new Date(timestamp),
        )}-${agendaId}`,
      )
      .get();

    const appointmetsMap: any = appointmentsDocs.data() ?? {};

    const appointments = Object.values(appointmetsMap).map((val: any) => {
      return {
        customerId: val.customerId,
        customerName: val.customerName,
        id: val.id,
        duration: val.duration,
        endDate: moment(val.endDate),
        name: val.name,
        startDate: moment(val.startDate),
        agendaId: agendaId,
      };
    });

    return appointments.sort(appointmentComparer);
  }

  public toResponse(appointments: Appointment[]): any {
    return appointments.map((val) => {
      return {
        startDate: val.startDate.toJSON(),
        endDate: val.endDate.toJSON(),
        name: val.name,
        customerId: val.customerId,
        customerName: val.customerName,
        id: val.id,
        duration: val.duration,
      };
    });
  }
}
