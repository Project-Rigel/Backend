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

    //only allow to set the config if its the owner.
    if (!ctx.auth.token.isBusinessOwner && dto.businessId === ctx.auth.token.businessId) {
      throw new HttpsError('permission-denied', 'Forbidden');
    }

    try {
      return await new SetAgendaConfigUseCase(new AgendaRepository()).execute(dto);
    } catch (e) {
      throw e;
    }
  });
