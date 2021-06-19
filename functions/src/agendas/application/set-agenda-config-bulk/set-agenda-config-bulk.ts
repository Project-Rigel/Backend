import { HttpsError } from 'firebase-functions/lib/providers/https';
import { DateFactory } from '../../../shared/date.factory';
import { Repository } from '../../../shared/repository';
import { AgendaModel } from '../../domain/models/agenda';
import moment = require('moment');
import { SetAgendaConfigBulkDto } from './dto/set-agenda-config-bulk.dto';
import { SetAgendaConfigResponse } from '../set-agenda-config/dto/set-agenda-config.dto.response';

export class SetAgendaConfigBulkUseCase {
  constructor(
    private readonly agendaRepository: Repository<AgendaModel>,
    private readonly dateFactory: DateFactory,
  ) {}

  public async execute(dto: SetAgendaConfigBulkDto) {
    const agenda = await this.agendaRepository.findOne(dto.agendaId);

    if (!agenda) {
      throw new HttpsError('invalid-argument', 'Agenda not found');
    }

    for (const config of dto.configs) {
      if (
        (config.dayOfWeek && config.specificDate) ||
        (!config.dayOfWeek && !config.specificDate)
      ) {
        throw new HttpsError(
          'invalid-argument',
          'Specify a day of week or specificDate in UTC format, not both nor any in config ' + config,
        );
      }

      if (config.specificDate && config.expirationDate) {
        throw new HttpsError(
          'invalid-argument',
          'A specific date can have and expiration '  + config,
        );
      }

      const specificDate = config.specificDate ? moment(config.specificDate) : null;
      specificDate
        ? agenda.setConfigWithDate(dto.agendaId, specificDate, config.intervals)
        : agenda.setConfigWithDayOfWeek(
        dto.agendaId,
        config.dayOfWeek,
        config.intervals,
        this.dateFactory.now(),
        );

      await this.agendaRepository.update(agenda.id, agenda);
    }

    return new SetAgendaConfigResponse(
      agenda.id,
      agenda.businessId,
      agenda.config,
    );
  }
}
