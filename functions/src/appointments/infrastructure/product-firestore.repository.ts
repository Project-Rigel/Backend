import { Repository } from '../../shared/repository';
import { Product } from '../domain/models/product';

export class ProductFirestoreRepository implements Repository<Product> {
  create(item: Product): Promise<boolean> {
    return Promise.resolve(false);
  }

  delete(id: string): Promise<boolean> {
    return Promise.resolve(false);
  }

  find(item: Product): Promise<Product[]> {
    return Promise.resolve([]);
  }

  findOne(id: string): Promise<Product> {
    return Promise.resolve(undefined);
  }

  update(id: string, item: Product): Promise<boolean> {
    return Promise.resolve(false);
  }
}
