import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { GetAvailableTimesDto } from "../models/get-available-times.dto";

export const getTimeAvaliableFunction = functions.https.onRequest(
  async (req, res) => {
    //TODO check auth with onCall function
    const dto: GetAvailableTimesDto = plainToClass(
      GetAvailableTimesDto,
      req.body
    );
    const errors = await validate(dto);

    if (errors.length > 0) {
      res.status(400).send({ errors: errors });
    }

    console.log(dto.timestamp);
    //1. Read if the avaliable time is created;

    const formattedDateDate = `${dto.timestamp.getDate()}_${dto.timestamp.getMonth()}_${dto.timestamp.getFullYear()}`;

    const doc = await admin
      .firestore()
      .doc(`agendas/${dto.agendaId}/times/${formattedDateDate}-${dto.agendaId}`)
      .get();

    if (!doc.exists) {
      await doc.ref.set({
        jorge: "Comeme los pelos",
        id: `${formattedDateDate}-${dto.agendaId}`,
      });

      const dayOfWeek = dto.timestamp.getDay();

      const parent = await admin
        .firestore()
        .doc(`agendas/${dto.agendaId}`)
        .get();

      if (parent.data() !== undefined) {
        console.log(formattedDateDate);
        if (parent.data().intervals[formattedDateDate]) {
          console.log(parent.data().intervals[formattedDateDate]);
        } else {
          console.log(parent.data().intervals[dayOfWeek]);
        }
      }
    }

    res.send({ data: doc.data() });
  }
);
