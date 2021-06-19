import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class GetAppointmentDto {
  @IsString()
  uid!: string;

  @IsString()
  businessId!: string;
  @IsString()
  productId!: string;

  @IsDate()
  @Type(() => Date)
  timestamp!: Date;

  @IsOptional()
  @IsString()
  agendaId?: string;
}
