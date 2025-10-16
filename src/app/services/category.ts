import { inject, Injectable, signal } from '@angular/core';
import { Config } from './config';
import { HttpClient } from '@angular/common/http';
import { AlertService } from '../ziadshalaby/ngx-zs-component/AlertFolder/alert-service/alert-service';

@Injectable({
  providedIn: 'root'
})
export class Category {
  private alertService = inject(AlertService);

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
        this.categories.set(data);
        this.loading.set(false)
      },
      error: (err) => {
        this.error.set('Failed to load categories');
        this.alertService.addAlert({
          message: 'Failed to load categories',
          type: 'danger',
          autoClose: false,
        })

        this.loading.set(false)
      }
    });
  }
}
