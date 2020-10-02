import { DayOfWeek, IntervalDto } from '../../dto/add-schedule-settings.dto';
import { Interval } from '../../../domain/models/agenda-interval';
import { IsDateString, IsEnum, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class GetAgendaConfigResponse {
  constructor(
    expirationDate: string,
    specificDate: string,
    dayOfWeek: DayOfWeek,
    intervals: Interval[] = null,
  ) {
    this.expirationDate = expirationDate;
    this.specificDate = specificDate;
    this.dayOfWeek = dayOfWeek;
    this.intervals = intervals;
  }

  @IsDateString()
  @IsString()
  expirationDate!: string;


  @IsDateString()
  @IsString()
  specificDate!: string;

  @IsEnum(DayOfWeek)
  dayOfWeek!: DayOfWeek;

  @ValidateNested({ each: true })
  @Type(() => IntervalDto)
  intervals: Interval[];


}
