import { GetAvailableTimesDto } from '../../agendas/application/dto/get-available-times.dto';
import * as admin from 'firebase-admin';
import { HttpsError } from 'firebase-functions/lib/providers/https';
import { getFormattedDateDMY } from './date';

export const createTimesDocWithDateAvaliableInterval = async (
  parentData: FirebaseFirestore.DocumentData,
  intervals: object[],
  date: Date,
  timesDoc: any,
  dto: GetAvailableTimesDto,
) => {
  Object.keys(parentData.intervals[date.toISOString()]).forEach((key) => {
    intervals.push({
      day: date.toISOString(),
      dayOfWeek: null,
      from: key,
      to: parentData.intervals[date.toISOString()][key],
    });
  });
  await timesDoc.ref.set(
    {
      id: `${getFormattedDateDMY(date)}-${dto.agendaId}`,
      availableTimes: intervals,
      appointments: [],
    },
    { merge: true },
  );
};

export const createTimesDocWithDayOfWeekAvaliableInterval = async (
  parentData: FirebaseFirestore.DocumentData,
  dayOfWeek: number,
  intervals: object[],
  timesDoc: FirebaseFirestore.DocumentSnapshot,
  date: Date,
  dto: GetAvailableTimesDto,
) => {
  Object.keys(parentData.intervals[dayOfWeek]).forEach((key) => {
    intervals.push({
      day: null,
      dayOfWeek: dayOfWeek,
      from: key,
      to: parentData.intervals[dayOfWeek][key],
    });
  });
  await timesDoc.ref.set(
    {
      id: `${getFormattedDateDMY(date)}-${dto.agendaId}`,
      availableTimes: intervals,
      appointments: [],
    },
    { merge: true },
  );
};

export const getAvailableTimesForDayInAgenda = async (dto: GetAvailableTimesDto, date: Date) => {
  //get the document that holds the available times for that day. This document holds the available times given by the config of the agendas and the confirmed appointments.
  const timesDoc = await admin
    .firestore()
    .doc(`agendas/${dto.agendaId}/times/${getFormattedDateDMY(date)}-${dto.agendaId}`)
    .get();

  let agendaDoc = await admin.firestore().doc(`agendas/${dto.agendaId}`).get();
  const timesData = agendaDoc.data() ?? {};

  const intervals: any[] = [];

  Object.keys(agendaDoc.data().intervals).forEach((key) => {
    if (key === dto.timestamp) {
      intervals.push({
        day: dto.timestamp,
        dayOfWeek: null,
        from: timesData.intervals[key],
        to: null,
      });
    } else if (new Date(dto.timestamp).getDay().toString() === key) {
      Object.keys(timesData.intervals[key]).forEach((intervalKey) => {
        intervals.push({
          day: null,
          dayOfWeek: new Date(dto.timestamp).getDay(),
          from: intervalKey,
          to: timesData.intervals[key][intervalKey],
        });
      });
    }
  });

  if (!timesDoc.exists) {
    await createTimesDocument(dto, date, timesDoc);
  }

  return {
    availableTimes: intervals,
    appointments: timesDoc.data().appointments,
    id: timesDoc.data().id,
  };
};

export const createTimesDocument = async (
  dto: GetAvailableTimesDto,
  date: Date,
  timesDoc: FirebaseFirestore.DocumentSnapshot,
) => {
  const dayOfWeek = new Date(dto.timestamp).getDay();

  const parent = await admin.firestore().doc(`agendas/${dto.agendaId}`).get();

  let intervals: object[] = [];

  const parentData = parent.data() ?? undefined;

  if (!parentData) {
    throw new HttpsError('internal', 'The doc is not owned by a business.');
  }

  if (parentData.intervals) {
    //the interval can be a specific date or a day of week. We need to normalize the date because we store the key as ISO string.
    const normalizedDate = date.setHours(0, 0, 0, 0);
    if (parentData.intervals[normalizedDate]) {
      await createTimesDocWithDateAvaliableInterval(parentData, intervals, date, timesDoc, dto);
    } else if (parentData.intervals[dayOfWeek]) {
      await createTimesDocWithDayOfWeekAvaliableInterval(
        parentData,
        dayOfWeek,
        intervals,
        timesDoc,
        date,
        dto,
      );
    } else {
      throw new HttpsError(
        'invalid-argument',
        'The agendas you are trying to book in does not have a config for the day you are trying to book. Please contact the business owner to set it up.',
      );
    }
  }
};
