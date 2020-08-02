import * as moment from 'moment';

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
