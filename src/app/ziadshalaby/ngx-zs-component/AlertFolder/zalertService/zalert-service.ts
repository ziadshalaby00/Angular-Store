// ==============================================
// Types
// ==============================================

import { Injectable, signal } from '@angular/core';
import { Alert } from '../zalert/zalert';

export interface NewAlert extends Omit<Alert, 'id' | 'progress'> {}

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

  addAlert(newAlert: NewAlert | NewAlert[]): void {
    const alertsToAdd = Array.isArray(newAlert) ? newAlert : [newAlert];

    const newAlerts: Alert[] = alertsToAdd.map((a: NewAlert) => ({
      ...a,
      id: crypto.randomUUID(),
    }));

    this.alerts.update((alerts: Alert[]) => [...alerts, ...newAlerts]);
  }

  onAlertClosed(id: string | number): void {
    this.alerts.update((alerts: Alert[]) => {
      return alerts.filter(a => a.id !== id);
    });
  }
}