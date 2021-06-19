import { Customer } from '../../src/appointments/domain/models/customer';
import PhoneNumber, { CountryPrefix } from '../../src/shared/phone-number';

export class CustomerObjectMother {
  static getRandom() {
    return new Customer(
      '1',
      '1',
      '1',
      '1',
      '1',
      new PhoneNumber(CountryPrefix.Spain, '1'),
    );
  }
}
