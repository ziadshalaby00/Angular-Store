import { CommonModule } from '@angular/common';
import { Component, computed, input, signal } from '@angular/core';

export type positionType = 'left' | 'right'

@Component({
  selector: 'ZS-scroll-to-top',
  imports: [CommonModule],
  templateUrl: './zscroll-to-top.html',
  styleUrl: './zscroll-to-top.css'
})
export class ZscrollToTop {
  // ✅ Input Signals (Modern Angular)
  position = input<positionType>('right'); // default: right
  circleBgColor = input<string>('text-gray-400/80')
  arrowAprogressColor = input<string>('text-blue-600')

  // Internal Signals
  scrollY = signal<number>(0);

  readonly circleRadius = 22;
  readonly circleCircumference = 2 * Math.PI * this.circleRadius;

  progressOffset = computed(() => {
    const _ = this.scrollY()
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? this.scrollY() / maxScroll : 0;
    return this.circleCircumference * (1 - progress);
  });

  positionClass = computed(() => ({
    'right-4': this.position() === 'right',
    'left-4': this.position() === 'left',
  }));

  ngOnInit() {
    window.addEventListener('scroll', this.onScroll);
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.onScroll);
  }

  private onScroll = () => {
    this.scrollY.set(window.scrollY);
  };

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}
