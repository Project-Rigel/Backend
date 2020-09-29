import 'reflect-metadata';
import { SetAgendaConfigUseCase } from '../../../src/agendas/application/set-agenda-config';
import { TestRepository } from '../../stubs/repository.stub';
import { SetAgendaConfigDto } from '../../../src/agendas/application/dto/set-agenda-config.dto';
import { anyString, instance, mock, when } from 'ts-mockito';
import { AgendaObjectMother } from '../../object-mothers/agenda.object-mother';
import { AgendaDto } from '../../../src/agendas/application/dto/agenda.dto';
import { AgendaConfig } from '../../../src/agendas/domain/models/agenda-config';
import { DayOfWeek } from '../../../src/agendas/application/dto/add-schedule-settings.dto';
import { HttpsError } from 'firebase-functions/lib/providers/https';

describe('set agendas config use case', () => {
  it('should return an updated agendas with valid config', async () => {
    const dto = new SetAgendaConfigDto('1', '1', 'Monday', null, [
      { startHour: '09:00', endHour: '12:00' },
    ]);

    const mockedRepo = mock(TestRepository);
    when(mockedRepo.findOne(anyString())).thenResolve(
      AgendaObjectMother.RandomAgenda('1', '2', null),
    );

    expect(await new SetAgendaConfigUseCase(instance(mockedRepo)).execute(dto)).toStrictEqual(
      new AgendaDto(
        '1',
        '2',
        new AgendaConfig(null, null, DayOfWeek.Monday, [{ startHour: '09:00', endHour: '12:00' }]),
      ),
    );
  });

  it('should throw an exception if the agendas does not exist', async () => {
    const dto = new SetAgendaConfigDto('1', '1', 'Monday', null, [
      { startHour: '09:00', endHour: '12:00' },
    ]);

    await expect(new SetAgendaConfigUseCase(new TestRepository()).execute(dto)).rejects.toThrow(
      HttpsError,
    );
  });

  it('should throw an exception if specificDate and dayOfWeek are present', async () => {
    const dto = new SetAgendaConfigDto('1', '1', 'Monday', '2020-08-07T21:00:00.000Z', [
      { startHour: '09:00', endHour: '12:00' },
    ]);

    await expect(new SetAgendaConfigUseCase(new TestRepository()).execute(dto)).rejects.toThrow(
      HttpsError,
    );
  });
});
