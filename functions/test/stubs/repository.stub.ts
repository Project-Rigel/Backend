import { Repository } from '../../src/shared/repository';

export class TestRepository<T> implements Repository<T> {
  storage = new Map();

  create(item: T): Promise<boolean> {
    const id = (item as any).id;
    if (!this.storage.has(item)) {
      this.storage.set(id, item);
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }

  delete(id: string): Promise<boolean> {
    return Promise.resolve(true);
  }

  find(item: T): Promise<T[]> {
    return this.storage.get(item);
  }

  findOne(id: string): Promise<T> {
    return this.storage.get(id);
  }

  update(id: string, item: T): Promise<boolean> {
    return Promise.resolve(true);
  }
}
