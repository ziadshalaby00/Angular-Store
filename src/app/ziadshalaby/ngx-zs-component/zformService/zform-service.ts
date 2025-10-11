// ==============================================
// Types
// ==============================================

import { signal, computed, WritableSignal } from '@angular/core';

export type ZFormField<T> = WritableSignal<T | null>;

export type ZFormFieldMap<T extends Record<string, any>> = {
  [K in keyof T]: ZFormField<T[K]>;
};

// ==============================================
// Zform Class
// ==============================================

export class Zform<T extends Record<string, any>> {
  readonly fields: ZFormFieldMap<T>;
  readonly touched = signal(false);

  constructor(initial: T) {
    this.fields = Object.keys(initial).reduce((acc, key) => {
      (acc as any)[key] = signal(initial[key]);
      return acc;
    }, {} as ZFormFieldMap<T>);
  }

  // ==============================================
  // Field Accessors
  // ==============================================

  set<K extends keyof T>(key: K, value: T[K] | null): void {
    this.fields[key].set(value);
  }

  get<K extends keyof T>(key: K): T[K] | null {
    return this.fields[key]();
  }

  // ==============================================
  // Form State & Validation
  // ==============================================

  readonly allFilled = computed(() => {
    return Object.values(this.fields).every(f => f() !== null && f() !== '');
  });

  private markAllTouched(): void {
    this.touched.set(true);
  }

  // ==============================================
  // Data Extraction & Submission
  // ==============================================

  getValues(): T {
    const result: Partial<T> = {};
    for (const key in this.fields) {
      if (this.fields.hasOwnProperty(key)) {
        result[key] = this.fields[key]() ?? undefined;
      }
    }
    return result as T;
  }

  submit(callback: (values: T) => void): void {
    this.markAllTouched();
    if (!this.allFilled()) return;
    callback(this.getValues());
  }
}