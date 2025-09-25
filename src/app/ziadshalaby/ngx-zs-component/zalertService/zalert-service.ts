import { Injectable, signal } from '@angular/core';
import { Alert } from '../zalert/zalert';

export interface NewAlert extends Omit<Alert, 'id' | 'progress'> {};

@Injectable({
  providedIn: 'root'
})
export class ZalertService {
  alerts = signal<Alert[]>([])

  onAlertClosed(id: string | number): void {
    this.alerts.update((alerts: Alert[]) => {
      return alerts.filter((a) => a.id !== id)
    })
  }

  addAlert(newAlert: NewAlert): void {
    const alert: Alert = {
      ...newAlert,
      id: crypto.randomUUID()
    };

    this.alerts.update((alerts: Alert[]) => [...alerts, alert]);
  }
}