import { Injectable } from '@angular/core';

// ----------------------
// Types
// ----------------------
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

// ----------------------
// Interfaces & Constants
// ----------------------
export interface PaletteEntry {
  border: string;
  borderHover: string;
  bg: string;
  text: string;
  textHover: string;   
  ring: string;
}

export const paletteMap = new Map<InputStyle, PaletteEntry>([
  ['normal',    { border: 'border-slate-200 dark:border-slate-700', borderHover: 'hover:border-slate-400 dark:hover:border-slate-500', bg: 'bg-white dark:bg-slate-800', text: 'text-slate-900 dark:text-slate-100', textHover: 'hover:text-slate-700 dark:hover:text-slate-300', ring: 'focus-within:ring-slate-400 dark:focus-within:ring-slate-500' }],
  ['primary',   { border: 'border-blue-200 dark:border-blue-700', borderHover: 'hover:border-blue-400 dark:hover:border-blue-500', bg: 'bg-white dark:bg-slate-900', text: 'text-blue-900 dark:text-blue-100', textHover: 'hover:text-blue-700 dark:hover:text-blue-300', ring: 'focus-within:ring-blue-400 dark:focus-within:ring-blue-500' }],
  ['secondary', { border: 'border-slate-200 dark:border-slate-700', borderHover: 'hover:border-slate-400 dark:hover:border-slate-500', bg: 'bg-white dark:bg-slate-800', text: 'text-slate-900 dark:text-slate-100', textHover: 'hover:text-slate-700 dark:hover:text-slate-300', ring: 'focus-within:ring-slate-300 dark:focus-within:ring-slate-600' }],
  ['success',   { border: 'border-green-300 dark:border-green-600', borderHover: 'hover:border-green-400 dark:hover:border-green-500', bg: 'bg-white dark:bg-slate-900', text: 'text-green-800 dark:text-green-300', textHover: 'hover:text-green-700 dark:hover:text-green-400', ring: 'focus-within:ring-green-400 dark:focus-within:ring-green-600' }],
  ['danger',    { border: 'border-red-300 dark:border-red-600', borderHover: 'hover:border-red-400 dark:hover:border-red-400', bg: 'bg-white dark:bg-slate-900', text: 'text-red-800 dark:text-red-300', textHover: 'hover:text-red-700 dark:hover:text-red-400', ring: 'focus-within:ring-red-400 dark:focus-within:ring-red-600' }],
  ['warning',   { border: 'border-yellow-300 dark:border-yellow-600', borderHover: 'hover:border-yellow-400 dark:hover:border-yellow-500', bg: 'bg-white dark:bg-slate-900', text: 'text-yellow-800 dark:text-yellow-300', textHover: 'hover:text-yellow-700 dark:hover:text-yellow-400', ring: 'focus-within:ring-yellow-400 dark:focus-within:ring-yellow-600' }],
  ['info',      { border: 'border-cyan-300 dark:border-cyan-600', borderHover: 'hover:border-cyan-400 dark:hover:border-cyan-500', bg: 'bg-white dark:bg-slate-900', text: 'text-cyan-800 dark:text-cyan-300', textHover: 'hover:text-cyan-700 dark:hover:text-cyan-400', ring: 'focus-within:ring-cyan-400 dark:focus-within:ring-cyan-600' }],
  ['dark',      { border: 'border-slate-800 dark:border-slate-200', borderHover: 'hover:border-slate-600 dark:hover:border-slate-400', bg: 'bg-slate-100 dark:bg-slate-900', text: 'text-slate-900 dark:text-slate-100', textHover: 'hover:text-slate-700 dark:hover:text-slate-300', ring: 'focus-within:ring-slate-500 dark:focus-within:ring-slate-400' }],
  ['light',     { border: 'border-slate-200 dark:border-slate-700', borderHover: 'hover:border-slate-400 dark:hover:border-slate-500', bg: 'bg-white dark:bg-slate-800', text: 'text-slate-900 dark:text-slate-100', textHover: 'hover:text-slate-700 dark:hover:text-slate-300', ring: 'focus-within:ring-slate-300 dark:focus-within:ring-slate-600' }],
  ['violet',    { border: 'border-violet-300 dark:border-violet-600', borderHover: 'hover:border-violet-400 dark:hover:border-violet-500', bg: 'bg-white dark:bg-slate-900', text: 'text-violet-800 dark:text-violet-300', textHover: 'hover:text-violet-700 dark:hover:text-violet-400', ring: 'focus-within:ring-violet-400 dark:focus-within:ring-violet-600' }],
  ['teal',      { border: 'border-teal-300 dark:border-teal-600', borderHover: 'hover:border-teal-400 dark:hover:border-teal-500', bg: 'bg-white dark:bg-slate-900', text: 'text-teal-800 dark:text-teal-300', textHover: 'hover:text-teal-700 dark:hover:text-teal-400', ring: 'focus-within:ring-teal-400 dark:focus-within:ring-teal-600' }],
]);

@Injectable({
  providedIn: 'root'
})
export class ZinputService {
  
}
