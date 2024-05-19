import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { LocaleService } from './services/locale/locale.service';
import { OptionModel } from './types/generic';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DropdownComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor( public locale: LocaleService ) {};
  onLocaleChange(selected: OptionModel) {
    this.locale.changeLocale(selected.value);
  };
}