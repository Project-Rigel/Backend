import { SetAgendaConfigDto } from '../dtos/set-agenda-config.dto';
import { HttpsError } from 'firebase-functions/lib/providers/https';
import { AgendaRepository } from '../services/agenda.repository';
import { BusinessRepository } from '../services/business.repository';
import moment = require('moment');

export class SetAgendaConfigUseCase {
  constructor(
    private readonly agendaRepository: AgendaRepository,
    private readonly businessRepository: BusinessRepository,
  ) {}

  public async execute(dto: SetAgendaConfigDto) {
    const agenda = await this.agendaRepository.getAgenda(dto.agendaId);

    if (!agenda) {
      throw new HttpsError('invalid-argument', 'Agenda not found');
    }

    this.businessRepository.getById(agenda.businessId);

    if ((dto.dayOfWeek && dto.specificDate) || (!dto.dayOfWeek && !dto.specificDate)) {
      throw new HttpsError(
        'invalid-argument',
        'Specify a day of week or specificDate in UTC format, not both nor any. ',
      );
    }

    const specificDate = dto.specificDate ? moment(dto.specificDate) : null;

    if (specificDate) {
      this.agendaRepository.setAgendaConfigWithSpecificDate(
        dto.agendaId,
        specificDate,
        dto.intervals,
      );
    } else {
      this.agendaRepository.setAgendaConfigWithDayOfWeek(
        dto.agendaId,
        dto.dayOfWeek,
        dto.intervals,
      );
    }

    // const specificDate = dto.specificDate
    //   ? moment(dto.specificDate).utc().hours(0).minutes(0).seconds(0).milliseconds(0).toISOString()
    //   : null;

    // const intervals = {
    //   // @ts-ignore
    //   [dto.dayOfWeek ? DayOfWeek[dto.dayOfWeek] : specificDate]: {},
    // };
    //
    // for (let i = 0; i < dto.intervals.length; i++) {
    //   // @ts-ignore
    //   intervals[dto.dayOfWeek ? DayOfWeek[dto.dayOfWeek] : specificDate][
    //     dto.intervals[i].startHour
    //   ] = dto.intervals[i].endHour;
    // }
    //
    // await agendaRef.set({ intervals: intervals }, { merge: true });

    // const timesDocs = await db.collection('agendas').doc(dto.agendaId).collection('times').get();
    //
    // if (timesDocs.size > 0) {
    //   const timesIntervals = [];
    //
    //   if (dto.specificDate) {
    //   }
    //   timesIntervals.push({
    //     day: null,
    //     dayOfWeek: dayOfWeek,
    //     from: key,
    //     to: parentData.intervals[dayOfWeek][key],
    //   });
    //   timesDocs.forEach((elem) => {
    //     elem.ref.set(
    //       {
    //         availableTimes: intervals,
    //       },
    //       { merge: true },
    //     );
    //   });
    // }

    return 'Ok';
  }
}
