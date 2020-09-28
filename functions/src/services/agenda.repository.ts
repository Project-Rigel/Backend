import { AgendaIntervalSetting } from '../models/agenda-interval-setting';
import * as admin from 'firebase-admin';
import moment = require('moment');
import { AgendaModel } from '../models/agenda.model';

export class AgendaRepository {
  public async getAgenda(agendaId: string): Promise<AgendaModel | null> {
    let agendaDoc = await admin.firestore().doc(`agendas/${agendaId}`).get();
    const agendaData = agendaDoc.data() ?? null;

    if (!agendaData) return null;

    return new AgendaModel(agendaData.businessId);
  }
  public async getAgendaIntervals(agendaId: string): Promise<AgendaIntervalSetting[]> {
    let agendaDoc = await admin.firestore().doc(`agendas/${agendaId}`).get();
    const timesData = agendaDoc.data() ?? {};

    const intervals: AgendaIntervalSetting[] = [];

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
    timestamp: string,
  ): Promise<AgendaIntervalSetting[]> {
    let agendaDoc = await admin.firestore().doc(`agendas/${agendaId}`).get();
    const timesData = agendaDoc.data() ?? {};

    const intervals: AgendaIntervalSetting[] = [];
    const weekDay = new Date(timestamp).getDay();
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

    return this.adjustMomentsToTimestamp(intervals, timestamp);
  }

  private adjustMomentsToTimestamp(intervals: AgendaIntervalSetting[], timestamp: string) {
    const dayMoment = moment.utc(timestamp);

    intervals.map((val) => {
      return {
        dayOfWeek: val.dayOfWeek,
        day: val.day,
        from: val.from.set({
          year: dayMoment.year(),
          month: dayMoment.month(),
          date: dayMoment.date(),
        }),
        to: val.to.set({
          year: dayMoment.year(),
          month: dayMoment.month(),
          date: dayMoment.date(),
        }),
      };
    });
    return intervals;
  }

  public async saveAgenda(agenda: AgendaModel) {
    await admin.firestore().doc(`agendas/${agenda.agendaId}`).set(JSON.parse(JSON.stringify(agenda)));
  }
}
