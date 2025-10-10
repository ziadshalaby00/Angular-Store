import { inject, Injectable, signal } from '@angular/core';
import { Config } from './config';
import { HttpClient } from '@angular/common/http';
import { ZalertService } from '../ziadshalaby/ngx-zs-component/AlertFolder/zalertService/zalert-service';

@Injectable({
  providedIn: 'root'
})
export class Brand {
  private http = inject(HttpClient);
  private config = inject(Config);
  private zalertService = inject(ZalertService);

  brands = signal<any[]>([]);
  error = signal<string | null>(null);

  loadBrands() {
    this.error.set(null);
    
    this.http.get(`${this.config.apiUrl}/api/products/get-brands/`).subscribe({
      next: (data: any) => {
        this.brands.set(data);
      },
      error: (err) => {
        this.error.set('Failed to load brands');
        this.zalertService.addAlert({
          message: 'Failed to load brands',
          type: 'danger',
          autoClose: false,
        })
      }
    });
  }
}
