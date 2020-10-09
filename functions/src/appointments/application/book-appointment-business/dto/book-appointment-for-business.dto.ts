import { IsDateString, IsString } from 'class-validator';

export class BookAppointmentForBusinessDto {
  @IsString()
  public readonly businessId: string;

  @IsDateString()
  public readonly startDate: string;

  @IsString()
  public readonly customerId: string;

  @IsString()
  public readonly productId: string;

  @IsString()
  public readonly agendaId: string;

  constructor(
    businessId: string,
    startDate: string,
    customerId: string,
    productId: string,
    agendaId: string,
  ) {
    this.businessId = businessId;
    this.startDate = startDate;
    this.customerId = customerId;
    this.productId = productId;
    this.agendaId = agendaId;
  }
}
