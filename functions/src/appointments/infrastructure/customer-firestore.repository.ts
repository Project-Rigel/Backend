import { Repository } from '../../shared/repository';
import { Customer } from '../domain/models/customer';

export class CustomerFirestoreRepository implements Repository<Customer> {
  create(item: Customer): Promise<boolean> {
    return Promise.resolve(false);
  }

  delete(id: string): Promise<boolean> {
    return Promise.resolve(false);
  }

  find(item: Customer): Promise<Customer[]> {
    return Promise.resolve([]);
  }

  findOne(id: string): Promise<Customer> {
    return Promise.resolve(undefined);
  }

  update(id: string, item: Customer): Promise<boolean> {
    return Promise.resolve(false);
  }
}
