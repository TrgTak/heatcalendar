import { Injectable, model } from '@angular/core';
import { AggregateParams, AggregateResponse } from '../../types/generic';
import { CalendarService } from '../calendar/calendar.service';

@Injectable({
  providedIn: 'root'
})
// FIXME: Dump this and implement proper service with HttpClient.
export class DummyDataService {
  constructor(private calendar: CalendarService) {};
  private resultSignal = model<AggregateResponse>({});
  readonly result = this.resultSignal.asReadonly();

  /**
  * Function that generates random data and updates the signal of the Service.
  */
  getAggregate(): void {
    let data:{[key: string]: number} = {};
    for (let mi = 0; mi < 12; mi ++) {
      for (let di = 1; di < this.calendar.meta().months[mi].days + 1; di++) {
        const hasValue = Math.floor(Math.random() * 10) > 6;
        if (hasValue) {
          const r =  Math.floor(Math.random() * 10);
          const isHigh = r > 7;
          const isLow = r < 5;
          const newKey = new Date(this.calendar.meta().year, mi, di).toISOString().substring(0,10);
          let value = 6 + Math.floor(Math.random() * 10);
          if (isHigh) value = 16 + Math.floor(Math.random() * 9);
          if (isLow) value = 1 + Math.floor(Math.random() * 5);
          data[newKey] = value
        }
      }
    }
    this.resultSignal.update(res => data)
  }
}
