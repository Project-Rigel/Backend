import { AgendaIntervalSetting } from '../models/agenda-interval-setting';
import * as admin from 'firebase-admin';
import { AgendaModel } from '../models/agenda';
import { Repository } from '../models/repository';
import moment = require('moment');

export class FirestoreAgendaRepository implements Repository<AgendaModel> {
  create(item: AgendaModel): Promise<boolean> {
    return Promise.resolve(false);
  }

  delete(id: string): Promise<boolean> {
    return Promise.resolve(false);
  }

  find(item: AgendaModel): Promise<AgendaModel[]> {
    return Promise.resolve([]);
  }

  async findOne(id: string): Promise<AgendaModel> {
    let agendaDoc = await admin.firestore().doc(`agendas/${id}`).get();
    const agendaData = agendaDoc.data() ?? null;

    if (!agendaData) return null;

    return new AgendaModel(agendaData.agendaId, agendaData.businessId, null);
  }

  update(id: string, item: AgendaModel): Promise<boolean> {
    return Promise.resolve(false);
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
}
