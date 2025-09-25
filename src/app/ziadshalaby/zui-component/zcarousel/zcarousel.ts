import { 
  Component, 
  input, 
  output, 
  model, 
  viewChild, 
  ElementRef, 
  computed, 
  effect, 
  signal 
} from '@angular/core';
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
  selector: 'app-zcarousel',
  imports: [CommonModule],
  templateUrl: './zcarousel.html',
  styleUrl: './zcarousel.css'
})
export class Zcarousel {
  // Inputs
  items = input.required<CarouselItem[]>();
  currentIndex = model<number>(0);
  
  arrows = input<boolean>(true);                        // show/hide arrows
  arrowColorClass = input<string>('text-gray-700');    // arrow color

  itemShape = input<itemShapeType>('rect');
  itemShapeSize = input<number>(300);

  showIndicators = input<boolean>(true);

  autoPlay = input<boolean>(true);
  duration = input<number>(3000);

  maxItemsPerBox = input<number>(4); // أقصى عدد ممكن يظهر في الـ box

  // Outputs
  itemClick = output<CarouselItem>();
  indexChange = output<number>();
  
  // View child
  carouselContainer = viewChild<ElementRef<HTMLElement>>('carouselContainer');

  // Items per box (dynamic by ResizeObserver)
  itemsPerBox = signal<number>(1);

  // Map item width
  readonly WIDTH_MAP: Record<string, string> = {
    1: 'w-full',
    2: 'w-1/2',
    3: 'w-1/3',
    4: 'w-1/4',
    5: 'w-1/5',
    6: 'w-1/6',
    7: 'w-1/7',
    8: 'w-1/8',
    9: 'w-1/9',
    10: 'w-1/10',
  };

  itemsPerBoxClass = computed<string>(() => this.WIDTH_MAP[this.itemsPerBox()] || 'w-full');

  get shape(): string {
    if (this.itemShape() === 'rect') {
      return 'rounded-lg'
    }
    return 'rounded-full'
  }

  get itemsPerBoxClasses(): string {
    if (this.itemShape() === 'rect') {
      return String(this.itemsPerBoxClass());
    }
    return `${this.itemsPerBoxClass()} justify-center items-center`;
  }

  private autoPlayTimer: number | null = null;

  // ========================================================
  totalBoxes = computed<number>(() =>
    Math.ceil(this.items().length / this.itemsPerBox())
  );

  indicatorBoxes = computed<number[]>(() =>
    Array.from({ length: this.totalBoxes() }, (_, i) => i)
  );

  // ========================================================
  constructor() {
    // autoplay
    effect(() => {
      this.autoPlay() ? this.startAutoPlay() : this.stopAutoPlay();
    });
  }

  ngAfterViewInit() {
    const el = this.carouselContainer()?.nativeElement;
    if (el) {
      this.resizeObserver = new ResizeObserver(() => this.updateItemsPerBox());
      this.resizeObserver.observe(el);
      this.updateItemsPerBox();
    }
  }

  ngOnDestroy() {
    this.stopAutoPlay();
    if (this.resizeObserver) this.resizeObserver.disconnect();
  }

  // Actions
  onItemClick(item: CarouselItem) {
    this.itemClick.emit(item);
  }

  updateIndex(newIndex: number) {
    const trackEl = this.carouselTrack();
    const containerEl = this.carouselContainer();
    if (!trackEl || !containerEl) return;

    this.currentIndex.set(newIndex);
    this.indexChange.emit(newIndex);

    // اربط translate بالـ index الجديد
    const containerWidth = containerEl.nativeElement.offsetWidth;
    this.currentTranslate.set(-newIndex * containerWidth);
    trackEl.nativeElement.style.transition = 'transform 0.3s ease-out';
    trackEl.nativeElement.style.transform = `translateX(${this.currentTranslate()}px)`;

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

  // autoplay
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

  // ========================================================
  private resizeObserver!: ResizeObserver;
  itemMinWidth = input<number>(200)

  private updateItemsPerBox() {
    const containerWidth = this.carouselContainer()?.nativeElement.offsetWidth || 0;

    // عدد العناصر الممكن تعرضها بدون ما يضيق الشكل
    const possibleCount = Math.floor(containerWidth / this.itemMinWidth());

    // خليه أقل من أو يساوي الحد الأقصى
    this.itemsPerBox.set(Math.min(this.maxItemsPerBox(), Math.max(1, possibleCount)));
  }

  getExtraFields(item: any) {
    return Object.keys(item).filter(
      key => !['id', 'image', 'name', 'description'].includes(key)
    );
  }

  // ========================================================

  carouselTrack = viewChild<ElementRef<HTMLDivElement>>('carouselTrack')

  private dragging = signal<boolean>(false);
  private startX = signal<number>(0);
  private currentTranslate = signal<number>(0);
  private prevTranslate = signal<number>(0);

  onDragStart(event: PointerEvent) {
    event.preventDefault();
    const trackEl = this.carouselTrack();
    const containerEl = this.carouselContainer();
    if (!trackEl || !containerEl) return;

    this.dragging.set(true);
    this.startX.set(event.clientX);
    this.prevTranslate.set(-this.currentIndex() * containerEl.nativeElement.offsetWidth);

    // إزالة transition أثناء السحب
    trackEl.nativeElement.style.transition = 'none';
    this.stopAutoPlay();
  }

  onDragMove(event: PointerEvent) {
    if (!this.dragging()) return;
    const trackEl = this.carouselTrack();
    if (!trackEl) return;

    const delta = event.clientX - this.startX();
    this.currentTranslate.set(this.prevTranslate() + delta);
    trackEl.nativeElement.style.transform = `translateX(${this.currentTranslate()}px)`;
  }

  onDragEnd() {
    if (!this.dragging()) return;
    this.dragging.set(false);

    const trackEl = this.carouselTrack();
    const containerEl = this.carouselContainer();
    if (!trackEl || !containerEl) return;

    const containerWidth = containerEl.nativeElement.offsetWidth;
    const movedSlides = Math.round(-this.currentTranslate() / containerWidth);

    const newIndex = Math.max(0, Math.min(this.totalBoxes() - 1, movedSlides));
    this.updateIndex(newIndex);

    trackEl.nativeElement.style.transition = 'transform 0.3s ease-out';
    this.currentTranslate.set(-this.currentIndex() * containerWidth);
    trackEl.nativeElement.style.transform = `translateX(${this.currentTranslate()}px)`;

    if (this.autoPlay()) this.startAutoPlay();
  }
}