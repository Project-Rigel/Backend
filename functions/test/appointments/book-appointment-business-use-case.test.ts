import 'reflect-metadata';
import { DayOfWeek } from '../../src/agendas/application/dto/add-schedule-settings.dto';
import { AgendaModel } from '../../src/agendas/domain/models/agenda';
import { Interval } from '../../src/agendas/domain/models/agenda-interval';
import { BookAppointmentFromBusiness } from '../../src/appointments/application/book-appointment-business/book-appointment-from-business';
import { BookAppointmentForBusinessDto } from '../../src/appointments/application/book-appointment-business/dto/book-appointment-for-business.dto';
import { Appointment } from '../../src/appointments/domain/models/appointment';
import { Customer } from '../../src/appointments/domain/models/customer';
import { Product } from '../../src/appointments/domain/models/product';
import { AgendaConfigMother } from '../object-mothers/agenda-config.mother';
import { AgendaObjectMother } from '../object-mothers/agenda.object-mother';
import { AppointmentResponseObjectMother } from '../object-mothers/appointment-response.object-mother';
import { CustomerObjectMother } from '../object-mothers/customer.object-mother';
import { ProductObjectMother } from '../object-mothers/product.object-mother';
import { TestIdGenerator } from '../object-mothers/test-id-generator';
import { TestRepository } from '../stubs/repository.stub';
import moment = require('moment');

describe('booking appointment from business', () => {
  it('should throw an exception when the agenda does not exists', async () => {
    const dto = new BookAppointmentForBusinessDto(
      '1',
      '2020-10-03T08:32:32.237Z',
      '1',
      '1',
      '1',
    );

    const result = new BookAppointmentFromBusiness(
      new TestRepository<AgendaModel>(),
      new TestRepository<Product>(),
      new TestRepository<Customer>(),
      new TestRepository<Appointment>(),
      new TestIdGenerator(),
    ).execute(dto);
    await expect(result).rejects.toThrow('Agenda not found.');
  });

  it('should throw an exception when product doesnot exist', async () => {
    const dto = new BookAppointmentForBusinessDto(
      '1',
      '2020-10-03T08:32:32.237Z',
      '1',
      '1',
      '1',
    );
    const agendaRepo = new TestRepository<AgendaModel>();
    await agendaRepo.create(AgendaObjectMother.RandomAgenda('1', '1', null));

    const result = new BookAppointmentFromBusiness(
      agendaRepo,
      new TestRepository<Product>(),
      new TestRepository<Customer>(),
      new TestRepository<Appointment>(),
      new TestIdGenerator(),
    ).execute(dto);
    await expect(result).rejects.toThrow('Product not found.');
  });

  it('should give a valid appointment when booked inside agenda config', async () => {
    const startDate = moment('2020-10-03T09:00:00.000Z');
    const dto = new BookAppointmentForBusinessDto(
      '1',
      startDate.toISOString(),
      '1',
      '1',
      '1',
    );

    const agendaRepo = new TestRepository<AgendaModel>();
    await agendaRepo.create(
      AgendaObjectMother.RandomAgenda(
        '1',
        '1',
        AgendaConfigMother.RandomConfigWithDayOfWeek(DayOfWeek.Saturday, [
          new Interval('09:00', '12:00'),
        ]),
      ),
    );

    const productRepo = new TestRepository<Product>();
    await productRepo.create(ProductObjectMother.getRandom());

    const customerRepo = new TestRepository<Customer>();
    await customerRepo.create(CustomerObjectMother.getRandom());

    const result = new BookAppointmentFromBusiness(
      agendaRepo,
      productRepo,
      customerRepo,
      new TestRepository<Appointment>(),
      new TestIdGenerator(),
    ).execute(dto);
    await expect(result).resolves.toStrictEqual(
      AppointmentResponseObjectMother.get(startDate.toDate(), 1, '1 1 1', '1'),
    );
  });

  it('should throw an error when booked outside of agenda config', async () => {
    const startDate = moment('2020-10-03T09:00:00.000Z');
    const id = new TestIdGenerator().generate();
    const dto = new BookAppointmentForBusinessDto(
      '1',
      startDate.toISOString(),
      id,
      id,
      id,
    );

    const agendaRepo = new TestRepository<AgendaModel>();
    await agendaRepo.create(
      AgendaObjectMother.RandomAgenda(
        id,
        id,
        AgendaConfigMother.RandomConfigWithDayOfWeek(DayOfWeek.Saturday, [
          new Interval('10:00', '11:00'),
          new Interval('13:00', '14:00'),
        ]),
      ),
    );

    const productRepo = new TestRepository<Product>();
    await productRepo.create(ProductObjectMother.getRandom());

    const customerRepo = new TestRepository<Customer>();
    await customerRepo.create(CustomerObjectMother.getRandom());

    const result = new BookAppointmentFromBusiness(
      agendaRepo,
      productRepo,
      customerRepo,
      new TestRepository<Appointment>(),
      new TestIdGenerator(),
    ).execute(dto);
    await expect(result).rejects.toThrow(
      'the specified date is off the agenda config.',
    );
  });
});
