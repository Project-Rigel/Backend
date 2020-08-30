import { IsDateString, IsEnum, IsOptional, IsString, Length, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { IsHourInHHmmFormat } from '../utils/is-interval-validator';

export enum DayOfWeek {
  Sunday = 0,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
}

export class Interval {
  @IsString()
  @Length(5, 5)
  @IsHourInHHmmFormat()
  startHour: string;

  @IsString()
  @Length(5, 5)
  @IsHourInHHmmFormat()
  endHour: string;
}

export class AddScheduleSettingsDto {
  /**
   * The id of the agenda you want to configure.
   */
  @IsString()
  public readonly agendaId!: string;

  /**
   * The business of the agenda
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
   * Specific date for intervals. This field lets you specify a certain date for overwriting the default behaviour.
   */
  @IsDateString()
  @IsOptional()
  public readonly specificDate?: string;

  /**
   * An array of intervals describing the available appointment times.
   */
  @ValidateNested({ each: true })
  @Type(() => Interval)
  public readonly intervals: Interval[];
}
