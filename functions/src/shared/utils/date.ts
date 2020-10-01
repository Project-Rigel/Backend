import * as moment from 'moment';
import { DayOfWeek } from '../../agendas/application/dto/add-schedule-settings.dto';

export const getFormattedDateDMY = (source: Date) => {
  return `${source.getDate()}_${source.getMonth()}_${source.getFullYear()}`;
};

export const getDateFromFormattedDate = (source: string) => {
  const tokens = source.split('_');

  return moment()
    .year(Number.parseInt(tokens[2]))
    .month(tokens[1])
    .date(Number.parseInt(tokens[0]));
};

export const getFormattedHHMm = (source: Date) => {
  return moment(source).format('HH:mm').toString();
};

export const getDayEnumFromString = (day: string) => {
  switch (day) {
    case 'Monday':
      return DayOfWeek.Monday;
    case 'Tuesday':
      return DayOfWeek.Tuesday;
    case 'Wednesday':
      return DayOfWeek.Wednesday;
    case 'Thursday':
      return DayOfWeek.Thursday;
    case 'Friday':
      return DayOfWeek.Friday;
    case 'Saturday':
      return DayOfWeek.Saturday;
    case 'Sunday':
      return DayOfWeek.Sunday;
    default:
      return null;
  }
};
