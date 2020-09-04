import { AvailableInterval } from '../models/available-interval';
import * as admin from 'firebase-admin';
import moment = require('moment');

export class AgendaService {
  public async getAgendaIntervals(agendaId: string): Promise<AvailableInterval[]> {
    let agendaDoc = await admin.firestore().doc(`agendas/${agendaId}`).get();
    const timesData = agendaDoc.data() ?? {};

    const intervals: AvailableInterval[] = [];

    Object.keys(agendaDoc.data().intervals).forEach((key) => {
      Object.keys(timesData.intervals[key]).forEach((intervalKey) => {
        intervals.push({
          day: isNaN(Number(key)) ? key : null,
          dayOfWeek: !isNaN(Number(key)) ? Number.parseInt(key) : null,
          from: moment(intervalKey, 'HH:mm'),
          to: moment(timesData.intervals[key][intervalKey], 'HH:mm'),
        });
      });
    });

    return intervals;
  }

  public async getAgendaIntervalsForWeekDay(
    agendaId: string,
    weekDay: number,
  ): Promise<AvailableInterval[]> {
    let agendaDoc = await admin.firestore().doc(`agendas/${agendaId}`).get();
    const timesData = agendaDoc.data() ?? {};

    const intervals: AvailableInterval[] = [];

    Object.keys(agendaDoc.data().intervals).forEach((key) => {
      Object.keys(timesData.intervals[key]).forEach((intervalKey) => {
        if (weekDay === Number(key))
          intervals.push({
            day: null,
            dayOfWeek: Number.parseInt(key),
            from: moment(intervalKey, 'HH:mm'),
            to: moment(timesData.intervals[key][intervalKey], 'HH:mm'),
          });
      });
    });

    return intervals;
  }
}
