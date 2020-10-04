import { HttpsError } from 'firebase-functions/lib/providers/https';
import { Repository } from '../../../shared/repository';
import { AgendaModel } from '../../domain/models/agenda';
import { AgendaConfig } from '../../domain/models/agenda-config';
import { GetAgendaConfigDto } from './dto/get-agenda-config.dto';
import { GetAgendaConfigResponse } from './dto/get-agenda-config.dto.response';

export class GetAgendaConfigUseCase {
  constructor(private readonly agendaRepository: Repository<AgendaModel>) {}

  public async execute(dto: GetAgendaConfigDto) {
    const agenda = await this.agendaRepository.findOne(dto.agendaId);

    if (!agenda) {
      throw new HttpsError('invalid-argument', 'Agenda not found');
    }

    if (dto.showOnlyValidConfig) {
      agenda.config = agenda.config.filter((value: AgendaConfig) => {
        return value.isConfigValid();
      });
    }

    return agenda.config.map((config) => {
      if (config.dayOfWeek) {
        return new GetAgendaConfigResponse(
          config.expirationDate.toISOString(),
          null,
          config.dayOfWeek,
          config.intervals,
        );
      }
      return new GetAgendaConfigResponse(
        null,
        config.specificDate.toISOString(),
        config.dayOfWeek,
        config.intervals,
      );
    });
  }
}
