import { computed, inject, Injectable, linkedSignal, signal } from '@angular/core';
import { Config } from './config';
import { HttpClient } from '@angular/common/http';
import { ZalertService, NewAlert } from '../ziadshalaby/ngx-zs-component/AlertFolder/zalertService/zalert-service';
import { Router } from '@angular/router';

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
  private http: HttpClient= inject(HttpClient);
  private config: Config = inject(Config);
  router: Router = inject(Router)

  readonly userData = signal<any>(null)
  readonly isLoggedin = signal<boolean>(false)

  error = signal<NewAlert[]>([]);
  signupLoading = signal<boolean>(false)
  loginLoading = signal<boolean>(false)
  googleLoading = signal<boolean>(false)

  signup(body: RegBody) {
    this.error.set([])

    this.http.post(`${this.config.apiUrl}/api/auth/register/`, body).subscribe({
      next: (res: any) => {
        this.signupLoading.set(false)
        this.zalertService.addAlert({
          message: res.message,
          type: 'success'
        })
      },
      error: (err: any) => {
        this.signupLoading.set(false);

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
            this.router.navigate(['/home'])
          },
          () => { this.loginLoading.set(false) }
        )
      },
      error: (err: any) => {
        console.log(err)
        this.loginLoading.set(false);

        const error: NewAlert = {
          message: err.error.detail,
          type: 'danger'
        }
        this.error.set([error]);
        this.zalertService.addAlert(this.error());
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
    if(this.codeClient() !== undefined)
      this.codeClient().requestCode();
    else
      this.googleLoading.set(false);
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

    this.http.post(`${this.config.apiUrl}/api/auth/google-login/`,
      { code }, { withCredentials: true }).subscribe({
      next: (res: any) => {
        this.getUserData(
          () => {
            this.googleLoading.set(false)
            this.zalertService.addAlert({
              message: res.message,
              type: 'success'
            })
            this.isLoggedin.set(true)
            this.router.navigate(['/home'])
          },
          () => { this.googleLoading.set(false) }
        )
      },
      error: (err: any) => {
        this.googleLoading.set(false);

        const error: NewAlert = {
          message: err.error.error,
          type: 'danger'
        }
        this.error.set([error]);
        this.zalertService.addAlert(this.error());
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

        const error: NewAlert = {
          message: err.error.detail,
          type: 'danger'
        }
        this.error.set([error]);
        this.zalertService.addAlert(this.error());

        this.logout()
      }
    })
  }

  logout(logoutAction?: () => void) {
    this.error.set([])

    this.http.post(`${this.config.apiUrl}/api/auth/logout/`, {}, { withCredentials: true }).subscribe({
      next: (res: any) => {
        this.zalertService.addAlert({
          message: res.message,
          type: 'success'
        })
        this.userData.set(null)
        this.isLoggedin.set(false)
      },
      error: (err: any) => {}
    })

    if(logoutAction) logoutAction()
  }

  verfiyAccess() {
    this.http.post(`${this.config.apiUrl}/api/auth/token/verify/`, {}, { withCredentials: true }).subscribe({
      next: (res: any) => {
        console.log(res)
        this.getUserData(
          () => {
            this.isLoggedin.set(true)
          }
        )
      },
      error: (err: any) => {
        console.log(err)
      }
    })
  }

}
