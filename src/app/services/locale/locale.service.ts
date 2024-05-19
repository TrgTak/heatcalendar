import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { LocaleMeta } from '../../types/generic';
import { LOCALES } from './locale.options';

@Injectable({
  providedIn: 'root'
})
export class LocaleService {
  private subscriptions: Subscription[] = [];
  dispose() {this.subscriptions.forEach(subscription => subscription.unsubscribe())};

  public localeOptions = LOCALES;
  public defaultOption = LOCALES.find(o => o.value === navigator.language) || LOCALES[0];

  private lang = new BehaviorSubject<string>(this.defaultOption.value);
  private metaSig = signal<LocaleMeta>(this.getLocaleMeta(this.defaultOption.value));
  public meta = this.metaSig.asReadonly();

  /**
  * @param baseName Any locale baseName.
  */
  public changeLocale(baseName: string): void {
    /* FIXME: figure out reliable type for locale baseNames if possible. */
    if (baseName) {
      this.dispose();
      this.lang.next(baseName);
      const subscription = this.lang.asObservable().subscribe((res) => {
        const newMeta = this.getLocaleMeta(res);
        this.metaSig.update(() => newMeta);
      });
      this.subscriptions.push(subscription);
    }
  }

  /**
  * @param baseName Any locale baseName.
  * @return LocaleMeta object which includes additional essential information in addition to Intl.Locale
  */
  private getLocaleMeta(baseName: string): LocaleMeta {
    /* FIXME: figure out reliable type for locale baseNames if possible. */
    const newLocale = new Intl.Locale(baseName);
    return {
      locale: newLocale,
      monthLabels: this.getMonthLabels(newLocale),
      weekDayLabels: this.getDayLabels(newLocale),
      weekStart: this.getWeekStart(newLocale),
    };
  };

  /**
  * @param locale Any Intl.Locale object.
  * @return An array of localized short-labels of the days which is ordered based on the start of the week in given locale.
  */
  private getDayLabels(locale: Intl.Locale): string[] {
    const firstDay = (locale as any).weekInfo.firstDay % 7;
    const labels = [...Array(7).keys()].map(key => 
      new Date(0, 0, key).toLocaleString(locale, { weekday: 'short' })
    );
    return [
      ...labels.slice(firstDay),
      ...labels.slice(0, (firstDay)),
    ]
  };

  /**
  * @param locale Any Intl.Locale object.
  * @return An array of localized short-labels of the months.
  */
  private getMonthLabels(locale: Intl.Locale): string[] {
    return [...Array(12).keys()].map(key => 
      new Date(0, key).toLocaleString(locale, { month: 'short' })
    );
  };

  /**
  * @param locale Any Intl.Locale object.
  * @return index of the first day of the week based on the given locale. Unlike Intl, this index returns Sunday as 0 instead of 7
  */
  private getWeekStart(locale: Intl.Locale): number { return (locale as any).weekInfo.firstDay % 7 };
}