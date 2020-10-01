import { AgendaConfig } from '../../domain/models/agenda-config';

export class AgendaDto {
  agendaId: string;
  businessId: string;
  config: AgendaConfig[];

  constructor(agendaId: string, businessId: string, config: AgendaConfig[]) {
    this.agendaId = agendaId;
    this.businessId = businessId;
    this.config = config;
  }
}
