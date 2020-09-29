import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { BookAppointmentDto } from '../application/dto/book-appointment.dto';
import { getFormattedDateDMY } from '../../shared/utils/date';
import { validateDto } from '../../shared/utils/dto-validator';
import { generateId } from '../../shared/uid-generator';
import { HttpsError } from 'firebase-functions/lib/providers/https';
import { Appointment } from '../domain/models/appointment';
import { Product } from '../domain/models/product';
import { Customer } from '../domain/models/customer';
import { AppointmentResponse } from '../application/dto/appointment.response';
import moment = require('moment');

const db = admin.firestore();

export const bookAppointmentFunction = functions
  .region('europe-west1')
  .https.onCall(async (data, ctx) => {
    if (!ctx.auth) {
      throw new HttpsError('unauthenticated', 'Unauthorized');
    }

    const { dto, errors } = await validateDto<BookAppointmentDto>(BookAppointmentDto, data);

    if (errors.length > 0) {
      throw new HttpsError('invalid-argument', 'Validation errors', errors.toString());
    }

    const productData = (
      await admin.firestore().collection('products').doc(dto.productId).get()
    ).data();

    if (!productData) {
      throw new HttpsError('invalid-argument', 'The specified product doesnt exist.');
    }

    const customerData = (
      await admin.firestore().collection('customers').doc(dto.uid).get()
    ).data();

    if (!customerData) {
      throw new HttpsError('invalid-argument', 'The specified customer doesnt exist.');
    }

    const { formattedDate, appointmentId, appointment } = await computeNeededData(
      dto,
      productData as Product,
      customerData as Customer,
    );

    const timesDoc = (await getBusinessAppointmentsDoc(dto, formattedDate).get()).data() ?? {};

    Object.values(timesDoc).forEach((val) => {
      if (val.startDate === appointment.startDate.toISOString()) {
        throw new HttpsError(
          'already-exists',
          'The interval to make the appointment is already booked.',
        );
      }
    });

    try {
      await performBatchWrite(dto, formattedDate, appointmentId, appointment);

      const appointmentResponse: AppointmentResponse = {
        startDate: appointment.startDate.toISOString(),
        endDate: appointment.endDate.toISOString(),
        customerName: appointment.customerName,
        productName: appointment.name,
        customerId: appointment.customerId,
        id: appointment.id,
        duration: appointment.duration,
      };

      return { appointment: appointmentResponse };
    } catch (error) {
      throw new HttpsError('internal', error.message);
    }
  });

async function performBatchWrite(
  dto: BookAppointmentDto,
  formattedDate: string,
  appointmentId: string,
  appointment: Appointment,
) {
  const batchWrite = db.batch();

  const appointmentToFirebase: any = { ...appointment };

  appointmentToFirebase.endDate = appointment.endDate.toISOString();
  appointmentToFirebase.startDate = appointment.startDate.toISOString();

  //write in the business side for agendas management
  batchWrite.set(
    getBusinessAppointmentsDoc(dto, formattedDate),
    {
      [appointmentId]: appointmentToFirebase,
    },
    { merge: true },
  );

  //write in the appointments public doc for public querying
  // batchWrite.set(
  //   getTimesAppointmentsDoc(dto, formattedDate),
  //   {
  //     appointments: {
  //       [appointmentToFirebase.startDate]: appointmentToFirebase.endDate,
  //     },
  //   },
  //   { merge: true },
  // );

  //write in the customer appointments subcollection for private an easy access querying
  batchWrite.set(getCustomerAppointmentsDoc(dto, appointmentId), appointment);

  await batchWrite.commit();
}

async function computeNeededData(dto: BookAppointmentDto, product: Product, customer: Customer) {
  //generate the needed data
  const formattedDate = getFormattedDateDMY(dto.timestamp);
  const appointmentId = generateId(db);

  //get the product info
  await db.doc(`users/${dto.businessId}/products/${dto.productId}`).get();

  const appointment: Appointment = {
    id: appointmentId,
    customerId: dto.uid,
    startDate: moment(dto.timestamp),
    endDate: moment(dto.timestamp).add(product.duration, 'minutes'),
    duration: product.duration,
    name: product.name,
    customerName: customer.name,
  };
  return { formattedDate, appointmentId, appointment };
}

function getBusinessAppointmentsDoc(dto: BookAppointmentDto, formattedDate: string) {
  return db
    .collection('agendas')
    .doc(dto.agendaId)
    .collection('appointments')
    .doc(`${formattedDate}-${dto.agendaId}`);
}

// function getTimesAppointmentsDoc(dto: BookAppointmentDto, formattedDate: string) {
//   return db
//     .collection('agendas')
//     .doc(dto.agendaId)
//     .collection('times')
//     .doc(`${formattedDate}-${dto.agendaId}`);
// }

function getCustomerAppointmentsDoc(dto: BookAppointmentDto, appointmentId: string) {
  return db.collection('customers').doc(dto.uid).collection('appointments').doc(appointmentId);
}
