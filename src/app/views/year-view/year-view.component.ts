import { Component, computed, input } from '@angular/core';
import { CalendarService } from '../../services/calendar/calendar.service';
import { DummyDataService } from '../../services/dummy-data/dummy-data.service';
import { AggregateParams } from '../../types/generic';
import { CalendarComponent } from '../../components/heat-calendar/calendar/calendar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-year-view',
  standalone: true,
  imports: [CalendarComponent],
  templateUrl: './year-view.component.html',
  styleUrl: './year-view.component.scss'
})
export class YearViewComponent {
  constructor(
    private calendar: CalendarService,
    private dummy: DummyDataService,
    private router: Router,
  ) {};

  dateField = input<string>(); //FIXME: Validate whatever is passed, if it is legit field of the data model and type is date | datetime etc.
  parameters = input<{[key: string]: any}>();
  data = computed(() => { return this.dummy.getDummyAggregate(this.aggregateParams()) }); //FIXME: Dummy data.
  year = computed(() => { return this.calendar.meta().year });

  //FIXME: Just sample parameters, later to be used for fetching real data.
  aggregateParams = computed<AggregateParams>(() => {
    const calendarStart = new Date(this.year(), 0, 1).toISOString();
    const calendarEnd = new Date(this.year() + 1, 0, 1).toISOString();
    const groupBy = `${this.dateField()}.day`
    const newParams: AggregateParams = {
      [`${this.dateField()}__gt`]: calendarStart,
      [`${this.dateField()}__lte`]: calendarEnd,
      groupBy: groupBy,
      aggregate: "count",
      attr: "id",
      ...this.parameters()
    };
    return newParams
  })

  onYearChange(year: number): void {
    this.calendar.changeYear(year);
  }

  onCellClick(e: { value: Date }): void {
    const dayStart = e.value;
    const dayEnd = new Date(e.value);
    dayEnd.setDate(dayEnd.getDate() + 1);
    const {aggregate, attr, groupBy, ...rest} = this.aggregateParams()
    const newParams = {
      ...rest,
      [`${this.dateField()}__gt`]: dayStart.toISOString(),
      [`${this.dateField()}__lte`]: dayEnd.toISOString(),
    };
    this.router.navigate(["/day"], { state: { parameters: newParams } });
  }
}
