import { CommonModule } from '@angular/common';
import { Component, computed, input, model, output, signal } from '@angular/core';

export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
export type InputStyle =
| 'primary'
| 'normal'
| 'secondary'
| 'success'
| 'danger'
| 'warning'
| 'info'
| 'dark'
| 'light'
| 'violet'
| 'teal';

export interface PaletteEntry {
  border: string;
  bg: string;
  text: string;
  ring: string;
}

export const palette: Record<InputStyle, PaletteEntry> = {
  normal: {
    border: 'border-slate-200 dark:border-slate-700',
    bg: 'bg-white dark:bg-slate-800',
    text: 'text-slate-900 dark:text-slate-100',
    ring: 'focus-within:ring-slate-400 dark:focus-within:ring-slate-500',
  },
  primary: {
    border: 'border-blue-200 dark:border-blue-700',
    bg: 'bg-white dark:bg-slate-900',
    text: 'text-blue-900 dark:text-blue-100',
    ring: 'focus-within:ring-blue-400 dark:focus-within:ring-blue-500',
  },
  secondary: {
    border: 'border-slate-200 dark:border-slate-700',
    bg: 'bg-white dark:bg-slate-800',
    text: 'text-slate-900 dark:text-slate-100',
    ring: 'focus-within:ring-slate-300 dark:focus-within:ring-slate-600',
  },
  success: {
    border: 'border-green-300 dark:border-green-600',
    bg: 'bg-white dark:bg-slate-900',
    text: 'text-green-800 dark:text-green-300',
    ring: 'focus-within:ring-green-400 dark:focus-within:ring-green-600',
  },
  danger: {
    border: 'border-red-300 dark:border-red-600',
    bg: 'bg-white dark:bg-slate-900',
    text: 'text-red-800 dark:text-red-300',
    ring: 'focus-within:ring-red-400 dark:focus-within:ring-red-600',
  },
  warning: {
    border: 'border-yellow-300 dark:border-yellow-600',
    bg: 'bg-white dark:bg-slate-900',
    text: 'text-yellow-800 dark:text-yellow-300',
    ring: 'focus-within:ring-yellow-400 dark:focus-within:ring-yellow-600',
  },
  info: {
    border: 'border-cyan-300 dark:border-cyan-600',
    bg: 'bg-white dark:bg-slate-900',
    text: 'text-cyan-800 dark:text-cyan-300',
    ring: 'focus-within:ring-cyan-400 dark:focus-within:ring-cyan-600',
  },
  dark: {
    border: 'border-slate-800 dark:border-slate-200',
    bg: 'bg-slate-100 dark:bg-slate-900',
    text: 'text-slate-900 dark:text-slate-100',
    ring: 'focus-within:ring-slate-500 dark:focus-within:ring-slate-400',
  },
  light: {
    border: 'border-slate-200 dark:border-slate-700',
    bg: 'bg-white dark:bg-slate-800',
    text: 'text-slate-900 dark:text-slate-100',
    ring: 'focus-within:ring-slate-300 dark:focus-within:ring-slate-600',
  },
  violet: {
    border: 'border-violet-300 dark:border-violet-600',
    bg: 'bg-white dark:bg-slate-900',
    text: 'text-violet-800 dark:text-violet-300',
    ring: 'focus-within:ring-violet-400 dark:focus-within:ring-violet-600',
  },
  teal: {
    border: 'border-teal-300 dark:border-teal-600',
    bg: 'bg-white dark:bg-slate-900',
    text: 'text-teal-800 dark:text-teal-300',
    ring: 'focus-within:ring-teal-400 dark:focus-within:ring-teal-600',
  },
};


@Component({
  selector: 'ZS-input',
  imports: [CommonModule],
  templateUrl: './zinput.html',
  styleUrl: './zinput.css'
})
export class Zinput {
  // ----------------------
  // Inputs (signal-style)
  // ----------------------
  readonly id = input<string>(crypto.randomUUID());
  readonly label = input<string | undefined>(undefined);
  readonly hint = input<string | undefined>(undefined);
  readonly placeholder = input<string>('');
  readonly type = input<InputType>('text');
  readonly inputStyle = input<InputStyle>('normal');
  readonly disabled = input<boolean>(false);
  readonly icon = input<string | undefined>(undefined); // FontAwesome class, e.g. 'fa fa-envelope'
  readonly autocomplete = input<string | null>('off');
  readonly maxlength = input<number | null>(null);

  readonly min = input<number | null>(null);
  readonly max = input<number | null>(null);
  readonly required = input<boolean>(false);
  readonly validateFn = input<(value: string | null) => string | null>(() => null); // دالة تحقق مخصصة
  readonly showSearchIcon = input<boolean>(false); // لتفعيل أيقونة البحث يدويًا إذا أردت


  // ----------------------
  // Model (two-way) - writable signal + auto-generated Change output
  // ----------------------
  readonly value = model<string>('');


  // ----------------------
  // Additional outputs
  // ----------------------
  readonly enter = output<void>();
  readonly focus = output<void>();
  readonly blur = output<void>();
  readonly change = output<string>();
  readonly search = output<void>();


  // ----------------------
  // Internal computed classes
  // ----------------------
  readonly containerClasses = computed(() => {
    const base =
      'w-full rounded-lg border px-3 py-2 transition-all duration-150 focus-within:ring-2';
    const inputStyle = this.inputStyle();
    const hasError = !!this.error();
    const isDisabled = this.disabled();

    let inputStyleEntry = palette[inputStyle] ?? palette.normal;

    if (hasError) {
      // لو فيه error نستخدم danger مباشرة
      inputStyleEntry = palette.danger;
    }

    const disabledCls = isDisabled
      ? 'opacity-60 cursor-not-allowed'
      : 'cursor-text';

    return [base, inputStyleEntry.border, inputStyleEntry.bg, inputStyleEntry.text, inputStyleEntry.ring, disabledCls].join(' ');
  });


  // ----------------------
  // Convenience signals
  // ----------------------
  readonly showClear = computed(() => {
    return this.type() !== 'password' && !!this.value();
  });

  readonly error = computed(() => {
    const val = this.value();
    const type = this.type();
    const required = this.required();

    // 1. التحقق من الحقل المطلوب
    if (required && !val) {
      return 'This field is required';
    }

    // 2. التحقق من نوع البريد الإلكتروني
    if (type === 'email' && val) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(val)) {
        return 'Please enter a valid email address';
      }
    }

    // 3. التحقق من min/max للـ number
    if (type === 'number' && val) {
      const num = Number(val);
      const min = this.min();
      const max = this.max();

      if (min !== null && num < min) {
        return `The value must be at least ${min}`;
      }
      if (max !== null && num > max) {
        return `The value must be at most ${max}`;
      }
    }

    // 4. التحقق المخصص
    const customValidator = this.validateFn();
    if (customValidator) {
      return customValidator(val);
    }

    return null;
  });

  // ----------------------
  // Events / Handlers
  // ----------------------
  onInput(ev: Event) {
    const v = (ev.target as HTMLInputElement).value;
    this.value.set(v);
    this.change.emit(v);
  }

  onEnter() {
    this.enter.emit();
  }

  onFocus() {
    this.focus.emit();
  }

  onBlur() {
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
    this.value.set('');
    this.change.emit('');
  }
}