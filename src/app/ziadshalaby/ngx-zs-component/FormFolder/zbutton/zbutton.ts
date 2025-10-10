// ==============================================
// Types
// ==============================================

export type ButtonVariant = 'solid' | 'outline';
export type BtnSizeType = FormSize | 'xl'

// ==============================================
// Imports
// ==============================================

import {
  Component,
  input,
  computed,
  output,
} from '@angular/core';
import { FormPaletteMap, FormStyle, FormSize } from '../zformService/zform-service';


// ==============================================
// Component Metadata
// ==============================================

@Component({
  selector: 'ZS-button',
  imports: [],
  templateUrl: './zbutton.html',
  styleUrl: './zbutton.css',
})
export class Zbutton {


  // ==============================================
  // Inputs
  // ==============================================
  readonly iId = input<string>(crypto.randomUUID());
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

  readonly textColor = computed<string>(() => {
    if(['primary', 'dark', 'violet'].includes(this.btnStyle())) 
      return 'text-gray-100'
    return 'text-gray-800 dark:text-gray-100'
  });

  readonly baseClasses = computed(() => {
    const size = this.size();
    const variant = this.variant();
    const p = this.palette();

    const sizes: Record<BtnSizeType, string> = {
      sm: 'text-xs px-3 py-1.5',
      md: 'text-sm px-4 py-2',
      lg: 'text-base px-4.5 py-2.5',
      xl: 'text-lg px-5 py-3',
    };

    const solidClasses = this.join(
      p.btnBG,
      'border border-transparent',
      'shadow-md dark:shadow-slate-800',
      'hover:shadow-lg',
      'active:shadow-sm',
      this.textColor(),
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
        'ease-in-out'
      )

    return this.join(
      'inline-flex items-center justify-center',
      sizes[size],
      variant === 'solid' ? solidClasses : outlineClasses,
      stateClasses,
      'rounded-lg',
      'focus-visible:ring-2',
      p.ring,
      'select-none',
      'outline-none'
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