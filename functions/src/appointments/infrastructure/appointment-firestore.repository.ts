import { Repository } from '../../shared/repository';
import { Appointment } from '../domain/models/appointment';

export class AppointmentFirestoreRepository implements Repository<Appointment> {
  create(item: Appointment): Promise<boolean> {
    return Promise.resolve(false);
  }

  delete(id: string): Promise<boolean> {
    return Promise.resolve(false);
  }

  find(item: Appointment): Promise<Appointment[]> {
    return Promise.resolve([]);
  }

  findOne(id: string): Promise<Appointment> {
    return Promise.resolve(undefined);
  }

  update(id: string, item: Appointment): Promise<boolean> {
    return Promise.resolve(false);
  }
}
