import { Component, computed, inject, signal } from '@angular/core';
import { Zbutton } from '../ziadshalaby/ngx-zs-component/FormCompFolder/zbutton/zbutton';
import { ChangeEventType, Zinput } from '../ziadshalaby/ngx-zs-component/FormCompFolder/zinput/zinput';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { Zmodal } from '../ziadshalaby/ngx-zs-component/zmodal/zmodal';
import { Zform } from '../ziadshalaby/ngx-zs-component/zformService/zform-service';

@Component({
  selector: 'app-login',
  imports: [Zbutton, Zinput, Zmodal],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  authService: AuthService = inject(AuthService)
  router: Router = inject(Router)

  ngAfterViewInit() {
    this.authService.initCodeClient()
  }

  readonly form = new Zform({
    username: '',
    password: ''
  })

  changeValues(event: ChangeEventType, key: keyof typeof this.form.fields) {
    this.form.set(key, event.valid ? event.value : null);
  }

  submit(event: SubmitEvent) {
    event.preventDefault();
    this.form.submit((values) => {
      this.authService.loginLoading.set(true)
      this.authService.login(values)
    })
  }

  google() {
    this.authService.googleLoading.set(true)
    this.authService.startRequestCode()
  }

  // Password Reset

  readonly passwordResetModal = signal<boolean>(false)
  readonly passwordResetForm = new Zform({
    email: ''
  })

  chanegEmailValue(event: ChangeEventType) {
    this.passwordResetForm.set('email', event.valid ? event.value : null);
  }

  confirmPasswordReset() {
    this.passwordResetForm.submit((values) => {
      this.authService.passwordResetLoading.set(true)
      this.authService.passwordReset(values)
    })
  }
}
