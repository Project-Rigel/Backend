import { IsInt, IsString, Max, Min } from 'class-validator';

export class GetAvailableDaysDto {
  @IsInt()
  @Min(0)
  @Max(11)
  month!: number;

  @IsString()
  agendaId!: string;

  @IsString()
  businessId!: string;

  @IsString()
  productId!: string;
}
