import { inject, Injectable, signal } from '@angular/core';
import { Config } from './config';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Brand {
  private http = inject(HttpClient);
  private config = inject(Config);

  brands = signal<any[]>([]);
  error = signal<string | null>(null);

  loadBrands() {
    this.error.set(null);
    
    this.http.get(`${this.config.apiUrl}/api/products/get-brands/`).subscribe({
      next: (data: any) => {
        console.log(data)
        this.brands.set(data);
      },
      error: (err) => {
        console.log(err)
        this.error.set('Failed to load categories');
      }
    });
  }
}
