import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Config {
  private readonly isProd = true;

  private readonly localApiUrl = 'http://localhost:8000';
  private readonly prodApiUrl = 'https://store.ziadshalaby00.dpdns.org';
  readonly accessTokenExpire: number = 14.75

  get apiUrl(): string {
    return this.isProd ? this.prodApiUrl : this.localApiUrl;
  }
}
