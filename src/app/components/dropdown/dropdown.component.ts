import { CommonModule } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { OptionModel } from '../../types/generic';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
})
export class DropdownComponent {
  label = input<string>("")
  value = input<OptionModel>();
  options = input<OptionModel[]>([]);
  onSelect = output<any>();
  defaultValue = input<string>();

  initial = computed<string>(() => {
    const val = this.value() || this.defaultValue();
    return val || this.options()[0].value
  })

  onChange(e: Event): void {
    const value = (e.target as any).value;
    const selected = this.options().find(option => option.value === value);
    if (selected) {
      this.onSelect.emit(selected)
    }
  }
}
