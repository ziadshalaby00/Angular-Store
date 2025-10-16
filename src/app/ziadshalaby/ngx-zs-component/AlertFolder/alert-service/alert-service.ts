// ==============================================
// Types
// ==============================================

import { Injectable, signal } from '@angular/core';
import { AlertType } from '../alert/alert';

export interface NewAlert extends Omit<AlertType, 'id' | 'progress'> {}
export interface BulkAlert extends Omit<AlertType, 'id' | 'progress' | 'message'> {}

// ==============================================
// Service
// ==============================================

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  // ==============================================
  // State
  // ==============================================

  readonly alerts = signal<AlertType[]>([]);

  // ==============================================
  // Public Methods
  // ==============================================

  addAlert(newAlert: NewAlert): void {
    const newAlertToAdd: AlertType = {
      ...newAlert,
      id: crypto.randomUUID(),
    };

    this.alerts.update((alerts: AlertType[]) => [...alerts, newAlertToAdd]);
  }

  bulkAlert(newAlerts: string[], options: BulkAlert): void {
    const alertsToAdd: AlertType[] = newAlerts.map((message) => ({
      ...options,
      message,
      id: crypto.randomUUID(),
    }));

    this.alerts.update((alerts: AlertType[]) => [...alerts, ...alertsToAdd]);
  }

  onAlertClosed(id: string | number): void {
    this.alerts.update((alerts: AlertType[]) => {
      return alerts.filter(a => a.id !== id);
    });
  }
}