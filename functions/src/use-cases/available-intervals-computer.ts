import { AgendaIntervalSetting } from '../models/agenda-interval-setting';
import { Appointment } from '../models/appointment';
import { Product } from '../models/product';
import { Moment } from 'moment';
import moment = require('moment');
import { IntervalDto } from '../dtos/interval.dto';

export class AvailableIntervalsComputer {
  public invoke(intervals: AgendaIntervalSetting[], appointments: Appointment[], product: Product) {
    //1. compound intervals with its corresponding sorted appointment
    const intervalsWithAppointments = AvailableIntervalsComputer.createIntervalsWithAppointments(
      intervals,
      appointments,
    );

    const resultingIntervals = [];

    for (let i = 0; i < intervalsWithAppointments.length; i++) {
      resultingIntervals.push(
        ...AvailableIntervalsComputer.calculateResultingIntervals(
          intervalsWithAppointments[i],
          product,
        ),
      );
    }

    return resultingIntervals;
  }

  private static calculateResultingIntervals(
    intervalWithAppointment: IntervalWithAppointments,
    product: Product,
  ) {
    const computedIntervals = [];

    for (let i = 0; i < intervalWithAppointment.appointments.length; i++) {
      const appointment = intervalWithAppointment.appointments[i];

      if (i === 0) {
        //if is the first appointment in interval
        computedIntervals.push(
          ...AvailableIntervalsComputer.computeIntervalsBeforeFirstAppointment(
            intervalWithAppointment,
            appointment,
            product,
          ),
        );

        const diff = intervalWithAppointment.to.diff(appointment.endDate, 'minutes');
        if (intervalWithAppointment.appointments.length === 1 && diff >= product.duration) {
          computedIntervals.push(
            ...AvailableIntervalsComputer.computeIntervalsUntilEndOfInterval(
              appointment,
              intervalWithAppointment,
              product,
            ),
          );
        }
      } else if (i === intervalWithAppointment.appointments.length - 1) {
        // is the last one
        computedIntervals.push(
          ...AvailableIntervalsComputer.computeIntervalsForEndAppointment(
            intervalWithAppointment,
            intervalWithAppointment.appointments[i - 1],
            appointment,
            product,
          ),
        );
      } else {
        //its in the middle
        computedIntervals.push(
          ...AvailableIntervalsComputer.computeIntervalsForMiddleAppointments(
            appointment,
            intervalWithAppointment.appointments[i - 1],
            intervalWithAppointment.appointments[i + 1],
            product,
          ),
        );
      }
    }

    if (intervalWithAppointment.appointments.length === 0) {
      computedIntervals.push(
        ...AvailableIntervalsComputer.addIntervalsWhenNoAppointments(
          intervalWithAppointment,
          product,
        ),
      );
    }
    return computedIntervals;
  }

  private static createIntervalsWithAppointments(
    intervals: AgendaIntervalSetting[],
    appointments: Appointment[],
  ): IntervalWithAppointments[] {
    const intervalsWithAppointments = [];

    intervals.sort((a, b) => {
      if (a.from.utc() < b.from.utc()) {
        return -1;
      }
      if (a.from.utc() > b.from.utc()) {
        return 1;
      }
      return 0;
    });

    for (let i = 0; i < intervals.length; i++) {
      const intervalWithAppointment: IntervalWithAppointments = {
        from: intervals[i].from.utc(),
        to: intervals[i].to.utc(),
        appointments: [],
      };

      for (let j = 0; j < appointments.length; j++) {
        if (AvailableIntervalsComputer.isAppointmentInsideInterval(appointments[j], intervals[i])) {
          intervalWithAppointment.appointments.push(appointments[j]);
        }
      }

      intervalsWithAppointments.push(intervalWithAppointment);
    }
    return intervalsWithAppointments;
  }

  private static isAppointmentInsideInterval(
    appointment: Appointment,
    interval: AgendaIntervalSetting,
  ) {
    return (
      appointment.startDate.utc() >= interval.from.utc() &&
      appointment.endDate.utc() <= interval.to.utc()
    );
  }

  private static computeIntervalsBeforeFirstAppointment(
    intervalWithAppointments: IntervalWithAppointments,
    appointment: Appointment,
    product: Product,
  ) {
    return AvailableIntervalsComputer.computeIntervalsBetweenMomentsWithProducDuration(
      intervalWithAppointments.from,
      appointment.startDate,
      product.duration,
    );
  }

  private static computeIntervalsForMiddleAppointments(
    appointment: Appointment,
    previousAppointment: Appointment,
    nextAppointment: Appointment,
    product: Product,
  ) {
    return AvailableIntervalsComputer.computeIntervalsBetweenMomentsWithProducDuration(
      previousAppointment.endDate,
      appointment.startDate,
      product.duration,
      nextAppointment.startDate,
    );
  }

  private static computeIntervalsForEndAppointment(
    intervalWithAppointments: IntervalWithAppointments,
    previousAppointment: Appointment,
    appointment: Appointment,
    product: Product,
  ) {
    const computedIntervals: IntervalDto[] = [];

    computedIntervals.push(
      ...AvailableIntervalsComputer.computeIntervalsBetweenMomentsWithProducDuration(
        previousAppointment.endDate,
        appointment.startDate,
        product.duration,
        null,
        false,
      ),
    );

    if (intervalWithAppointments.to > appointment.endDate) {
      computedIntervals.push(
        ...AvailableIntervalsComputer.computeIntervalsBetweenMomentsWithProducDuration(
          appointment.endDate,
          intervalWithAppointments.to,
          product.duration,
        ),
      );
    }

    return computedIntervals;
  }

  private static addIntervalsWhenNoAppointments(
    intervalWithAppointments: IntervalWithAppointments,
    product: Product,
  ) {
    return AvailableIntervalsComputer.computeIntervalsBetweenMomentsWithProducDuration(
      intervalWithAppointments.from,
      intervalWithAppointments.to,
      product.duration,
    );
  }

  private static computeIntervalsUntilEndOfInterval(
    appointment: Appointment,
    intervalWithAppointments: IntervalWithAppointments,
    product: Product,
  ) {
    return AvailableIntervalsComputer.computeIntervalsBetweenMomentsWithProducDuration(
      appointment.endDate,
      intervalWithAppointments.to,
      product.duration,
    );
  }

  private static computeIntervalsBetweenMomentsWithProducDuration(
    startMoment: Moment,
    endMoment: Moment,
    duration: number,
    nextMoment: Moment = null,
    shouldAddAtEnd = true,
  ) {
    const computedIntervals: IntervalDto[] = [];

    let nextMomentFrom = moment(startMoment.utc());
    let nextMomentTo = moment(startMoment.utc()).add(duration, 'minutes').utc();

    while (
      nextMomentTo.utc() < endMoment.utc() && nextMoment
        ? nextMoment.utc().diff(nextMomentTo.utc(), 'minutes') >= duration
        : endMoment.utc().diff(nextMomentTo.utc(), 'minutes') >= duration
    ) {
      computedIntervals.push({
        from: nextMomentFrom.utc().toISOString(),
        to: nextMomentTo.utc().toISOString(),
      });

      nextMomentFrom = moment(nextMomentTo).utc();
      nextMomentTo = moment(nextMomentTo).utc().add(duration, 'minutes');
    }

    if (shouldAddAtEnd && endMoment.utc().diff(startMoment.utc(), 'minutes') > 0) {
      computedIntervals.push({
        from: nextMomentFrom.utc().toISOString(),
        to: nextMomentTo.utc().toISOString(),
      });
    }

    return computedIntervals;
  }
}

interface IntervalWithAppointments {
  from: Moment;
  to: Moment;
  appointments: Appointment[];
}
