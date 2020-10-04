import * as admin from 'firebase-admin';
import { Business } from '../domain/models/business';

export class BusinessRepository {
  public async getById(businessId: string): Promise<Business> {
    const doc = await admin.firestore().doc(`business/${businessId}`).get();

    const businessData = doc.data() || null;

    if (!businessData) return null;

    return {
      name: doc.data().name,
      nif: doc.data().nif,
      phone: doc.data().phone,
    };
  }
}
