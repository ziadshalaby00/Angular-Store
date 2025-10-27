// ==============================================
// Types
// ==============================================

export interface CarouselItem {
  id: number | string;
  name: string;
  image: string;
  description?: string;
  [key: string]: any; // Allow for additional properties
}

export type ItemShapeType = 'rect' | 'circle';

// ==============================================
// Component
// ==============================================

import { Component, input, output, model, viewChild, ElementRef, computed, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseColors, ColorMapping } from '../palette-service';

@Component({
  selector: 'ZS-carousel',
  imports: [CommonModule],
  templateUrl: './carousel.html',
  styleUrl: './carousel.css'
})
export class Carousel {

  // ==============================================
  // Inputs
  // ==============================================

  readonly itemsNumber = input.required<number>();

  readonly arrows = input<boolean>(true);                    // Show/hide navigation arrows
  readonly arrowColor = input<BaseColors>('gray'); // Arrow color CSS class

  readonly showIndicators = input<boolean>(true);

  readonly autoPlay = input<boolean>(true);
  readonly duration = input<number>(3000);

  readonly maxItemsPerBox = input<number>(4); // Maximum number of items visible in one box

  readonly itemMinWidth = input<number>(200);

  // ==============================================
  // Outputs
  // ==============================================

  readonly indexChangeEv = output<number>();

  // ==============================================
  // Model
  // ==============================================

  readonly currentIndex = model<number>(0);

  // ==============================================
  // View Children
  // ==============================================

  readonly carouselContainer = viewChild<ElementRef<HTMLElement>>('carouselContainer');
  readonly carouselTrack = viewChild<ElementRef<HTMLDivElement>>('carouselTrack');

  // ==============================================
  // Signals
  // ==============================================

  readonly itemsPerBox = signal<number>(1);
  readonly currentTranslate = signal<number>(0);
  readonly dragging = signal<boolean>(false);
  private readonly startX = signal<number>(0);
  private readonly prevTranslate = signal<number>(0);

  // ==============================================
  // Computed Properties
  // ==============================================
  readonly arrowColorClass = computed<string>(() => ColorMapping.get(this.arrowColor())?.text ?? 'text-gray-600')
  
  readonly itemsPerBoxWidth = computed<string>(() => `${100 / this.itemsPerBox()}%`);

  readonly totalBoxes = computed<number>(() =>
    Math.ceil(this.itemsNumber() / this.itemsPerBox())
  );

  readonly indicatorBoxes = computed<number[]>(() =>
    Array.from({ length: this.totalBoxes() }, (_, i) => i)
  );

  // ==============================================
  // Private Properties
  // ==============================================

  private autoPlayTimer: ReturnType<typeof setInterval> | null = null;
  private resizeObserver!: ResizeObserver;

  // ==============================================
  // Lifecycle Hooks
  // ==============================================

  constructor() {
    effect(() => {
      this.autoPlay() ? this.startAutoPlay() : this.stopAutoPlay();
    });
  }

  ngAfterViewInit() {
    const el = this.carouselContainer()?.nativeElement;
    if (el) {
      this.resizeObserver = new ResizeObserver(() => {
        this.updateItemsPerBox();
        const containerWidth = el.offsetWidth;
        const pos = -this.currentIndex() * containerWidth;
        this.applyTranslate(pos, 'none');
      });
      this.resizeObserver.observe(el);
      this.updateItemsPerBox();
      const containerWidth = el.offsetWidth;
      this.applyTranslate(-this.currentIndex() * containerWidth, 'none');
    }
  }

  ngOnDestroy() {
    this.stopAutoPlay();
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  // ==============================================
  // Public Methods
  // ==============================================

  updateIndex(newIndex: number): void {
    const containerEl = this.carouselContainer();
    if (!containerEl) return;

    this.currentIndex.set(newIndex);
    this.indexChangeEv.emit(newIndex);

    const containerWidth = containerEl.nativeElement.offsetWidth;
    const newTranslate = -newIndex * containerWidth;
    this.applyTranslate(newTranslate, 'transform 0.3s ease-out');

    this.restartAutoPlay();
  }

  next(): void {
    if (this.currentIndex() < this.totalBoxes() - 1) {
      this.updateIndex(this.currentIndex() + 1);
    } else {
      this.updateIndex(0);
    }
  }

  previous(): void {
    if (this.currentIndex() > 0) {
      this.updateIndex(this.currentIndex() - 1);
    } else {
      this.updateIndex(this.totalBoxes() - 1);
    }
  }

  // ==============================================
  // AutoPlay Methods
  // ==============================================

  startAutoPlay(): void {
    if (this.autoPlayTimer) return;
    this.autoPlayTimer = setInterval(() => this.next(), this.duration());
  }

  stopAutoPlay(): void {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
      this.autoPlayTimer = null;
    }
  }

  restartAutoPlay(): void {
    this.stopAutoPlay();
    if (this.autoPlay()) {
      this.startAutoPlay();
    }
  }

  // ==============================================
  // Resize Handling
  // ==============================================

  private updateItemsPerBox(): void {
    const containerWidth = this.carouselContainer()?.nativeElement.offsetWidth || 0;
    const possibleCount = Math.floor(containerWidth / this.itemMinWidth());
    this.itemsPerBox.set(
      Math.min(this.maxItemsPerBox(), Math.max(1, possibleCount))
    );
  }

  // ==============================================
  // Drag Handling
  // ==============================================

  onDragStart(event: PointerEvent): void {
    event.preventDefault();
    const trackEl = this.carouselTrack();
    const containerEl = this.carouselContainer();
    if (!trackEl || !containerEl) return;

    this.dragging.set(true);
    this.startX.set(event.clientX);
    this.prevTranslate.set(-this.currentIndex() * containerEl.nativeElement.offsetWidth);

    trackEl.nativeElement.style.transition = 'none';
    this.stopAutoPlay();
  }

  onDragMove(event: PointerEvent): void {
    if (!this.dragging()) return;
    const delta = event.clientX - this.startX();
    this.currentTranslate.set(this.prevTranslate() + delta);
  }

  onDragEnd(): void {
    if (!this.dragging()) return;
    this.dragging.set(false);

    const containerEl = this.carouselContainer();
    if (!containerEl) return;

    const containerWidth = containerEl.nativeElement.offsetWidth;
    const movedSlides = Math.round(-this.currentTranslate() / containerWidth);
    const newIndex = Math.max(0, Math.min(this.totalBoxes() - 1, movedSlides));

    this.updateIndex(newIndex);

    const finalTranslate = -this.currentIndex() * containerWidth;
    this.applyTranslate(finalTranslate, 'transform 0.3s ease-out');

    if (this.autoPlay()) {
      this.startAutoPlay();
    }
  }

  // ==============================================
  // Helper Methods
  // ==============================================

  private applyTranslate(value: number, transition: string | null = 'transform 0.3s ease-out'): void {
    this.currentTranslate.set(value);
    const trackEl = this.carouselTrack();
    if (!trackEl) return;

    trackEl.nativeElement.style.transition = transition ?? 'none';
  }
}