import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { GetAvailableTimesDto } from './dtos/get-available-times.dto';
import * as moment from 'moment';
import { AppointmentInterval } from './models/appointment-interval';
import { appointmentComparer } from './utils/intervals-sorting';
import { AvailableInterval } from './models/available-interval';
import { validateDto } from './utils/dto-validator';
import { getFormattedDateDMY } from './utils/date';
import { HttpsError } from 'firebase-functions/lib/providers/https';
import { Product } from './models/product';
import { getAvailableTimesForDayInAgenda } from './utils/intervals-utils';

export const getTimeAvailableFunction = functions.region('europe-west1').https.onCall(async (data, ctx) => {

  if (!ctx.auth) {
    throw new HttpsError('unauthenticated', 'Unauthorized');
  }

  const { errors, dto } = await validateDto<GetAvailableTimesDto>(GetAvailableTimesDto, data);

  if (errors.length > 0) {
    throw new HttpsError('invalid-argument', 'Validation errors', errors.toString());
  }

  const date:Date = new Date(dto.timestamp);

  let times = await getAvailableTimesForDayInAgenda(dto, date);

  if (!times) {
    throw new HttpsError('internal', 'There are no avaliable time intervals for this combo.');
  }

  let { sortedAppointments, availableIntervals } = transformIntervalsToMoments(times);

  const response: { from: string, to: string }[] = [];

    const productData = (await admin.firestore().collection('products').doc(dto.productId).get()).data();

    if (!productData) {
      throw new HttpsError('invalid-argument', 'There is no product associated with that Id.');
    }

    computeIntervals(availableIntervals, sortedAppointments, response, productData as Product);

  return { intervals: response };

});


function transformIntervalsToMoments(times: FirebaseFirestore.DocumentData): { sortedAppointments: AppointmentInterval[], availableIntervals: AvailableInterval[] } {
  const appointments = times.appointments ?? [];
  let sortedAppointments: AppointmentInterval[] = [];
  Object.keys(appointments).sort().forEach(elem => {
    sortedAppointments.push({ from: moment(elem), to: moment(appointments[elem]) });
  });

  //TODO convert hours to moment for all arrays
  const availableIntervals: AvailableInterval[] = times.availableTimes.map((val: AvailableInterval) => {
    return {
      dayOfWeek: val.dayOfWeek,
      day: val.day,
      from: moment(new Date(val.from)),
      to: moment(new Date(val.to)),
    };
  }).sort(appointmentComparer);
  return { sortedAppointments, availableIntervals };
}

function computeIntervals(availableIntervals: AvailableInterval[], sortedAppointments: AppointmentInterval[], response: { from: string, to: string }[], product: Product) {
  let appointmentIndex = 0;

  if (sortedAppointments.length <= 0) {
    for (let i = 0; i < availableIntervals.length; i++) {
      response.push({
        from: availableIntervals[i].from.format("HH:mm"),
        to: availableIntervals[i].to.format("HH:mm"),
      });
    }
  } else {
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
            response.push({
              from: availableIntervals[i].from.format('HH:mm'),
              to: sortedAppointments[j].from.format('HH:mm'),
            });

            // si es el final de las citas comprobamos si sobra tiempo al final.
            const diff = availableIntervals[i].to.diff(sortedAppointments[j].to, 'minutes');
            if (j === sortedAppointments.length - 1 && diff >= 0) {
              response.push({
                from: sortedAppointments[j].to.format('HH:mm'),
                to: availableIntervals[i].to.format('HH:mm'),
              });
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
            response.push({
              from: sortedAppointments[j].to.format('HH:mm'),
              to: availableIntervals[i].to.format('HH:mm'),
            });
          } else if (j + 1 < sortedAppointments.length && sortedAppointments[j + 1].from < availableIntervals[i].to) {
            response.push({
              from: sortedAppointments[j].to.format('HH:mm'),
              to: sortedAppointments[j + 1].from.format('HH:mm'),
            });
          }
        }
      }
    }
  }

}
