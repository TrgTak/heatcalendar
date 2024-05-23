import { Component } from '@angular/core';

@Component({
  selector: 'app-daily-data',
  standalone: true,
  imports: [],
  templateUrl: './daily-data.component.html',
  styleUrl: './daily-data.component.scss'
})
export class DailyDataComponent {
  parameters = JSON.stringify(history.state.parameters);
}
