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
import { FormPaletteMap, BaseSize, FormStyle } from '../../palette-service/palette-service';
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

  readonly min = input(10);
  readonly max = input(400);
  readonly step = input(10);

  readonly inputStyle = input<FormStyle>('secondary');
  readonly size = input<BaseSize>('md');

  readonly disabled = input<boolean>(false);
  readonly isReadonly = input<boolean>(false);

  readonly showValue = input(true);

  // ==============================================
  // Model
  // ==============================================
  readonly value = model<number>(200);
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
    const sizeClasses: Record<'size' | 'height', Record<BaseSize, string>> = {
      height: {
        sm: 'h-1.5',
        md: 'h-2.5',
        lg: 'h-3.5',
      },
      size: {
        sm: 'size-3.5',
        md: 'size-5',
        lg: 'size-7',
      }
    }
    return sizeClasses[type][this.size()]
  }

  readonly dotCLasses = computed<string>(() => {
    const sizeClasses: Record<BaseSize, string> = {
      sm: 'text-[6px]',
      md: 'text-[10px]',
      lg: 'text-[14px]',
    }
    return sizeClasses[this.size()]
  })

  readonly gapCLasses = computed<string>(() => {
    const sizeClasses: Record<BaseSize, string> = {
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
    }
    return sizeClasses[this.size()]
  })

  readonly rangeClasses = computed<string>(() => {
    const base = 'relative w-full rounded-full cursor-pointer';
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
    if (!track) return `${p}%`;

    const trackWidth = track.offsetWidth; // عرض الشريط بالبكسل
    const displacementSizes = {
      sm: 6,
      md: 10,
      lg: 14,
    };

    const displacementPx = displacementSizes[this.size()];
    const displacementPercent = (displacementPx / trackWidth) * 100;

    const displacement = p - displacementPercent;
    return `${displacement}%`;
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