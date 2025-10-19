// =================================================================================================
// Types
// =================================================================================================

export type LoaderType = 'spinner' | 'pro' | 'double' | 'gear' | 'fan' | 'pulse' | 'dots' | 'bars';

// =================================================================================================
// Component Definition
// =================================================================================================

import { Component, computed, input } from '@angular/core';
import { BaseColors, BaseSize, ColorMapping } from '../palette-service/palette-service';

@Component({
  selector: 'ZS-spinner',
  imports: [],
  templateUrl: './spinner.html',
  styleUrl: './spinner.css'
})
export class Spinner {

  // =================================================================================================
  // Inputs
  // =================================================================================================

  readonly loading = input<boolean>(false);
  readonly isFloating = input<boolean>(false);
  readonly color = input<BaseColors>('blue');
  readonly withBox = input<boolean>(false);
  readonly boxColorClass = input<string>('bg-gray-300/90 dark:bg-gray-400/80');
  readonly type = input<LoaderType>('spinner');
  readonly size = input<BaseSize>('md');

  // =================================================================================================
  // Computed Properties
  // =================================================================================================

  readonly wrapperClasses = computed<string>(() =>
    this.isFloating()
      ? 'fixed inset-0 flex items-center justify-center z-[1200] bg-black/50 dark:bg-black/70'
      : 'flex items-center justify-center'
  );

  readonly boxClasses = computed<string>(() =>
    this.withBox()
      ? `p-5 rounded-lg shadow-md ${this.boxColorClass()}`
      : ''
  );

  readonly spinnerSizeTextClass = computed<string>(() => {
    const sizes: Record<BaseSize, string> = {
      sm: 'text-3xl',
      md: 'text-5xl',
      lg: 'text-7xl'
    };
    return sizes[this.size()];
  });

  readonly spinnerSizeDotsClass = computed<string>(() => {
    const sizes: Record<BaseSize, string> = {
      sm: 'size-2',
      md: 'size-4',
      lg: 'size-6'
    };
    return sizes[this.size()];
  });

  readonly spinnerSizeBarsClass = (num: number): string => {
    const sizes: Record<BaseSize, string[]> = {
      sm: ['w-1 h-3', 'w-1 h-3.5', 'w-1 h-4'],
      md: ['w-1.5 h-6', 'w-1.5 h-8', 'w-1.5 h-10'],
      lg: ['w-2 h-8', 'w-2 h-9', 'w-2 h-10']
    };
    return sizes[this.size()][num - 1];
  };

  readonly spinnerSizeProClass = computed<string>(() => {
    const sizes: Record<BaseSize, string> = {
      sm: 'border-t-3 border-b-3 size-7',
      md: 'border-t-5 border-b-5 size-12',
      lg: 'border-t-7 border-b-7 size-18'
    };
    return sizes[this.size()];
  });

  readonly spinnerSizePulseClass = computed<string>(() => {
    const sizes: Record<BaseSize, string> = {
      sm: 'border-3 size-7',
      md: 'border-5 size-12',
      lg: 'border-7 size-18'
    };
    return sizes[this.size()];
  });

  readonly spinnerSizeDoubleClass = (num: 1 | 2): string => {
    const sizes: Record<BaseSize, { 1: string; 2: string }> = {
      sm: { 1: 'border-3 size-7', 2: 'border-3 size-5' },
      md: { 1: 'border-5 size-12', 2: 'border-5 size-8.5' },
      lg: { 1: 'border-7 size-18', 2: 'border-7 size-13' }
    };
    return sizes[this.size()][num];
  };

  readonly bgColor = computed<string | undefined>(() =>
    ColorMapping.get(this.color())?.bg
  );

  readonly borderColor = computed<string | undefined>(() =>
    ColorMapping.get(this.color())?.border
  );

  readonly textColor = computed<string | undefined>(() =>
    ColorMapping.get(this.color())?.text
  );
}