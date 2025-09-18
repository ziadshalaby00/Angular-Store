import { computed, inject, Injectable, signal } from '@angular/core';
import { Config } from './config';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Product {
  private http = inject(HttpClient);
  private config = inject(Config);

  products = signal<any[]>([]);
  error = signal<string | null>(null);

  currentPage = signal(1);
  totalPages = signal(1);

  loadProducts(filters: any) {
    this.error.set(null);

    let params = new HttpParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]() !== '' && filters[key]() !== null && filters[key]() !== undefined) {
        params = params.set(key, filters[key]());
      }
    });
    
    this.http.get(`${this.config.apiUrl}/api/products/get-products/`, { params }).subscribe({
      next: (data: any) => {
        console.log(data)
        this.products.set(data.results);

        const pageSize = 10;
        this.totalPages.set(Math.ceil(data.count / pageSize));

        const nextPage = this.getPageNumber(data.next);
        const prevPage = this.getPageNumber(data.previous);

        if (!prevPage) {
          this.currentPage.set(1);
        } else if (!nextPage) {
          this.currentPage.set(this.totalPages());
        } else {
          this.currentPage.set(prevPage + 1);
        }
      },
      error: (err) => {
        console.log(err)
        this.error.set('Failed to load products');
      }
    });
  }

  getPageNumber(url: string | null): number | null {
    if (!url) return null;
    const params = new URL(url).searchParams;
    return parseInt(params.get('page') || '1', 10);
  }
}
