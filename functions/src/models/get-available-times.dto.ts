import { IsDateString, IsOptional, IsString } from 'class-validator';

export class GetAvailableTimesDto {
  @IsString()
  businessId!: string;

  @IsString()
  agendaId!: string;
  @IsString()
  @IsOptional()
  productId?: string;

  @IsDateString()
  timestamp!: string;
}
