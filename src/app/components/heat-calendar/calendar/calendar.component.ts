import { CommonModule } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { CalendarService } from '../../../services/calendar/calendar.service';
import { LocaleService } from '../../../services/locale/locale.service';
import { AggregateResponse } from '../../../types/generic';
import { CalendarCellComponent } from '../calendar-cell/calendar-cell.component';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, CalendarCellComponent],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent {
  constructor(
    private calendar: CalendarService,
    private locale: LocaleService,
  ) {};

  today = new Date();
  year = input<number>(this.today.getFullYear());
  data = input<AggregateResponse>({});
  onCellClick = output<any>();
  meta = computed(() => { return this.locale.meta() });
  months = computed(() => { return this.calendar.getMonthMeta(this.year(), this.meta().locale) });
  days = computed(() => { return this.calendar.isLeapYear(this.year()) ? 366 : 365 });
  columnCount = computed(() => { return Math.ceil(this.days() / 7) });
  monthTransitions = computed(() => { return this.calendar.getMonthTransitions(this.year()) });
  cellOffset = computed(()=> { return (this.months()[0].firstWeekday - this.locale.meta().weekStart + 7) % 7 });

  /**
  * @param dayIndex Index based on the day within the year.
  * @return Returns date object of the dayIndex of the year
  */
  getCellDate(dayIndex: number) {
    const ms = new Date(this.year(), 0, 1).getTime() + dayIndex * 1000 * 60 * 60 * 24;
    return new Date(ms)
  }

  /**
  * @param dayIndex Index based on the day within the year.
  * @return Returns aggregate value from the available data according to given dayIndex of the year
  */
  getCellValue(dayIndex: number) {
    const key = this.getCellDate(dayIndex).toISOString().substring(0,10);
    return this.data()[key] || 0
  }

  /**
  * @param dayIndex Index based on the day within the year.
  * @return Returns true if dayIndex is within the range of the year starting from 0.
  */
  validateCell(dayIndex: number): boolean {
      const isPrevYear = dayIndex < this.cellOffset();
      const isNextYear = dayIndex >= this.days() + this.cellOffset();
      return !(isPrevYear || isNextYear)
  }

  /**
  * @param dayIndex Index based on the day within the year.
  * @return Returns true if the matching day is end of a month.
  */
  isEndOfAnyMonth(dayIndex: number): boolean {
    return this.monthTransitions().includes(dayIndex - this.cellOffset())
  };

  /**
  * @param dayIndex Index based on the day within the year.
  * @return Returns true if next week from the matching day is within the next month.
  */
  isTransitionColumn(dayIndex: number): boolean {
    for (let i = dayIndex; i < dayIndex + 7; i ++) {
      if (this.isEndOfAnyMonth(i)) return true
    }
    return false
  };

  /**
  * @param x Column index of a calendar cell.
  * @param y Row index of a calendar cell.
  * @return Returns an object for ngClass with the correct border utility classes based on the cell's position.
  */
  getCellBorders(x: number, y: number): {[key: string]: boolean} {
    let cellBorders: {[key: string]: boolean} = {};
    if (x === 0 && this.validateCell(y + x * 7)) { // All valid cells on the leftmost side.
      cellBorders["border-l"] = true;
    };
    if (
      this.isTransitionColumn(y + x * 7) || // All cells before month transition.
      (x === 0 && !this.validateCell(y)) || // All invalid cells on the leftmost side.
      (x + 1 === this.columnCount() && this.validateCell(y + x * 7)) // Last valid column of any row.
    ) {
      cellBorders["border-r"] = true;
    };
    if (this.isEndOfAnyMonth(y + x * 7) && y !== 6) { // Last day of any month unless it is in the last row.
      cellBorders["border-b"] = true;
    };
    if (x === 0 && y !== 0 && y === this.cellOffset()) { // First valid cell within the leftmost columns.
      cellBorders["border-t"] = true;
    };
    return cellBorders
  };

  handleClick(e: Event): void {
    this.onCellClick.emit(e)
  }
}