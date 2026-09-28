import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Config } from './config';

@Injectable({ providedIn: 'root' })
export class AddressService {
  private http = inject(HttpClient);
  private config = inject(Config);

  addresses = signal<any[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  loadAddresses() {
    this.loading.set(true);
    this.error.set(null);

    this.http.get<any[]>(
      `${this.config.apiUrl}/api/address/addresses/`,
      { withCredentials: true }
    ).subscribe({
      next: (data) => {
        this.addresses.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Address load error:', err);
        this.error.set('Failed to load addresses');
        this.loading.set(false);
      }
    });
  }

  fetchAddresses() {
    return this.http.get<any[]>(
      `${this.config.apiUrl}/api/address/addresses/`,
      { withCredentials: true }
    );
  }
}