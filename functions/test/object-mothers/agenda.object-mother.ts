import { AgendaModel } from '../../src/agendas/domain/models/agenda';
import { AgendaConfig } from '../../src/agendas/domain/models/agenda-config';

export class AgendaObjectMother {
  public static RandomAgenda(id: string, businessId: string, config: AgendaConfig[]): AgendaModel {
    return new AgendaModel(id, businessId, config);
  }
}
