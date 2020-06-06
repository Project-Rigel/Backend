import { Type } from "class-transformer";
import { IsDate, IsString } from "class-validator";
/*{ "uid": string, "agendaId": string?, // en caso de que haya una agenda sola no hace falta especificarlo "businessId": string, "productId": string, date: timestamp }*/
export class GetAppointmentDto {
  @IsString()
  uid: string;

  @IsString()
  businessId: string;
  @IsString()
  productId: string;

  @IsDate()
  @Type(() => Date)
  timestamp: Date;

  @IsString()
  agendaId?: string;
}
