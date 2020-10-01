import { AgendaConfig } from '../../src/agendas/domain/models/agenda-config';
import { DayOfWeek } from '../../src/agendas/application/dto/add-schedule-settings.dto';
import moment = require('moment');

export class AgendaConfigMother {
  public static expirationDate = moment().add('2', 'months').toDate();
  public static RandomConfigWithDayOfWeek() {
    return [
      new AgendaConfig(AgendaConfigMother.expirationDate, null, DayOfWeek.Monday, [
        { startHour: '08:00', endHour: '12:00' },
      ]),
    ];
  }
}
