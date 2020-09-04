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
import { getAvailableIntervalsInDayFunction } from './get-available-intervals-in-day.function';
import { bookAppointmentFunction } from './book-appointment.function';
import { getOpenDaysForMonth } from './get-open-days-for-month';
import { setAgendaScheduleSettings } from './add-schedule-settings-to-agenda';

exports.getAvaliableTimeIntervals = getAvailableIntervalsInDayFunction;
exports.bookAppointment = bookAppointmentFunction;
exports.getAvaliableDaysInMonth = getOpenDaysForMonth;
exports.setAgendaScheduleSettings = setAgendaScheduleSettings;
