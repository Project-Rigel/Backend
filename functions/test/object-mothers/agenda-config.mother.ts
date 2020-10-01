import { AgendaConfig } from '../../src/agendas/domain/models/agenda-config';
import { DayOfWeek } from '../../src/agendas/application/dto/add-schedule-settings.dto';
import moment = require('moment');
import { Interval } from '../../src/agendas/domain/models/agenda-interval';

export class AgendaConfigMother {
  public static expirationDate = moment().add('2', 'months').toDate();
  public static RandomConfigWithDayOfWeek() {
    return [
      new AgendaConfig(AgendaConfigMother.expirationDate, null, DayOfWeek.Monday, [
        new Interval('08:00', '12:00'),
      ]),
    ];
  }
}
