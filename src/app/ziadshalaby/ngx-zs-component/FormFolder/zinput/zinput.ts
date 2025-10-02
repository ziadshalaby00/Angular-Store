import { CommonModule } from '@angular/common';
import { Component, computed, ElementRef, input, model, output, signal, viewChild } from '@angular/core';
import { FormPaletteMap, FormSize, FormStyle } from '../zformService/zform-service';
import { Zlabel } from '../zlabel/zlabel';

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

type sizeClassesType = 'container' | 'field' | 'leftIcon' | 'rightIcon';

// ----------------------
// Constants & Regex
// ----------------------
const sizeClassesMap = new Map<sizeClassesType, Record<FormSize, string>>([
  ['container', { 
    sm: 'px-2 py-1 rounded-md', 
    md: 'px-3 py-2 rounded-lg', 
    lg: 'px-4 py-3 rounded-lg' 
  }],

  ['field', { 
    sm: 'text-xs', 
    md: 'text-sm', 
    lg: 'text-base' 
  }],

  ['leftIcon', { 
    sm: 'text-sm mr-1.5', 
    md: 'text-base mr-2', 
    lg: 'text-lg mr-2.5' 
  }],

  ['rightIcon', { 
    sm: 'text-xs', 
    md: 'text-sm', 
    lg: 'text-base' 
  }]
]);

const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/; // يقبل فقط أرقام (7–20) مع + أو () أو - أو مسافات
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ----------------------
// Component Decorator
// ----------------------
@Component({
  selector: 'ZS-input',
  imports: [CommonModule, Zlabel],
  templateUrl: './zinput.html',
  styleUrl: './zinput.css'
})
export class Zinput {
  // ----------------------
  // Inputs (signal-style)
  // ----------------------
  readonly id = input<string>(crypto.randomUUID());
  readonly name = input.required<string>();
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
  readonly showLoaderIconOnSerachInput = input<boolean>(false);

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

  // ----------------------
  // ViewChild
  // ----------------------
  readonly inputEl = viewChild<ElementRef<HTMLInputElement>>('inputEl');

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
  readonly search = output<string | null>();
  readonly cleared = output<void>();
  readonly keydown = output<KeyboardEvent>();

  // ----------------------
  // Internal State (Signals)
  // ----------------------
  private readonly touched = signal<boolean>(false); // ✅ لتعقب التفاعل
  readonly showPassword = signal<boolean>(false);
  private searchDebounceTimer?: ReturnType<typeof setTimeout>;
  readonly LoaderIconOnSerachInput = signal<string | null>(null); 

  // ----------------------
  // Computed Properties
  // ----------------------
  readonly disabledOrReadonly = computed<boolean>(() => (this.disabled() || this.isReadonly()));

  readonly containerClasses = computed(() => {
    const base = 'border transition-all duration-150 focus-within:ring-2';
    const hasError = !!this.error();

    let inputStyleEntry = FormPaletteMap.get(this.inputStyle()) ?? FormPaletteMap.get('normal');

    if (hasError) {
      inputStyleEntry = FormPaletteMap.get('danger');
    }

    const disabledCls = this.disabled() ? 'opacity-60' : '';
    const disabeldOrReadonlyCls = this.disabledOrReadonly()
      ? 'cursor-not-allowed'
      : 'cursor-text';

    return [
      base,
      inputStyleEntry?.border,
      inputStyleEntry?.borderHover,
      inputStyleEntry?.bg,
      inputStyleEntry?.text,
      inputStyleEntry?.ring,
      disabledCls,
      disabeldOrReadonlyCls
    ].filter(Boolean).join(' ');
  });

  readonly showClear = computed(() => {
    return this.type() !== 'password' && !!this.value();
  });

  readonly error = computed<string[] | null>(() => {
    let result = Array();

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

    // 7. url
    if (type === 'url' && val) {
      try {
        new URL(val); // يمكنك استخدام هذه الطريقة للتحقق من صحة الرابط
      } catch {
        result.push('Please enter a valid URL');
      }
    }

    // 8. custom validator
    result.push(...(this.validateFn()(val) ?? []));

    return result.length !== 0 ? result : null;
  });

  // ----------------------
  // Getters
  // ----------------------
  get actualType(): string {
    if (this.type() === 'phone') return 'tel';
    if (this.type() === 'search') return 'text';
    if (this.type() === 'password' && this.showPassword()) {
      return 'text'; // 👈 لو عايز تظهر الباسورد
    }
    return this.type();
  }

  getSize(type: sizeClassesType): string {
    return sizeClassesMap.get(type)?.[this.size()] ?? '';
  }

  // ----------------------
  // Lifecycle Hooks
  // ----------------------
  ngAfterViewInit() {
    if (this.autofocus()) {
      queueMicrotask(() => this.inputEl()?.nativeElement.focus());
    }
  }

  // ----------------------
  // Event Handlers
  // ----------------------
  onInput(ev: Event) {
    if (this.disabledOrReadonly()) return;
    const v = (ev.target as HTMLInputElement).value;
    this.value.set(v);

    // 👇 لو الحقل Search نعمل debounce
    if (this.type() === 'search') {
      if (this.showLoaderIconOnSerachInput()) 
        this.LoaderIconOnSerachInput.set('fas fa-spinner fa-spin');

      if (this.searchDebounceTimer)
        clearTimeout(this.searchDebounceTimer);
      
      this.searchDebounceTimer = setTimeout(() => {
        this.search.emit(this.value()); // ✅ بعد delay
        this.LoaderIconOnSerachInput.set(null);
      }, this.searchDebounceDelay());
    }
  }

  onEnter() {
    if (this.disabledOrReadonly()) return;
    this.enter.emit();
  }

  onFocus() {
    this.focus.emit();
  }

  onBlur() {
    if (this.disabledOrReadonly()) return;
    this.touched.set(true); // ✅ المستخدم لمس الحقل
    this.value.set(this.formatFn()(this.value()));
    this.blur.emit();
  }

  onChange() {
    if (this.disabledOrReadonly()) return;
    this.change.emit(this.value());
  }

  onSearch() {
    if (this.disabledOrReadonly()) return;
    this.search.emit(this.value());
  }

  clear() {
    if (this.disabledOrReadonly()) return;

    this.value.set(null);
    this.change.emit(null);
    this.search.emit(null);
    this.cleared.emit();
  }

  togglePassword() {
    if (this.disabledOrReadonly()) return;
    this.showPassword.update((v) => !v);
  }

  onKeydown(ev: KeyboardEvent) {
    if (this.disabledOrReadonly()) return;
    this.keydown.emit(ev);
  }
}