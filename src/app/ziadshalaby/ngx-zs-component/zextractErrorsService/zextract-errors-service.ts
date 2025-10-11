import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ZextractErrorsService {
  /**
   * Extract all error messages recursively from any structure
   * @param input - could be string | string[] | object | | Error | null | undefined
   * @returns string[] - flattened array of all messages
   */
  extract(input: unknown): string[] {
    const result: string[] = [];
    const seen = new WeakSet();

    const traverse = (value: unknown): void => {
      if (value == null) return; // null or undefined

      if (typeof value === 'string') {
        result.push(String(value));
      } else if (Array.isArray(value)) {
        for (const item of value) traverse(item);
      } else if (value instanceof Error) {
        result.push(value.message);
      } else if (typeof value === 'object') {
        if (seen.has(value)) return;
        seen.add(value);

        for (const key of Object.keys(value as object)) {
          traverse((value as any)[key]);
        }
      }
    };

    traverse(input);
    return result;
  }
}
