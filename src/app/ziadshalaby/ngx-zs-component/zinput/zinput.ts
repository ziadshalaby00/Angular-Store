import { CommonModule } from '@angular/common';
import { Component, computed, ElementRef, inject, input, model, output, signal, ViewChild } from '@angular/core';
import { ZinputService, InputStyle, paletteMap } from '../zinputService/zinput-service';

// ----------------------
// Types
// ----------------------
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

// ----------------------
// Regex
// ----------------------
const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/; // يقبل فقط أرقام (7–20) مع + أو () أو - أو مسافات
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ----------------------
// Component Decorator
// ----------------------
@Component({
  selector: 'ZS-input',
  imports: [CommonModule],
  templateUrl: './zinput.html',
  styleUrl: './zinput.css'
})
export class Zinput {
  inputService: ZinputService = inject(ZinputService)

  // ----------------------
  // Inputs (signal-style)
  // ----------------------
  readonly id = input<string>(crypto.randomUUID());
  readonly name = input.required<string>();
  readonly label = input<string | null>(null);
  readonly hint = input<string | null>(null);

  readonly placeholder = input<string | null>(null);
  readonly type = input<InputType>('text');
  readonly inputStyle = input<InputStyle>('normal');

  readonly disabled = input<boolean>(false);
  readonly isReadonly = input<boolean>(false);
  readonly autocomplete = input<string | null>('off');
  readonly required = input<boolean>(false);
  readonly inputmode = input<string | null>(null);

  readonly icon = input<string | null>(null);
  readonly showSearchIcon = input<boolean>(false);

  readonly maxlength = input<number | null>(null);
  readonly minlength = input<number | null>(null);
  readonly spellcheck = input<boolean>(false);
  readonly step = input<number | null>(null);
  readonly min = input<number | null>(null);
  readonly max = input<number | null>(null);

  readonly validateFn = input<ValidatorFn>(() => []);
  readonly formatFn = input<FormatterFn>((val) => val?.trim() ?? null);

  readonly autofocus = input<boolean>(false);

  // ----------------------
  // ViewChild
  // ----------------------
  @ViewChild('inputEl') inputEl!: ElementRef<HTMLInputElement>;

  // ----------------------
  // Model
  // ----------------------
  readonly value = model<string | null>(null);

  // ----------------------
  // Outputs
  // ----------------------
  readonly enter = output<void>();
  readonly focus = output<void>();
  readonly blur = output<void>();
  readonly change = output<string | null>();
  readonly search = output<void>();
  readonly cleared = output<void>();
  readonly keydown = output<KeyboardEvent>();

  // ----------------------
  // Internal State
  // ----------------------
  private readonly touched = signal(false); // ✅ لتعقب التفاعل

  // ----------------------
  // Getters
  // ----------------------
  get actualType(): string {
    if (this.type() === 'phone') return 'tel';
    if (this.type() === 'search') return 'text';
    return this.type();
  }

  // ----------------------
  // Computed Properties
  // ----------------------
  readonly containerClasses = computed(() => {
    const base =
      'w-full rounded-lg border px-3 py-2 transition-all duration-150 focus-within:ring-2';
    const inputStyle = this.inputStyle();
    const hasError = !!this.error();
    const isDisabled = this.disabled();

    let inputStyleEntry = paletteMap.get(inputStyle) ?? paletteMap.get('normal');

    if (hasError) {
      inputStyleEntry = paletteMap.get('danger');
    }

    const disabledCls = isDisabled
      ? 'opacity-60 cursor-not-allowed'
      : 'cursor-text';

    return [
      base,
      inputStyleEntry?.border,
      inputStyleEntry?.borderHover,
      inputStyleEntry?.bg,
      inputStyleEntry?.text,
      inputStyleEntry?.ring,
      disabledCls,
    ].join(' ');
  });

  readonly showClear = computed(() => {
    return this.type() !== 'password' && !!this.value();
  });

  readonly error = computed<string[] | null>(() => {
    let result = Array()

    const val = this.value();
    const type = this.type();
    const required = this.required();
    const minlength = this.minlength();
    const maxlength = this.maxlength();
    const min = this.min();
    const max = this.max();

    // ✅ لا يظهر أي خطأ إلا بعد التفاعل
    if (!this.touched()) return null;

    // 1. required
    if (required && !val) {
      result.push('This field is required');
    }

    // 2. minlength
    if (minlength !== null && val && val.length < minlength) {
      result.push(`The value must be at least ${minlength} characters`);
    }

    // 3. maxlength
    if (maxlength !== null && val && val.length > maxlength) {
      result.push(`The value must be at most ${maxlength} characters`);
    }

    // 4. email
    if (type === 'email' && val) {
      if (!emailRegex.test(val)) {
        result.push('Please enter a valid email address');
      }
    }

    // 5. number (min/max)
    if (type === 'number' && val) {
      const num = Number(val);
      if (!Number.isNaN(num)) {
        if (min !== null && num < min) {
          result.push(`The value must be at least ${min}`);
        }
        if (max !== null && num > max) {
          result.push(`The value must be at most ${max}`);
        }
      } else {
        result.push('Please enter a valid number');
      }
    }

    // 6. phone
    if (type === 'phone' && val) {
      if (!phoneRegex.test(val)) {
        result.push('Please enter a valid phone number');
      }
    }

    // 7. custom validator
    result.push(...(this.validateFn()(val) ?? []));

    return result.length !== 0 ? result : null;
  });

  // ----------------------
  // Lifecycle Hooks
  // ----------------------
  ngAfterViewInit() {
    if (this.autofocus()) {
      queueMicrotask(() => this.inputEl.nativeElement.focus());
    }
  }

  // ----------------------
  // Event Handlers
  // ----------------------
  onInput(ev: Event) {
    const v = (ev.target as HTMLInputElement).value;
    this.value.set(v);
  }

  onEnter() {
    this.enter.emit();
  }

  onFocus() {
    this.focus.emit();
  }

  onBlur() {
    this.touched.set(true); // ✅ المستخدم لمس الحقل
    this.value.set(this.formatFn()(this.value()))
    this.blur.emit();
  }

  onChange() {
    this.change.emit(this.value());
  }

  onSearch() {
    this.search.emit();
  }

  clear() {
    if (this.disabled()) return;
    this.value.set(null);
    this.change.emit(null);
    this.cleared.emit();
  }

  onKeydown(ev: KeyboardEvent) {
    this.keydown.emit(ev);
  }
}