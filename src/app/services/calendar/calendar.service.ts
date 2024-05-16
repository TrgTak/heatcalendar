import { Injectable, input } from '@angular/core';

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
  public lang = input<string>(navigator.language);
  public locale: any = new Intl.Locale(this.lang());

  private first = this.locale.weekInfo.firstDay % 7;
  private labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  public monthLabels = [...Array(12).keys()].map(key => new Date(0, key).toLocaleString(this.locale, { month: 'short' }));
  public dayLabels = [
    ...this.labels.slice(this.first),
    ...this.labels.slice(0, (this.first)),
  ];
  public getMonthData(year: number) {
    const yearStart = new Date(year, 0, 0);
    return Object.fromEntries(
      this.monthLabels.map((m, i) => {
        const monthStart = new Date(year, i, 0);
        const nextMonthStart = new Date(year, i + 1, 0);
        let result: MonthInfo = {
          label: m,
          firstWeekDay: (monthStart.getDay() + 1) % 7,
          lastWeekDay: ((nextMonthStart.getDay() + 7) % 7),
          lastDayYearIndex: Math.ceil((nextMonthStart.getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24)) - 1,
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
  public getMonthTransitions(year: number) {
    return Object.values(this.getMonthData(year)).map(md => md.lastDayYearIndex);
  }
  public isLeapYear(year: number) {
    return (year % 4 === 0 && year % 100 > 0) || year % 400 === 0
  }
}