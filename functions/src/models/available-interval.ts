import {Moment} from "moment";

export interface AvailableInterval {
    dayOfWeek: number,
    day: string,
    from: Moment,
    to: Moment,
}