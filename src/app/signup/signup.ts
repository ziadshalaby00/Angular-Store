import { Component, computed, inject, signal, WritableSignal } from '@angular/core';
import { Zinput, ChangeEventType, ValidatorFn } from '../ziadshalaby/ngx-zs-component/FormCompFolder/zinput/zinput';
import { Zbutton } from '../ziadshalaby/ngx-zs-component/FormCompFolder/zbutton/zbutton';
import { AuthService, googleClientId } from '../services/auth-service';
import { Router } from '@angular/router';
import { Zform } from '../ziadshalaby/ngx-zs-component/zformService/zform-service';
import { Zcard } from '../ziadshalaby/ngx-zs-component/zcard/zcard';

@Component({
  selector: 'app-signup',
  imports: [Zinput, Zbutton, Zcard],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {
  authService: AuthService = inject(AuthService)
  router: Router = inject(Router)
  
  ngAfterViewInit() {
    this.authService.initCodeClient()
  }
  
  // Form fields signals
  form = new Zform({
    fullname: '',
    username: '',
    email: '',
    password: '',
  })

  changeValues(event: ChangeEventType, key: keyof typeof this.form.fields) {
    this.form.set(key, event.value, event.valid);
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
