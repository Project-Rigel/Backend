import * as functions from 'firebase-functions';
import { HttpsError } from 'firebase-functions/lib/providers/https';
import { FirestoreAgendaRepository } from '../../agendas/infrastructure/repositories/firestore-agenda.repository';
import { FirestoreIdGenerator } from '../../shared/infraestructure/firestore-id-generator';
import {
  BUSINESS_ID_KEY,
  IS_BUSINESS_OWNER_KEY,
} from '../../shared/jwt-claims';
import { validateDto } from '../../shared/utils/dto-validator';
import { BookAppointmentFromBusiness } from '../application/book-appointment-business/book-appointment-from-business';
import { BookAppointmentForBusinessDto } from '../application/book-appointment-business/dto/book-appointment-for-business.dto';
import { AppointmentFirestoreRepository } from './appointment-firestore.repository';
import { CustomerFirestoreRepository } from './customer-firestore.repository';
import { ProductFirestoreRepository } from './product-firestore.repository';

export const bookAppointmentForBusinessFunction = functions
  .region('europe-west1')
  .https.onCall(async (data, ctx) => {
    if (!ctx.auth) {
      throw new HttpsError('unauthenticated', 'Unauthorized');
    }

    const { dto, errors } = await validateDto<BookAppointmentForBusinessDto>(
      BookAppointmentForBusinessDto,
      data,
    );

    if (errors.length > 0) {
      throw new HttpsError(
        'invalid-argument',
        'Validation errors',
        errors.toString(),
      );
    }

    console.log(ctx.auth.token);
    if (
      !ctx.auth.token[IS_BUSINESS_OWNER_KEY] ||
      ctx.auth.token[BUSINESS_ID_KEY] !== dto.businessId
    ) {
      throw new HttpsError(
        'permission-denied',
        'Only business owners can boook an appointment using this method.',
      );
    }

    try {
      const bookedAppointment = await new BookAppointmentFromBusiness(
        new FirestoreAgendaRepository(),
        new ProductFirestoreRepository(),
        new CustomerFirestoreRepository(),
        new AppointmentFirestoreRepository(),
        new FirestoreIdGenerator(),
      ).execute(dto);
      return { appointment: bookedAppointment };
    } catch (error) {
      throw new HttpsError('internal', error.message);
    }
  });
