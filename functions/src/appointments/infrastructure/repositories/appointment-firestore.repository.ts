import * as admin from 'firebase-admin';
import { Repository } from '../../../shared/repository';
import { getFormattedDateDMY } from '../../../shared/utils/date';
import { Appointment } from '../../domain/models/appointment';
import moment = require('moment');

export class AppointmentFirestoreRepository implements Repository<Appointment> {
  async create(appointment: Appointment): Promise<boolean> {
    const batchWrite = admin.firestore().batch();
    const appointmentToFirebase: any = { ...appointment };

    appointmentToFirebase.endDate = appointment.endDate.toISOString();
    appointmentToFirebase.startDate = appointment.startDate.toISOString();

    batchWrite.set(
      this.getBusinessAppointmentsDoc(
        appointment,
        getFormattedDateDMY(appointment.startDate.toDate()),
      ),
      {
        [appointment.id]: appointmentToFirebase,
      },
      { merge: true },
    );

    batchWrite.set(
      this.getCustomerAppointmentsDoc(appointment),
      appointmentToFirebase,
    );

    await batchWrite.commit();
    return true;
  }

  delete(id: string): Promise<boolean> {
    throw new Error('not implemented');
  }

  async find(item: Appointment): Promise<Appointment[]> {
    const appointmentsDoc = await admin
      .firestore()
      .doc(
        `agendas/${item.agendaId}/appointments/${getFormattedDateDMY(
          item.startDate.toDate(),
        )}-${item.agendaId}`,
      )
      .get();

    const appointmetsMap = appointmentsDoc.data() ?? {};

    const appointment = Object.values(appointmetsMap).find((val: any) => {
      return val.id === item.id;
    });

    return [
      new Appointment(
        moment(appointment.startDate),
        moment(appointment.endDate),
        appointment.name,
        appointment.customerId,
        appointment.customerName,
        appointment.id,
        appointment.duration,
        appointment.agendaId,
      ),
    ];
  }

  findOne(id: string): Promise<Appointment> {
    throw Error();
  }

  update(id: string, item: Appointment): Promise<boolean> {
    throw new Error('not implemented');
  }

  getBusinessAppointmentsDoc(appointment: Appointment, formattedDate: string) {
    return admin
      .firestore()
      .collection('agendas')
      .doc(appointment.agendaId)
      .collection('appointments')
      .doc(`${formattedDate}-${appointment.agendaId}`);
  }

  getCustomerAppointmentsDoc(appointment: Appointment) {
    return admin
      .firestore()
      .collection('customers')
      .doc(appointment.customerId)
      .collection('appointments')
      .doc(appointment.id);
  }
}
