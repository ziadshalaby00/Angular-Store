import { Component, computed, input, model, output } from '@angular/core';
import { FormStyle, FormPaletteMap } from '../configTypeAndClsService/configTypeAndCls';

// date-picker.model.ts
export type DatePickerType = 'date' | 'datetime-local' | 'month' | 'week' | 'time';

@Component({
  selector: 'ZS-date',
  imports: [],
  templateUrl: './zdate.html',
  styleUrl: './zdate.css'
})
export class Zdate {
  // Inputs
  readonly id = input<string>(crypto.randomUUID());
  readonly label = input<string | undefined>(undefined);
  readonly hint = input<string | undefined>(undefined);
  readonly placeholder = input<string>('');
  readonly required = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly readonly = input<boolean>(false);

  readonly type = input<DatePickerType>('date');
  readonly inputStyle = input<FormStyle>('normal');

  // Model
  readonly value = model<string | null>(null);

  // Outputs
  readonly valueChange = output<string | null>();
  readonly blur = output<void>();
  readonly focus = output<void>();

  // Computed icon
  readonly icon = computed(() => {
    switch (this.type()) {
      case 'datetime-local': return 'fa-calendar-clock';
      case 'month': return 'fa-calendar-days';
      case 'week': return 'fa-calendar-week';
      default: return 'fa-calendar';
    }
  });

  // Computed input type
  readonly inputType = computed(() => this.type());

  // Computed classes
  readonly inputClasses = computed(() => {
    const base = 'w-full appearance-none focus:outline-none px-4 py-2.5 pl-10 pr-4 focus-within:ring-2 rounded-lg border shadow-sm  transition-all duration-150';
    const styleEntry = FormPaletteMap.get(this.inputStyle()) ?? FormPaletteMap.get('normal');
    const disabledCls = this.disabled() ? 'opacity-60 cursor-not-allowed' : 'cursor-text';
    return [
      base, 
      styleEntry?.border, 
      styleEntry?.borderHover,
      styleEntry?.bg, 
      styleEntry?.text,
      styleEntry?.ring,
      disabledCls
    ].join(' ');
  });

  // Events
  onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const newValue = input.value || null;
    this.value.set(newValue);
    this.valueChange.emit(newValue);
  }

  onFocus() {
    this.focus.emit();
  }

  onBlur() {
    this.blur.emit();
  }
}