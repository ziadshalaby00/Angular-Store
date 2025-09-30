import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { BaseColors, LoaderSize, LoaderType, LoaderColorMapping } from '../configTypeAndClsService/configTypeAndCls';

// ======================
// تعريف المكوّن (Component)
// ======================

@Component({
  selector: 'ZS-spinner',
  imports: [],
  templateUrl: './zspinner.html',
  styleUrl: './zspinner.css'
})
export class Zspinner {

  // ======================
  // المدخلات (Inputs)
  // ======================

  readonly isFloating = input<boolean>(false);
  readonly color = input<BaseColors>('blue');
  readonly withBox = input<boolean>(false);
  readonly boxColorClass = input<string>('bg-gray-300/90 dark:bg-gray-400/80');
  readonly type = input<LoaderType>('spinner');
  readonly size = input<LoaderSize>('md');


  // ======================
  // الحسابات (Computed Properties)
  // ======================

  readonly wrapperClasses = computed<string>(() =>
    this.isFloating()
      ? 'fixed inset-0 flex items-center justify-center z-[1000] bg-black/40 dark:bg-white/30'
      : 'flex items-center justify-center'
  );

  readonly boxClasses = computed<string>(() =>
    this.withBox()
      ? `p-4 rounded-lg shadow-md ${this.boxColorClass()}`
      : ''
  );

  readonly spinnerSizeTextClass = computed<string>(() => {
    const sizes: Record<LoaderSize, string> = {
      sm: 'text-2xl',
      md: 'text-4xl',
      lg: 'text-6xl'
    };
    return sizes[this.size()];
  });

  readonly spinnerSizeDotsClass = computed<string>(() => {
    const sizes: Record<LoaderSize, string> = {
      sm: 'size-2',
      md: 'size-3',
      lg: 'size-5'
    };
    return sizes[this.size()];
  });

  readonly spinnerSizeBarsClass = (num: number): string => {
    const sizes: Record<LoaderSize, string[]> = {
      sm: ['w-0.5 h-1.5', 'w-0.5 h-2.5', 'w-0.5 h-3.5'],
      md: ['w-1 h-3', 'w-1 h-4', 'w-1 h-5'],
      lg: ['w-2 h-5', 'w-2 h-6', 'w-2 h-7']
    };
    return sizes[this.size()][num - 1];
  };

  readonly spinnerSizeProClass = computed<string>(() => {
     const sizes: Record<LoaderSize, string> = {
      sm: 'border-t-2 border-b-2 h-6 w-6',
      md: 'border-t-4 border-b-4 h-10 w-10',
      lg: 'border-t-6 border-b-6 h-14 w-14'
    };
    return sizes[this.size()];
  })

  readonly spinnerSizePulseClass = computed<string>(() => {
     const sizes: Record<LoaderSize, string> = {
      sm: 'border-2 h-6 w-6',
      md: 'border-4 h-10 w-10',
      lg: 'border-6 h-14 w-14'
    };
    return sizes[this.size()];
  })

  readonly spinnerSizeDoubleClass = (num: 1 | 2): string => {
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

  readonly bgColor = computed<string | undefined>(() => {
    return LoaderColorMapping.get(this.color())?.bg
  })

  readonly borderColor = computed<string | undefined>(() => {
    return LoaderColorMapping.get(this.color())?.border
  })

  readonly textColor = computed<string | undefined>(() => {
    return LoaderColorMapping.get(this.color())?.text
  })
}