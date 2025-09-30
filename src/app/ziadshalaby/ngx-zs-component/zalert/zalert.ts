import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { ZalertService } from '../zalertService/zalert-service';
import { Alert, ALERT_CONFIG, AlertFullType, oldAlertsType } from '../configTypeAndClsService/configTypeAndCls';

// =============== Component Decorator ===============
@Component({
  selector: 'ZS-alert',
  imports: [CommonModule],
  templateUrl: './zalert.html',
  styleUrl: './zalert.css'
})
export class Zalert {


  // =============== Dependencies ===============
  readonly zalertService: ZalertService = inject(ZalertService)


  // =============== Inputs ===============
  readonly positionClass = input<string>('top-4 right-4'); // e.g., "top-6 left-6", "bottom-4 right-10"
  readonly defultShowCloseButton = input<boolean>(true);
  readonly defultAutoClose = input<boolean>(true)
  readonly defultDuration = input<number>(5000)


  // =============== Signals & Computed ===============
  private readonly oldAlerts = signal<oldAlertsType>(new Set());

  private readonly direction = computed<'top' | 'bottom'>(() => {
    for (const s of this.positionClass().split(' ')) {
      if (s.startsWith('bottom-')) return 'bottom';
      if (s.startsWith('top-')) return 'top';
    }
    return 'top';
  });

  readonly alerts = computed<Alert[]>(() => {
    const list = this.zalertService.alerts();
    return this.direction() === 'bottom' ? [...list].reverse() : list;
  });

  readonly alertConfig = computed<AlertFullType[]>(() => {
    return this.alerts().map((alert: Alert) => {
      const config = ALERT_CONFIG[alert.type] || ALERT_CONFIG['info'];
      return {
        ...alert,
        ...config,
      };
    });
  });


  // =============== Getters ===============
  get maxHeightStyle(): { maxHeight: string } {
    let offsetRem = 0;

    for (const s of this.positionClass().split(' ')) {
      const match = s.match(/\d+/);
      if (match) {
        offsetRem = parseInt(match[0], 10) * 0.25;
      }
    }

    return {
      maxHeight: `calc(100vh - ${offsetRem}rem)`
    };
  }


  // =============== Private Properties ===============
  private activeIntervals = new Map<string | number, number>();


  // =============== Lifecycle & Effects ===============
  constructor() {
    effect(() => {
      const lastAlert = this.alerts().at(-1);
      if (lastAlert && !this.oldAlerts().has(lastAlert.id)) {
        this.registerAlert(lastAlert);
      }
    });
  }

  ngOnDestroy(): void {
    this.activeIntervals.forEach(clearInterval);
    this.activeIntervals.clear();
  }


  // =============== Private Methods ===============
  private registerAlert(alert: Alert): void {
    // سجل إن الـ alert اتعالج
    const set: oldAlertsType = new Set(this.oldAlerts());
    set.add(alert.id);
    this.oldAlerts.set(set);

    const autoClose = alert.autoClose ?? this.defultAutoClose();
    const duration = alert.duration ?? this.defultDuration();

    // Auto-close logic
    if (autoClose) {
      let progress = 100;
      const step = 100 / (duration / 100);

      const interval = window.setInterval(() => {
        progress = Math.max(0, progress - step);

        // تحديث progress
        this.zalertService.alerts.update(all =>
          all.map(a => a.id === alert.id ? { ...a, progress } : a)
        );

        if (progress <= 0) {
          this.closeAlert(alert.id);
        }
      }, 100);

      this.activeIntervals.set(alert.id, interval);
    }
  }


  // =============== Public Methods ===============
  closeAlert(id: string | number): void {
    // نظف أي interval شغال
    const interval = this.activeIntervals.get(id);
    if (interval) {
      clearInterval(interval);
      this.activeIntervals.delete(id);
    }

    // شيل من oldAlerts
    const set: oldAlertsType = new Set(this.oldAlerts());
    set.delete(id);
    this.oldAlerts.set(set);

    // احذف من الخدمة
    this.zalertService.onAlertClosed(id);
  }

}