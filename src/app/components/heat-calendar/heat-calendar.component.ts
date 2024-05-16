import { CommonModule } from "@angular/common";
import { CalendarComponent } from "./calendar/calendar.component";
import { Component } from "@angular/core";

@Component({
  selector: 'app-heat-calendar',
  standalone: true,
  imports: [CommonModule, CalendarComponent],
  templateUrl: './heat-calendar.component.html',
  styleUrl: './heat-calendar.component.scss',
})
export class HeatCalendarComponent {
  private today = new Date();
  year: number = this.today.getFullYear();
  onYearChange(v: number ) {
    this.year = v
  }
}
