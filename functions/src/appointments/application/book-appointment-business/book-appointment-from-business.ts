import { HttpsError } from 'firebase-functions/lib/providers/https';
import * as moment from 'moment';
import { AgendaModel } from '../../../agendas/domain/models/agenda';
import { Repository } from '../../../shared/repository';
import { IdGenerator } from '../../../shared/uid-generator';
import { Appointment } from '../../domain/models/appointment';
import { Customer } from '../../domain/models/customer';
import { Product } from '../../domain/models/product';
import { AppointmentResponse } from '../dto/appointment.response';
import { BookAppointmentForBusinessDto } from './dto/book-appointment-for-business.dto';

export class BookAppointmentFromBusiness {
  constructor(
    private readonly agendaRepository: Repository<AgendaModel>,
    public readonly productRepository: Repository<Product>,
    public readonly customerRepository: Repository<Customer>,
    public readonly appointmentRepository: Repository<Appointment>,
    public readonly idGenerator: IdGenerator,
  ) {}

  public async execute(
    dto: BookAppointmentForBusinessDto,
  ): Promise<AppointmentResponse> {
    const agenda = await this.agendaRepository.findOne(dto.agendaId);

    if (!agenda) {
      throw new HttpsError('not-found', 'Agenda not found.');
    }

    const product = await this.productRepository.findOne(dto.productId);

    if (!product) {
      throw new HttpsError('not-found', 'Product not found.');
    }

    const customer = await this.customerRepository.findOne(dto.customerId);

    if (!customer) {
      throw new HttpsError('not-found', 'Customer not found.');
    }

    const startDateAppointment = moment(dto.startDate);
    const endDateAppointment = moment(dto.startDate).add(
      product.duration,
      'minutes',
    );
    const isValid = agenda.isDateIntervalInsideConfig(
      startDateAppointment.toDate(),
      endDateAppointment.toDate(),
    );

    if (!isValid) {
      throw new HttpsError(
        'invalid-argument',
        'the specified date is off the agenda config.',
      );
    }

    const appointment = new Appointment(
      startDateAppointment,
      endDateAppointment,
      product.name,
      customer.id,
      customer.fullName,
      this.idGenerator.generate(),
      product.duration,
      dto.agendaId,
    );
    await this.appointmentRepository.create(appointment);

    return AppointmentResponse.fromAppointment(appointment);
  }
}
