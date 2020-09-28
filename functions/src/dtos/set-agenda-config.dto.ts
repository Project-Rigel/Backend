import { IsDateString, IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { DayOfWeek, IntervalDto } from './add-schedule-settings.dto';

export class SetAgendaConfigDto {
  /*
   * The agenda to apply the config to
   */
  @IsString()
  public readonly agendaId!: string;

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
  @Type(() => IntervalDto)
  public readonly intervals: IntervalDto[];
}
