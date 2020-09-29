import { Repository } from '../../src/shared/repository';

export class TestRepository<T> implements Repository<T> {
  create(item: T): Promise<boolean> {
    return Promise.resolve(true);
  }

  delete(id: string): Promise<boolean> {
    return Promise.resolve(true);
  }

  find(item: T): Promise<T[]> {
    return Promise.resolve([]);
  }

  findOne(id: string): Promise<T> {
    return Promise.resolve(null);
  }

  update(id: string, item: T): Promise<boolean> {
    return Promise.resolve(true);
  }
}
