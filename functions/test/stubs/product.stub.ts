import { Product } from '../../src/appointments/domain/models/product';

export class ProductStub {
  public static getProduct(duration: number): Product {
    return {
      duration: duration,
      name: 'name',
      id: 'id',
      description: 'description',
      businessId: 'bId',
    };
  }
}
