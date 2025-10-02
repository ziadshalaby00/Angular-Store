import { computed, inject, Injectable, signal } from '@angular/core';
import { Config } from './config';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ZalertService } from '../ziadshalaby/ngx-zs-component/AlertFolder/zalertService/zalert-service';

@Injectable({
  providedIn: 'root'
})
export class Product {
  private http: HttpClient = inject(HttpClient);
  private config: Config = inject(Config);
  private zalertService: ZalertService = inject(ZalertService)

  products = signal<any[]>([]);
  error = signal<string | null>(null);
  loading = signal<boolean>(false)

  currentPage = signal(0);
  pageSize = signal(10);
  totalPages = signal(0);
  totalItems = signal(0)

  loadProducts(filters: any) {
    this.error.set(null);
    this.loading.set(true)

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

        this.totalItems.set(data.count);
        this.totalPages.set(Math.ceil(data.count / this.pageSize()));

        const nextPage = this.getPageNumber(data.next);
        const prevPage = this.getPageNumber(data.previous);

        if (!prevPage) {
          this.currentPage.set(1);
        } else if (!nextPage) {
          this.currentPage.set(this.totalPages());
        } else {
          this.currentPage.set(prevPage + 1);
        }

        this.loading.set(false)
      },
      error: (err) => {
        console.log(err)

        this.error.set('Failed to load products');
        this.zalertService.addAlert({
          message: 'Failed to load products',
          type: 'danger',
          autoClose: false,
        })

        this.loading.set(false)
      }
    });
  }

  getPageNumber(url: string | null): number | null {
    if (!url) return null;
    const params = new URL(url).searchParams;
    return parseInt(params.get('page') || '1', 10);
  }
}
