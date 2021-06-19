import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { HttpsError } from 'firebase-functions/lib/providers/https';
import { getDateFromFormattedDate } from '../../../shared/utils/date';
import { validateDto } from '../../../shared/utils/dto-validator';
import { GetAvailableDaysDto } from '../../application/dto/get-available-days.dto';
import moment = require('moment');

const db = admin.firestore();

export const getOpenDaysForMonth = functions
  .region('europe-west1')
  .https.onCall(async (data, ctx) => {
    if (!ctx.auth) {
      throw new HttpsError('unauthenticated', 'Unauthorized');
    }

    //validate the dto
    const { dto, errors } = await validateDto<GetAvailableDaysDto>(
      GetAvailableDaysDto,
      data,
    );

    if (errors.length > 0) {
      throw new HttpsError(
        'invalid-argument',
        'Validation errors',
        errors.toString(),
      );
    }

    const agendaData = (await db.doc('agendas/' + dto.agendaId).get()).data();

    if (!agendaData) {
      throw new HttpsError(
        'internal',
        'There is no agendas created with that ID.',
      );
    }

    if (!agendaData.intervals) {
      return { openDays: [] };
    }

    const intervals: number[] = [];

    try {
      //TODO read if there is any opening day outside of the normal ones
      extractAgendaConfigData(agendaData, intervals);

      const openDays: any[] = [];
      computeOpenDaysForGivenAgenda(intervals, openDays);
      return openDays;
    } catch (e) {
      throw new HttpsError('internal', e.toString());
    }
  });

function computeOpenDaysForGivenAgenda(intervals: number[], openDays: any[]) {
  for (let i = 0; i < intervals.length; i++) {
    let intervalOpenDays = [];
    let firstDay;
    let isDayOfWeek: boolean;

    //if the length of the key is greater than 1 we are referencing a day
    if (intervals[i].toString().length > 1) {
      const formattedMoment = getDateFromFormattedDate(intervals[i].toString());
      if (formattedMoment.month() !== moment(new Date()).month()) {
        continue;
      }
      isDayOfWeek = false;
      firstDay = moment().startOf('month').date(formattedMoment.get('date'));
    } else {
      isDayOfWeek = true;
      firstDay = moment().startOf('month').date(intervals[i]);
    }

    if (firstDay.date() > 7) firstDay.add(7, 'd');
    const month = firstDay.month();
    while (month === firstDay.month()) {
      intervalOpenDays.push(firstDay.date());
      firstDay.add(7, 'd');
    }

    if (isDayOfWeek) {
      openDays.push({
        day: intervals[i],
        dayDisplayName: firstDay.format('dddd'),
        openDays: intervalOpenDays,
        isDayOfWeek: isDayOfWeek,
      });
    } else {
      openDays.push({
        day: firstDay.day(),
        dayDisplayName: firstDay.format('dddd'),
        openDays: [firstDay.date()],
        isDayOfWeek: isDayOfWeek,
      });
    }
  }
}

function extractAgendaConfigData(
  agendaData: FirebaseFirestore.DocumentData,
  intervals: any[],
) {
  Object.keys(agendaData.intervals).forEach((key) => {
    if (key.toString().length <= 1) {
      intervals.push(Number.parseInt(key));
    } else {
      intervals.push(key.toString());
    }
  });
}
