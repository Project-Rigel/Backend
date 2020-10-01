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
import { getAvailableIntervalsInDayFunction } from './agendas/infrastructure/functions/get-available-intervals-in-day.function';
import { bookAppointmentFunction } from './appointments/infrastructure/book-appointment.function';
import { getOpenDaysForMonth } from './agendas/infrastructure/functions/get-open-days-for-month';
import { setAgendaScheduleSettings } from './agendas/infrastructure/functions/add-schedule-settings-to-agenda';
import { setAgendaConfigFunction } from './agendas/infrastructure/functions/set-agenda-config.function';
import { createCustomClaimOnBusinessCreationFunction } from './users/add-custom-claim.function';
import { GetAgendaConfigFunction } from './agendas/infrastructure/functions/get-agenda-config.function';

exports.getAvaliableTimeIntervals = getAvailableIntervalsInDayFunction;
exports.bookAppointment = bookAppointmentFunction;
exports.getAvaliableDaysInMonth = getOpenDaysForMonth;
exports.setAgendaScheduleSettings = setAgendaScheduleSettings;
exports.setAgendaConfig = setAgendaConfigFunction;
exports.addBusinessDocsCallback = createCustomClaimOnBusinessCreationFunction;
exports.getAgendaConfig = GetAgendaConfigFunction;
