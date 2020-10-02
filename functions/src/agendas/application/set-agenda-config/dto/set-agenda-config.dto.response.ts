import { GetAgendaConfigResponse } from '../../get-agenda-config/dto/get-agenda-config.dto.response';
import { IsString, ValidateNested } from 'class-validator';
import { AgendaConfig } from '../../../domain/models/agenda-config';

export class SetAgendaConfigResponse {
  constructor(agendaId: string, businessId: string, config: AgendaConfig[]) {
    this.agendaId = agendaId;
    this.businessId = businessId;
    this.config = config.map(conf => {
      if (conf.dayOfWeek) {
        return new GetAgendaConfigResponse(
          conf.expirationDate.toISOString(),
          null,
          conf.dayOfWeek,
          conf.intervals
        );
      }
      return new GetAgendaConfigResponse(
        null,
        conf.expirationDate.toISOString(),
        conf.dayOfWeek,
        conf.intervals
      );
    });
  }

  @IsString()
  agendaId!: string;

  @IsString()
  businessId!: string;

  @ValidateNested({ each: true })
  config!: GetAgendaConfigResponse[];
}
