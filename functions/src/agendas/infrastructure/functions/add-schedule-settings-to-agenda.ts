import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { HttpsError } from 'firebase-functions/lib/providers/https';
import { validateDto } from '../../../shared/utils/dto-validator';
import {
  AddScheduleSettingsDto,
  DayOfWeek,
} from '../../application/dto/add-schedule-settings.dto';
import moment = require('moment');

const db = admin.firestore();

export const setAgendaScheduleSettings = functions
  .region('europe-west1')
  .https.onCall(async (data, ctx) => {
    try {
      if (!ctx.auth) {
        throw new HttpsError('unauthenticated', 'Unauthorized');
      }

      //validate the dto
      const { dto, errors } = await validateDto<AddScheduleSettingsDto>(
        AddScheduleSettingsDto,
        data,
      );

      if (errors.length > 0) {
        throw new HttpsError('invalid-argument', 'Validation errors', errors);
      }

      const agendaRef = await db.doc('agendas/' + dto.agendaId);

      if (!(await agendaRef.get()).exists) {
        throw new HttpsError('invalid-argument', 'Agenda not found');
      }

      if (
        (dto.dayOfWeek && dto.specificDate) ||
        (!dto.dayOfWeek && !dto.specificDate)
      ) {
        throw new HttpsError(
          'invalid-argument',
          'Specify a day of week or specificDate in UTC format, not both nor any. ',
        );
      }

      const specificDate = dto.specificDate
        ? moment(dto.specificDate)
            .utc()
            .hours(0)
            .minutes(0)
            .seconds(0)
            .milliseconds(0)
            .toISOString()
        : null;

      const intervals = {
        // @ts-ignore
        [dto.dayOfWeek ? DayOfWeek[dto.dayOfWeek] : specificDate]: {},
      };

      for (let i = 0; i < dto.intervals.length; i++) {
        // @ts-ignore
        intervals[dto.dayOfWeek ? DayOfWeek[dto.dayOfWeek] : specificDate][
          dto.intervals[i].startHour
        ] = dto.intervals[i].endHour;
      }

      await agendaRef.set({ intervals: intervals }, { merge: true });

      // const timesDocs = await db.collection('agendas').doc(dto.agendaId).collection('times').get();
      //
      // if (timesDocs.size > 0) {
      //   const timesIntervals = [];
      //
      //   if (dto.specificDate) {
      //   }
      //   timesIntervals.push({
      //     day: null,
      //     dayOfWeek: dayOfWeek,
      //     from: key,
      //     to: parentData.intervals[dayOfWeek][key],
      //   });
      //   timesDocs.forEach((elem) => {
      //     elem.ref.set(
      //       {
      //         availableTimes: intervals,
      //       },
      //       { merge: true },
      //     );
      //   });
      // }

      return 'Ok';
    } catch (e) {
      throw new HttpsError('internal', e.toString());
    }
  });
