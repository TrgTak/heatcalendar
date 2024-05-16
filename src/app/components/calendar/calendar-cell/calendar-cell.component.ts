import { CommonModule } from '@angular/common';
import { Component, DoCheck, Input } from '@angular/core';
import { TooltipDirective } from '../../../directives/tooltip.directive';
import { CalendarService } from '../../../services/calendar/calendar.service';

@Component({
  selector: 'app-calendar-cell',
  standalone: true,
  imports: [CommonModule, TooltipDirective],
  templateUrl: './calendar-cell.component.html',
  styleUrl: './calendar-cell.component.scss',
  hostDirectives: [TooltipDirective],
})
export class CalendarCellComponent implements DoCheck {
  private today = new Date();
  @Input('year') year: number = this.today.getFullYear();
  @Input('yearDayIndex') yearDayIndex: number = 0;
  @Input('data') data: number = 0;
  @Input('disabled') disabled?: boolean = false;
  label: string = "";

  constructor(private calendar: CalendarService) {}

  generateTooltip(year: number, dayIndex: number) {
    const d = new Date(year, 0, 1);
    const ms = d.getTime() + dayIndex * 1000 * 60 * 60 * 24;
    const cellDate = new Date(ms);
    let arr = [];
    if (!this.data) {
      arr.push("No results");
    }
    else {
      arr.push(`${this.data} ${this.data > 1 ? "results":"result"}`)
    }
    arr.push(`on ${cellDate.toLocaleDateString(this.calendar.locale, { month:'short', day:'numeric' })}`);
    this.label = arr.join(" ")
  }
  ngDoCheck(): void {
    this.generateTooltip(this.year, this.yearDayIndex)
  }
}
