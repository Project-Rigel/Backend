import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { GetAppointmentDto } from './dtos/get-appointment.dto';
import { getFormattedDateDMY } from './utils/date';
import { validateDto } from './utils/dto-validator';
import { generateId } from './utils/uid-generator';
import { HttpsError } from 'firebase-functions/lib/providers/https';
import { Appointment } from './models/appointment';
import { Product } from './models/product';
import { Customer } from './models/customer';

import moment = require('moment');

const db = admin.firestore();

export const bookAppointmentFunction = functions
  .region('europe-west1')
  .https.onCall(async (data, ctx) => {
    if (!ctx.auth) {
      throw new HttpsError('unauthenticated', 'Unauthorized');
    }
    //validate the dto
    const { dto, errors } = await validateDto<GetAppointmentDto>(GetAppointmentDto, data);

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

      const appointmentResponse: any = {
        startDate: appointment.startDate.toISOString(),
        endDate: appointment.endDate.toISOString(),
        customerName: appointment.customerName,
        name: appointment.name,
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
  dto: GetAppointmentDto,
  formattedDate: string,
  appointmentId: string,
  appointment: Appointment,
) {
  const batchWrite = db.batch();

  const appointmentToFirebase: any = { ...appointment };

  appointmentToFirebase.endDate = appointment.endDate.toISOString();
  appointmentToFirebase.startDate = appointment.startDate.toISOString();

  //write in the business side for agenda management
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

async function computeNeededData(dto: GetAppointmentDto, product: Product, customer: Customer) {
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

function getBusinessAppointmentsDoc(dto: GetAppointmentDto, formattedDate: string) {
  return db
    .collection('agendas')
    .doc(dto.agendaId)
    .collection('appointments')
    .doc(`${formattedDate}-${dto.agendaId}`);
}

// function getTimesAppointmentsDoc(dto: GetAppointmentDto, formattedDate: string) {
//   return db
//     .collection('agendas')
//     .doc(dto.agendaId)
//     .collection('times')
//     .doc(`${formattedDate}-${dto.agendaId}`);
// }

function getCustomerAppointmentsDoc(dto: GetAppointmentDto, appointmentId: string) {
  return db.collection('customers').doc(dto.uid).collection('appointments').doc(appointmentId);
}
