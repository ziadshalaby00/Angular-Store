// ========================================================================
// Imports
// ========================================================================

import { CommonModule } from '@angular/common';
import { Component, computed, input, signal } from '@angular/core';


// ========================================================================
// Types
// ========================================================================

export type PositionType = 'left' | 'right';


// ========================================================================
// Component Declaration
// ========================================================================

@Component({
  selector: 'ZS-scroll-to-top',
  imports: [CommonModule],
  templateUrl: './scroll-to-top.html',
  styleUrl: './scroll-to-top.css',
})
export class ScrollToTop {

  // ========================================================================
  // Inputs
  // ========================================================================

  /**
   * Determines the horizontal position of the button ('left' or 'right').
   * Default: 'right'
   */
  readonly position = input<PositionType>('right');

  /**
   * Tailwind CSS class for the circle's color (background ring).
   */
  readonly circleColorClass = input<string>('text-gray-400/80');

  /**
   * Tailwind CSS class for the arrow and progress indicator color.
   */
  readonly arrowProgressColorClass = input<string>('text-blue-600');


  // ========================================================================
  // Constants
  // ========================================================================

  private readonly circleRadius = 22;
  readonly circleCircumference = 2 * Math.PI * this.circleRadius;


  // ========================================================================
  // Internal State
  // ========================================================================

  readonly scrollY = signal<number>(0);


  // ========================================================================
  // Computed Properties
  // ========================================================================

  /**
   * Computes the stroke-dashoffset for the progress circle based on scroll position.
   */
  readonly progressOffset = computed(() => {
    const _ = this.scrollY();
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? this.scrollY() / maxScroll : 0;
    return this.circleCircumference * (1 - progress);
  });

  /**
   * Returns Tailwind classes to position the button horizontally.
   */
  readonly positionClass = computed(() => ({
    'right-4': this.position() === 'right',
    'left-4': this.position() === 'left',
  }));


  // ========================================================================
  // Lifecycle Hooks
  // ========================================================================

  ngOnInit() {
    window.addEventListener('scroll', this.onScroll);
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.onScroll);
  }


  // ========================================================================
  // Event Handlers
  // ========================================================================

  private readonly onScroll = () => {
    this.scrollY.set(window.scrollY);
  };

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}