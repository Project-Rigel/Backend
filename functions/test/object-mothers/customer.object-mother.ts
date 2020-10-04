import { Customer } from '../../src/appointments/domain/models/customer';

export class CustomerObjectMother {
  static getRandom() {
    return new Customer('1', '1', '1', '1', '1', '1');
  }
}
