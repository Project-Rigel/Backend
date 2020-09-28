import { DayOfWeek, IntervalDto } from '../dtos/add-schedule-settings.dto';
import { AgendaIntervalSetting } from './agenda-interval-setting';
import * as admin from 'firebase-admin';
import moment = require('moment');

//TODO move to another file
class Interval {}

//TODO move to another file
class AgendaConfig {
  expirationDate: Date | null;
  specificDate: Date | null;
  dayOfWeek: DayOfWeek | null;
  intervals: Interval[];
}

export class AgendaModel {
  agendaId: string;
  businessId: string;
  config: AgendaConfig;

  constructor(agendaId: string, businessId: string, config: AgendaConfig) {
    this.agendaId = agendaId;
    this.businessId = businessId;
    if (config === null) {
      this.config = new AgendaConfig();
    } else {
      this.config = config;
    }
  }

  //TODO crear un metodo comun para las operaciones parecidas de ambos metodos
  setConfigWithDate(
    agendaId: string,
    specificDate: any | moment.Moment,
    intervals: IntervalDto[],
  ): void {
    this.agendaId = agendaId;
    this.config.specificDate = specificDate;
    this.config.intervals = intervals;
  }

  setConfigWithDayOfWeek(agendaId: string, dayOfWeek: string, intervals: IntervalDto[]): void {
    this.agendaId = agendaId;
    this.config.dayOfWeek = this.getDayEnumFromString(dayOfWeek);
    this.config.intervals = intervals;
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

  getDayEnumFromString(day: string) {
    switch (day) {
      case "Monday":
        return DayOfWeek.Monday;
      case "Tuesday":
        return DayOfWeek.Tuesday;
      case "Wednesday":
        return DayOfWeek.Wednesday;
      case "Thursday":
        return DayOfWeek.Thursday;
      case "Friday":
        return DayOfWeek.Friday;
      case "Saturday":
        return DayOfWeek.Saturday;
      case "Sunday":
        return DayOfWeek.Sunday;
      default:
        return null;
    }
  }
}
