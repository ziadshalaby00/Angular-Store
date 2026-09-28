import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Config } from './config';

@Injectable({ providedIn: 'root' })
export class Review {
  private http = inject(HttpClient);
  private config = inject(Config);

  getProductReviews(productId: number, page: number = 1) {
    return this.http.get<any>(
      `${this.config.apiUrl}/api/reviews/products/${productId}/reviews/?page=${page}`,
      { withCredentials: true }
    );
  }
}