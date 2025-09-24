import { Injectable, signal } from '@angular/core';
import { Alert } from '../zalert/zalert';

export interface NewAlert {
  message: string;
  type: 'success' | 'danger' | 'warning' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class ZalertService {
  alerts = signal<Alert[]>([])

  onAlertClosed(id: string | number): void {
    this.alerts.update((alerts) => {
      return alerts.filter((a) => a.id !== id)
    })
  }

  addAlert(newAlert: NewAlert): void {
    const alert: Alert = {
      ...newAlert,
      id: crypto.randomUUID()
    };

    this.alerts.update((alerts) => [...alerts, alert]);
  }
}