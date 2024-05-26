import { CommonModule } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { TooltipDirective } from '../../../directives/tooltip.directive';
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
  ) {};
  disabled = input<boolean>(false);
  legend = input<number>(0);
  count = input<number>(0);
  date = input<any>();
  onClick = output<any>();
  info = computed<string>(() => {
    if (!this.count()) return "No results"
    else return `${this.count()} ${this.count() > 1 ? "results" : "result"}`
  })
  localeBaseName = computed(() => this.locale.meta().locale.baseName);

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

  handleClick(): void {
    this.onClick.emit({ value: this.date() });
  }
}
