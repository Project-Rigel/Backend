import { DayOfWeek, IntervalDto } from '../dtos/add-schedule-settings.dto';

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

  constructor(businessId: string) {
    this.businessId = businessId;
    this.config = new AgendaConfig();
  }

  //TODO crear un metodo comun para las operaciones parecidas de ambos metodos
  setConfigWithDate(
    agendaId: string,
    specificDate: any | moment.Moment,
    intervals: IntervalDto[],
  ): void {
    //
    this.agendaId = agendaId;
    this.config.specificDate = specificDate;
    this.config.intervals = intervals;
  }

  setConfigWithDayOfWeek(agendaId: string, dayOfWeek: string, intervals: IntervalDto[]): void {
    //
    this.agendaId = agendaId;
    this.config.dayOfWeek = this.getDayOfWeekFromString(dayOfWeek);
    this.config.intervals = intervals;
  }

  getDayOfWeekFromString(dayOfWeek: string) {
    switch (dayOfWeek) {
      case "Monday":
        return DayOfWeek.Monday;
      case "Tuesday":
        return DayOfWeek.Tuesday;
      case "Wednesady":
        return DayOfWeek.Wednesday;
      case "Thurday":
        return DayOfWeek.Thursday;
      case "Friday":
        return DayOfWeek.Friday;
      case "Saturday":
        return DayOfWeek.Saturday;
      case "Sunday":
        return DayOfWeek.Sunday;
      default:
        return null
    }
  }
}
