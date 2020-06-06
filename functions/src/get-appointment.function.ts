import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { GetAppointmentDto } from "../models/get-appointment.dto";
import { plainToClass } from "class-transformer";

const db = admin.firestore();

//Escribir business/businessId/agendas/agendaId/appotinments/${datetime-agendaid}.
export const getAppointmentFunction = functions.https.onRequest(
  async (req, res) => {
    const dto: GetAppointmentDto = plainToClass(GetAppointmentDto, req.body);
    console.log(dto);
    //const currentTime = new Date().getTime();
    const formattedDate = `${dto.timestamp.getDate()}_${dto.timestamp.getMonth()}_${dto.timestamp.getFullYear()}`;
    let appointment = db
      .collection("bussiness")
      .doc(dto.businessId)
      .collection("agendas")
      .doc(dto.agendaId)
      .collection("appotinments")
      .doc(`${formattedDate}-${dto.agendaId}`);

    var key = db.collection("_").doc().id;
    console.log("AQDDDDD");
    let interval = {
      [key]: {
        uid: dto.uid,
        horaInicio: dto.timestamp.getHours(),
      },
    };
    try {
      let transaction: Promise<FirebaseFirestore.Transaction> = db.runTransaction(
        async (t: FirebaseFirestore.Transaction) => {
          return await t.set(appointment, interval);
        }
      );
      console.log(transaction);
    } catch (error) {
      throw error;
    }
  }
);
