import * as admin from "firebase-admin";
import "reflect-metadata";
import {getTimeAvaliableFunction} from "./get-time-avaliable.function";

admin.initializeApp();

exports.getTimeAvaliableFunction = getTimeAvaliableFunction;



// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript