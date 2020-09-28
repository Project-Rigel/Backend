import * as functions from 'firebase-functions';
import { AppointmentService } from './services/appointments.service';
import { GetAvailableTimesDto } from './dtos/get-available-times.dto';
import { validateDto } from './utils/dto-validator';
import { AvailableIntervalsComputer } from './use-cases/available-intervals-computer';
import { AgendaRepository } from './services/agenda.repository';
import { ProductService } from './services/product.service';
import { HttpsError } from 'firebase-functions/lib/providers/https';
const appointmentService = new AppointmentService();
const agendaService = new AgendaRepository();
const productService = new ProductService();
const useCase = new AvailableIntervalsComputer();

export const getAvailableIntervalsInDayFunction = functions
  .region('europe-west1')
  .https.onCall(async (data, ctx) => {
    if (!ctx.auth) {
      throw new HttpsError('unauthenticated', 'Unauthorized');
    }

    const { errors, dto } = await validateDto<GetAvailableTimesDto>(GetAvailableTimesDto, data);

    if (errors.length > 0) {
      throw new HttpsError('invalid-argument', 'Validation errors', errors.toString());
    }

    const intervals = await agendaService.getAgendaIntervalsForWeekDay(dto.agendaId, dto.timestamp);
    const appointments = await appointmentService.getSortedAppointmentsForDay(
      dto.agendaId,
      dto.timestamp,
    );

    const product = await productService.getProduct(dto.productId);

    if (!product) {
      throw new HttpsError('invalid-argument', 'There is no product associated with that Id.');
    }

    return useCase.invoke(intervals, appointments, product);
  });
