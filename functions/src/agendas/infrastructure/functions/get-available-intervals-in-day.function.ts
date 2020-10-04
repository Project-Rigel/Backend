import * as functions from 'firebase-functions';
import { HttpsError } from 'firebase-functions/lib/providers/https';
import { AvailableIntervalsComputer } from '../../../appointments/application/available-intervals-computer';
import { AppointmentService } from '../../../appointments/infrastructure/appointments.service';
import { ProductService } from '../../../appointments/infrastructure/product.service';
import { validateDto } from '../../../shared/utils/dto-validator';
import { GetAvailableTimesDto } from '../../application/dto/get-available-times.dto';
import { FirestoreAgendaRepository } from '../repositories/firestore-agenda.repository';

const appointmentService = new AppointmentService();
const agendaService = new FirestoreAgendaRepository();
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
