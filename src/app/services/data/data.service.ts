import { Injectable, model } from '@angular/core';

type AggregateResponse = {
  [key: string]: number
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private resultSignal = model<AggregateResponse>({});
  readonly result = this.resultSignal.asReadonly();
  
  constructor() { }

  getDummyData() {
    let data: AggregateResponse = {};
    for (let i = 0; i < 100; i++) {
      const k =  Math.floor(Math.random() * 366);
      const v = Math.floor(Math.random() * 27)
      if (data[k]) {
        continue
      }
      else data[k] = v
    }
    this.resultSignal.update(res => data)
  }
}
