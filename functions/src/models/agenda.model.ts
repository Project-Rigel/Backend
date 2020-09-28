import { DayOfWeek, IntervalDto } from '../dtos/add-schedule-settings.dto';
import { Moment } from 'moment';

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

  //TODO crear un metodo comun para las operaciones parecidas de ambos metodos
  setConfigWithDate(
    agendaId: string,
    specificDate: any | moment.Moment,
    intervals: IntervalDto[],
  ): void {
    //TODO set with date
  }

  setConfigWithDayOfWeek(agendaId: string, dayOfWeek: string, intervals: IntervalDto[]): void {
    //TDOO set with day of week
  }
}
