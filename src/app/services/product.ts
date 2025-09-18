import { inject, Injectable, signal } from '@angular/core';
import { Config } from './config';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Product {
  private http = inject(HttpClient);
  private config = inject(Config);

  products = signal<any[]>([]);
  error = signal<string | null>(null);
  loading = signal<boolean>(false);

  loadProducts() {
    this.loading.set(true);
    this.error.set(null);
    
    this.http.get(`${this.config.apiUrl}/api/products/get-products/`).subscribe({
      next: (data: any) => {
        console.log(data)
        this.products.set(data.results);
        this.loading.set(false);
      },
      error: (err) => {
        console.log(err)
        this.error.set('Failed to load products');
        this.loading.set(false);
      }
    });
  }
}
