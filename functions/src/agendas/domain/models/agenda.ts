import { IntervalDto } from '../../application/dto/add-schedule-settings.dto';
import { AgendaIntervalSetting } from './agenda-interval-setting';
import * as admin from 'firebase-admin';
import { AgendaConfig } from './agenda-config';
import moment = require('moment');
import { Interval } from './agenda-interval';
import { getDayEnumFromString } from '../../../shared/utils/date';

export class AgendaModel {
  id: string;
  businessId: string;
  config: AgendaConfig[];

  constructor(agendaId: string, businessId: string, config: AgendaConfig[] | null) {
    this.id = agendaId;
    this.businessId = businessId;
    this.config = [];
    if (config !== null) {
      this.config = config;
    }
  }

  setConfigWithDate(
    agendaId: string,
    specificDate: any | moment.Moment,
    intervals: IntervalDto[],
  ): void {
    const mappedIntervals = intervals.map((interval) => {
      return new Interval(interval.startHour, interval.endHour);
    });
    const newConfig = new AgendaConfig(null, moment(specificDate).toDate(), null, mappedIntervals);
    this.addOrUpdateConfig(newConfig);
  }

  setConfigWithDayOfWeek(
    agendaId: string,
    dayOfWeek: string,
    intervals: IntervalDto[],
    now: Date,
  ): void {
    const mappedIntervals = intervals.map((interval) => {
      return new Interval(interval.startHour, interval.endHour);
    });
    const newConfig = new AgendaConfig(
      moment(now).add(2, 'months').toDate(),
      null,
      getDayEnumFromString(dayOfWeek),
      mappedIntervals,
    );
    this.addOrUpdateConfig(newConfig);
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

  addOrUpdateConfig(newConfig: AgendaConfig): void {
    let updated = false;
    this.config.forEach((config, index) => {
      if (config.isEquals(newConfig)) {
        this.config[index] = newConfig;
        updated = true;
        return
      }
    })
    if (!updated) {
      this.config.push(newConfig);
    }
  }
}
