import { SetAgendaConfigDto } from './dto/set-agenda-config.dto';
import { HttpsError } from 'firebase-functions/lib/providers/https';
import { Repository } from '../../../shared/repository';
import { AgendaModel } from '../../domain/models/agenda';
import { AgendaDto } from '../dto/agenda.dto';
import moment = require('moment');
import { AgendaConfig } from '../../domain/models/agenda-config';
import { Interval } from '../../domain/models/agenda-interval';
import { DateFactory } from '../../../shared/date.factory';
import { getDayEnumFromString } from '../../../shared/utils/date';

export class SetAgendaConfigUseCase {
  constructor(
    private readonly agendaRepository: Repository<AgendaModel>,
    private readonly dateFactory: DateFactory,
  ) {}

  public async execute(dto: SetAgendaConfigDto) {
    const agenda = await this.agendaRepository.findOne(dto.agendaId);

    if (!agenda) {
      throw new HttpsError('invalid-argument', 'Agenda not found');
    }

    if ((dto.dayOfWeek && dto.specificDate) || (!dto.dayOfWeek && !dto.specificDate)) {
      throw new HttpsError(
        'invalid-argument',
        'Specify a day of week or specificDate in UTC format, not both nor any. ',
      );
    }

    // Si son iguales return error
    const mappedIntervals = dto.intervals.map((interval) => {
      return new Interval(interval.startHour, interval.endHour);
    });
    const configToAdd = new AgendaConfig(
      moment(dto.expirationDate).toDate(),
      moment(dto.specificDate).toDate(),
      getDayEnumFromString(dto.dayOfWeek),
      mappedIntervals,
    );
    agenda.config.forEach((config) => {
      if (config.isEquals(configToAdd)) {
        throw new HttpsError('invalid-argument', 'Cannot set config because it already exists.');
      }
    });

    const specificDate = dto.specificDate ? moment(dto.specificDate) : null;
    specificDate
      ? agenda.setConfigWithDate(dto.agendaId, specificDate, dto.intervals)
      : agenda.setConfigWithDayOfWeek(
          dto.agendaId,
          dto.dayOfWeek,
          dto.intervals,
          this.dateFactory.now(),
        );

    await this.agendaRepository.update(agenda.id, agenda);

    return new AgendaDto(agenda.id, agenda.businessId, agenda.config);
  }
}
