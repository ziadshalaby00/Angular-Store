import { computed, inject, Injectable, linkedSignal, signal } from '@angular/core';
import { Config } from './config';
import { HttpClient } from '@angular/common/http';
import { ZalertService, NewAlert } from '../ziadshalaby/ngx-zs-component/AlertFolder/zalertService/zalert-service';
import { Router } from '@angular/router';
import { ZextractErrorsService } from '../ziadshalaby/ngx-zs-component/zextractErrorsService/zextract-errors-service';

declare const google: any;
export const googleClientId: string = 
  '376492260397-gh7pa085um18niabf0vn88140l7956gb.apps.googleusercontent.com'

export interface RegBody {
  fullname: string,
  username: string,
  email: string,
  password: string,
}

export interface logBody {
  username: string,
  password: string,
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private zalertService: ZalertService = inject(ZalertService)
  private zextractErrorsService: ZextractErrorsService = inject(ZextractErrorsService)
  private http: HttpClient= inject(HttpClient);
  private config: Config = inject(Config);
  router: Router = inject(Router)

  readonly userData = signal<any>(null)
  readonly isLoggedin = signal<boolean>(false)

  error = signal<string[]>([]);
  signupLoading = signal<boolean>(false)
  loginLoading = signal<boolean>(false)
  googleLoading = signal<boolean>(false)
  verifyloading = signal<boolean>(false)

  signup(body: RegBody) {
    this.error.set([])

    this.http.post(`${this.config.apiUrl}/api/auth/register/`, body).subscribe({
      next: (res: any) => {
        this.signupLoading.set(false)
        this.zalertService.addAlert({
          message: res.message,
          type: 'success'
        })
        this.router.navigate(['/login'])
      },
      error: (err: any) => {
        this.signupLoading.set(false);
        this.setErrors(err.error)
      }
    })
  }

  login(body: logBody) {
    this.error.set([])

    this.http.post(`${this.config.apiUrl}/api/auth/login/`, body, { withCredentials: true }).subscribe({
      next: (res: any) => {
        this.getUserData(
          () => {
            this.loginLoading.set(false)
            this.zalertService.addAlert({
              message: res.message,
              type: 'success'
            })
            this.isLoggedin.set(true)
            this.refreshEventLoop(this.config.accessTokenExpire)
            this.router.navigate(['/home'])
          },
          () => { this.loginLoading.set(false) }
        )
      },
      error: (err: any) => {
        this.loginLoading.set(false);
        this.setErrors(err.error)
      }
    })
  }

  // ============================= Google init ============================= //
  private codeClient = signal<any>(null);
  initCodeClient() {
    if (typeof google !== 'undefined' && google?.accounts?.oauth2) {
      this.codeClient.set(
        google.accounts.oauth2.initCodeClient({
          client_id: googleClientId,
          scope: 'openid email profile',
          ux_mode: 'popup',
          callback: (response: any) => this.handleGoogleResponse(response),
        })
      )
    }
  }

  startRequestCode() {
    const client = this.codeClient();
    if (!client) {
      this.zalertService.addAlert({
        message: 'Google authentication not initialized.',
        type: 'danger'
      });
      this.googleLoading.set(false);
      return;
    }
    client.requestCode();
  }

  private handleGoogleResponse(response: any) {
    const code = response.code;
    if (code) {
      this.googleExchange(code);
    } else {
      this.googleLoading.set(false);
    }
  }
  // ============================= Google init ============================= //

  googleExchange(code: string) {
    this.error.set([])

    this.http.post(`${this.config.apiUrl}/api/auth/google-login/`, { code }, { withCredentials: true }).subscribe({
      next: (res: any) => {
        this.getUserData(
          () => {
            this.googleLoading.set(false)
            this.zalertService.addAlert({
              message: res.message,
              type: 'success'
            })
            this.isLoggedin.set(true)
            this.refreshEventLoop(this.config.accessTokenExpire)
            this.router.navigate(['/home'])
          },
          () => { this.googleLoading.set(false) }
        )
      },
      error: (err: any) => {
        this.googleLoading.set(false);
        this.setErrors(err.error)
      }
    })
  }

  getUserData(successFn?: () => void, faildFn?: () => void) {
    this.error.set([])

    this.http.get(`${this.config.apiUrl}/api/auth/me/`, { withCredentials: true }).subscribe({
      next: (res: any) => {
        this.userData.set(res)
        if(successFn) successFn()
      },
      error: (err: any) => {
        if(faildFn) faildFn()

        this.setErrors(err.error)
        this.logout()
      }
    })
  }

  logout(logoutAction?: (message?: string) => void) {
    this.error.set([])

    this.http.post(`${this.config.apiUrl}/api/auth/logout/`, {}, { withCredentials: true }).subscribe({
      next: (res: any) => {
        if(logoutAction) logoutAction(res.message)
        this.resetDataLogout()
        this.stopRefreshEventLoop()
      },
      error: (err: any) => {}
    })
  }

  resetDataLogout() {
    this.userData.set(null)
    this.isLoggedin.set(false)
  }

  verifyAccess() {
    this.error.set([])

    this.http.post(`${this.config.apiUrl}/api/auth/token/verify/`, {}, { withCredentials: true }).subscribe({
      next: (res: any) => {
        this.getUserData(
          () => {
            this.isLoggedin.set(true)
            this.verifyloading.set(false)
            this.refreshEventLoop(this.config.accessTokenExpire)
          }
        )
      },
      error: (err: any) => {
        this.refreshToken()
      }
    })
  }

  refreshToken() {
    this.error.set([])

    this.http.post(`${this.config.apiUrl}/api/auth/token/refresh/`, {}, { withCredentials: true }).subscribe({
      next: (res: any) => {
        console.log(res)
        this.getUserData(
          () => {
            this.isLoggedin.set(true)
            this.verifyloading.set(false)
            this.refreshEventLoop(this.config.accessTokenExpire)
          }
        )
      },
      error: (err: any) => {
        this.logout(
          () => { this.verifyloading.set(false) }
        )
      }
    })
  }

  private refreshIntervalId: any = null;
  refreshEventLoop(intervalMinutes: number = 10): void {
    this.stopRefreshEventLoop()

    console.log('started refresh token')
    const intervalMs = intervalMinutes * 60 * 1000;

    this.refreshIntervalId = setInterval(() => {
      console.log('refreshing token')
      this.refreshToken();
    }, intervalMs);
  }

  stopRefreshEventLoop(): void {
    if (this.refreshIntervalId) {
      clearInterval(this.refreshIntervalId);
      this.refreshIntervalId = null;
    }
  }

  setErrors(errorObject: any) {
    const errors = this.zextractErrorsService.extract(errorObject)
    this.error.update((v: string[]) => [...v, ...errors]);
    this.zalertService.bulkAlert(errors, { type: 'danger' });
  }
}
