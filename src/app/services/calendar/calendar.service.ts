import { Injectable } from '@angular/core';

type MonthInfo = {
  label: string,
  firstWeekDay: number,
  lastWeekDay: number,
  lastDayYearIndex: number,
  days: number,
  weekSpread: number,
}

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  public monthLabels = [...Array(12).keys()].map(key => new Date(0, key).toLocaleString('en', { month: 'short' }));
  public dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  public getMonthData(year: number) {
    const yearStart = new Date(year, 0, 0);
    return Object.fromEntries(
      this.monthLabels.map((m, i) => {
        const monthStart = new Date(year, i, 0);
        const nextMonthStart = new Date(year, i + 1, 0);
        let result: MonthInfo = {
          label: m,
          firstWeekDay: monthStart.getDay(),
          lastWeekDay: ((nextMonthStart.getDay() % 7) + 6) % 7,
          lastDayYearIndex: Math.ceil((nextMonthStart.getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24)),
          days: nextMonthStart.getDate(),
          weekSpread: 5,
        }
        if (result.days === 28 && result.firstWeekDay === 0) {
          result.weekSpread = 4
        }
        if (
          (result.days === 30 && result.firstWeekDay === 6) ||
          (result.days === 31 && result.firstWeekDay >= 5)
        ) {
          result.weekSpread = 6
        }
        return [i, result]
      })
    )
  };
}