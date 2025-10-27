export type BaseSize = 'sm' | 'md' | 'lg';

export type FormStyle =
  | 'primary'
  | 'secondary'
  | 'warning'
  | 'success'
  | 'danger'
  | 'dark'
  | 'info'
  | 'violet'
  | 'teal';

export interface FormPaletteEntry {
  border: string;
  borderHover: string;

  inputBg: string;
  bgSelect: string;
  ring: string;

  btnBG: string;
  btnBGHover: string;

  text: string;
  textHover: string;

  checkBoxText?: string;
  checkBoxTextHover?: string;
}

export const FormPaletteMap = new Map<FormStyle, FormPaletteEntry>([
  [
    'secondary',
    {
      border: 'border-slate-300 dark:border-slate-600',
      borderHover: 'hover:border-slate-500 dark:hover:border-slate-400',

      inputBg: 'bg-slate-50 dark:bg-slate-900',
      ring: 'focus-within:ring-slate-400 dark:focus-within:ring-slate-600',

      bgSelect: 'bg-slate-200 dark:bg-slate-800',

      text: 'text-slate-800 dark:text-slate-300',
      textHover: 'hover:text-slate-700 dark:hover:text-slate-400',

      btnBG: 'bg-slate-500 dark:bg-slate-700',
      btnBGHover: 'hover:bg-slate-600',

      checkBoxText: 'text-slate-500 dark:text-slate-700',
      checkBoxTextHover: 'hover:text-slate-600',
    },
  ],
  [
    'primary',
    {
      border: 'border-blue-200 dark:border-blue-700',
      borderHover: 'hover:border-blue-400 dark:hover:border-blue-500',

      inputBg: 'bg-white dark:bg-slate-900',
      ring: 'focus-within:ring-blue-400 dark:focus-within:ring-blue-500',

      bgSelect: 'bg-blue-200 dark:bg-blue-800',

      text: 'text-blue-900 dark:text-blue-100',
      textHover: 'hover:text-blue-700 dark:hover:text-blue-300',

      btnBG: 'bg-blue-500 dark:bg-blue-700',
      btnBGHover: 'hover:bg-blue-600',
      
      checkBoxText: 'text-blue-500 dark:text-blue-700',
      checkBoxTextHover: 'hover:text-blue-600',
    },
  ],
  [
    'success',
    {
      border: 'border-green-300 dark:border-green-600',
      borderHover: 'hover:border-green-500 dark:hover:border-green-400',

      inputBg: 'bg-white dark:bg-slate-900',
      ring: 'focus-within:ring-green-400 dark:focus-within:ring-green-600',

      bgSelect: 'bg-green-200 dark:bg-green-800',

      text: 'text-green-800 dark:text-green-300',
      textHover: 'hover:text-green-700 dark:hover:text-green-400',

      btnBG: 'bg-green-500 dark:bg-green-700',
      btnBGHover: 'hover:bg-green-600',

      checkBoxText: 'text-green-500 dark:text-green-700',
      checkBoxTextHover: 'hover:text-green-600',
    },
  ],
  [
    'danger',
    {
      border: 'border-red-300 dark:border-red-600',
      borderHover: 'hover:border-red-500 dark:hover:border-red-400',

      inputBg: 'bg-white dark:bg-slate-900',
      ring: 'focus-within:ring-red-400 dark:focus-within:ring-red-600',

      bgSelect: 'bg-red-200 dark:bg-red-800',

      text: 'text-red-800 dark:text-red-300',
      textHover: 'hover:text-red-700 dark:hover:text-red-400',

      btnBG: 'bg-red-500 dark:bg-red-700',
      btnBGHover: 'hover:bg-red-600',

      checkBoxText: 'text-red-500 dark:text-red-700',
      checkBoxTextHover: 'hover:text-red-600',
    },
  ],
  [
    'warning',
    {
      border: 'border-yellow-300 dark:border-yellow-600',
      borderHover: 'hover:border-yellow-500 dark:hover:border-yellow-400',

      inputBg: 'bg-white dark:bg-slate-900',
      ring: 'focus-within:ring-yellow-400 dark:focus-within:ring-yellow-600',

      bgSelect: 'bg-amber-200 dark:bg-amber-800',

      text: 'text-amber-800 dark:text-amber-300',
      textHover: 'hover:text-amber-700 dark:hover:text-amber-400',

      btnBG: 'bg-amber-500 dark:bg-amber-700',
      btnBGHover: 'hover:bg-amber-600',

      checkBoxText: 'text-amber-500 dark:text-amber-700',
      checkBoxTextHover: 'hover:text-amber-600',
    },
  ],
  [
    'info',
    {
      border: 'border-cyan-300 dark:border-cyan-600',
      borderHover: 'hover:border-cyan-500 dark:hover:border-cyan-400',

      inputBg: 'bg-white dark:bg-slate-900',
      ring: 'focus-within:ring-cyan-400 dark:focus-within:ring-cyan-600',

      bgSelect: 'bg-cyan-200 dark:bg-cyan-800',

      text: 'text-cyan-800 dark:text-cyan-300',
      textHover: 'hover:text-cyan-700 dark:hover:text-cyan-400',

      btnBG: 'bg-cyan-500 dark:bg-cyan-700',
      btnBGHover: 'hover:bg-cyan-600',

      checkBoxText: 'text-cyan-500 dark:text-cyan-700',
      checkBoxTextHover: 'hover:text-cyan-600',
    },
  ],
  [
    'dark',
    {
      border: 'border-slate-900 dark:border-slate-700',
      borderHover: 'hover:border-gray-500 dark:hover:border-slate-500',

      inputBg: 'bg-slate-300 dark:bg-slate-900',
      ring: 'focus-within:ring-slate-700 dark:focus-within:ring-slate-600',

      bgSelect: 'bg-slate-400 dark:bg-slate-800',

      text: 'text-slate-900 dark:text-slate-300',
      textHover: 'hover:text-slate-700 dark:hover:text-slate-400',

      btnBG: 'bg-slate-900 dark:bg-slate-700',
      btnBGHover: 'hover:bg-slate-800',

      checkBoxText: 'text-slate-900 dark:text-slate-700',
      checkBoxTextHover: 'hover:text-slate-800'
    },
  ],
  [
    'violet',
    {
      border: 'border-violet-300 dark:border-violet-600',
      borderHover: 'hover:border-violet-500 dark:hover:border-violet-400',

      inputBg: 'bg-white dark:bg-slate-900',
      ring: 'focus-within:ring-violet-400 dark:focus-within:ring-violet-600',

      bgSelect: 'bg-violet-200 dark:bg-violet-800',

      text: 'text-violet-800 dark:text-violet-300',
      textHover: 'hover:text-violet-700 dark:hover:text-violet-400',

      btnBG: 'bg-violet-500 dark:bg-violet-700 ',
      btnBGHover: 'hover:bg-violet-600',

      checkBoxText: 'text-violet-500 dark:text-violet-700',
      checkBoxTextHover: 'hover:text-violet-600',
    },
  ],
  [
    'teal',
    {
      border: 'border-teal-300 dark:border-teal-600',
      borderHover: 'hover:border-teal-500 dark:hover:border-teal-400',

      inputBg: 'bg-white dark:bg-slate-900',
      ring: 'focus-within:ring-teal-400 dark:focus-within:ring-teal-600',

      bgSelect: 'bg-teal-200 dark:bg-teal-800',

      text: 'text-teal-800 dark:text-teal-300',
      textHover: 'hover:text-teal-700 dark:hover:text-teal-400',

      btnBG: 'bg-teal-500 dark:bg-teal-700',
      btnBGHover: 'hover:bg-teal-600',

      checkBoxText: 'text-teal-500 dark:text-teal-700',
      checkBoxTextHover: 'hover:text-teal-600',
    },
  ],
]);

// ==================================================================================
// ==================================================================================

export type BaseColors =
  | 'slate' | 'gray'   | 'zinc'    | 'neutral' | 'stone'
  | 'red'   | 'orange' | 'amber'   | 'yellow'  | 'rose'
  | 'lime'  | 'green'  | 'emerald' | 'teal'
  | 'cyan'  | 'sky'    | 'blue'    | 'indigo'
  | 'violet'| 'purple' | 'fuchsia' | 'pink';

export type BaseColorPrefixes = 'text' | 'bg' | 'border';

export const ColorMapping: Map<BaseColors, Record<BaseColorPrefixes, string>> = new Map([
  ['slate',   { text: 'text-slate-600 dark:text-slate-400',     bg: 'bg-slate-600 dark:bg-slate-400',     border: 'border-slate-600 dark:border-slate-400'      }],
  ['gray',    { text: 'text-gray-600 dark:text-gray-400',       bg: 'bg-gray-600 dark:bg-gray-400',       border: 'border-gray-600 dark:border-gray-400'        }],
  ['zinc',    { text: 'text-zinc-600 dark:text-zinc-400',       bg: 'bg-zinc-600 dark:bg-zinc-400',       border: 'border-zinc-600 dark:border-zinc-400'        }],
  ['neutral', { text: 'text-neutral-600 dark:text-neutral-400', bg: 'bg-neutral-600 dark:bg-neutral-400', border: 'border-neutral-600 dark:border-neutral-400'  }],
  ['stone',   { text: 'text-stone-600 dark:text-stone-400',     bg: 'bg-stone-600 dark:bg-stone-400',     border: 'border-stone-600 dark:border-stone-400'      }],
  ['red',     { text: 'text-red-600 dark:text-red-400',         bg: 'bg-red-600 dark:bg-red-400',         border: 'border-red-600 dark:border-red-400'          }],
  ['orange',  { text: 'text-orange-600 dark:text-orange-400',   bg: 'bg-orange-600 dark:bg-orange-400',   border: 'border-orange-600 dark:border-orange-400'    }],
  ['amber',   { text: 'text-amber-600 dark:text-amber-400',     bg: 'bg-amber-600 dark:bg-amber-400',     border: 'border-amber-600 dark:border-amber-400'      }],
  ['yellow',  { text: 'text-yellow-600 dark:text-yellow-400',   bg: 'bg-yellow-600 dark:bg-yellow-400',   border: 'border-yellow-600 dark:border-yellow-400'    }],
  ['lime',    { text: 'text-lime-600 dark:text-lime-400',       bg: 'bg-lime-600 dark:bg-lime-400',       border: 'border-lime-600 dark:border-lime-400'        }],
  ['green',   { text: 'text-green-600 dark:text-green-400',     bg: 'bg-green-600 dark:bg-green-400',     border: 'border-green-600 dark:border-green-400'      }],
  ['emerald', { text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-600 dark:bg-emerald-400', border: 'border-emerald-600 dark:border-emerald-400'  }],
  ['teal',    { text: 'text-teal-600 dark:text-teal-400',       bg: 'bg-teal-600 dark:bg-teal-400',       border: 'border-teal-600 dark:border-teal-400'        }],
  ['cyan',    { text: 'text-cyan-600 dark:text-cyan-400',       bg: 'bg-cyan-600 dark:bg-cyan-400',       border: 'border-cyan-600 dark:border-cyan-400'        }],
  ['sky',     { text: 'text-sky-600 dark:text-sky-400',         bg: 'bg-sky-600 dark:bg-sky-400',         border: 'border-sky-600 dark:border-sky-400'          }],
  ['blue',    { text: 'text-blue-600 dark:text-blue-400',       bg: 'bg-blue-600 dark:bg-blue-400',       border: 'border-blue-600 dark:border-blue-400'        }],
  ['indigo',  { text: 'text-indigo-600 dark:text-indigo-400',   bg: 'bg-indigo-600 dark:bg-indigo-400',   border: 'border-indigo-600 dark:border-indigo-400'    }],
  ['violet',  { text: 'text-violet-600 dark:text-violet-400',   bg: 'bg-violet-600 dark:bg-violet-400',   border: 'border-violet-600 dark:border-violet-400'    }],
  ['purple',  { text: 'text-purple-600 dark:text-purple-400',   bg: 'bg-purple-600 dark:bg-purple-400',   border: 'border-purple-600 dark:border-purple-400'    }],
  ['fuchsia', { text: 'text-fuchsia-600 dark:text-fuchsia-400', bg: 'bg-fuchsia-600 dark:bg-fuchsia-400', border: 'border-fuchsia-600 dark:border-fuchsia-400'  }],
  ['pink',    { text: 'text-pink-600 dark:text-pink-400',       bg: 'bg-pink-600 dark:bg-pink-400',       border: 'border-pink-600 dark:border-pink-400'        }],
  ['rose',    { text: 'text-rose-600 dark:text-rose-400',       bg: 'bg-rose-600 dark:bg-rose-400',       border: 'border-rose-600 dark:border-rose-400'        }],
]);
