import { GetAvailableTimesDto } from '../dtos/get-available-times.dto';
import * as admin from 'firebase-admin';
import { HttpsError } from 'firebase-functions/lib/providers/https';
import { getFormattedDateDMY } from './date';

export const createSortedIntervals = async (parentData: FirebaseFirestore.DocumentData,
                                            intervals: object[],
                                            date: Date,
                                            timesDoc: any) => {
  Object.keys(parentData.intervals[date.toISOString()]).forEach(key => {
    intervals.push({
      day: date.toISOString(),
      dayOfWeek: null,
      from: key,
      to: parentData.intervals[date.toISOString()][key],
    });
  });
  await timesDoc.ref.set({ availableTimes: intervals, appointments: [] }, { merge: true });
};

export const setDocumentAvailableIntervals = async (parentData: FirebaseFirestore.DocumentData,
                                                    dayOfWeek: number, intervals: object[],
                                                    timesDoc: FirebaseFirestore.DocumentSnapshot,
                                                    date: Date, dto: GetAvailableTimesDto) => {
  Object.keys(parentData.intervals[dayOfWeek]).forEach(key => {
    intervals.push({
      day: null,
      dayOfWeek: dayOfWeek,
      from: key,
      to: parentData.intervals[dayOfWeek][key],
    });
  });
  await timesDoc.ref.set({
    id: `${getFormattedDateDMY(date)}-${dto.agendaId}`,
    availableTimes: intervals,
    appointments: [],
  }, { merge: true });
};

export const getAvailableTimesForDayInAgenda = async (dto: GetAvailableTimesDto, date: Date) => {
  const timesDoc = await admin.firestore()
    .doc(`agendas/${dto.agendaId}/times/${getFormattedDateDMY(date)}-${dto.agendaId}`).get();

  let times;

  if (!timesDoc.exists) {
    await createTimesDocument(dto, date, timesDoc);
    times = (await timesDoc.ref.get()).data();
  } else {
    times = timesDoc.data();
  }
  return times;
};

export const createTimesDocument = async (dto: GetAvailableTimesDto, date: Date, timesDoc: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>) => {
  const dayOfWeek = new Date(dto.timestamp).getDay();

  const parent = await admin.firestore()
    .doc(`agendas/${dto.agendaId}`).get();

  let intervals: object[] = [];

  const parentData = parent.data() ?? undefined;

  if (!parentData) {
    throw new HttpsError('internal', 'The doc is not owned by a business.');
  }
  if (parentData.intervals) {
    if (parentData.intervals[date.toISOString()]) {
      await createSortedIntervals(parentData, intervals, date, timesDoc);
    } else if (parentData.intervals[dayOfWeek]) {
      await setDocumentAvailableIntervals(parentData, dayOfWeek, intervals, timesDoc, date, dto);
    } else {
      throw new HttpsError('invalid-argument', 'The agenda you are trying to book in does not have a config for the day you are trying to book. Please contact the business owner to set it up.');
    }
  }
};
