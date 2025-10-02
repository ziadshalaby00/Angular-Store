import { Injectable, signal } from '@angular/core';
import { Alert } from '../zalert/zalert';

// =============== Interfaces ===============
export interface NewAlert extends Omit<Alert, 'id' | 'progress'> {}


// =============== Service ===============
@Injectable({
  providedIn: 'root'
})
export class ZalertService {

  // =============== State ===============
  readonly alerts = signal<Alert[]>([]);


  // =============== Public Methods ===============
  addAlert(newAlert: NewAlert): void {
    const alert: Alert = {
      ...newAlert,
      id: crypto.randomUUID()
    };

    this.alerts.update((alerts: Alert[]) => [...alerts, alert]);
  }

  onAlertClosed(id: string | number): void {
    this.alerts.update((alerts: Alert[]) => {
      return alerts.filter((a) => a.id !== id);
    });
  }

}