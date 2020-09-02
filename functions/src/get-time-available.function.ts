import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { GetAvailableTimesDto } from './dtos/get-available-times.dto';
import * as moment from 'moment';
import { AppointmentInterval } from './models/appointment-interval';
import { appointmentComparer } from './utils/intervals-sorting';
import { AvailableInterval } from './models/available-interval';
import { validateDto } from './utils/dto-validator';
import { HttpsError } from 'firebase-functions/lib/providers/https';
import { Product } from './models/product';

import { getAvailableTimesForDayInAgenda } from './utils/intervals-utils';
import { computeIntervals } from './utils/intervals-computer';

export const getTimeAvailableFunction = functions
  .region('europe-west1')
  .https.onCall(async (data, ctx) => {
    if (!ctx.auth) {
      throw new HttpsError('unauthenticated', 'Unauthorized');
    }

    const { errors, dto } = await validateDto<GetAvailableTimesDto>(GetAvailableTimesDto, data);

    if (errors.length > 0) {
      throw new HttpsError('invalid-argument', 'Validation errors', errors.toString());
    }

    const date: Date = new Date(dto.timestamp);

    let times = await getAvailableTimesForDayInAgenda(dto, date);

    if (!times) {
      throw new HttpsError('internal', 'There are no avaliable time intervals for this combo.');
    }

    let { sortedAppointments, availableIntervals } = transformIntervalsToMoments(
      times,
      dto.timestamp,
    );

    const response: { from: string; to: string }[] = [];

    const productData = (
      await admin.firestore().collection('products').doc(dto.productId).get()
    ).data();

    if (!productData) {
      throw new HttpsError('invalid-argument', 'There is no product associated with that Id.');
    }

    computeIntervals(availableIntervals, sortedAppointments, response);
    const newResponse = applyProductDurationToResponse(
      response,
      productData as Product,
      dto.timestamp,
    );

    return { intervals: newResponse };
  });

function transformIntervalsToMoments(
  times: FirebaseFirestore.DocumentData,
  timestampIsoFormat: string,
): {
  sortedAppointments: AppointmentInterval[];
  availableIntervals: AvailableInterval[];
} {
  const appointments = times.appointments ?? [];
  let sortedAppointments: AppointmentInterval[] = [];
  Object.keys(appointments)
    .sort()
    .forEach((elem) => {
      sortedAppointments.push({
        from: moment(elem).utc(),
        to: moment(appointments[elem]).utc(),
      });
    });

  const availableIntervals: AvailableInterval[] = times.availableTimes
    .map((val: AvailableInterval) => {
      const fromMoment = moment.utc(val.from, 'HH:mm');
      const toMoment = moment.utc(val.to, 'HH:mm');
      const dayMoment = moment.utc(timestampIsoFormat);

      return {
        dayOfWeek: val.dayOfWeek,
        day: val.day,
        from: fromMoment.set({
          year: dayMoment.year(),
          month: dayMoment.month(),
          date: dayMoment.date(),
        }),
        to: toMoment.set({
          year: dayMoment.year(),
          month: dayMoment.month(),
          date: dayMoment.date(),
        }),
      };
    })
    .sort(appointmentComparer);

  return { sortedAppointments, availableIntervals };
}

function applyProductDurationToResponse(
  response: { from: string; to: string }[],
  product: Product,
  timestamp: string,
): { from: string; to: string }[] {
  const newResponse: { from: string; to: string }[] = [];
  const dayMoment = moment(timestamp);
  response.forEach((val) => {
    const from = moment.utc(val.from, 'HH:mm').set({
      year: dayMoment.year(),
      month: dayMoment.month(),
      date: dayMoment.date(),
    });

    const to = moment.utc(val.to, 'HH:mm').set({
      year: dayMoment.year(),
      month: dayMoment.month(),
      date: dayMoment.date(),
    });

    const diff = to.diff(from, 'minutes');
    if (diff > product.duration) {
      const newMoment = from.add(product.duration, 'minutes');
      newResponse.push({
        from: val.from,
        to: newMoment.format('HH:mm'),
      });

      if (newMoment.diff(to) <= product.duration) {
        newResponse.push({
          from: newMoment.format('HH:mm'),
          to: val.to,
        });
      }
    } else {
      newResponse.push(val);
    }
  });

  return newResponse;
}
