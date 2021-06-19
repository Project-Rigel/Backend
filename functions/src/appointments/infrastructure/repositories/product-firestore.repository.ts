import * as admin from 'firebase-admin';
import { Repository } from '../../../shared/repository';
import { Product } from '../../domain/models/product';

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

  async findOne(id: string): Promise<Product> {
    const doc = await admin.firestore().collection('products').doc(id).get();

    const productData = doc.data() ?? null;

    if (!productData) return null;

    return new Product(
      productData.description,
      productData.duration,
      productData.name,
      productData.id,
      productData.businessId,
    );
  }

  update(id: string, item: Product): Promise<boolean> {
    return Promise.resolve(false);
  }
}
