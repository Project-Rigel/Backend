import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { GetAppointmentDto } from './models/get-appointment.dto';
import { getFormattedDateDMY } from './utils/date';
import { validateDto } from './utils/dto-validator';
import { generateId } from './utils/uid-generator';
import moment = require('moment');
import { HttpsError } from 'firebase-functions/lib/providers/https';
import { Appointment } from './models/appointment';
import { Product } from './models/product';
import { Customer } from './models/customer';

const db = admin.firestore();

export const getAppointmentFunction = functions.region("europe-west1").https.onCall(
  async (data, ctx) => {

    if (!ctx.auth) {
      throw new HttpsError('unauthenticated', 'Unauthorized');
    }

    //validate the dto
    const { dto, errors } = await validateDto<GetAppointmentDto>(GetAppointmentDto, data);

    if (errors.length > 0) {
      throw new HttpsError('invalid-argument', "Validation errors", errors.toString());
    }

    const productData = (await admin.firestore().collection("products").doc(dto.productId).get()).data();

    if(!productData){
      throw new HttpsError("invalid-argument", "The specified product doesnt exist.")
    }

    const customerData = (await admin.firestore().collection("customers").doc(dto.uid).get()).data();

    if(!customerData){
      throw new HttpsError("invalid-argument", "The specified customer doesnt exist.")
    }

    const { formattedDate, appointmentId, appointment } = await computeNeededData(dto, productData as Product, customerData as Customer);

    const timesDoc = (await getTimesAppointmentsDoc(dto, formattedDate).get()).data();

    if (!timesDoc)
      throw new HttpsError('internal', 'No times doc created');

    if (timesDoc.appointments[getFormattedDateDMY(appointment.startDate)]) {
      throw new HttpsError('already-exists', 'The interval to make the appointment is already booked.');
    }

    try {
      await performBatchWrite(dto, formattedDate, appointmentId, appointment);

      return { appointment: appointment };
    } catch (error) {
      throw new HttpsError('internal', error.message);

    }
  },
);

async function performBatchWrite(dto: GetAppointmentDto, formattedDate: string, appointmentId: string, appointment: Appointment) {
  const batchWrite = db.batch();

  //write in the business side
  batchWrite.set(getBusinessAppointmentsDoc(dto, formattedDate), {
    [appointmentId]: appointment,
  }, { merge: true });


  //write in the appointments public doc
  batchWrite.set(getTimesAppointmentsDoc(dto, formattedDate), {
    appointments: {
      [getFormattedDateDMY(appointment.startDate)]: appointment.endDate,
    },
  }, { merge: true });

  //write in the customer appointments subcollection
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
    startDate: dto.timestamp,
    endDate: moment(dto.timestamp).add(product.duration, 'minutes').toDate(),
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

function getTimesAppointmentsDoc(dto: GetAppointmentDto, formattedDate: string) {
  return db
    .collection('agendas')
    .doc(dto.agendaId)
    .collection('times').doc(`${formattedDate}-${dto.agendaId}`);
}

function getCustomerAppointmentsDoc(dto: GetAppointmentDto, appointmentId: string) {
  return db.collection('customers').doc(dto.uid).collection('appointments').doc(appointmentId);
}
