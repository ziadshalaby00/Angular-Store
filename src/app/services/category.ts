import { inject, Injectable, signal } from '@angular/core';
import { Config } from './config';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Category {
  private http = inject(HttpClient);
  private config = inject(Config);

  categories = signal<any[]>([]);
  error = signal<string | null>(null);
  loading = signal<boolean>(false)

  loadCategories() {
    this.error.set(null);
    this.loading.set(true)

    this.http.get(`${this.config.apiUrl}/api/products/get-categories/`).subscribe({
      next: (data: any) => {
        console.log(data)
        this.categories.set(data);
        this.loading.set(false)
      },
      error: (err) => {
        console.log(err)
        this.error.set('Failed to load categories');
        this.loading.set(false)
      }
    });
  }
}
