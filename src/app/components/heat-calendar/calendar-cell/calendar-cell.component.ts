import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { TooltipDirective } from '../../../directives/tooltip.directive';
import { CalendarService } from '../../../services/calendar/calendar.service';
import { DummyDataService } from '../../../services/dummy-data/dummy-data.service';
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
    private calendar: CalendarService,
    private dummy: DummyDataService
  ) {};
  dayIndex = input<number>(0);
  disabled = input<boolean>(false);
  legend = input<number>(0);
  details = computed(() => { return this.generateTooltip(this.calendar.meta().year)});

  count = computed<number>(() => {
    const ms = new Date(this.calendar.meta().year, 0, 1).getTime() + this.dayIndex() * 1000 * 60 * 60 * 24;

    //FIXME: About There is nothing wrong but if dateKeys will be based on ISO, timezone related magic must be done in the
    //backend in the future and aggregation must be done based on the timezone information of the user (either via passing in query parameters
    //to the GET request or backend reading the information from the active session of the user).
    //For now this can be confusing on the frontend, as the keys might look like they are showing the wrong day due to timezone differences.
    const key = new Date(ms).toISOString().substring(0,10);
    return this.dummy.result()[key] || 0
  })

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
  * @return Returns an object for ngClass with the correct background-color utility class based on the given count.
  */
  public getColor(count: number): {[key: string]: boolean} {
    let cellColor: {[key: string]: boolean} = {};
    for (let i = 0; i < 5; i++) {
      const start = (i * 5) + 1;
      const end = (i + 1) * 5;
      if (start <= count) {
        if (i === 4) cellColor["bg-blue-6"] = true;
        else if (count <= end) {
          cellColor[`bg-blue-${i + 2}`] = true;
          break;
        }
      }
    }
    return cellColor;
  };
}
