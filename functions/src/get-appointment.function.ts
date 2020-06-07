import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { GetAppointmentDto } from '../models/get-appointment.dto';
import { getFormattedDateDMY } from './utils/date';
import { validateDto } from './utils/dto-validator';
import { generateId } from './utils/uid-generator';
import moment = require('moment');

const db = admin.firestore();

export const getAppointmentFunction = functions.https.onRequest(
  async (req, res) => {

    //validate the dto
    const { dto, errors } = await validateDto<GetAppointmentDto>(GetAppointmentDto, req.body);

    if (errors.length > 0) {
      res.status(400).send({ errors });
    }

    const { formattedDate, appointmentId, appointment } = await computeNeededData(dto);

    const timesDoc = (await getTimesAppointmentsDoc(dto,formattedDate).get()).data() ?? res.status(500).send({error: "No times doc created"});

    if(timesDoc.appointments[appointment.horaInicio]){
      res.status(409).send({message: "The interval to make the appointment is already booked."});
    }

    try {
      await performBatchWrite(dto, formattedDate, appointmentId, appointment);

      res.status(200).send();
    } catch (error) {
      res.status(500).send(error);
      throw error;
    }
  },
);


async function performBatchWrite(dto: GetAppointmentDto, formattedDate: string, appointmentId: string, appointment: { horaFin: string; duration: number; uid: string; id: any; horaInicio: string }) {
  const batchWrite = db.batch();

  //write in the business side
  batchWrite.set(getBusinessAppointmentsDoc(dto, formattedDate), {
    [appointmentId]: appointment,
  }, { merge: true });


  //write in the appointments public doc
  batchWrite.set(getTimesAppointmentsDoc(dto, formattedDate), {
    appointments: {
      [appointment.horaInicio]: appointment.horaFin,
    },
  }, { merge: true });

  //write in the customer appointments subcollection
  batchWrite.set(getCustomerAppointmentsDoc(dto, appointmentId), appointment);

  await batchWrite.commit();
}

async function computeNeededData(dto: GetAppointmentDto) {
  //generate the needed data
  const formattedDate = getFormattedDateDMY(dto.timestamp);
  const appointmentId = generateId(db);

  //get the product info
  await db.doc(`users/${dto.businessId}/products/${dto.productId}`).get();

  const appointment = {
    id: appointmentId,
    uid: dto.uid,
    horaInicio: dto.timestamp.getHours() + ':' + dto.timestamp.getMinutes(),
    horaFin: moment(dto.timestamp).add(30, 'minutes').toDate().getHours() + ':' + moment(dto.timestamp).add(30, 'minutes').toDate().getMinutes(),
    duration: 30, //TODO set with the product info
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
