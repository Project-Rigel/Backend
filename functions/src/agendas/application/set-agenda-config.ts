import { SetAgendaConfigDto } from './dto/set-agenda-config.dto';
import { HttpsError } from 'firebase-functions/lib/providers/https';
import { Repository } from '../../shared/repository';
import { AgendaModel } from '../domain/models/agenda';
import { AgendaDto } from './dto/agenda.dto';
import moment = require('moment');

export class SetAgendaConfigUseCase {
  constructor(private readonly agendaRepository: Repository<AgendaModel>) {}

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

    const specificDate = dto.specificDate ? moment(dto.specificDate) : null;
    specificDate
      ? agenda.setConfigWithDate(dto.agendaId, specificDate, dto.intervals)
      : agenda.setConfigWithDayOfWeek(dto.agendaId, dto.dayOfWeek, dto.intervals);

    await this.agendaRepository.update(agenda.agendaId, agenda);

    return new AgendaDto(agenda.agendaId, agenda.businessId, agenda.config);
  }
}
