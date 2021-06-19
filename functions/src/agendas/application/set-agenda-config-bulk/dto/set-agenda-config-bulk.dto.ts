import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { DayOfWeek, IntervalDto } from '../../dto/add-schedule-settings.dto';


export class SetAgendaConfigBulkDto {

  constructor(agendaId: string, businessId: string, configs: AgendaConfigDto[]) {
    this.agendaId = agendaId;
    this.businessId = businessId;
    this.configs = configs;
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
   * An array configs supplied for the agenda
   */
  @ValidateNested({ each: true })
  @Type(() => AgendaConfigDto)
  public readonly configs!: AgendaConfigDto[];

}


export class AgendaConfigDto {


  constructor(dayOfWeek: string, expirationDate: string, specificDate: string, intervals: IntervalDto[]) {
    this.dayOfWeek = dayOfWeek;
    this.expirationDate = expirationDate;
    this.specificDate = specificDate;
    this.intervals = intervals;
  }

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
