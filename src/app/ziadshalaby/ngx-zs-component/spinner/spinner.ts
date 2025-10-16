// =================================================================================================
// Types
// =================================================================================================

export type LoaderType = 'spinner' | 'pro' | 'double' | 'gear' | 'fan' | 'pulse' | 'dots' | 'bars';
export type LoaderSize = 'sm' | 'md' | 'lg';

export type BaseColors =
  | 'slate' | 'gray'   | 'zinc'    | 'neutral' | 'stone'
  | 'red'   | 'orange' | 'amber'   | 'yellow'  | 'rose'
  | 'lime'  | 'green'  | 'emerald' | 'teal'
  | 'cyan'  | 'sky'    | 'blue'    | 'indigo'
  | 'violet'| 'purple' | 'fuchsia' | 'pink';

export type LoaderColorPrefixes = 'text' | 'bg' | 'border';

// =================================================================================================
// Color Mapping
// =================================================================================================

export const LoaderColorMapping: Map<BaseColors, Record<LoaderColorPrefixes, string>> = new Map([
  ['slate',   { text: 'text-slate-600',   bg: 'bg-slate-600',   border: 'border-slate-600' }],
  ['gray',    { text: 'text-gray-600',    bg: 'bg-gray-600',    border: 'border-gray-600' }],
  ['zinc',    { text: 'text-zinc-600',    bg: 'bg-zinc-600',    border: 'border-zinc-600' }],
  ['neutral', { text: 'text-neutral-600', bg: 'bg-neutral-600', border: 'border-neutral-600' }],
  ['stone',   { text: 'text-stone-600',   bg: 'bg-stone-600',   border: 'border-stone-600' }],
  ['red',     { text: 'text-red-600',     bg: 'bg-red-600',     border: 'border-red-600' }],
  ['orange',  { text: 'text-orange-600',  bg: 'bg-orange-600',  border: 'border-orange-600' }],
  ['amber',   { text: 'text-amber-600',   bg: 'bg-amber-600',   border: 'border-amber-600' }],
  ['yellow',  { text: 'text-yellow-600',  bg: 'bg-yellow-600',  border: 'border-yellow-600' }],
  ['lime',    { text: 'text-lime-600',    bg: 'bg-lime-600',    border: 'border-lime-600' }],
  ['green',   { text: 'text-green-600',   bg: 'bg-green-600',   border: 'border-green-600' }],
  ['emerald', { text: 'text-emerald-600', bg: 'bg-emerald-600', border: 'border-emerald-600' }],
  ['teal',    { text: 'text-teal-600',    bg: 'bg-teal-600',    border: 'border-teal-600' }],
  ['cyan',    { text: 'text-cyan-600',    bg: 'bg-cyan-600',    border: 'border-cyan-600' }],
  ['sky',     { text: 'text-sky-600',     bg: 'bg-sky-600',     border: 'border-sky-600' }],
  ['blue',    { text: 'text-blue-600',    bg: 'bg-blue-600',    border: 'border-blue-600' }],
  ['indigo',  { text: 'text-indigo-600',  bg: 'bg-indigo-600',  border: 'border-indigo-600' }],
  ['violet',  { text: 'text-violet-600',  bg: 'bg-violet-600',  border: 'border-violet-600' }],
  ['purple',  { text: 'text-purple-600',  bg: 'bg-purple-600',  border: 'border-purple-600' }],
  ['fuchsia', { text: 'text-fuchsia-600', bg: 'bg-fuchsia-600', border: 'border-fuchsia-600' }],
  ['pink',    { text: 'text-pink-600',    bg: 'bg-pink-600',    border: 'border-pink-600' }],
  ['rose',    { text: 'text-rose-600',    bg: 'bg-rose-600',    border: 'border-rose-600' }],
]);

// =================================================================================================
// Component Definition
// =================================================================================================

import { Component, computed, input } from '@angular/core';

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
  readonly size = input<LoaderSize>('md');

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
      ? `p-4 rounded-lg shadow-md ${this.boxColorClass()}`
      : ''
  );

  readonly spinnerSizeTextClass = computed<string>(() => {
    const sizes: Record<LoaderSize, string> = {
      sm: 'text-3xl',
      md: 'text-5xl',
      lg: 'text-7xl'
    };
    return sizes[this.size()];
  });

  readonly spinnerSizeDotsClass = computed<string>(() => {
    const sizes: Record<LoaderSize, string> = {
      sm: 'size-2',
      md: 'size-4',
      lg: 'size-6'
    };
    return sizes[this.size()];
  });

  readonly spinnerSizeBarsClass = (num: number): string => {
    const sizes: Record<LoaderSize, string[]> = {
      sm: ['w-1 h-3', 'w-1 h-3.5', 'w-1 h-4'],
      md: ['w-1.5 h-6', 'w-1.5 h-8', 'w-1.5 h-10'],
      lg: ['w-2 h-8', 'w-2 h-9', 'w-2 h-10']
    };
    return sizes[this.size()][num - 1];
  };

  readonly spinnerSizeProClass = computed<string>(() => {
    const sizes: Record<LoaderSize, string> = {
      sm: 'border-t-3 border-b-3 size-7',
      md: 'border-t-5 border-b-5 size-12',
      lg: 'border-t-7 border-b-7 size-18'
    };
    return sizes[this.size()];
  });

  readonly spinnerSizePulseClass = computed<string>(() => {
    const sizes: Record<LoaderSize, string> = {
      sm: 'border-3 size-7',
      md: 'border-5 size-12',
      lg: 'border-7 size-18'
    };
    return sizes[this.size()];
  });

  readonly spinnerSizeDoubleClass = (num: 1 | 2): string => {
    const sizes: Record<LoaderSize, { 1: string; 2: string }> = {
      sm: { 1: 'border-3 size-7', 2: 'border-3 size-5' },
      md: { 1: 'border-5 size-12', 2: 'border-5 size-8.5' },
      lg: { 1: 'border-7 size-18', 2: 'border-7 size-13' }
    };
    return sizes[this.size()][num];
  };

  readonly bgColor = computed<string | undefined>(() =>
    LoaderColorMapping.get(this.color())?.bg
  );

  readonly borderColor = computed<string | undefined>(() =>
    LoaderColorMapping.get(this.color())?.border
  );

  readonly textColor = computed<string | undefined>(() =>
    LoaderColorMapping.get(this.color())?.text
  );
}