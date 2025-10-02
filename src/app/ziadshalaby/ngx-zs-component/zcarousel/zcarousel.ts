import { Component, input, output, model, viewChild, ElementRef, computed, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface CarouselItem {
  id: number | string;
  name: string;
  image: string;
  description?: string;
  [key: string]: any; // Allow for additional properties
}

export type itemShapeType = 'rect' | 'circle'

@Component({
  selector: 'ZS-carousel',
  imports: [CommonModule],
  templateUrl: './zcarousel.html',
  styleUrl: './zcarousel.css'
})
export class Zcarousel {

  // ============================ Inputs ============================ //
  readonly itemsNumber = input.required<number>()

  readonly arrows = input<boolean>(true);                        // show/hide arrows
  readonly arrowColorClass = input<string>('text-gray-700');    // arrow color

  readonly showIndicators = input<boolean>(true);

  readonly autoPlay = input<boolean>(true);
  readonly duration = input<number>(3000);

  readonly maxItemsPerBox = input<number>(4); // أقصى عدد ممكن يظهر في الـ box

  readonly itemMinWidth = input<number>(200)
  // ============================ Inputs ============================ //


  // ============================ Outputs ============================ //
  readonly indexChange = output<number>();
  // ============================ Outputs ============================ //


  // ============================ Model ============================ //
  readonly currentIndex = model<number>(0);
  // ============================ Model ============================ //


  // ============================ View Children ============================ //
  readonly carouselContainer = viewChild<ElementRef<HTMLElement>>('carouselContainer');
  readonly carouselTrack = viewChild<ElementRef<HTMLDivElement>>('carouselTrack')
  // ============================ View Children ============================ //


  // ============================ Signals ============================ //
  readonly itemsPerBox = signal<number>(1);
  readonly currentTranslate = signal<number>(0);
  readonly dragging = signal<boolean>(false);
  private readonly startX = signal<number>(0);
  private readonly prevTranslate = signal<number>(0);
  // ============================ Signals ============================ //


  // ============================ Computed ============================ //
  readonly itemsPerBoxWidth = computed<string>(() =>  `${100/this.itemsPerBox()}%`);
  
  readonly totalBoxes = computed<number>(() =>
    Math.ceil(this.itemsNumber() / this.itemsPerBox())
  );

  readonly indicatorBoxes = computed<number[]>(() =>
    Array.from({ length: this.totalBoxes() }, (_, i) => i)
  );
  // ============================ Computed ============================ //


  // ============================ Private Properties ============================ //
  private autoPlayTimer: ReturnType<typeof setInterval> | null = null;
  private resizeObserver!: ResizeObserver;
  // ============================ Private Properties ============================ //


  // ============================ Lifecycle Hooks ============================ //
  constructor() {
    // autoplay
    effect(() => {
      this.autoPlay() ? this.startAutoPlay() : this.stopAutoPlay();
    });
  }

  ngAfterViewInit() {
    const el = this.carouselContainer()?.nativeElement;
    if (el) {
      this.resizeObserver = new ResizeObserver(() => {
        this.updateItemsPerBox();
        // بعد كل تغيير في الحجم، عيّن translate حسب ال index الحالى
        const containerWidth = el.offsetWidth;
        const pos = -this.currentIndex() * containerWidth;
        this.applyTranslate(pos, 'none'); // رجّع بدون transition فورى
      });
      this.resizeObserver.observe(el);
      this.updateItemsPerBox();
      // وضع أولى الحالة
      const containerWidth = el.offsetWidth;
      this.applyTranslate(-this.currentIndex() * containerWidth, 'none');
    }
  }

  ngOnDestroy() {
    this.stopAutoPlay();
    if (this.resizeObserver) this.resizeObserver.disconnect();
  }
  // ============================ Lifecycle Hooks ============================ //


  // ============================ Public Methods ============================ //
  updateIndex(newIndex: number) {
    const containerEl = this.carouselContainer();
    if (!containerEl) return;

    this.currentIndex.set(newIndex);
    this.indexChange.emit(newIndex);

    // حساب المسافة بالـ pixels وربطها بالـ signal فقط
    const containerWidth = containerEl.nativeElement.offsetWidth;
    const newTranslate = -newIndex * containerWidth;
    this.applyTranslate(newTranslate, 'transform 0.3s ease-out');

    this.restartAutoPlay();
  }

  next() {
    if (this.currentIndex() < this.totalBoxes() - 1) {
      this.updateIndex(this.currentIndex() + 1);
    } else {
      this.updateIndex(0);
    }
  }

  previous() {
    if (this.currentIndex() > 0) {
      this.updateIndex(this.currentIndex() - 1);
    } else {
      this.updateIndex(this.totalBoxes() - 1);
    }
  }
  // ============================ Public Methods ============================ //


  // ============================ AutoPlay Methods ============================ //
  startAutoPlay() {
    if (this.autoPlayTimer) return;
    this.autoPlayTimer = setInterval(() => this.next(), this.duration());
  }

  stopAutoPlay() {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
      this.autoPlayTimer = null;
    }
  }

  restartAutoPlay() {
    this.stopAutoPlay();
    if (this.autoPlay()) this.startAutoPlay();
  }
  // ============================ AutoPlay Methods ============================ //


  // ============================ Resize Handling ============================ //
  private updateItemsPerBox() {
    const containerWidth = this.carouselContainer()?.nativeElement.offsetWidth || 0;

    // عدد العناصر الممكن تعرضها بدون ما يضيق الشكل
    const possibleCount = Math.floor(containerWidth / this.itemMinWidth());

    // خليه أقل من أو يساوي الحد الأقصى
    this.itemsPerBox.set(Math.min(this.maxItemsPerBox(), Math.max(1, possibleCount)));
  }
  // ============================ Resize Handling ============================ //


  // ============================ Drag Handling ============================ //
  onDragStart(event: PointerEvent) {
    event.preventDefault();
    const trackEl = this.carouselTrack();
    const containerEl = this.carouselContainer();
    if (!trackEl || !containerEl) return;

    this.dragging.set(true);
    this.startX.set(event.clientX);
    this.prevTranslate.set(-this.currentIndex() * containerEl.nativeElement.offsetWidth);

    // إزالة transition أثناء السحب
    // (نحن لسه لا نلمس transform مباشرة — الـ template سيطبّق currentTranslate)
    trackEl.nativeElement.style.transition = 'none';
    this.stopAutoPlay();
  }

  onDragMove(event: PointerEvent) {
    if (!this.dragging()) return;
    const delta = event.clientX - this.startX();
    this.currentTranslate.set(this.prevTranslate() + delta);
    // لا تعدّل style.transform هنا — template يطبقه
  }

  onDragEnd() {
    if (!this.dragging()) return;
    this.dragging.set(false);

    const containerEl = this.carouselContainer();
    if (!containerEl) return;

    const containerWidth = containerEl.nativeElement.offsetWidth;
    const movedSlides = Math.round(-this.currentTranslate() / containerWidth);
    const newIndex = Math.max(0, Math.min(this.totalBoxes() - 1, movedSlides));

    // حدّث الـ index (وهى بدورها تستدعى applyTranslate)
    this.updateIndex(newIndex);

    // بعد التحديث التأكد من وضع الـ translate المتوافق مع index
    const finalTranslate = -this.currentIndex() * containerWidth;
    this.applyTranslate(finalTranslate, 'transform 0.3s ease-out');

    if (this.autoPlay()) this.startAutoPlay();
  }
  // ============================ Drag Handling ============================ //


  // ============================ Helper Methods ============================ //
  // helper: set translate value and optionally change transition
  private applyTranslate(value: number, transition: string | null = 'transform 0.3s ease-out') {
    this.currentTranslate.set(value);
    const trackEl = this.carouselTrack();
    if (!trackEl) return;
    if (transition === null) {
      trackEl.nativeElement.style.transition = 'none';
    } else {
      trackEl.nativeElement.style.transition = transition;
    }
  }
  // ============================ Helper Methods ============================ //

}