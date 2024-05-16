import { Injectable, input } from '@angular/core';

type MonthInfo = {
  label: string,
  firstDayWeekIndex: number,
  lastDayYearIndex: number,
  days: number,
  weekSpread: number,
}

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  public lang = input<string>(navigator.language); // FIXME: App should offer its own language selection and that should be the value instead of navigator language.
  public locale: any = new Intl.Locale(this.lang());

  public weekFirstDay = this.locale.weekInfo.firstDay % 7;
  private labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]; // FIXME: Hardcoded string. Translate or configure.
  public dayLabels = [
    ...this.labels.slice(this.weekFirstDay),
    ...this.labels.slice(0, (this.weekFirstDay)),
  ]; // Ordered dayLabels by the calendar weekdays of the current locale.
  public monthLabels = [...Array(12).keys()].map(key => new Date(0, key).toLocaleString(this.locale, { month: 'short' }));
  public getWeekSpread(start: number, days: number) {
    if (days === 28 && start === this.weekFirstDay) return 4
    if (
      (days === 30 && start === (this.weekFirstDay + 6) % 7) ||
      (days === 31 && start === (this.weekFirstDay + 5) % 7) ||
      (days === 31 && start === (this.weekFirstDay + 6) % 7)
    ) return 6
    return 5
  }
  public getMonthData(year: number) {
    const yearStart = new Date(year, 0, 0);
    return Object.fromEntries(
      this.monthLabels.map((m, i) => {
        const monthStart = new Date(year, i, 0);
        const nextMonthStart = new Date(year, i + 1, 0);
        let newMonth: MonthInfo = {
          label: m,
          firstDayWeekIndex: (monthStart.getDay() + 1) % 7,
          lastDayYearIndex: Math.ceil((nextMonthStart.getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24)) - 1,
          days: nextMonthStart.getDate(),
          weekSpread: this.getWeekSpread((monthStart.getDay() + 1) % 7 ,nextMonthStart.getDate()),
        }
        return [i, newMonth]
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