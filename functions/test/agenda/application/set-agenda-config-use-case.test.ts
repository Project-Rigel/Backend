import 'reflect-metadata';
import { SetAgendaConfigUseCase } from '../../../src/agendas/application/set-agenda-config/set-agenda-config';
import { TestRepository } from '../../stubs/repository.stub';
import { SetAgendaConfigDto } from '../../../src/agendas/application/set-agenda-config/dto/set-agenda-config.dto';
import { anyString, instance, mock, when } from 'ts-mockito';
import { AgendaObjectMother } from '../../object-mothers/agenda.object-mother';
import { AgendaConfig } from '../../../src/agendas/domain/models/agenda-config';
import { DayOfWeek } from '../../../src/agendas/application/dto/add-schedule-settings.dto';
import { HttpsError } from 'firebase-functions/lib/providers/https';
import moment = require('moment');
import { DateFactory } from '../../../src/shared/date.factory';
import { Interval } from '../../../src/agendas/domain/models/agenda-interval';
import { SetAgendaConfigResponse } from '../../../src/agendas/application/set-agenda-config/dto/set-agenda-config.dto.response';

describe('set agendas config use case', () => {
  it('should return an updated agendas with valid config', async () => {
    const dto = new SetAgendaConfigDto('1', '1', 'Monday', null, '2020-10-07T21:00:00.000Z', [
      new Interval('09:00', '12:00'),
    ]);

    const mockedRepo = mock(TestRepository);
    when(mockedRepo.findOne(anyString())).thenResolve(
      AgendaObjectMother.RandomAgenda('1', '2', null),
    );

    const date = new Date();
    const mockedTimeFactory = mock(DateFactory);
    when(mockedTimeFactory.now()).thenReturn(date);

    expect(
      await new SetAgendaConfigUseCase(instance(mockedRepo), instance(mockedTimeFactory)).execute(
        dto,
      ),
    ).toStrictEqual(
      new SetAgendaConfigResponse('1','2',
        [new AgendaConfig(moment(date).add('2', 'months').toDate(), null, DayOfWeek.Monday, [new Interval('09:00', '12:00')])]))
  });

  it('should throw an exception if the agendas does not exist', async () => {
    const dto = new SetAgendaConfigDto('1', '1', 'Monday', null, '2020-10-07T21:00:00.000Z', [
      { startHour: '09:00', endHour: '12:00' },
    ]);

    await expect(
      new SetAgendaConfigUseCase(new TestRepository(), instance(mock(DateFactory))).execute(dto),
    ).rejects.toThrow(HttpsError);
  });

  it('should throw an exception if both specificDate and dayOfWeek are present', async () => {
    const dto = new SetAgendaConfigDto(
      '1',
      '1',
      'Monday',
      '2020-08-07T21:00:00.000Z',
      '2020-10-07T21:00:00.000Z',
      [{ startHour: '09:00', endHour: '12:00' }],
    );

    await expect(
      new SetAgendaConfigUseCase(new TestRepository(), instance(mock(DateFactory))).execute(dto),
    ).rejects.toThrow(HttpsError);
  });
});
