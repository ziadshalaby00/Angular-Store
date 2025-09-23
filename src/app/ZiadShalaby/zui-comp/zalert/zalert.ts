import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { ZalertService } from '../zalertService/zalert-service';

export interface Alert {
  id: number | string; // نستخدمه للتتبع والإغلاق
  message: string;
  type: 'success' | 'danger' | 'warning' | 'info';
  progress?: number;
}

@Component({
  selector: 'app-zalert',
  imports: [CommonModule],
  templateUrl: './zalert.html',
  styleUrl: './zalert.css'
})
export class Zalert {
  zalertService = inject(ZalertService)
  
  alerts = computed(() => this.zalertService.alerts());
  private oldAlerts = signal<Set<number | string>>(new Set());

  position = input<string>('top-4 right-4'); // e.g., "top-6 left-6", "bottom-4 right-10"
  showCloseButton = input<boolean>(true);

  autoClose = input<boolean>(true)
  duration = input<number>(5000)

  get maxHeightStyle() {
    let topValue = 0;

    for (const s of this.position().split(' ')) {
      if (s.startsWith('top-')) {
        const match = s.match(/\d+/);
        if (match) topValue = parseInt(match[0], 10);
      }
    }

    const topRem = topValue * 0.25; // Tailwind spacing 1 = 0.25rem

    return {
      maxHeight: `calc(100vh - ${topRem}rem)`
    };
  }

  alertConfig = computed(() => {
    const alerts = this.alerts()

    return alerts.map(alert => {
      const config = {
        ...alert,
        icon: '',
        bgColor: '',
        textColor: '',
        borderColor: '',
      };

      switch (alert.type) {
        case 'success':
          config.icon = 'fas fa-check-circle';
          config.bgColor = 'bg-green-100 dark:bg-green-800';
          config.textColor = 'text-green-800 dark:text-green-100';
          config.borderColor = 'border-green-500 dark:border-green-300';
          break;

        case 'danger':
          config.icon = 'fas fa-exclamation-circle';
          config.bgColor = 'bg-red-100 dark:bg-red-800';
          config.textColor = 'text-red-800 dark:text-red-100';
          config.borderColor = 'border-red-500 dark:border-red-300';
          break;

        case 'warning':
          config.icon = 'fas fa-exclamation-triangle';
          config.bgColor = 'bg-yellow-100 dark:bg-yellow-800';
          config.textColor = 'text-yellow-800 dark:text-yellow-100';
          config.borderColor = 'border-yellow-500 dark:border-yellow-300';
          break;

        case 'info':
        default:
          config.icon = 'fas fa-info-circle';
          config.bgColor = 'bg-blue-100 dark:bg-blue-800';
          config.textColor = 'text-blue-800 dark:text-blue-100';
          config.borderColor = 'border-blue-500 dark:border-blue-300';
          break;
      }

      return config;
    });
  });

  constructor() {
    effect(() => {
      const alerts = this.alerts();

      alerts.forEach(alert => {
        if (!this.oldAlerts().has(alert.id)) {
          const set = new Set(this.oldAlerts());
          set.add(alert.id);
          this.oldAlerts.set(set);

          if (this.autoClose()) {
            const start = Date.now();
            const interval = setInterval(() => {
              const elapsed = Date.now() - start;
              const progress = Math.max(0, 100 - (elapsed / this.duration()) * 100);

              // تحديث progress
              this.zalertService.alerts.update(all => {
                return all.map(a => a.id === alert.id ? { ...a, progress } : a);
              });

              if (elapsed >= this.duration()) {
                clearInterval(interval);
                this.closeAlert(alert.id);
              }
            }, 100);
          }
        }
      });
    });
  }

  closeAlert(id: string | number): void {
    const set = new Set(this.oldAlerts());
    set.delete(id);
    this.oldAlerts.set(set);

    this.zalertService.onAlertClosed(id)
  }
}
