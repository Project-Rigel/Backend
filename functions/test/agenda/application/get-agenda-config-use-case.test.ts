import 'reflect-metadata';
import { TestRepository } from '../../stubs/repository.stub';
import { anyString, instance, mock, when } from 'ts-mockito';
import { AgendaObjectMother } from '../../object-mothers/agenda.object-mother';
import { GetAgendaConfigDto } from '../../../src/agendas/application/get-agenda-config/dto/get-agenda-config.dto';
import { GetAgendaConfigUseCase } from '../../../src/agendas/application/get-agenda-config/get-agenda-config';
import { AgendaConfigMother } from '../../object-mothers/agenda-config.mother';

describe('get agenda config use case', () => {
  it('should return no config when the agenda has none', async () => {
    const dto = new GetAgendaConfigDto('1', '1', true);

    const mockedRepo = mock(TestRepository);
    when(mockedRepo.findOne(anyString())).thenResolve(
      AgendaObjectMother.RandomAgenda('1', '2', []),
    );

    const result = await new GetAgendaConfigUseCase(instance(mockedRepo)).execute(dto);
    expect(result).toStrictEqual([]);
  });

  it('should return a correct config when the agenda has one', async () => {
    const dto = new GetAgendaConfigDto('1', '1', true);

    const mockedRepo = mock(TestRepository);
    when(mockedRepo.findOne(anyString())).thenResolve(
      AgendaObjectMother.RandomAgenda('1', '2', AgendaConfigMother.RandomConfigWithDayOfWeek()),
    );

    const result = await new GetAgendaConfigUseCase(instance(mockedRepo)).execute(dto);
    expect(result).toStrictEqual(AgendaConfigMother.RandomConfigWithDayOfWeek());
  });
});
