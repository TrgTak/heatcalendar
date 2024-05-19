import { Injectable, model } from '@angular/core';
import { AggregateResponse } from '../../types/generic';
import { CalendarService } from '../calendar/calendar.service';

@Injectable({
  providedIn: 'root'
})
// FIXME: Dump this and replace with real api call when it is available.
export class DummyDataService {
  constructor(private calendar: CalendarService) {};
  private resultSignal = model<AggregateResponse>({});
  readonly result = this.resultSignal.asReadonly();

  /**
   * Generates dummy aggregate object for testing the calendar component with the 
   * keys according day indexes within a year and values as random counts between 1 to 27
   * @param year Changes random range of the keys from 0-364 to 0-365 if given year is leap year.
   */
  getDummyData(year: number) {
    const isLeapYear = this.calendar.isLeapYear(year)
    let data: AggregateResponse = {};
    for (let i = 0; i < 200; i++) {
      const k =  Math.floor(Math.random() * (isLeapYear ? 366: 365));
      const v = 1 + i < 100 ?
        Math.floor(Math.random() * 27):
        Math.floor(Math.random() * 7);
      if (data[k]) {
        continue;
      }
      else data[k] = v;
    }
    this.resultSignal.update(() => data)
  }
}
