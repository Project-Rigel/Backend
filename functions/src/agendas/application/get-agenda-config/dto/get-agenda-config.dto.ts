import { IsBoolean, IsString } from 'class-validator';

export class GetAgendaConfigDto {
  constructor(agendaId: string, businessId: string, showOnlyValidConfig: boolean) {
    this.agendaId = agendaId;
    this.businessId = businessId;
    this.showOnlyValidConfig = showOnlyValidConfig;
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
   * Specific date for intervals. This field lets you specify a certain date for overwriting the default behaviour.
   */
  @IsBoolean()
  public readonly showOnlyValidConfig?: boolean;
}
