import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { GetAvailableTimesDto } from '../models/get-available-times.dto';
import * as moment from 'moment';
import { AppointmentInterval } from '../models/appointment-interval';
import { appointmentComparer } from './utils/intervals-sorting';
import { AvailableInterval } from '../models/available-interval';
import { validateDto } from './utils/dto-validator';
import { getFormattedDateDMY } from './utils/date';
import { HttpsError } from 'firebase-functions/lib/providers/https';

export const getTimeAvailableFunction = functions.https.onCall(async (data, ctx) => {

  if (!ctx.auth) {
    throw new HttpsError('unauthenticated', 'Unauthorized');
  }

  const { errors, dto } = await validateDto<GetAvailableTimesDto>(GetAvailableTimesDto, data);

  if (errors.length > 0) {
    throw new HttpsError('invalid-argument', 'Validation errors', errors.toString());
  }


  const formattedDate = getFormattedDateDMY(new Date(dto.timestamp));

  //1. Read if the avaliable time is created;
  const timesDoc = await admin.firestore()
    .doc(`agendas/${dto.agendaId}/times/${formattedDate}-${dto.agendaId}`).get();


  if (!timesDoc.exists) {
    await createTimesDocument(dto, formattedDate, timesDoc);
  }

  console.log(timesDoc.data())
  const times = timesDoc.data() ?? undefined;

  if(!times){
    throw new HttpsError("internal",'times doc is missing.');
  }

  let { sortedAppointments, availableIntervals } = transformIntervalsToMoments(times);

  const response: { from: string, to: string }[] = [];
  computeIntervals(availableIntervals, sortedAppointments, response);

  return { intervals: response };

});


async function createSortedIntervals(parentData: FirebaseFirestore.DocumentData, intervals: object[], formattedDate: string, timesDoc: any) {
  Object.keys(parentData.intervals[formattedDate]).forEach(key => {
    intervals.push({
      day: formattedDate,
      dayOfWeek: null,
      from: key,
      to: parentData.intervals[formattedDate][key],
    });
  });
  await timesDoc.ref.set({ availableTimes: intervals }, { merge: true });
}

async function setDocumentAvailableIntervals(parentData: FirebaseFirestore.DocumentData, dayOfWeek: number, intervals: object[], timesDoc: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>, formattedDate: string, dto: GetAvailableTimesDto) {
  Object.keys(parentData.intervals[dayOfWeek]).forEach(key => {
    intervals.push({
      day: null,
      dayOfWeek: dayOfWeek,
      from: key,
      to: parentData.intervals[dayOfWeek][key],
    });
  });
  await timesDoc.ref.set({
    id: `${formattedDate}-${dto.agendaId}`,
    availableTimes: intervals,
  }, { merge: true });
}

async function createTimesDocument(dto: GetAvailableTimesDto, formattedDate: string, timesDoc: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>) {
  const dayOfWeek = new Date(dto.timestamp).getDay();

  const parent = await admin.firestore()
    .doc(`agendas/${dto.agendaId}`).get();

  let intervals: object[] = [];

  const parentData = parent.data() ?? undefined;

  if (!parentData) {
    throw new HttpsError('internal', 'The doc is not owned by a business.');
  }
  if (parentData.intervals) {
    if (parentData.intervals[formattedDate]) {
      await createSortedIntervals(parentData, intervals, formattedDate, timesDoc);
    } else if (parentData.intervals[dayOfWeek]) {
      await setDocumentAvailableIntervals(parentData, dayOfWeek, intervals, timesDoc, formattedDate, dto);
    }else{
      throw new HttpsError("invalid-argument", "The agenda you are trying to book in does not have a config for the day you are trying to book. Please contact the business owner to set it up.")
    }
  }
}

function transformIntervalsToMoments(times: FirebaseFirestore.DocumentData): { sortedAppointments: AppointmentInterval[], availableIntervals: AvailableInterval[] } {
  const appointments = times.appointments ?? [];
  let sortedAppointments: AppointmentInterval[] = [];
  Object.keys(appointments).sort().forEach(elem => {
    sortedAppointments.push({ from: moment(elem, 'HH:mm'), to: moment(appointments[elem], 'HH:mm') });
  });

  //TODO convert hours to moment for all arrays
  const availableIntervals = times.availableTimes.map((val: AvailableInterval) => {
    return {
      dayOfWeek: val.dayOfWeek,
      day: val.day,
      from: moment(val.from, 'HH:mm'),
      to: moment(val.to, 'HH:mm'),
    };
  }).sort(appointmentComparer);
  return { sortedAppointments, availableIntervals };
}

function computeIntervals(availableIntervals: AvailableInterval[], sortedAppointments: AppointmentInterval[], response: { from:string, to:string }[]) {
  let appointmentIndex = 0;

  for (let i = 0; i < availableIntervals.length; i++) {
    for (let j = appointmentIndex; j < sortedAppointments.length; j++) {

      //si es mayor que el intervalo de apertura pasar al siguiente intervalo
      if (sortedAppointments[j].to > availableIntervals[i].to || sortedAppointments[j].from > availableIntervals[i].to) {
        appointmentIndex = j;
        break;
      }

      //si es el primer evento en este intervalo
      if (j === appointmentIndex) {

        //si hay margen desde el principio del intervalo hasta el principio del evento lo añadimos
        const diff = sortedAppointments[j].from.diff(availableIntervals[i].from, 'minutes');
        if (!(diff <= 0)) {
          response.push({ from: availableIntervals[i].from.format("HH:mm"), to: sortedAppointments[j].from.format("HH:mm") });

          // si es el final de las citas comprobamos si sobra tiempo al final.
          const diff = availableIntervals[i].to.diff(sortedAppointments[j].to, 'minutes');
          if (j === sortedAppointments.length - 1 && diff >= 0) {
            response.push({ from: sortedAppointments[j].to.format("HH:mm"), to: availableIntervals[i].to.format("HH:mm") });
          }
        }
        //si no es el primer evento.
      } else {
        // //miramos hacia delante y comprobamos que no nos salgamos del array ni del intervalo.
        // if (j + 1 < ordered.length && ordered[j + 1].from > availableTimes[i].to){
        //     response.push({from: ordered[j].to, to: availableTimes[i].to})
        // }//si estamos en el ultimo hay margen hasta el final del intervalo lo añadimos.
        // else
        if (j === sortedAppointments.length - 1 && availableIntervals[i].to.diff(sortedAppointments[j].to, 'minutes') > 0) {
          response.push({ from: sortedAppointments[j].to.format("HH:mm"), to: availableIntervals[i].to.format("HH:mm") });
        } else if (j + 1 < sortedAppointments.length && sortedAppointments[j + 1].from < availableIntervals[i].to) {
          response.push({ from: sortedAppointments[j].to.format("HH:mm"), to: sortedAppointments[j + 1].from.format("HH:mm") });
        }
      }
    }
  }
}
