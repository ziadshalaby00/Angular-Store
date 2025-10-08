// ==============================================
// Types
// ==============================================

import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  input,
  signal
} from '@angular/core';
import { ZalertService } from '../zalertService/zalert-service';

export interface Alert {
  id: number | string;
  message: string;
  type: 'success' | 'danger' | 'warning' | 'info';
  autoClose?: boolean;
  duration?: number;
  showCloseButton?: boolean;
  progress?: number;
}

export interface AlertFullType extends Alert {
  icon: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
}

export type OldAlertsType = Set<number | string>;

export const ALERT_CONFIG: Record<
  Alert['type'],
  Omit<AlertFullType, keyof Alert>
> = {
  success: {
    icon: 'fas fa-check-circle',
    bgColor: 'bg-green-100 dark:bg-green-800',
    textColor: 'text-green-800 dark:text-green-100',
    borderColor: 'border-green-500 dark:border-green-300'
  },
  danger: {
    icon: 'fas fa-exclamation-circle',
    bgColor: 'bg-red-100 dark:bg-red-800',
    textColor: 'text-red-800 dark:text-red-100',
    borderColor: 'border-red-500 dark:border-red-300'
  },
  warning: {
    icon: 'fas fa-exclamation-triangle',
    bgColor: 'bg-yellow-100 dark:bg-yellow-800',
    textColor: 'text-yellow-800 dark:text-yellow-100',
    borderColor: 'border-yellow-500 dark:border-yellow-300'
  },
  info: {
    icon: 'fas fa-info-circle',
    bgColor: 'bg-blue-100 dark:bg-blue-800',
    textColor: 'text-blue-800 dark:text-blue-100',
    borderColor: 'border-blue-500 dark:border-blue-300'
  }
};

// ==============================================
// Component Decorator
// ==============================================

@Component({
  selector: 'ZS-alert',
  imports: [CommonModule],
  templateUrl: './zalert.html',
  styleUrl: './zalert.css'
})
export class Zalert {

  // ==============================================
  // Dependencies
  // ==============================================

  readonly zalertService: ZalertService = inject(ZalertService);

  // ==============================================
  // Inputs
  // ==============================================

  readonly positionClass = input<string>('top-4 right-4'); // e.g., "top-6 left-6", "bottom-4 right-10"
  readonly defaultShowCloseButton = input<boolean>(true);
  readonly defaultAutoClose = input<boolean>(true);
  readonly defaultDuration = input<number>(5000);

  // ==============================================
  // Signals & Computed Properties
  // ==============================================

  private readonly oldAlerts = signal<OldAlertsType>(new Set());

  private readonly direction = computed<'top' | 'bottom'>(() => {
    for (const part of this.positionClass().split(' ')) {
      if (part.startsWith('bottom-')) return 'bottom';
      if (part.startsWith('top-')) return 'top';
    }
    return 'top';
  });

  readonly alerts = computed<Alert[]>(() => {
    const list = this.zalertService.alerts();
    return this.direction() === 'bottom' ? [...list].reverse() : list;
  });

  readonly alertConfig = computed<AlertFullType[]>(() => {
    return this.alerts().map((alert: Alert) => {
      const config = ALERT_CONFIG[alert.type] || ALERT_CONFIG.info;
      return {
        ...alert,
        ...config
      };
    });
  });

  // ==============================================
  // Getters
  // ==============================================

  get maxHeightStyle(): { maxHeight: string } {
    let offsetRem = 0;

    for (const part of this.positionClass().split(' ')) {
      const match = part.match(/\d+/);
      if (match) {
        offsetRem = parseInt(match[0], 10) * 0.25;
      }
    }

    return {
      maxHeight: `calc(100vh - ${offsetRem}rem)`
    };
  }

  // ==============================================
  // Private Properties
  // ==============================================

  private activeIntervals = new Map<string | number, number>();

  // ==============================================
  // Lifecycle & Effects
  // ==============================================

  constructor() {
    effect(() => {
      const alerts = this.alerts();
      const oldIds = this.oldAlerts();

      // استخرج التنبيهات الجديدة فقط
      const newOnes = alerts.filter(a => !oldIds.has(a.id));

      // سجّل كل تنبيه جديد
      for (const alert of newOnes) {
        this.registerAlert(alert);
      }
    });
  }

  ngOnDestroy(): void {
    this.activeIntervals.forEach(clearInterval);
    this.activeIntervals.clear();
  }

  // ==============================================
  // Private Methods
  // ==============================================

  private registerAlert(alert: Alert): void {
    // Mark alert as processed
    const updatedSet = new Set(this.oldAlerts());
    updatedSet.add(alert.id);
    this.oldAlerts.set(updatedSet);

    const autoClose = alert.autoClose ?? this.defaultAutoClose();
    const duration = alert.duration ?? this.defaultDuration();

    if (autoClose) {
      let progress = 100;
      const step = 100 / (duration / 100);

      const interval = window.setInterval(() => {
        progress = Math.max(0, progress - step);

        this.zalertService.alerts.update(all =>
          all.map(a => (a.id === alert.id ? { ...a, progress } : a))
        );

        if (progress <= 0) {
          this.closeAlert(alert.id);
        }
      }, 100);

      this.activeIntervals.set(alert.id, interval);
    }
  }

  // ==============================================
  // Public Methods
  // ==============================================

  closeAlert(id: string | number): void {
    // Clear active interval if exists
    const interval = this.activeIntervals.get(id);
    if (interval) {
      clearInterval(interval);
      this.activeIntervals.delete(id);
    }

    // Remove from processed alerts
    const updatedSet = new Set(this.oldAlerts());
    updatedSet.delete(id);
    this.oldAlerts.set(updatedSet);

    // Remove from service
    this.zalertService.onAlertClosed(id);
  }
}