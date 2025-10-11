// ==============================================
// Types
// ==============================================

import { Injectable, signal } from '@angular/core';
import { Alert } from '../zalert/zalert';

export interface NewAlert extends Omit<Alert, 'id' | 'progress'> {}
export interface BulkAlert extends Omit<Alert, 'id' | 'progress' | 'message'> {}

// ==============================================
// Service
// ==============================================

@Injectable({
  providedIn: 'root'
})
export class ZalertService {

  // ==============================================
  // State
  // ==============================================

  readonly alerts = signal<Alert[]>([]);

  // ==============================================
  // Public Methods
  // ==============================================

  addAlert(newAlert: NewAlert): void {
    const newAlertToAdd: Alert = {
      ...newAlert,
      id: crypto.randomUUID(),
    };

    this.alerts.update((alerts: Alert[]) => [...alerts, newAlertToAdd]);
  }

  bulkAlert(newAlerts: string[], options: BulkAlert): void {
    const alertsToAdd: Alert[] = newAlerts.map((message) => ({
      ...options,
      message,
      id: crypto.randomUUID(),
    }));

    this.alerts.update((alerts: Alert[]) => [...alerts, ...alertsToAdd]);
  }

  onAlertClosed(id: string | number): void {
    this.alerts.update((alerts: Alert[]) => {
      return alerts.filter(a => a.id !== id);
    });
  }
}