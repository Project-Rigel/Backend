import * as admin from "firebase-admin";
admin.initializeApp();

import "reflect-metadata";
import { getTimeAvaliableFunction } from "./get-time-avaliable.function";
import { getAppointmentFunction } from "./get-appointment.function";

exports.getTimeAvaliableFunction = getTimeAvaliableFunction;
exports.getAppointmentFunction = getAppointmentFunction;

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
