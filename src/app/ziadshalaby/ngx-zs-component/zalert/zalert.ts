import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { ZalertService } from '../zalertService/zalert-service';

export interface Alert {
  id: number | string; // نستخدمه للتتبع والإغلاق
  message: string;
  type: 'success' | 'danger' | 'warning' | 'info';
  autoClose?: boolean;
  duration?: number;
  showCloseButton?: boolean
  progress?: number;
}

export interface AlertFullType extends Alert {
  icon: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
}

const ALERT_CONFIG: Record<Alert['type'], Omit<AlertFullType, keyof Alert>> = {
  success: {
    icon: 'fas fa-check-circle',
    bgColor: 'bg-green-100 dark:bg-green-800',
    textColor: 'text-green-800 dark:text-green-100',
    borderColor: 'border-green-500 dark:border-green-300',
  },
  danger: {
    icon: 'fas fa-exclamation-circle',
    bgColor: 'bg-red-100 dark:bg-red-800',
    textColor: 'text-red-800 dark:text-red-100',
    borderColor: 'border-red-500 dark:border-red-300',
  },
  warning: {
    icon: 'fas fa-exclamation-triangle',
    bgColor: 'bg-yellow-100 dark:bg-yellow-800',
    textColor: 'text-yellow-800 dark:text-yellow-100',
    borderColor: 'border-yellow-500 dark:border-yellow-300',
  },
  info: {
    icon: 'fas fa-info-circle',
    bgColor: 'bg-blue-100 dark:bg-blue-800',
    textColor: 'text-blue-800 dark:text-blue-100',
    borderColor: 'border-blue-500 dark:border-blue-300',
  },
};

export type oldAlertsType = Set<number | string>

@Component({
  selector: 'ZS-alert',
  imports: [CommonModule],
  templateUrl: './zalert.html',
  styleUrl: './zalert.css'
})
export class Zalert {
  zalertService: ZalertService = inject(ZalertService)
  
  alerts = computed<Alert[]>(() => {
    const list = this.zalertService.alerts();
    return this.direction() === 'bottom' ? [...list].reverse() : list;
  });

  private direction = computed<'top' | 'bottom'>(() => {
    for (const s of this.position().split(' ')) {
      if (s.startsWith('bottom-')) return 'bottom';
      if (s.startsWith('top-')) return 'top';
    }
    return 'top';
  });

  private oldAlerts = signal<oldAlertsType>(new Set());

  position = input<string>('top-4 right-4'); // e.g., "top-6 left-6", "bottom-4 right-10"
  defultShowCloseButton = input<boolean>(true);

  defultAutoClose = input<boolean>(true)
  defultDuration = input<number>(5000)

  get maxHeightStyle(): { maxHeight: string } {
    let offsetRem = 0;

    for (const s of this.position().split(' ')) {
      const match = s.match(/\d+/);
      if (match) {
        offsetRem = parseInt(match[0], 10) * 0.25;
      }
    }

    return {
      maxHeight: `calc(100vh - ${offsetRem}rem)`
    };
  }

  alertConfig = computed<AlertFullType[]>(() => {
    return this.alerts().map((alert: Alert) => {
      const config = ALERT_CONFIG[alert.type] || ALERT_CONFIG['info'];
      return {
        ...alert,
        ...config,
      };
    });
  });

  constructor() {
    effect(() => {
      const lastAlert = this.alerts().at(-1);
      if (lastAlert && !this.oldAlerts().has(lastAlert.id)) {
        this.registerAlert(lastAlert);
      }
    });
  }

  private activeIntervals = new Map<string | number, number>();

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

  ngOnDestroy(): void {
    this.activeIntervals.forEach(clearInterval);
    this.activeIntervals.clear();
  }
}
