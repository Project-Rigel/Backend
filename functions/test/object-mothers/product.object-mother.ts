import { Product } from '../../src/appointments/domain/models/product';

export class ProductObjectMother {
  static getRandom() {
    return new Product('1', 1, '1', '1', '1');
  }
}
