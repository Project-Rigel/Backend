import * as admin from 'firebase-admin';

//important to run the init first
if (process.env.FUNCTIONS_EMULATOR) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://rigel-admin.firebaseio.com',
  });
} else {
  admin.initializeApp();
}

import 'reflect-metadata';
import { getTimeAvailableFunction } from './get-time-available.function';
import { getAppointmentFunction } from './get-appointment.function';
import { getOpenDaysForMonth } from './get-open-days-for-month';


exports.getAvaliableTimeIntervals = getTimeAvailableFunction;
exports.bookAppointment = getAppointmentFunction;
exports.getAvaliableDaysInMonth = getOpenDaysForMonth;

