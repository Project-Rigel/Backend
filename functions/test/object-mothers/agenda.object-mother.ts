import { AgendaModel } from '../../src/models/agenda';
import { AgendaConfig } from '../../src/models/agenda-config';

export class AgendaObjectMother {
  public static RandomAgenda(id: string, businessId: string, config: AgendaConfig): AgendaModel {
    return new AgendaModel(id, businessId, config);
  }
}
