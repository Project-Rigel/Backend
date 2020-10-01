import { Repository } from '../../../shared/repository';
import { AgendaModel } from '../../domain/models/agenda';
import { HttpsError } from 'firebase-functions/lib/providers/https';
import { GetAgendaConfigDto } from './dto/get-agenda-config.dto';
import { AgendaConfig } from '../../domain/models/agenda-config';

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

    return agenda.config;
  }
}
