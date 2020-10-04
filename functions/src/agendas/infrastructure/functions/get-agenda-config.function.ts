import * as functions from 'firebase-functions';
import { HttpsError } from 'firebase-functions/lib/providers/https';
import { validateDto } from '../../../shared/utils/dto-validator';
import { GetAgendaConfigDto } from '../../application/get-agenda-config/dto/get-agenda-config.dto';
import { GetAgendaConfigUseCase } from '../../application/get-agenda-config/get-agenda-config';
import { FirestoreAgendaRepository } from '../repositories/firestore-agenda.repository';

export const GetAgendaConfigFunction = functions
  .region('europe-west1')
  .https.onCall(async (data, ctx) => {
    if (!ctx.auth) {
      throw new HttpsError('unauthenticated', 'Unauthorized');
    }

    //validate the dto
    const { dto, errors } = await validateDto<GetAgendaConfigDto>(GetAgendaConfigDto, data);

    if (errors.length > 0) {
      throw new HttpsError('invalid-argument', 'Validation errors', errors.toString());
    }

    try {
      return await new GetAgendaConfigUseCase(new FirestoreAgendaRepository()).execute(dto);
    } catch (e) {
      throw e;
    }
  });
