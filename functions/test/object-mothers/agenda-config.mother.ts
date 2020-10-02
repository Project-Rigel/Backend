import { AgendaConfig } from '../../src/agendas/domain/models/agenda-config';
import { DayOfWeek } from '../../src/agendas/application/dto/add-schedule-settings.dto';
import { Interval } from '../../src/agendas/domain/models/agenda-interval';
import { GetAgendaConfigResponse } from '../../src/agendas/application/get-agenda-config/dto/get-agenda-config.dto.response';
import moment = require('moment');

export class AgendaConfigMother {
  public static expirationDate = moment().add('2', 'months').toDate();
  public static RandomConfigWithDayOfWeek(dayOfWeek: DayOfWeek = DayOfWeek.Monday, intervals: Interval[] =[
    new Interval('08:00', '12:00'),
  ]) {
    return [
      new AgendaConfig(AgendaConfigMother.expirationDate, null, dayOfWeek, intervals),
    ];
  }

  public static RandomConfigWithDayOfWeekDto(dayOfWeek: DayOfWeek = DayOfWeek.Monday, intervals: Interval[] =[
    new Interval('08:00', '12:00'),
  ] ) {
    return [
      new GetAgendaConfigResponse(AgendaConfigMother.expirationDate.toISOString(), null, dayOfWeek, intervals),
    ];
  }
}
