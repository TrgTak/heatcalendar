import { Injectable } from '@angular/core';
import { AggregateParams, AggregateResponse } from '../../types/generic';
import { CalendarService } from '../calendar/calendar.service';
import { LocaleService } from '../locale/locale.service';

@Injectable({
  providedIn: 'root'
})
// FIXME: Dump this and implement proper service with HttpClient.
export class DummyDataService {
  constructor(private calendar: CalendarService, private locale: LocaleService) {};

  /**
  * @param parameters: (Later supposed to include values to build query parameters but for now just sample parameters that needs to 
  * include year information as value to a key ends with __gt)
  * Function that generates random aggregate data based on dates.
  */
  getDummyAggregate(parameters: AggregateParams): AggregateResponse {
    let data:{[key: string]: number} = {};
    const yearEntry = Object.entries(parameters).find(([k,v]) => k.endsWith("__gt"));
    if (yearEntry) {
      const locale = this.locale.meta().locale;
      const year = new Date(yearEntry[1]).getFullYear();
      const months = Object.values(this.calendar.getMonthMeta(year, locale));
      for (let mi = 0; mi < months.length; mi ++) {
        for (let di = 1; di < months[mi].days + 1; di++) {
          const hasValue = Math.floor(Math.random() * 10) > 6;
          if (hasValue) {
            const r =  Math.floor(Math.random() * 10);
            const isHigh = r > 7;
            const isLow = r < 5;
            const newKey = new Date(year, mi, di).toISOString().substring(0,10);
            let value = 6 + Math.floor(Math.random() * 10);
            if (isHigh) value = 16 + Math.floor(Math.random() * 9);
            if (isLow) value = 1 + Math.floor(Math.random() * 5);
            data[newKey] = value
          }
        }
      }
    };
    return data
  }
}
