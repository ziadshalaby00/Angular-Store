import { inject, Injectable, signal } from '@angular/core';
import { Config } from './config';
import { HttpClient } from '@angular/common/http';
import { ZalertService, NewAlert } from '../ziadshalaby/ngx-zs-component/AlertFolder/zalertService/zalert-service';

export interface RegBody {
  fullname: string,
  username: string,
  email: string,
  password: string,
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private zalertService: ZalertService = inject(ZalertService)
  private http: HttpClient= inject(HttpClient);
  private config: Config = inject(Config);

  error = signal<NewAlert[]>([]);
  loading = signal<boolean>(false)

  signup(body: RegBody) {
    this.error.set([])
    this.loading.set(true)

    this.http.post(`${this.config.apiUrl}/api/auth/register/`, body).subscribe({
      next: (data: any) => {
        this.loading.set(false)
        this.zalertService.addAlert({
          message: data.message,
          type: 'success'
        })
      },
      error: (err: any) => {
        this.loading.set(false);

        const alerts: NewAlert[] = [];

        for (const key in err.error) {
          const messages: string[] = err.error[key];
          for (const msg of messages) {
            alerts.push({
              message: msg,
              type: 'danger',
            });
          }
        }

        this.error.set(alerts);
        this.zalertService.addAlert(alerts);
      }
    })
  }
}
