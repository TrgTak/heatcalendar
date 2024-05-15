import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, input } from '@angular/core';
import { CalendarService } from '../../services/calendar/calendar.service';
import { DataService } from '../../services/data/data.service';
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

  constructor(private calendar: CalendarService, private dummy: DataService) {}

  year = input<number>(this.today.getFullYear());
  data = computed(() => { return this.dummy.result() })
  dayLabels = this.calendar.dayLabels;
  monthLabels = this.calendar.monthLabels;
  monthData = this.calendar.getMonthData(this.year());
  cellCount = ((this.year() % 4 === 0 && this.year() % 100 > 0) || this.year() % 400 === 0) ? 366 : 365;
  columnCount = Math.ceil(this.cellCount / 7);
  monthTransitions = Object.values(this.monthData).map(md => md.lastDayYearIndex);

  isEndOfTheMonth(dayIndex: number): boolean {
    return this.monthTransitions.includes(dayIndex)
  }
  isLastWeek(dayIndex: number): boolean {
    for (let i = dayIndex; i < dayIndex + 7; i ++) {
      if (this.isEndOfTheMonth(i)) return true
    }
    return false
  }
  isInvalid(dayIndex: number): boolean {
    return (
      dayIndex <= this.monthData[0].firstWeekDay ||
      dayIndex >= this.cellCount + this.monthData[0].firstWeekDay + 1
    )
  }
  getMonthDay(dayIndex: number): number {
    if (dayIndex <= 31) return dayIndex
    else {
      const transitionIndex = this.monthTransitions.findIndex(mt => dayIndex <= mt);
      return (dayIndex - this.monthTransitions[transitionIndex - 1]) || 0
    }
  }
  trackByItem(index: number): string {
    return `${this.year}-${index}`
  }
  ngOnInit(): void {
    this.dummy.getDummyData();
  }
}