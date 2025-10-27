// ==============================================
// Types
// ==============================================

export type ButtonVariant = 'solid' | 'outline';
export type BtnSizeType = 'xs' | BaseSize | 'xl'

// ==============================================
// Imports
// ==============================================

import {
  Component,
  input,
  computed,
  output,
} from '@angular/core';
import { FormPaletteMap, FormStyle, BaseSize } from '../../palette-service';


// ==============================================
// Component Metadata
// ==============================================

@Component({
  selector: 'ZS-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.css',
})
export class Button {


  // ==============================================
  // Inputs
  // ==============================================
  readonly Id = input<string>(crypto.randomUUID());
  readonly btnStyle = input<FormStyle>('primary');
  readonly variant = input<ButtonVariant>('solid');
  readonly size = input<BtnSizeType>('md');
  readonly disabled = input<boolean>(false);
  readonly icon = input<string | null>(null); // Optional FontAwesome icon class (e.g., "fa fa-plus")
  readonly type = input<'button' | 'submit' | 'reset'>('button');


  // ==============================================
  // Outputs
  // ==============================================

  readonly clickedEv = output<Event>();


  // ==============================================
  // Computed Properties
  // ==============================================

  readonly palette = computed(() => FormPaletteMap.get(this.btnStyle())!);

  readonly solidTextColor = computed<string>(() => {
    if(['primary', 'dark', 'violet', 'secondary'].includes(this.btnStyle())) 
      return 'text-slate-100'
    return 'text-slate-800 dark:text-slate-100'
  });

  readonly baseClasses = computed(() => {
    const size = this.size();
    const variant = this.variant();
    const p = this.palette();

    const sizes: Record<BtnSizeType, string> = {
      xs: 'text-[10px] px-2 py-1',
      sm: 'text-xs px-3.5 py-1.75',
      md: 'text-sm px-5 py-2.5',
      lg: 'text-base px-6.5 py-3.25',
      xl: 'text-lg px-8 py-4',
    };

    const solidClasses = this.join(
      p.btnBG,
      p.btnBGHover,
      'shadow-md dark:shadow-slate-700/50',
      'hover:shadow-lg',
      'active:shadow-sm',
      ['dark'].includes(this.btnStyle()) ? 'dark:hover:shadow-sm' : '',
      this.solidTextColor(),
    );

    const outlineClasses = this.join(
      'bg-transparent',
      'border',
      p.border,
      p.borderHover,
      p.text,
      p.textHover,
      'hover:shadow-sm',
    )

    const stateClasses = this.disabled()
      ? 'opacity-60 cursor-not-allowed shadow-none'
      : this.join(
        'hover:scale-[1.02]',
        'active:scale-[0.97]',
        'transition-[background-color,color,border-color,box-shadow,opacity]',
        'duration-200',
        'ease-in-out',
      )

    return this.join(
      'inline-flex items-center justify-center',
      ['xl'].includes(size) ? 'rounded-xl' : 'rounded-lg',
      'focus-visible:ring-2',
      'select-none',
      'outline-none',
      sizes[size],
      variant === 'solid' ? solidClasses : outlineClasses,
      stateClasses,
      p.ring,
    )
  });


  // ==============================================
  // Methods
  // ==============================================
  private join(...classes: string[]): string {
    return classes.join(' ');
  }

  onClick(event: Event): void {
    if (!this.disabled()) {
      this.clickedEv.emit(event);
    }
  }
}