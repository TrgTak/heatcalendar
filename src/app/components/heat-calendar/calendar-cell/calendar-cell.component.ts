import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { TooltipDirective } from '../../../directives/tooltip.directive';
import { CalendarService } from '../../../services/calendar/calendar.service';
import { DummyDataService } from '../../../services/dummy-data/dummy-data.service';
import { LocaleService } from '../../../services/locale/locale.service';
import { Router } from '@angular/router';

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
    private router: Router,
    private dummy: DummyDataService
  ) {};
  dateField = input<string>();
  parameters = input<{[key: string]: any}>();
  dayIndex = input<number>(0);
  disabled = input<boolean>(false);
  legend = input<number>(0);
  details = computed(() => { return this.generateTooltip(this.calendar.meta().year)});
  cellDate = computed<Date>(() => {
    const ms = new Date(this.calendar.meta().year, 0, 1).getTime() + this.dayIndex() * 1000 * 60 * 60 * 24;
    return new Date(ms)
  })
  count = computed<number>(() => {
    //FIXME: About There is nothing wrong but if dateKeys will be based on ISO, timezone related magic must be done in the
    //backend in the future and aggregation must be done based on the timezone information of the user (either via passing in query parameters
    //to the GET request or backend can read the information from the active session of the user).
    //For now, if data is inspected, this can be confusing on the frontend, as the keys might look like they are showing the wrong day due to
    //timezone differences, but they are correct by ISO
    const key = this.cellDate().toISOString().substring(0,10);
    return this.dummy.result()[key] || 0
  });



  /**
  * @param year Calendar year.
  * @return Tooltip message based on available information for the given day of the given year.
  */
  private generateTooltip(year: number): { label: string, tooltip: string } {
    let msg = "";
    if (!this.count()) msg = "No results on" // FIXME: Hardcoded string. Translate or configure.
    else msg = `${this.count()} ${this.count() > 1 ? "results" : "result"} on` // FIXME: Hardcoded string. Translate or configure.
    const getLabel = (isLong: boolean = false) => this.cellDate().toLocaleDateString(
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

  public handleClick() {
    const dayStart = this.cellDate();
    const dayEnd = new Date(this.cellDate());
    dayEnd.setDate(dayEnd.getDate() + 1);
    const newParams = {
      ...this.parameters(),
      [`${this.dateField()}__gt`]: dayStart.toISOString(),
      [`${this.dateField()}__lte`]: dayEnd.toISOString(),
    }
    this.router.navigate(["/daily"], { state: { parameters: newParams } })
  }
}
