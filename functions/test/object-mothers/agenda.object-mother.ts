import { AgendaModel } from '../../src/models/agenda.model';

export class AgendaObjectMother {
  public static RandomAgenda(id: string, businessId: string): AgendaModel {
    return new AgendaModel(id, businessId, null);
  }
}
