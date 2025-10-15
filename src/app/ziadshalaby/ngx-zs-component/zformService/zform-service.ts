// ==============================================
// Types
// ==============================================

import { signal, computed, WritableSignal } from '@angular/core';

// نوع الحقل الواحد: يحتوي على value و valid
export type ZFormField<T> = WritableSignal<{ value: T | null; valid: boolean }>;

// خريطة الحقول كلها
export type ZFormFieldMap<T extends Record<string, any>> = {
  [K in keyof T]: ZFormField<T[K]>;
};

// ==============================================
// Zform Class
// ==============================================

export class Zform<T extends Record<string, any>> {
  public readonly fields: ZFormFieldMap<T>;
  public readonly touched = signal(false);

  constructor(initial: T) {
    this.fields = Object.keys(initial).reduce((acc, key) => {
      (acc as any)[key] = signal({
        value: initial[key],
        valid: false,
      });
      return acc;
    }, {} as ZFormFieldMap<T>);
  }

  // ==============================================
  // Field Accessors
  // ==============================================

  public set<K extends keyof T>(key: K, value: T[K] | null, valid: boolean = true): void {
    this.fields[key].set({ value, valid });
  }

  public patch<K extends keyof T>(key: K, partial: Partial<{ value: T[K] | null; valid: boolean }>): void {
    const current = this.fields[key]();
    this.fields[key].set({ ...current, ...partial });
  }

  public get<K extends keyof T>(key: K): { value: T[K] | null; valid: boolean } {
    return this.fields[key]();
  }

  // ==============================================
  // Form State & Validation
  // ==============================================

  public readonly allFilled = computed(() => {
    return Object.values(this.fields).every(f => {
      const v = f();
      return v.value !== null && v.value !== '' && v.valid === true;
    });
  });

  private markAllTouched(): void {
    this.touched.set(true);
  }

  // ==============================================
  // Data Extraction & Submission
  // ==============================================

  public getValues(): T {
    const result: Partial<T> = {};
    for (const key in this.fields) {
      if (this.fields.hasOwnProperty(key)) {
        result[key] = this.fields[key]().value ?? undefined;
      }
    }
    return result as T;
  }

  public getValidations(): Record<keyof T, boolean> {
    const result: Partial<Record<keyof T, boolean>> = {};
    for (const key in this.fields) {
      if (this.fields.hasOwnProperty(key)) {
        result[key] = this.fields[key]().valid;
      }
    }
    return result as Record<keyof T, boolean>;
  }

  public submit(callback: (values: T) => void): void {
    this.markAllTouched();

    const allFilled = this.allFilled()
    const allValid = Object.values(this.getValidations()).every(v => v === true);

    if (!allFilled || !allValid) return;

    callback(this.getValues());
  }
}
