import { Component, inject, viewChild } from '@angular/core';
import { AuthService } from '../services/auth-service';
import { Router } from '@angular/router';
import { Button, Card, Form, ChangeEventType, ValidatorFn, Input } from '@ziadshalaby/ngx-zs-component';

@Component({
  selector: 'app-signup',
  imports: [Input, Button, Card],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {
  authService: AuthService = inject(AuthService)
  router: Router = inject(Router)
  
  ngAfterViewInit() {
    this.authService.initCodeClient()
  }
  
  readonly pass = viewChild<Input>('password')
  readonly conf_pass = viewChild<Input>('conf_password')

  // Form fields signals
  form = new Form({
    fullname: '',
    username: '',
    email: '',
    password: '',
    conf_password: ''
  })

  changeValues(event: ChangeEventType, key: keyof typeof this.form.fields) {
    this.form.set(key, event.value, event.valid);

    if (event.fromForce) return;
    
    if (key === 'password') {
      const conf = this.conf_pass();
      if (conf) conf.forceChange();
    }

    if (key === 'conf_password') {
      const pass = this.pass();
      if (pass) pass.forceChange();
    }
  }

  confPassValidate: ValidatorFn = (value: string | null) => {
    if(this.form.get('password').value !== value)
      return ['The passwords do not match.']
    return []
  }

  submit(event: SubmitEvent) {
    event.preventDefault();
    this.form.submit((values) => {
      this.authService.signupLoading.set(true)
      this.authService.signup(values)
    });
  }

  google() {
    this.authService.googleLoading.set(true)
    this.authService.startRequestCode()
  }
}
