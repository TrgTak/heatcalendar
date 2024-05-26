import { Component } from '@angular/core';

@Component({
  selector: 'app-day-view',
  standalone: true,
  imports: [],
  templateUrl: './day-view.component.html',
  styleUrl: './day-view.component.scss'
})
export class DayViewComponent {
  parameters = JSON.stringify(history.state.parameters);
}
