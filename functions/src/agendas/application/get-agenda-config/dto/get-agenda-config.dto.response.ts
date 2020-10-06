import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Interval } from '../../../domain/models/agenda-interval';
import { DayOfWeek, IntervalDto } from '../../dto/add-schedule-settings.dto';

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
