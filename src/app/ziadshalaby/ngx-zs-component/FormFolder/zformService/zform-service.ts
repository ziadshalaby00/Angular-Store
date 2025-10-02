import { Injectable } from '@angular/core';

// =================================================================================================
// =================================================================================================
export type FormSize = 'sm' | 'md' | 'lg';

export type FormStyle =
| 'primary' | 'normal' | 'warning'
| 'success' | 'danger' | 'light'
| 'info'    | 'dark'   
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
  ['normal', {
    border: 'border-slate-200 dark:border-slate-700',
    borderHover: 'hover:border-slate-400 dark:hover:border-slate-500',
    bg: 'bg-white dark:bg-slate-900',                // standardized dark base
    text: 'text-slate-900 dark:text-slate-100',
    textHover: 'hover:text-slate-700 dark:hover:text-slate-300',
    ring: 'focus-within:ring-slate-400 dark:focus-within:ring-slate-500',
    bgSelect: 'bg-slate-200 dark:bg-slate-700',      // changed so selection visible in dark
    // optional: selectedText: 'text-slate-900 dark:text-white'
  }],

  ['primary', {
    border: 'border-blue-200 dark:border-blue-700',
    borderHover: 'hover:border-blue-400 dark:hover:border-blue-500',
    bg: 'bg-white dark:bg-slate-900',
    text: 'text-blue-900 dark:text-blue-100',
    textHover: 'hover:text-blue-700 dark:hover:text-blue-300',
    ring: 'focus-within:ring-blue-400 dark:focus-within:ring-blue-500',
    bgSelect: 'bg-blue-200 dark:bg-blue-800',
    // optional: selectedText: 'text-blue-900 dark:text-white'
  }],

  ['success', {
    border: 'border-green-300 dark:border-green-600',
    borderHover: 'hover:border-green-500 dark:hover:border-green-400',
    bg: 'bg-white dark:bg-slate-900',
    text: 'text-green-800 dark:text-green-300',
    textHover: 'hover:text-green-700 dark:hover:text-green-400',
    ring: 'focus-within:ring-green-400 dark:focus-within:ring-green-600',
    bgSelect: 'bg-green-200 dark:bg-green-800',
  }],

  ['danger', {
    border: 'border-red-300 dark:border-red-600',
    borderHover: 'hover:border-red-500 dark:hover:border-red-400', // ADDED dark hover
    bg: 'bg-white dark:bg-slate-900',
    text: 'text-red-800 dark:text-red-300',
    textHover: 'hover:text-red-700 dark:hover:text-red-400',
    ring: 'focus-within:ring-red-400 dark:focus-within:ring-red-600',
    bgSelect: 'bg-red-200 dark:bg-red-800',
  }],

  ['warning', {
    border: 'border-yellow-300 dark:border-yellow-600',
    borderHover: 'hover:border-yellow-500 dark:hover:border-yellow-400',
    bg: 'bg-white dark:bg-slate-900',
    // switched to amber/darker text for better contrast on light backgrounds
    text: 'text-amber-800 dark:text-amber-300',
    textHover: 'hover:text-amber-700 dark:hover:text-amber-400',
    ring: 'focus-within:ring-yellow-400 dark:focus-within:ring-yellow-600',
    bgSelect: 'bg-amber-200 dark:bg-amber-800',
    // optional: selectedText: 'text-black dark:text-white'
  }],

  ['info', {
    border: 'border-cyan-300 dark:border-cyan-600',
    borderHover: 'hover:border-cyan-500 dark:hover:border-cyan-400',
    bg: 'bg-white dark:bg-slate-900',
    text: 'text-cyan-800 dark:text-cyan-300',
    textHover: 'hover:text-cyan-700 dark:hover:text-cyan-400',
    ring: 'focus-within:ring-cyan-400 dark:focus-within:ring-cyan-600',
    bgSelect: 'bg-cyan-200 dark:bg-cyan-800',
  }],

  ['dark', {
    // flipped to be less confusing: light uses lighter border, dark uses darker border
    border: 'border-slate-200 dark:border-slate-700',
    borderHover: 'hover:border-slate-400 dark:hover:border-slate-500',
    bg: 'bg-slate-100 dark:bg-slate-900',
    text: 'text-slate-900 dark:text-slate-100',
    textHover: 'hover:text-slate-700 dark:hover:text-slate-300',
    ring: 'focus-within:ring-slate-500 dark:focus-within:ring-slate-400',
    bgSelect: 'bg-slate-400 dark:bg-slate-700',
  }],

  ['light', {
    border: 'border-slate-200 dark:border-slate-700',
    borderHover: 'hover:border-slate-400 dark:hover:border-slate-500',
    bg: 'bg-white dark:bg-slate-900',                 // standardized dark base
    text: 'text-slate-900 dark:text-slate-100',
    textHover: 'hover:text-slate-700 dark:hover:text-slate-300',
    ring: 'focus-within:ring-slate-300 dark:focus-within:ring-slate-500',
    bgSelect: 'bg-slate-200 dark:bg-slate-700',       // fixed like normal
  }],

  ['violet', {
    border: 'border-violet-300 dark:border-violet-600',
    borderHover: 'hover:border-violet-500 dark:hover:border-violet-400',
    bg: 'bg-white dark:bg-slate-900',
    text: 'text-violet-800 dark:text-violet-300',
    textHover: 'hover:text-violet-700 dark:hover:text-violet-400',
    ring: 'focus-within:ring-violet-400 dark:focus-within:ring-violet-600',
    bgSelect: 'bg-violet-200 dark:bg-violet-800',
  }],

  ['teal', {
    border: 'border-teal-300 dark:border-teal-600',
    borderHover: 'hover:border-teal-500 dark:hover:border-teal-400',
    bg: 'bg-white dark:bg-slate-900',
    text: 'text-teal-800 dark:text-teal-300',
    textHover: 'hover:text-teal-700 dark:hover:text-teal-400',
    ring: 'focus-within:ring-teal-400 dark:focus-within:ring-teal-600',
    bgSelect: 'bg-teal-200 dark:bg-teal-800',
  }]
]);
// =================================================================================================
// =================================================================================================

@Injectable({
  providedIn: 'root'
})
export class ZformService {
  
}
