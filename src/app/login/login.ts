import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { Button, Input, Modal, Card, Form, ChangeEventType } from '@ziadshalaby/ngx-zs-component'

@Component({
  selector: 'app-login',
  imports: [Button, Input, Modal, Card],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  authService: AuthService = inject(AuthService)
  router: Router = inject(Router)

  ngAfterViewInit() {
    this.authService.initCodeClient()
  }

  readonly form = new Form({
    username: '',
    password: ''
  })

  changeValues(event: ChangeEventType, key: keyof typeof this.form.fields) {
    this.form.set(key, event.value, event.valid );
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
  readonly passwordResetForm = new Form({
    email: ''
  })

  chanegEmailValue(event: ChangeEventType) {
    this.passwordResetForm.set('email', event.value, event.valid);
  }

  confirmPasswordReset() {
    this.passwordResetForm.submit((values) => {
      this.authService.passwordResetLoading.set(true)
      this.authService.passwordReset(values, () => { this.passwordResetModal.set(false) })
    })
  }
}
