// ==============================================
// Imports
// ==============================================
import {
  Component,
  ChangeDetectionStrategy,
  computed,
  input,
  model,
  signal,
  ElementRef,
  viewChild,
  effect,
} from '@angular/core';
import { FormPaletteMap, FormSize, FormStyle } from '../../palette-service/palette-service';
import { Label } from '../label/label';
import { CommonModule } from '@angular/common';

// ==============================================
// Component Metadata
// ==============================================
@Component({
  selector: 'ZS-range',
  imports: [Label, CommonModule],
  templateUrl: './range.html',
  styleUrl: './range.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Range {

  // ==============================================
  // Inputs
  // ==============================================
  readonly iId = input<string>(crypto.randomUUID());
  readonly label = input<string | null>(null);
  readonly hint = input<string | null>(null);

  readonly min = input(1);
  readonly max = input(100);
  readonly step = input(1);

  readonly inputStyle = input<FormStyle>('secondary');
  readonly size = input<FormSize>('md');

  readonly disabled = input<boolean>(false);
  readonly isReadonly = input<boolean>(false);

  readonly showValue = input(true);

  // ==============================================
  // Model
  // ==============================================
  readonly value = model<number>(50);
  readonly touched = model<boolean>(false); // Tracks if the user has interacted with the input

  // ==============================================
  // References & Internal State
  // ==============================================
  readonly trackRef = viewChild<ElementRef<HTMLDivElement>>('track');
  readonly dragging = signal(false);

  // ==============================================
  // Computed Properties
  // ==============================================
  readonly disabledOrReadonly = computed<boolean>(() => this.disabled() || this.isReadonly());

  readonly palette = computed(() => {
    return FormPaletteMap.get(this.inputStyle()) ?? FormPaletteMap.get('secondary')!;
  });

  readonly percent = computed(() => {
    const range = this.max() - this.min();
    return ((this.value() - this.min()) / range) * 100;
  });

  rangeSizeClasses = (type: 'size' | 'height'): string => {
    const sizeClasses: Record<'size' | 'height', Record<FormSize, string>> = {
      height: {
        sm: 'h-2',
        md: 'h-4',
        lg: 'h-6',
      },
      size: {
        sm: 'size-2',
        md: 'size-4',
        lg: 'size-6',
      }
    }

    return sizeClasses[type][this.size()]
  }

  readonly rangeClasses = computed<string>(() => {
    const base = 'relative w-full rounded-full cursor-pointer overflow-hidden';
    const sizeClasses = this.rangeSizeClasses('height');
    const disabledClass = this.disabled() ? 'opacity-60' : '';
    const interactionClass = !this.disabledOrReadonly() ? 'group' : '';

    return [
      sizeClasses,
      this.palette().border,
      this.palette().inputBg,
      this.palette().text,
      base,
      disabledClass,
      interactionClass
    ].join(' ');
  });

  // ==============================================
  // Event Handlers
  // ==============================================
  onMouseDown(event: MouseEvent): void {
    if (this.disabledOrReadonly()) return;
    this.dragging.set(true);
    this.updateValueFromEvent(event);
  }

  onMouseMove(event: MouseEvent): void {
    if (this.disabledOrReadonly() || !this.dragging()) return;
    this.updateValueFromEvent(event);
  }

  onMouseUp(): void {
    if (this.disabledOrReadonly()) return;
    this.dragging.set(false);
  }

  // ==============================================
  // Private Helpers
  // ==============================================
  private updateValueFromEvent(event: MouseEvent): void {
    if (this.disabledOrReadonly()) return;

    const track = this.trackRef()?.nativeElement;
    if (!track) return;

    const rect = track.getBoundingClientRect();
    const x = Math.min(Math.max(event.clientX - rect.left, 0), rect.width);
    const percent = x / rect.width;
    const rawValue = this.min() + percent * (this.max() - this.min());

    const stepped = Math.round(rawValue / this.step()) * this.step();
    this.value.set(Math.min(this.max(), Math.max(this.min(), stepped)));
  }

  calcThumbPosition(): string {
    const p = this.percent();
    const track = this.trackRef()?.nativeElement;
    if (!track) return '0%';

    const trackWidth = track.offsetWidth;
    const thumbSizes = {
      sm: 8,
      md: 16,
      lg: 24
    }
    const thumbSize = thumbSizes[this.size()];
    const thumbHalf = thumbSize / 2;
    const center = (p / 100) * trackWidth;
    const left = center - thumbHalf;
    const clamped = Math.min(Math.max(left, 0), trackWidth - thumbSize);

    return `${(clamped / trackWidth) * 100}%`;
  }

  // ==============================================
  // Lifecycle & Side Effects
  // ==============================================
  constructor() {
    const mouseUpHandler = this.onMouseUp.bind(this);
    const mouseMoveHandler = this.onMouseMove.bind(this);

    effect((): (() => void) | void => {
      if (!this.dragging()) return;

      window.addEventListener('mouseup', mouseUpHandler);
      window.addEventListener('mousemove', mouseMoveHandler);

      return () => {
        window.removeEventListener('mouseup', mouseUpHandler);
        window.removeEventListener('mousemove', mouseMoveHandler);
      };
    });
  }
}