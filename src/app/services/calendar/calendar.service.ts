import { Injectable, computed, signal } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CalendarMeta, MonthMeta } from '../../types/generic';
import { LocaleService } from '../locale/locale.service';
@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  constructor(private locale: LocaleService) {};
  
  private subscriptions: Subscription[] = [];
  dispose() {this.subscriptions.forEach(subscription => subscription.unsubscribe())};

  private today = new Date();
  private currentYear = this.today.getFullYear()
  private defaultMeta: CalendarMeta = {
    year: this.currentYear,
    days: this.isLeapYear(this.currentYear) ? 366 : 365,
    months: this.getMonthMeta(this.currentYear, this.locale.meta().locale)
  };
  private year = new BehaviorSubject<number>(this.today.getFullYear());
  private metaSig = signal<CalendarMeta>(this.defaultMeta);
  public meta = this.metaSig.asReadonly();

  /**
  * @param year New year value to switch the calendar to.
  */
  public changeYear(year: number): void {
    this.dispose();
    this.year.next(year);
    if (year) {
      const subscription = this.year.asObservable().subscribe(() => {
        const days = this.isLeapYear(year) ? 366 : 365
        const newMeta = {
          ...this.meta(),
          year: year,
          days: days,
        }
        this.metaSig.update(() => newMeta)
      });
      this.subscriptions.push(subscription)
    }
  }

  /**
  * @param year Year which returned information will be based on.
  * @param locale Optional. If given, it will append weekSpread information to every month.
  * @return An object with keys as month indexes (January as 0) and values as object that includes month details.
  */
  public getMonthMeta(year: number, locale?: Intl.Locale): {[key: number]: MonthMeta} {
    const yearStart = new Date(year, 0, 0);
    return Object.fromEntries(
      [...Array(12).keys()].map((k, i) => {
        const monthStart = new Date(year, i, 0);
        const nextMonthStart = new Date(year, i + 1, 0);
        const currentLocale = locale ? locale : this.locale.meta().locale
        let newMonth: MonthMeta = {
          firstWeekday: (monthStart.getDay() + 1) % 7,
          transitionIndex: Math.ceil((nextMonthStart.getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24)) - 1,
          days: nextMonthStart.getDate(),
          weekSpread: this.getWeekSpread((monthStart.getDay() + 1) % 7, nextMonthStart.getDate(), currentLocale)
        }
        return [i, newMonth]
      })
    )
  };

  /**
  * @param start Weekday index. Starting from sunday as 0.
  * @param days Amout of days.
  * @param locale To get which weekday is the start of the week.
  * @return Count of the weeks, given days are stretched to, including non full weeks from the start and the end.
  */
   public getWeekSpread(start: number, days: number, locale: Intl.Locale): number {
    const weekStart = (locale as any).weekInfo.firstDay % 7;
    if (days === 28 && start === weekStart) return 4
    if (
      (days === 30 && start === (weekStart + 6) % 7) ||
      (days === 31 && start === (weekStart + 5) % 7) ||
      (days === 31 && start === (weekStart + 6) % 7)
    ) return 6
    return 5
  }

  /**
  * @param year Year which returned information will be based on.
  * @return An array of day indexes within given year which represents last day of the months.
  */
  public getMonthTransitions(year: number): number[] {
    return Object.values(this.getMonthMeta(year)).map(md => md.transitionIndex);
  }

  /**
  * @param year Year which returned information will be based on.
  * @return true if given year is leap year.
  */
  public isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 > 0) || year % 400 === 0
  }
}