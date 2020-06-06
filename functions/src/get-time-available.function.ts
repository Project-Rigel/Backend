import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {GetAvailableTimesDto} from "../models/get-available-times.dto";
import * as moment from "moment";
import {AppointmentInterval} from "../models/appointment-interval";
import {appointmentComparer} from "./utils/intervals-sorting";
import {AvailableInterval} from "../models/available-interval";
import {validateDto} from "./utils/dto-validator";

export const getTimeAvailableFunction = functions.https.onRequest(async (req, res) => {

    const {errors, dto} = await validateDto<GetAvailableTimesDto>(GetAvailableTimesDto,req.body)

    if (errors.length > 0) {
        res.status(400).send({errors: errors});
    }
    
    const formattedDateDate = `${dto.timestamp.getDate()}_${dto.timestamp.getMonth()}_${dto.timestamp.getFullYear()}`

    //1. Read if the avaliable time is created;
    const timesDoc = await admin.firestore()
        .doc(`agendas/${dto.agendaId}/times/${formattedDateDate}-${dto.agendaId}`).get();

    if (!timesDoc.exists) {
        await timesDoc.ref.set({jorge: "Comeme los pelos", id: `${formattedDateDate}-${dto.agendaId}`});

        const dayOfWeek = dto.timestamp.getDay();

        const parent = await admin.firestore()
            .doc(`agendas/${dto.agendaId}`).get();

        let intervals: object[] = [];

        const parentData = parent.data() ?? {};

        if (parentData && parentData.intervals) {
            if (parentData.intervals[formattedDateDate]) {
                Object.keys(parentData.intervals[formattedDateDate]).forEach(key => {
                    intervals.push({
                        day: formattedDateDate,
                        dayOfWeek: null,
                        from: key,
                        to: parentData.intervals[formattedDateDate][key]
                    })
                });
                await timesDoc.ref.set({availableTimes: intervals}, {merge: true});
            } else if (parentData.intervals[dayOfWeek]) {
                console.log(parentData.intervals)
                Object.keys(parentData.intervals[dayOfWeek]).forEach(key => {
                    intervals.push({
                        day: null,
                        dayOfWeek: dayOfWeek,
                        from: key,
                        to: parentData.intervals[dayOfWeek][key]
                    })
                });
                await timesDoc.ref.set({availableTimes: intervals}, {merge: true});
            } else {
                res.send({intervals});
                return;
            }
        } else {
            res.send({intervals});
            return;
        }


    }

    //get the diff between the fiest hour of intervals and the first hour of the appointment
    //if diff > 0  get the first hour of interval and first hour of appoointment, advance to the end of appointment and repeat with the next appointment
    //they are ordered.

    const times = timesDoc.data() ?? res.status(500).send(new Error("times doc is missing."));

    const appointments = times.appointments;
    if (appointments) {
        let sortedAppointments: AppointmentInterval[] = [];
        Object.keys(appointments).sort().forEach(elem => {
            sortedAppointments.push({from: moment(elem, "HH:mm"), to: moment(appointments[elem], "HH:mm")});
        });

        //TODO convert hours to moment for all arrays
        const availableIntervals = times.availableTimes.map((val:AvailableInterval) => {
            return {
                dayOfWeek: val.dayOfWeek,
                day: val.day,
                from: moment(val.from, "HH:mm"),
                to: moment(val.to, "HH:mm"),
            }
        }).sort(appointmentComparer);

        let appointmentIndex = 0;
        const response = [];
        for (let i = 0; i < availableIntervals.length; i++) {
            for (let j = appointmentIndex; j < sortedAppointments.length; j++) {

                //si es mayor que el intervalo de apertura pasar al siguiente intervalo
                if (sortedAppointments[j].to > availableIntervals[i].to || sortedAppointments[j].from > availableIntervals[i].to) {
                    appointmentIndex = j;
                    break;
                }

                //si es el primer evento en este intervalo
                if (j === appointmentIndex) {

                    //si hay margen desde el principio del intervalo hasta el principio del evento lo añadimos
                    const diff = sortedAppointments[j].from.diff(availableIntervals[i].from, "minutes");
                    if (!(diff <= 0)) {
                        response.push({from: availableIntervals[i].from, to: sortedAppointments[j].from})

                        // si es el final de las citas comprobamos si sobra tiempo al final.
                        const diff = availableIntervals[i].to.diff(sortedAppointments[j].to, "minutes");
                        if (j === sortedAppointments.length - 1 && diff >= 0) {
                            response.push({from: sortedAppointments[j].to, to: availableIntervals[i].to})
                        }
                    }
                    //si no es el primer evento.
                } else {
                    // //miramos hacia delante y comprobamos que no nos salgamos del array ni del intervalo.
                    // if (j + 1 < ordered.length && ordered[j + 1].from > availableTimes[i].to){
                    //     response.push({from: ordered[j].to, to: availableTimes[i].to})
                    // }//si estamos en el ultimo hay margen hasta el final del intervalo lo añadimos.
                    // else
                    if (j === sortedAppointments.length - 1 && availableIntervals[i].to.diff(sortedAppointments[j].to, "minutes") > 0) {
                        response.push({from: sortedAppointments[j].to, to: availableIntervals[i].to})
                    } else if (j + 1 < sortedAppointments.length && sortedAppointments[j + 1].from < availableIntervals[i].to) {
                        response.push({from: sortedAppointments[j].to, to: sortedAppointments[j + 1].from})
                    }
                }


            }
        }


        res.send({intervals: response});
        return;
    }


    res.send({intervals: times});
});

