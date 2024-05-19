import { CommonModule } from '@angular/common';
import { Component, OnInit, computed } from '@angular/core';
import { CalendarService } from '../../../services/calendar/calendar.service';
import { DummyDataService } from '../../../services/dummy-data/dummy-data.service';
import { LocaleService } from '../../../services/locale/locale.service';
import { CalendarCellComponent } from '../calendar-cell/calendar-cell.component';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, CalendarCellComponent],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent implements OnInit {
  constructor(
    private calendar: CalendarService,
    private locale: LocaleService,
    private dummy: DummyDataService
  ) {};
  data = computed(() => { return this.dummy.result() }); //FIXME: Dummy data.
  meta = computed(() => { return this.locale.meta() });
  year = computed(() => { return this.calendar.meta().year });
  months = computed(() => { return this.calendar.getMonthMeta(this.year(), this.meta().locale) });
  days = computed(() => { return this.calendar.isLeapYear(this.year()) ? 366 : 365 });
  columnCount = computed(() => { return Math.ceil(this.days() / 7) });
  monthTransitions = computed(() => { return this.calendar.getMonthTransitions(this.year()) });
  cellOffset = computed(()=> { return (this.months()[0].firstWeekday - this.locale.meta().weekStart + 7) % 7 });

  /**
  * @param year New year value to switch the calendar to.
  */
  onYearChange(year: number): void {
    this.calendar.changeYear(year);
    this.dummy.getDummyData(year); //FIXME: Dummy data.
  }

  /**
  * @param dayIndex Index based on the day within the year.
  * @return Returns true if dayIndex is within the range of the year starting from 0.
  */
  validateCell(cellIndex: number): boolean {
      const isPrevYear = cellIndex < this.cellOffset();
      const isNextYear = cellIndex >= this.days() + this.cellOffset();
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
  * @return Returns an object for for ngClass with the correct border utility classes based on the cell's position.
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

  ngOnInit(): void {
    this.dummy.getDummyData(this.year()); //FIXME: Dummy data.
  }
}