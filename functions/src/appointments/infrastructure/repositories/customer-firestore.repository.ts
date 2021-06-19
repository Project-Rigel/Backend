import * as admin from 'firebase-admin';
import PhoneNumber, { CountryPrefix } from '../../../shared/phone-number';
import { Repository } from '../../../shared/repository';
import { Customer } from '../../domain/models/customer';

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

  async findOne(id: string): Promise<Customer> {
    const doc = await admin.firestore().collection('customers').doc(id).get();

    const customerDocData = doc.data() ?? null;

    if (!customerDocData) return null;

    return new Customer(
      customerDocData.id,
      customerDocData.email,
      customerDocData.name,
      customerDocData.firstSurname,
      customerDocData.secondSurname,
      new PhoneNumber(CountryPrefix.Spain, customerDocData.phone),
    );
  }

  update(id: string, item: Customer): Promise<boolean> {
    return Promise.resolve(false);
  }
}
