import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, input } from '@angular/core';
import { CalendarService } from '../../services/calendar/calendar.service';
import { DummyDataService } from '../../services/dummy-data/dummy-data.service';
import { CalendarCellComponent } from './calendar-cell/calendar-cell.component';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, CalendarCellComponent],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent implements OnInit {
  private today = new Date();
  constructor(private calendar: CalendarService, private dummy: DummyDataService) {}

  year = input<number>(this.today.getFullYear());
  data = computed(() => { return this.dummy.result() })
  dayLabels = this.calendar.dayLabels;
  monthLabels = this.calendar.monthLabels;
  monthData = this.calendar.getMonthData(this.year());
  weekFirstDay = this.calendar.weekFirstDay
  cellOffset = this.monthData[0].firstDayWeekIndex - this.weekFirstDay
  cellCount = this.calendar.isLeapYear(this.year()) ? 366 : 365;
  columnCount = Math.ceil(this.cellCount / 7);
  monthTransitions = this.calendar.getMonthTransitions(this.year());

  isCellInvalid(dayIndex: number): boolean {
    if (dayIndex < 7 && this.monthData[0].firstDayWeekIndex > 0) { // Invalidate the cells before the start of the year.
      return dayIndex < this.cellOffset
    }
    if (dayIndex >= this.cellCount + this.cellOffset) { // Invalidate the cells after the end of the year.
      return true
    }
    return false    
  }
  trackBy(index: number): string {
    return `${this.year}-${index}`
  }
  isEndOfAnyMonth(dayIndex: number): boolean { // Used only for calculating month transition border styles.
    return this.monthTransitions.includes(dayIndex - this.cellOffset)
  }
  isTransitionColumn(dayIndex: number): boolean { // 7 cells, backwards starting from the last day of any month. Used only for calculating month transition border styles.
    for (let i = dayIndex; i < dayIndex + 7; i ++) {
      if (this.isEndOfAnyMonth(i)) return true
    }
    return false
  }
  getCellBorders(x: number, y: number) {
    let cellBorders: {[key: string]: boolean} = {}
    if (x === 0 && !this.isCellInvalid(y + x * 7)) { // All valid cells on the leftmost side.
      cellBorders["border-l"] = true
    }
    if (
      this.isTransitionColumn(y + x * 7) || // All cells before month transition.
      (x === 0 && this.isCellInvalid(y)) || // All invalid cells on the leftmost side.
      (x + 1 === this.columnCount && !this.isCellInvalid(y + x * 7)) // Last valid cell, +1 is due to index vs count comparison.
    ) {
      cellBorders["border-r"] = true
    }
    if (this.isEndOfAnyMonth(y + x * 7) && y !== 6) { // Every month transition cell which are not in last row.
      cellBorders["border-b"] = true
    }
    if (x === 0 && y !== 0 && y === this.cellOffset) { // Next valid cell after the first cell within the leftmost columns.
      cellBorders["border-t"] = true
    }
    return cellBorders
  }
  ngOnInit(): void {
    console.log(this.monthData, Object.values(this.monthData).map(md=>[md.label, md.weekSpread]))
    this.dummy.getDummyData();
  }
}