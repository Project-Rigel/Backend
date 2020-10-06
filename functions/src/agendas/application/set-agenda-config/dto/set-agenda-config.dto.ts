import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { DayOfWeek, IntervalDto } from '../../dto/add-schedule-settings.dto';

export class SetAgendaConfigDto {
  constructor(
    agendaId: string,
    businessId: string,
    dayOfWeek: string,
    specificDate: string,
    expirationDate: string,
    intervals: IntervalDto[],
  ) {
    this.agendaId = agendaId;
    this.businessId = businessId;
    this.dayOfWeek = dayOfWeek;
    this.specificDate = specificDate;
    this.expirationDate = expirationDate;
    this.intervals = intervals;
  }

  /*
   * The agendas to apply the config to
   */
  @IsString()
  public readonly agendaId!: string;

  /*
   * The businessId of the user
   */
  @IsString()
  public readonly businessId!: string;

  /**
   * The day of week for specifying intervals. If you specify a day of week you cant use a specific date.
   */
  @IsEnum(DayOfWeek)
  @IsOptional()
  public readonly dayOfWeek?: string;

  /**
   * The date in which the config becomes useless
   */
  @IsDateString()
  @IsOptional()
  public readonly expirationDate?: string;

  /**
   * Specific date for intervals. This field lets you specify a certain date for overwriting the default behaviour.
   */
  @IsDateString()
  @IsOptional()
  public readonly specificDate?: string;

  /**
   * An array of intervals describing the available appointment times.
   */
  @ValidateNested({ each: true })
  @Type(() => IntervalDto)
  public readonly intervals: IntervalDto[];
}
