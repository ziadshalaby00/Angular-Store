import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  ElementRef,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FormPaletteMap, FormSize, FormStyle } from '../zformService/zform-service';
import { Zlabel } from '../zlabel/zlabel';

// ==============================================================================
// Types
// ==============================================================================

export type DateType =   
  | 'date' 
  | 'datetime-local' 
  | 'month' 
  | 'week' 
  | 'time';

export type InputType = 
  | DateType 
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'phone'
  | 'url'
  | 'search';

export type ValidatorFn = (value: string | null) => string[];
export type FormatterFn = (value: string | null) => string | null;

type SizeClassesType = 'container' | 'field' | 'leftIcon' | 'rightIcon';

export interface ChangeEventType {
  value: string | null;
  valid: boolean;
}
// ==============================================================================
// Constants & Regex
// ==============================================================================

const SIZE_CLASSES_MAP = new Map<SizeClassesType, Record<FormSize, string>>([
  [
    'container',
    {
      sm: 'px-2 py-1 rounded-md',
      md: 'px-3 py-2 rounded-lg',
      lg: 'px-4 py-3 rounded-lg',
    },
  ],
  [
    'field',
    {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    },
  ],
  [
    'leftIcon',
    {
      sm: 'text-sm mr-1.5',
      md: 'text-base mr-2',
      lg: 'text-lg mr-2.5',
    },
  ],
  [
    'rightIcon',
    {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    },
  ],
]);

const DATE_ICON_MAP: Record<DateType, string> = {
  date: 'fas fa-calendar',
  'datetime-local': 'fas fa-calendar',
  month: 'fas fa-calendar-days',
  week: 'fas fa-calendar-week',
  time: 'fas fa-clock',
};

const ICONS = {
  spinner: 'fas fa-spinner fa-spin',
};

const PHONE_REGEX = /^\+?[0-9\s\-()]{7,20}$/; // Accepts 7–20 digits with optional +, spaces, hyphens, or parentheses
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ==============================================================================
// Component Definition
// ==============================================================================

@Component({
  selector: 'ZS-input',
  imports: [CommonModule, Zlabel],
  templateUrl: './zinput.html',
  styleUrl: './zinput.css',
})
export class Zinput {
  // ==============================================================================
  // Inputs
  // ==============================================================================

  readonly iId = input<string>(crypto.randomUUID());
  readonly iName = input<string | null>(null);
  readonly label = input<string | null>(null);
  readonly hint = input<string | null>(null);
  readonly placeholder = input<string | null>(null);
  readonly type = input<InputType>('text');
  readonly inputStyle = input<FormStyle>('normal');

  readonly disabled = input<boolean>(false);
  readonly isReadonly = input<boolean>(false);
  readonly autocomplete = input<string | null>('off');
  readonly required = input<boolean>(false);
  readonly inputmode = input<string | null>(null);

  readonly icon = input<string | null>(null);
  readonly showSearchIcon = input<boolean>(false);
  readonly showLoaderIconOnSearchInput = input<boolean>(false);

  readonly maxlength = input<number | null>(null);
  readonly minlength = input<number | null>(null);
  readonly spellcheck = input<boolean>(false);

  readonly min = input<string | number | null>(null);
  readonly max = input<string | number | null>(null);
  readonly step = input<number | null>(null);

  readonly validateFn = input<ValidatorFn>(() => []);
  readonly formatFn = input<FormatterFn>((val) => val?.trim() ?? null);

  readonly autofocus = input<boolean>(false);
  readonly searchDebounceDelay = input<number>(300);
  readonly size = input<FormSize>('md');

  // ==============================================================================
  // ViewChild
  // ==============================================================================

  readonly inputEl = viewChild<ElementRef<HTMLInputElement>>('inputEl');

  // ==============================================================================
  // Model
  // ==============================================================================

  readonly value = model<string | null>(null);
  readonly touched = model<boolean>(false); // Tracks if the user has interacted with the input

  // ==============================================================================
  // Outputs
  // ==============================================================================

  readonly enterEv = output<void>();
  readonly focusEv = output<void>();
  readonly blurEv = output<void>();
  readonly changedEv = output<ChangeEventType>();
  readonly searchEv = output<string | null>();
  readonly clearedEv = output<void>();
  readonly keydownEv = output<KeyboardEvent>();

  // ==============================================================================
  // Internal State (Signals)
  // ==============================================================================

  readonly showPassword = signal<boolean>(false);
  private searchDebounceTimer?: ReturnType<typeof setTimeout>;
  readonly loaderIconOnSearchInput = signal<string | null>(null); // Fixed typo: "Serach" → "Search"

  // ==============================================================================
  // Computed Properties
  // ==============================================================================

  readonly disabledOrReadonly = computed<boolean>(() => this.disabled() || this.isReadonly());

  readonly containerClasses = computed(() => {
    const baseClasses = 'border transition-all duration-150 focus-within:ring-2';
    const hasError = !!this.error();

    let styleConfig = FormPaletteMap.get(this.inputStyle()) ?? FormPaletteMap.get('normal')!;
    if (hasError) {
      styleConfig = FormPaletteMap.get('danger')!;
    }

    const disabledClass = this.disabled() ? 'opacity-60' : '';
    const interactionClass = this.disabledOrReadonly() ? 'cursor-not-allowed' : 'cursor-text';

    return [
      baseClasses,
      styleConfig.border,
      styleConfig.borderHover,
      styleConfig.inputBg,
      styleConfig.text,
      styleConfig.ring,
      disabledClass,
      interactionClass,
    ]
      .filter(Boolean)
      .join(' ');
  });

  // Computed date icon
  readonly isDate = computed<boolean>(() => {
    const dateTypes: DateType[] = ['date', 'datetime-local', 'month', 'week', 'time'];
    return dateTypes.includes(this.type() as DateType);
  });
  
  readonly dateIcon = computed(() => {
    if (this.icon()) return '';
    return DATE_ICON_MAP[this.type() as DateType] || 'fas fa-calendar';
  });

  readonly showClear = computed(() => this.type() !== 'password' && !!this.value());

  readonly error = computed<string[] | null>(() => {
    const val = this.value();
    const type = this.type();
    const required = this.required();
    const minlength = this.minlength();
    const maxlength = this.maxlength();
    const min = this.min();
    const max = this.max();

    // Only validate after user interaction
    if (!this.touched()) return null;

    const errors: string[] = [];

    // Required validation
    if (required && !val) {
      errors.push('This field is required');
    }

    // Min length
    if (minlength !== null && val && val.length < minlength) {
      errors.push(`The value must be at least ${minlength} characters`);
    }

    // Max length
    if (maxlength !== null && val && val.length > maxlength) {
      errors.push(`The value must be at most ${maxlength} characters`);
    }

    // Email format
    if (type === 'email' && val && !EMAIL_REGEX.test(val)) {
      errors.push('Please enter a valid email address');
    }

    // Number range & validity
    if (type === 'number' && val) {
      const num = Number(val);
      if (Number.isNaN(num)) {
        errors.push('Please enter a valid number');
      } else {
        if (min !== null && num < Number(min)) {
          errors.push(`The value must be at least ${min}`);
        }
        if (max !== null && num > Number(max)) {
          errors.push(`The value must be at most ${max}`);
        }
      }
    }

    // Date/Time Range Validation
    if (this.isDate() && val) {
      const valueTime = new Date(val).getTime();

      const minDate = min ? new Date(min as string).getTime() : null;
      const maxDate = max ? new Date(max as string).getTime() : null;

      if (minDate !== null && valueTime < minDate) {
        errors.push(`The date must be on or after ${min}`);
      }
      if (maxDate !== null && valueTime > maxDate) {
        errors.push(`The date must be on or before ${max}`);
      }
    }

    // Phone format
    if (type === 'phone' && val && !PHONE_REGEX.test(val)) {
      errors.push('Please enter a valid phone number');
    }

    // URL validity
    if (type === 'url' && val) {
      try {
        new URL(val);
      } catch {
        errors.push('Please enter a valid URL');
      }
    }

    // Custom validator
    const customErrors = this.validateFn()(val) ?? [];
    errors.push(...customErrors);

    return errors.length > 0 ? errors : null;
  });

  readonly supportsMinMaxStep = computed<boolean>(() => {
    const t = this.type();
    return this.isDate() || ['number'].includes(t);
  })

  // ==============================================================================
  // Getters
  // ==============================================================================

  get actualType(): string {
    if (this.type() === 'phone') return 'tel';
    if (this.type() === 'search') return 'text';
    if (this.type() === 'password' && this.showPassword()) return 'text';
    return this.type();
  }

  getSize(type: SizeClassesType): string {
    return SIZE_CLASSES_MAP.get(type)?.[this.size()] ?? '';
  }

  // ==============================================================================
  // Lifecycle Hooks
  // ==============================================================================

  ngAfterViewInit() {
    if (this.autofocus()) {
      queueMicrotask(() => this.inputEl()?.nativeElement.focus());
    }
  }

  // ==============================================================================
  // Event Handlers
  // ==============================================================================

  onInput(event: Event): void {
    if (this.disabledOrReadonly()) return;

    const value = (event.target as HTMLInputElement).value;
    this.value.set(value);

    // Handle search input with debounce and loader
    if (this.type() === 'search') {
      if (this.showLoaderIconOnSearchInput()) {
        this.loaderIconOnSearchInput.set(ICONS.spinner);
      }

      if (this.searchDebounceTimer) {
        clearTimeout(this.searchDebounceTimer);
      }

      this.searchDebounceTimer = setTimeout(() => {
        this.searchEv.emit(this.value());
        this.loaderIconOnSearchInput.set(null);
      }, this.searchDebounceDelay());
    }
  }

  onEnter(): void {
    if (this.disabledOrReadonly()) return;
    this.enterEv.emit();
  }

  onFocus(): void {
    this.focusEv.emit();
  }

  onBlur(): void {
    if (this.disabledOrReadonly()) return;
    this.touched.set(true);
    this.value.set(this.formatFn()(this.value()));
    this.blurEv.emit();
  }

  onChange(): void {
    if (this.disabledOrReadonly()) return;
    this.touched.set(true);

    const valid = this.error() === null;
    const value = this.value();
    this.changedEv.emit({ value , valid });
  }

  onSearch(): void {
    if (this.disabledOrReadonly()) return;
    this.searchEv.emit(this.value());
  }

  clear(): void {
    if (this.disabledOrReadonly()) return;
    this.value.set(null);

    const valid = this.error() === null;
    const value = null;
    this.changedEv.emit({ value, valid });

    this.searchEv.emit(null);
    this.clearedEv.emit();
  }

  togglePassword(): void {
    if (this.disabledOrReadonly()) return;
    this.showPassword.update((v) => !v);
  }

  onKeydown(event: KeyboardEvent): void {
    if (this.disabledOrReadonly()) return;
    this.keydownEv.emit(event);
  }
}