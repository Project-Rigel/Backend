import * as functions from 'firebase-functions';
import { HttpsError } from 'firebase-functions/lib/providers/https';
import { validateDto } from './utils/dto-validator';
import * as admin from 'firebase-admin';
import { GetAvailableDaysDto } from './models/get-available-days.dto';
import moment = require('moment');

const db = admin.firestore();

export const getOpenDaysForMonth = functions.https.onCall(
  async (data, ctx) => {

    if (!ctx.auth) {
      throw new HttpsError('unauthenticated', 'Unauthorized');
    }

    //validate the dto
    const { dto, errors } = await validateDto<GetAvailableDaysDto>(GetAvailableDaysDto, data);

    if (errors.length > 0) {
      throw new HttpsError('invalid-argument', "Validation errors", errors.toString());
    }

    const agendaData = (await db.doc("agendas/" + dto.agendaId).get()).data();

    if(!agendaData){
      throw  new HttpsError("internal", "There is no agenda created with that ID.")
    }

    if(!agendaData.intervals){
      throw  new HttpsError("internal", "There is no open days set up for this agenda.")
    }

    const intervals: number[] = [];

    //TODO read if there is any opening day outside of the normal ones
    Object.keys(agendaData.intervals).forEach(key => {
      intervals.push(Number.parseInt(key));
    });

    const results = [];
    for (let i = 0; i < intervals.length; i++) {
      var date = moment().month(dto.month).weekday(intervals[i]);

      if (date.date() > 7) date.add(7,'d');
      var month = date.month();
      while(month === date.month()){
        results.push(date);
        date.add(7,'d');
      }
    }


  },
);