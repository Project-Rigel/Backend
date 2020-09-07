import * as admin from 'firebase-admin';
import { Product } from '../models/product';

export class ProductService {
  async getProduct(productId: string): Promise<Product | null> {
    const productDoc = await admin.firestore().doc(`products/${productId}`).get();

    const product = productDoc.data() ?? null;

    return product
      ? {
          businessId: product.businessId,
          description: product.description,
          duration: product.duration,
          id: product.id,
          name: product.name,
        }
      : null;
  }
}
