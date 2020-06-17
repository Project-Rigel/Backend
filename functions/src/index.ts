import * as admin from 'firebase-admin';
import 'reflect-metadata';
//important to run the init first
if (process.env.FUNCTIONS_EMULATOR) {
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

import { getTimeAvailableFunction } from './get-time-available.function';
import { getAppointmentFunction } from './get-appointment.function';


exports.getAvaliableTimeIntervals = getTimeAvailableFunction;
exports.bookAppointment = getAppointmentFunction;

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
