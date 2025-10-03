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

export type InputType =
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

  readonly id = input<string>(crypto.randomUUID());
  readonly name = input<string | null>(null);
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
  readonly step = input<number | null>(null);
  readonly min = input<number | null>(null);
  readonly max = input<number | null>(null);

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

  // ==============================================================================
  // Outputs
  // ==============================================================================

  readonly enter = output<void>();
  readonly focus = output<void>();
  readonly blur = output<void>();
  readonly change = output<string | null>();
  readonly search = output<string | null>();
  readonly cleared = output<void>();
  readonly keydown = output<KeyboardEvent>();

  // ==============================================================================
  // Internal State (Signals)
  // ==============================================================================

  private readonly touched = signal<boolean>(false); // Tracks if the user has interacted with the input
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
      styleConfig.bg,
      styleConfig.text,
      styleConfig.ring,
      disabledClass,
      interactionClass,
    ]
      .filter(Boolean)
      .join(' ');
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
        if (min !== null && num < min) {
          errors.push(`The value must be at least ${min}`);
        }
        if (max !== null && num > max) {
          errors.push(`The value must be at most ${max}`);
        }
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
        this.loaderIconOnSearchInput.set('fas fa-spinner fa-spin');
      }

      if (this.searchDebounceTimer) {
        clearTimeout(this.searchDebounceTimer);
      }

      this.searchDebounceTimer = setTimeout(() => {
        this.search.emit(this.value());
        this.loaderIconOnSearchInput.set(null);
      }, this.searchDebounceDelay());
    }
  }

  onEnter(): void {
    if (this.disabledOrReadonly()) return;
    this.enter.emit();
  }

  onFocus(): void {
    this.focus.emit();
  }

  onBlur(): void {
    if (this.disabledOrReadonly()) return;
    this.touched.set(true);
    this.value.set(this.formatFn()(this.value()));
    this.blur.emit();
  }

  onChange(): void {
    if (this.disabledOrReadonly()) return;
    this.change.emit(this.value());
  }

  onSearch(): void {
    if (this.disabledOrReadonly()) return;
    this.search.emit(this.value());
  }

  clear(): void {
    if (this.disabledOrReadonly()) return;
    this.value.set(null);
    this.change.emit(null);
    this.search.emit(null);
    this.cleared.emit();
  }

  togglePassword(): void {
    if (this.disabledOrReadonly()) return;
    this.showPassword.update((v) => !v);
  }

  onKeydown(event: KeyboardEvent): void {
    if (this.disabledOrReadonly()) return;
    this.keydown.emit(event);
  }
}