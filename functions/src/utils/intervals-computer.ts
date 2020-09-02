import { AvailableInterval } from '../models/available-interval';
import { AppointmentInterval } from '../models/appointment-interval';

export function computeIntervals(
  availableIntervals: AvailableInterval[],
  sortedAppointments: AppointmentInterval[],
  response: { from: string; to: string }[],
) {
  let appointmentIndex = 0;

  if (sortedAppointments.length <= 0) {
    addDefaultIntervals(availableIntervals, response);
  } else {
    for (let i = 0; i < availableIntervals.length; i++) {
      for (let j = appointmentIndex; j < sortedAppointments.length; j++) {
        const appointmentIsGreaterThanThisInterval =
          sortedAppointments[j].to > availableIntervals[i].to;
        const appointmentStartsInNextInterval =
          sortedAppointments[j].from > availableIntervals[i].to;

        if (
          availableIntervals.length > sortedAppointments.length &&
          sortedAppointments[j].to < availableIntervals[i].from
        ) {
          response.push({
            from: availableIntervals[i].from.utc().format('HH:mm'),
            to: availableIntervals[i].to.utc().format('HH:mm'),
          });
          break;
        }

        if (appointmentStartsInNextInterval || appointmentIsGreaterThanThisInterval) {
          appointmentIndex = j;
          break;
        }

        //si es el primer evento en este intervalo
        if (j === appointmentIndex) {
          //si hay margen desde el principio del intervalo hasta el principio del evento lo añadimos
          const diff = sortedAppointments[j].from
            .utc()
            .diff(availableIntervals[i].from.utc(), 'minutes');
          if (!(diff <= 0)) {
            response.push({
              from: availableIntervals[i].from.utc().format('HH:mm'),
              to: sortedAppointments[j].from.utc().format('HH:mm'),
            });

            // si es el final de las citas comprobamos si sobra tiempo al final.
            const diff = availableIntervals[i].to
              .utc()
              .diff(sortedAppointments[j].to.utc(), 'minutes');
            if (j === sortedAppointments.length - 1 && diff > 0) {
              response.push({
                from: sortedAppointments[j].to.utc().format('HH:mm'),
                to: availableIntervals[i].to.utc().format('HH:mm'),
              });
            }
          }
          // else if (sortedAppointments.length === 1) {
          //   response.push({
          //     from: sortedAppointments[j].to.utc().format('HH:mm'),
          //     to: availableIntervals[i].to.utc().format('HH:mm'),
          //   });
          // }
          //si no es el primer evento.
        } else {
          // //miramos hacia delante y comprobamos que no nos salgamos del array ni del intervalo.
          // if (j + 1 < ordered.length && ordered[j + 1].from > availableTimes[i].to){
          //     response.push({from: ordered[j].to, to: availableTimes[i].to})
          // }//si estamos en el ultimo hay margen hasta el final del intervalo lo añadimos.
          // else
          if (
            j === sortedAppointments.length - 1 &&
            availableIntervals[i].to.utc().diff(sortedAppointments[j].to.utc(), 'minutes') > 0
          ) {
            response.push({
              from: sortedAppointments[j].to.utc().format('HH:mm'),
              to: availableIntervals[i].to.utc().format('HH:mm'),
            });
          } else if (
            j + 1 < sortedAppointments.length &&
            sortedAppointments[j + 1].from.utc() < availableIntervals[i].to.utc()
          ) {
            response.push({
              from: sortedAppointments[j].to.utc().format('HH:mm'),
              to: sortedAppointments[j + 1].from.utc().format('HH:mm'),
            });
          }
        }
      }
    }
  }
}

function addDefaultIntervals(
  availableIntervals: AvailableInterval[],
  response: { from: string; to: string }[],
) {
  for (let i = 0; i < availableIntervals.length; i++) {
    response.push({
      from: availableIntervals[i].from.utc().format('HH:mm'),
      to: availableIntervals[i].to.utc().format('HH:mm'),
    });
  }
}
