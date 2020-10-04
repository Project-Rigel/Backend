import * as admin from 'firebase-admin';
import { IdGenerator } from '../uid-generator';

export class FirestoreIdGenerator implements IdGenerator {
  db = admin.firestore();
  generate(): string {
    return this.db.collection('_').doc().id;
  }
}
