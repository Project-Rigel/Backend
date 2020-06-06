import { getAppointmentFunction } from "./get-appointment.function";
import * as admin from 'firebase-admin';
import 'reflect-metadata';
import { getTimeAvailableFunction } from './get-time-available.function';

if (!process.env.FIREBASE_CONFIG) {
  const serviceAccount = require('./rigel-admin-firebase-adminsdk-76ugg-4ed1a0dbb1.json');
  const params = {
    type: serviceAccount.type,
    projectId: serviceAccount.project_id,
    privateKeyId: serviceAccount.private_key_id,
    privateKey: serviceAccount.private_key,
    clientEmail: serviceAccount.client_email,
    clientId: serviceAccount.client_id,
    authUri: serviceAccount.auth_uri,
    tokenUri: serviceAccount.token_uri,
    authProviderX509CertUrl: serviceAccount.auth_provider_x509_cert_url,
    clientC509CertUrl: serviceAccount.client_x509_cert_url,
  };
  admin.initializeApp({
    credential: admin.credential.cert(params),
    databaseURL: 'https://rigel-admin.firebaseio.com',
  });
} else {
  admin.initializeApp();
}


exports.getTimeAvaliableFunction = getTimeAvailableFunction;
exports.getAppointmentFunction = getAppointmentFunction;

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
