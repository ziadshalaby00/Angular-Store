import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Config } from './config';

export interface BuyNowBody {
  product_id: number;
  quantity: number;
  shipping_address_id: number;
  payment_method: string;
}

@Injectable({ providedIn: 'root' })
export class Order {
  private http = inject(HttpClient);
  private config = inject(Config);

  buyNow(body: BuyNowBody) {
    return this.http.post(
      `${this.config.apiUrl}/api/order/buy-now/`,
      body,
      { withCredentials: true }
    );
  }

  getUserOrders() {
    return this.http.get(
      `${this.config.apiUrl}/api/order/get-orders/`,
      { withCredentials: true }
    );
  }
}