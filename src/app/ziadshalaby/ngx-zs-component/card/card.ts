import { Component, computed, effect, ElementRef, inject, input, signal, viewChild } from '@angular/core';
import { FormPaletteMap, FormStyle } from '../palette-service/palette-service';

// ==============================================================================
// Types
// ==============================================================================
export interface VariantType {
  border?: boolean,
  border_hover?: boolean,
  shadow?: boolean,
}

export type AnimationType =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'none';

// ==============================================================================
// Component
// ==============================================================================
@Component({
  selector: 'ZS-card',
  standalone: true,
  templateUrl: './card.html',
  styleUrls: ['./card.css'],
})
export class Card {
  // ==========================================================================
  // Inputs
  // ==========================================================================
  readonly cardStyle = input<FormStyle>('primary');
  readonly variant = input<VariantType>();
  readonly clickable = input<boolean>(false);
  readonly animation = input<AnimationType>('none');
  readonly bodyClass = input<string>('bg-gray-100 dark:bg-gray-800')

  // ==========================================================================
  // Local State
  // ==========================================================================
  readonly cardRef = viewChild<ElementRef>('cardRef');
  readonly isVisible = signal(false);

  constructor() {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.isVisible.set(true);
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.2 }
    );

    queueMicrotask(() => {
      const el = this.cardRef()?.nativeElement;
      if (el) observer.observe(el);
    });
  }

  // ==========================================================================
  // Computed Classes
  // ==========================================================================
  readonly classList = computed(() => {
    const style = this.cardStyle();
    const variant = this.variant();
    const clickable = this.clickable();
    const animation = this.animation();
    const visible = this.isVisible();
    const bodyClass = this.bodyClass();

    const palette = FormPaletteMap.get(style) ?? {
      border: '',
      borderHover: '',
      ring: '',
    };

    const base = 'w-full h-full overflow-hidden flex flex-col gap-4 rounded-lg transition-all duration-300';

    // ---------------------
    // Border Handling
    // ---------------------
    const border = (variant?.border ?? true) ? `border ${palette.border}` : 'border-0';

    // ---------------------
    // Shadow Handling
    // ---------------------
    const shadowClasses = (variant?.shadow ?? true)
      ? 'shadow-md dark:shadow-slate-700/50 hover:shadow-lg'
      : 'shadow-none';

    // ---------------------
    // Hover Border Handling
    // ---------------------
    const hoverBorder = (variant?.border_hover ?? true) ? palette.borderHover : '';

    // ---------------------
    // Clickable / Focus Effects
    // ---------------------
    const clickEffects = clickable
      ? `cursor-pointer hover:scale-[1.02] active:scale-[0.97] focus-visible:ring-2 ${palette.ring}`
      : '';

    // ---------------------
    // Animation Handling
    // ---------------------
    const animationClass = animation !== 'none' ? `animate-from-${animation}` : '';
    const visibleClass = visible ? 'animate-visible' : '';

    // ---------------------
    // Combine Classes
    // ---------------------
    return [
      base,
      border,
      hoverBorder,
      bodyClass,
      shadowClasses,
      clickEffects,
      animationClass,
      visibleClass
    ]
      .filter(Boolean)
      .join(' ');
  });
}