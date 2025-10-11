import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Config {
  private readonly isProd = false;

  private readonly localApiUrl = 'http://127.0.0.1:8000';
  private readonly prodApiUrl = 'https://api.example.com';
  readonly accessTokenExpire: number = 14.75

  get apiUrl(): string {
    return this.isProd ? this.prodApiUrl : this.localApiUrl;
  }
}
