import { IsBoolean, IsDateString, IsString } from 'class-validator';

export class BookAppointmentForBusinessDto {
  @IsBoolean()
  public readonly sendSMS: boolean;

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
    sendSMS: boolean,
    businessId: string,
    startDate: string,
    customerId: string,
    productId: string,
    agendaId: string,
  ) {
    this.sendSMS = sendSMS;
    this.businessId = businessId;
    this.startDate = startDate;
    this.customerId = customerId;
    this.productId = productId;
    this.agendaId = agendaId;
  }
}
