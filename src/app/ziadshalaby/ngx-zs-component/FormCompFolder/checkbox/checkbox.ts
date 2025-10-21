import { CommonModule } from '@angular/common';
import { Component, computed, input, model } from '@angular/core';
import { BaseSize, FormPaletteMap, FormStyle } from '../../palette-service/palette-service';
import { Label } from '../label/label';

// ==============================================
// Types
// ==============================================

export type VariantType = 'solid' | 'regular'
export type ShapeType = 'square' | 'circle' | 'toggle'


// ==============================================
// Class
// ==============================================

@Component({
  selector: 'ZS-checkbox',
  imports: [Label, CommonModule],
  templateUrl: './checkbox.html',
  styleUrl: './checkbox.css'
})
export class Checkbox {
  // ==============================================
  // Inputs
  // ==============================================

  readonly Id = input<string>(crypto.randomUUID());
  readonly label = input<string | null>(null);
  readonly hint = input<string | null>(null);
  readonly inputStyle = input<FormStyle>('secondary');
  readonly size = input<BaseSize>('md');
  readonly disabled = input<boolean>(false);
  readonly isReadonly = input<boolean>(false);

  readonly variant = input<VariantType>('regular');
  readonly shape = input<ShapeType>('square');


  // ==============================================
  // Model
  // ==============================================

  readonly value = model<boolean>(false);


  // ==============================================
  // Computed Signals
  // ==============================================

  readonly palette = computed(() => FormPaletteMap.get(this.inputStyle()) ?? FormPaletteMap.get('secondary')!);

  readonly iconClasses = computed<string>(() => {
    const v: VariantType = this.variant()
    const s: ShapeType = this.shape()

    const variantClass: Record<'true' | 'false', Record<VariantType, string>> = {
      true: {
        solid: 'fa-solid',
        regular: 'fa-regular'
      },
      false: {
        solid: 'fa-regular',
        regular: 'fa-regular'
      }
    }
    const shapeClass: Record<'true' | 'false', Record<ShapeType, string>> = {
      true: {
        toggle: 'fa-toggle-on',
        square: 'fa-square-check',
        circle: 'fa-circle-check'
      },
      false: {
        toggle: 'fa-toggle-off',
        square: 'fa-square',
        circle: 'fa-circle'
      },
    }

    const disabledClass = this.disabled() ? 'opacity-60' : '';
    const interactionClass = this.disabledOrReadonly() ? 'cursor-not-allowed' : '';

    const state = this.value() ? 'true' : 'false' as ('true' | 'false');
    return [
      s === 'toggle' ? variantClass.true.solid : variantClass[state][v], 
      shapeClass[state][s],
      disabledClass,
      interactionClass
    ].join(' ')
  })

  readonly sizeClass = computed<string>(() => {
    const sizeClasses: Record<BaseSize, string> = {
      sm: 'text-[20px]',
      md: 'text-[30px]',
      lg: 'text-[45px]'
    }
    return sizeClasses[this.size()]
  });

  readonly isChecked = computed<boolean>(() => this.value());
  readonly disabledOrReadonly = computed<boolean>(() => this.disabled() || this.isReadonly());


  // ==============================================
  // Handlers
  // ==============================================

  toggleChecked() {
    if (this.disabledOrReadonly()) return;
    this.value.update(v => !v);
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      this.toggleChecked();
    }
  }
}
