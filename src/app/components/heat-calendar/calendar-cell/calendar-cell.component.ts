import { CommonModule } from '@angular/common';
import { Component, DoCheck, computed, input } from '@angular/core';
import { TooltipDirective } from '../../../directives/tooltip.directive';
import { CalendarService } from '../../../services/calendar/calendar.service';
import { LocaleService } from '../../../services/locale/locale.service';

@Component({
  selector: 'app-calendar-cell',
  standalone: true,
  imports: [CommonModule, TooltipDirective],
  templateUrl: './calendar-cell.component.html',
  styleUrl: './calendar-cell.component.scss',
  hostDirectives: [TooltipDirective],
})
export class CalendarCellComponent {
  constructor( 
    private locale: LocaleService,
    private calendar: CalendarService
  ) {};
  dayIndex = input<number>(0);
  count = input<number>(0);
  disabled = input<boolean>(false);
  legend = input<boolean>(false);
  details = computed(() => { return this.generateTooltip(this.calendar.meta().year)});

  /**
  * @param year Calendar year.
  * @return Tooltip message based on available information for the given day of the given year.
  */
  private generateTooltip(year: number): { label: string, tooltip: string } {
    const ms = new Date(year, 0, 1).getTime() + this.dayIndex() * 1000 * 60 * 60 * 24;
    const cellDate = new Date(ms);
    let msg = "";
    if (!this.count()) msg = "No results on" // FIXME: Hardcoded string. Translate or configure.
    else msg = `${this.count()} ${this.count() > 1 ? "results" : "result"} on` // FIXME: Hardcoded string. Translate or configure.
    const getLabel = (isLong: boolean = false) => cellDate.toLocaleDateString(
      this.locale.meta().locale, 
      { 
        month: isLong ? "long": "short",
        day:'numeric',
        ...isLong ? { weekday: "long" } : {}
      })
    return {
      label: [msg, getLabel(true)].join(" "),
      tooltip: [msg, getLabel()].join(" ")
    }
  }

  /**
  * @param count Number of the results in the cell's according day.
  * @return 
  */
  public getColor(count: number): {[key: string]: boolean} {
    let cellColor: {[key: string]: boolean} = {};
    for (let i = 0; i < 5; i++) {
      const start = i * 5;
      const end = (i + 1) * 5;
      if (start <= count) {
        if (i === 4) cellColor["bg-blue-6"] = true;
        else if (count < end) cellColor[`bg-blue-${i + 2}`] = true;
        else continue
      }
      else continue;
    }
    return cellColor;
  };
}
