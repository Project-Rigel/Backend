import * as functions from 'firebase-functions';
import { HttpsError } from 'firebase-functions/lib/providers/https';
import { validateDto } from './utils/dto-validator';
import { SetAgendaConfigDto } from './dtos/set-agenda-config.dto';
import { SetAgendaConfigUseCase } from './use-cases/set-agenda-config';
import { AgendaRepository } from './services/agenda.repository';
import { BusinessRepository } from './services/business.repository';

export const setAgendaConfigFunction = functions
  .region('europe-west1')
  .https.onCall(async (data, ctx) => {
    if (!ctx.auth) {
      throw new HttpsError('unauthenticated', 'Unauthorized');
    }

    //validate the dto
    const { dto, errors } = await validateDto<SetAgendaConfigDto>(SetAgendaConfigDto, data);

    if (errors.length > 0) {
      throw new HttpsError('invalid-argument', 'Validation errors', errors.toString());
    }

    return ctx.auth.token;
    // //prueba
    // if (!ctx.auth.token.isTheBoss) {
    //   throw new HttpsError('permission-denied', 'Forbidden');
    // }

    try {
      const result = await new SetAgendaConfigUseCase(
        new AgendaRepository(),
        new BusinessRepository(),
      ).execute(dto);

      return result;
    } catch (e) {
      throw e;
    }
  });
