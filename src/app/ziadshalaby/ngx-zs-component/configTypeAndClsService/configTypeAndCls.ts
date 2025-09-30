import { Injectable } from '@angular/core';

// =================================================================================================
// =================================================================================================
export interface Alert {
  id: number | string;
  message: string;
  type: 'success' | 'danger' | 'warning' | 'info';
  autoClose?: boolean;
  duration?: number;
  showCloseButton?: boolean;
  progress?: number;
}

export interface AlertFullType extends Alert {
  icon: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
}

export type oldAlertsType = Set<number | string>;

export const ALERT_CONFIG: Record<Alert['type'], Omit<AlertFullType, keyof Alert>> = {
  success: { icon: 'fas fa-check-circle', bgColor: 'bg-green-100 dark:bg-green-800', textColor: 'text-green-800 dark:text-green-100', borderColor: 'border-green-500 dark:border-green-300' },
  danger: { icon: 'fas fa-exclamation-circle', bgColor: 'bg-red-100 dark:bg-red-800', textColor: 'text-red-800 dark:text-red-100', borderColor: 'border-red-500 dark:border-red-300' },
  warning: { icon: 'fas fa-exclamation-triangle', bgColor: 'bg-yellow-100 dark:bg-yellow-800', textColor: 'text-yellow-800 dark:text-yellow-100', borderColor: 'border-yellow-500 dark:border-yellow-300' },
  info: { icon: 'fas fa-info-circle', bgColor: 'bg-blue-100 dark:bg-blue-800', textColor: 'text-blue-800 dark:text-blue-100', borderColor: 'border-blue-500 dark:border-blue-300' },
};
// =================================================================================================
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
// =================================================================================================

export type FormStyle =
| 'primary' | 'normal' | 'secondary'
| 'success' | 'danger' | 'warning'
| 'info'    | 'dark'   | 'light'
| 'violet'  | 'teal';

export interface FormPaletteEntry {
  border: string;
  borderHover: string;
  bg: string;
  bgSelect: string;
  text: string;
  textHover: string;   
  ring: string;
}

export const FormPaletteMap = new Map<FormStyle, FormPaletteEntry>([
  ['normal',    { border: 'border-slate-200 dark:border-slate-700',   borderHover: 'hover:border-slate-400 dark:hover:border-slate-500',    bg: 'bg-white dark:bg-slate-800',     text: 'text-slate-900 dark:text-slate-100',   textHover: 'hover:text-slate-700 dark:hover:text-slate-300',    ring: 'focus-within:ring-slate-400 dark:focus-within:ring-slate-500',     bgSelect: 'bg-slate-200 dark:bg-slate-800'    }],
  ['primary',   { border: 'border-blue-200 dark:border-blue-700',     borderHover: 'hover:border-blue-400 dark:hover:border-blue-500',      bg: 'bg-white dark:bg-slate-900',     text: 'text-blue-900 dark:text-blue-100',     textHover: 'hover:text-blue-700 dark:hover:text-blue-300',      ring: 'focus-within:ring-blue-400 dark:focus-within:ring-blue-500',       bgSelect: 'bg-blue-200 dark:bg-blue-800'      }],
  ['secondary', { border: 'border-slate-200 dark:border-slate-700',   borderHover: 'hover:border-slate-400 dark:hover:border-slate-500',    bg: 'bg-white dark:bg-slate-800',     text: 'text-slate-900 dark:text-slate-100',   textHover: 'hover:text-slate-700 dark:hover:text-slate-300',    ring: 'focus-within:ring-slate-300 dark:focus-within:ring-slate-600',     bgSelect: 'bg-slate-200 dark:bg-slate-800'    }],
  ['success',   { border: 'border-green-300 dark:border-green-600',   borderHover: 'hover:border-green-400 dark:hover:border-green-500',    bg: 'bg-white dark:bg-slate-900',     text: 'text-green-800 dark:text-green-300',   textHover: 'hover:text-green-700 dark:hover:text-green-400',    ring: 'focus-within:ring-green-400 dark:focus-within:ring-green-600',     bgSelect: 'bg-green-200 dark:bg-green-800'    }],
  ['danger',    { border: 'border-red-300 dark:border-red-600',       borderHover: 'hover:border-red-400',                                  bg: 'bg-white dark:bg-slate-900',     text: 'text-red-800 dark:text-red-300',       textHover: 'hover:text-red-700 dark:hover:text-red-400',        ring: 'focus-within:ring-red-400 dark:focus-within:ring-red-600',         bgSelect: 'bg-red-200 dark:bg-red-800'        }],
  ['warning',   { border: 'border-yellow-300 dark:border-yellow-600', borderHover: 'hover:border-yellow-400 dark:hover:border-yellow-500',  bg: 'bg-white dark:bg-slate-900',     text: 'text-yellow-800 dark:text-yellow-300', textHover: 'hover:text-yellow-700 dark:hover:text-yellow-400',  ring: 'focus-within:ring-yellow-400 dark:focus-within:ring-yellow-600',   bgSelect: 'bg-yellow-200 dark:bg-yellow-800'  }],
  ['info',      { border: 'border-cyan-300 dark:border-cyan-600',     borderHover: 'hover:border-cyan-400 dark:hover:border-cyan-500',      bg: 'bg-white dark:bg-slate-900',     text: 'text-cyan-800 dark:text-cyan-300',     textHover: 'hover:text-cyan-700 dark:hover:text-cyan-400',      ring: 'focus-within:ring-cyan-400 dark:focus-within:ring-cyan-600',       bgSelect: 'bg-cyan-200 dark:bg-cyan-800'      }],
  ['dark',      { border: 'border-slate-800 dark:border-slate-200',   borderHover: 'hover:border-slate-600 dark:hover:border-slate-400',    bg: 'bg-slate-100 dark:bg-slate-900', text: 'text-slate-900 dark:text-slate-100',   textHover: 'hover:text-slate-700 dark:hover:text-slate-300',    ring: 'focus-within:ring-slate-500 dark:focus-within:ring-slate-400',     bgSelect: 'bg-slate-400 dark:bg-slate-700'    }],
  ['light',     { border: 'border-slate-200 dark:border-slate-700',   borderHover: 'hover:border-slate-400 dark:hover:border-slate-500',    bg: 'bg-white dark:bg-slate-800',     text: 'text-slate-900 dark:text-slate-100',   textHover: 'hover:text-slate-700 dark:hover:text-slate-300',    ring: 'focus-within:ring-slate-300 dark:focus-within:ring-slate-600',     bgSelect: 'bg-slate-200 dark:bg-slate-800'    }],
  ['violet',    { border: 'border-violet-300 dark:border-violet-600', borderHover: 'hover:border-violet-400 dark:hover:border-violet-500',  bg: 'bg-white dark:bg-slate-900',     text: 'text-violet-800 dark:text-violet-300', textHover: 'hover:text-violet-700 dark:hover:text-violet-400',  ring: 'focus-within:ring-violet-400 dark:focus-within:ring-violet-600',   bgSelect: 'bg-violet-200 dark:bg-violet-800'  }],
  ['teal',      { border: 'border-teal-300 dark:border-teal-600',     borderHover: 'hover:border-teal-400 dark:hover:border-teal-500',      bg: 'bg-white dark:bg-slate-900',     text: 'text-teal-800 dark:text-teal-300',     textHover: 'hover:text-teal-700 dark:hover:text-teal-400',      ring: 'focus-within:ring-teal-400 dark:focus-within:ring-teal-600',       bgSelect: 'bg-teal-200 dark:bg-teal-800'      }]
]);


// =================================================================================================
// =================================================================================================

@Injectable({
  providedIn: 'root'
})
export class ConfigTypeAndCls {

  constructor() {
    const types: FormStyle[] = ['primary', 'normal', 'secondary', 'success', 'danger', 'warning', 'info', 'dark', 'light', 'violet', 'teal'];
    const arr = ['blue', 'slate', 'slate', 'green', 'red', 'yellow', 'cyan', 'slate', 'slate', 'violet', 'teal'];

    for (let i = 0; i < types.length; i++) {
      const entry = FormPaletteMap.get(types[i]);
      if (entry) {
        entry['bgSelect'] = `bg-${arr[i]}-200 dark:bg-${arr[i]}-800`;
      }
    }

    const output = Array.from(FormPaletteMap.entries())
    .map(([key, value]) => {
      const props = Object.entries(value)
        .map(([k, v]) => `${k}: '${v}'`)
        .join(', ');
      return `  ['${key}', { ${props} }],`;
    })
    .join('\n');

    console.log(output);
  }
}
