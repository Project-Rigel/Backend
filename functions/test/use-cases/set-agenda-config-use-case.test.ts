import 'reflect-metadata';
import { SetAgendaConfigUseCase } from '../../src/use-cases/set-agenda-config';
import { TestRepository } from '../stubs/repository.stub';
import { SetAgendaConfigDto } from '../../src/dtos/set-agenda-config.dto';
import { anyString, instance, mock, when } from 'ts-mockito';
import { AgendaObjectMother } from '../object-mothers/agenda.object-mother';

describe('set agenda config use case', () => {
  it('should return an updated agenda with valid config', async () => {
    const dto = new SetAgendaConfigDto('1', '1', 'Monday', null, [
      { startHour: '09:00', endHour: '12:00' },
    ]);

    const mockedRepo = mock(TestRepository);
    when(mockedRepo.findOne(anyString())).thenResolve(AgendaObjectMother.RandomAgenda('1', '2'));

    expect(await new SetAgendaConfigUseCase(instance(mockedRepo)).execute(dto)).toStrictEqual('Ok');
  });
});
