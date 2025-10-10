import { Component, computed, inject, signal } from '@angular/core';
import { Zbutton } from '../ziadshalaby/ngx-zs-component/FormFolder/zbutton/zbutton';
import { ChangeEventType, Zinput } from '../ziadshalaby/ngx-zs-component/FormFolder/zinput/zinput';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

@Component({
  selector: 'app-login',
  imports: [Zbutton, Zinput],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  authService: AuthService = inject(AuthService)
  router: Router = inject(Router)

  ngAfterViewInit() {
    this.authService.initCodeClient()
  }

  readonly fields = {
    username: signal<string | null>(null),
    password: signal<string | null>(null),
  }

  changeValues(event: ChangeEventType, input: keyof typeof this.fields) {
    const field = this.fields[input]
    field.set(event.valid ? event.value : null);
  }

  readonly markAllTouched = signal<boolean>(false)
  
  readonly allFieldsFilled = computed(() => {
    return Object.values(this.fields).every(field => field() !== null);
  });

  submit(event: SubmitEvent) {
    event.preventDefault();

    this.markAllTouched.set(true)
    if(!this.allFieldsFilled()) return

    const body = {
      username: this.fields.username() ?? '',
      password: this.fields.password() ?? '',
    }

    this.authService.loginLoading.set(true)
    this.authService.login(body)
  }

  google() {
    this.authService.googleLoading.set(true)
    this.authService.startRequestCode()
  }

  forgotPass() {
    console.log('Forgot Password')
  }
}
