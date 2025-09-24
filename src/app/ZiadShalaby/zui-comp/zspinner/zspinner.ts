import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';

export type LoaderType = 'spinner' | 'pro' | 'double' | 'gear' | 'fan' | 'pulse' | 'dots' | 'bars';
export type LoaderSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-zspinner',
  imports: [],
  templateUrl: './zspinner.html',
  styleUrl: './zspinner.css'
})
export class Zspinner {
  // Inputs (signals)
  isFloating = input<boolean>(false);
  color = input<string>('blue-600'); // for spinner/pulse use `text-...`, for dots/bars use `bg-...`
  withBox = input<boolean>(false);
  boxColor = input<string>('bg-gray-300/90 dark:bg-gray-400/80');
  type = input<LoaderType>('spinner');
  size = input<LoaderSize>('md');

  // computed classes (return strings)
  wrapperClasses = computed<string>(() =>
    this.isFloating()
      ? 'fixed inset-0 flex items-center justify-center z-100 bg-black/40 dark:bg-white/30'
      : 'flex items-center justify-center'
  );

  boxClasses = computed<string>(() =>
    this.withBox()
      ? `p-4 rounded-lg shadow-md ${this.boxColor()}`
      : ''
  );

  spinnerSizeTextClass = computed<string>(() => {
    const sizes: Record<LoaderSize, string> = {
      sm: 'text-2xl',
      md: 'text-4xl',
      lg: 'text-6xl'
    };
    return sizes[this.size()];
  });

  spinnerSizeDotsClass = computed<string>(() => {
    const sizes: Record<LoaderSize, string> = {
      sm: 'size-2',
      md: 'size-3',
      lg: 'size-5'
    };
    return sizes[this.size()];
  });

  spinnerSizeBarsClass = (num: number): string => {
    const sizes: Record<LoaderSize, string[]> = {
      sm: ['w-0.5 h-1.5', 'w-0.5 h-2.5', 'w-0.5 h-3.5'],
      md: ['w-1 h-3', 'w-1 h-4', 'w-1 h-5'],
      lg: ['w-2 h-5', 'w-2 h-6', 'w-2 h-7']
    };
    return sizes[this.size()][num - 1];
  };

  spinnerSizeProClass = computed<string>(() => {
     const sizes: Record<LoaderSize, string> = {
      sm: 'border-t-2 border-b-2 h-6 w-6',
      md: 'border-t-4 border-b-4 h-10 w-10',
      lg: 'border-t-6 border-b-6 h-14 w-14'
    };
    return sizes[this.size()];
  })

  spinnerSizePulseClass = computed<string>(() => {
     const sizes: Record<LoaderSize, string> = {
      sm: 'border-2 h-6 w-6',
      md: 'border-4 h-10 w-10',
      lg: 'border-6 h-14 w-14'
    };
    return sizes[this.size()];
  })

  spinnerSizeDoubleClass = (num: 1 | 2): string => {
     const sizes: Record<LoaderSize, {1: string, 2: string}> = {
      sm: {
        1: 'border-2 size-6',
        2: 'border-2 size-4'
      },
      md: {
        1: 'border-4 size-10',
        2: 'border-4 size-7'
      },
      lg: {
        1: 'border-6 size-16',
        2: 'border-6 size-11'
      },
    };
    return sizes[this.size()][num];
  }

  bgColor = computed<string>(() => {
    return `bg-${this.color()}`
  })

  borderColor = computed<string>(() => {
    return `border-${this.color()}`
  })

  textColor = computed<string>(() => {
    return `text-${this.color()}`
  })
}
