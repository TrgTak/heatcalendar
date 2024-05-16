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
  offset = this.monthData[0].firstWeekDay - this.calendar.locale.weekInfo.firstDay % 7
  cellCount = this.calendar.isLeapYear(this.year()) ? 366 : 365;
  columnCount = Math.ceil(this.cellCount / 7);
  monthTransitions = this.calendar.getMonthTransitions(this.year());

  isEndOfTheMonth(dayIndex: number): boolean {
    return this.monthTransitions.includes(dayIndex - this.offset)
  }
  isInLastWeek(dayIndex: number): boolean {
    for (let i = dayIndex; i < dayIndex + 7; i ++) {
      if (this.isEndOfTheMonth(i)) return true
    }
    return false
  }
  isCellInvalid(dayIndex: number): boolean {
    if (dayIndex < 7 && this.monthData[0].firstWeekDay > 0) {
      return dayIndex < this.offset
    }
    if (dayIndex >= this.cellCount + this.offset) {
      return true
    }
    return false    
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