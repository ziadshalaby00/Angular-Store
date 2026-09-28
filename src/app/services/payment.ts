import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Config } from './config';

@Injectable({ providedIn: 'root' })
export class Payment {
  private http = inject(HttpClient);
  private config = inject(Config);

  createPayment(orderId: number) {
    return this.http.post<any>(
      `${this.config.apiUrl}/api/payment/create-payment/${orderId}/`,
      {},
      { withCredentials: true }
    );
  }
}