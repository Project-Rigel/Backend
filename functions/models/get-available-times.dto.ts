import {IsDate, IsDateString, IsString} from "class-validator";
import {Type} from "class-transformer";

export class GetAvailableTimesDto {
    @IsString()
    businessId: string;

    @IsString()
    agendaId: string;
    @IsString()
    productId: string;

    @IsDate()
    @Type(() => Date)
    timestamp: Date
}