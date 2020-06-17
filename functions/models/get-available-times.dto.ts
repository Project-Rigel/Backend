import { IsDate, IsDateString, IsString } from 'class-validator';

export class GetAvailableTimesDto {
  @IsString()
  businessId!: string;

  @IsString()
  agendaId!: string;
  @IsString()
  productId!: string;

  @IsDateString()
  timestamp!: string;
}
