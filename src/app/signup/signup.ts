import { Component, computed, inject, signal, WritableSignal } from '@angular/core';
import { Zinput, ChangeEventType, ValidatorFn } from '../ziadshalaby/ngx-zs-component/FormFolder/zinput/zinput';
import { Zbutton } from '../ziadshalaby/ngx-zs-component/FormFolder/zbutton/zbutton';
import { AuthService, googleClientId } from '../services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [Zinput, Zbutton],
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
  readonly fields = {
    fullname: signal<string | null>(null),
    username: signal<string | null>(null),
    email: signal<string | null>(null),
    password: signal<string | null>(null),
    confirmPassword: signal<string | null>(null)
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
      fullname: this.fields.fullname() ?? '',
      username: this.fields.username() ?? '',
      email: this.fields.email() ?? '',
      password: this.fields.password() ?? '',
    }

    this.authService.signupLoading.set(true)
    this.authService.signup(body)
  }

  confPassValidate: ValidatorFn = (value: string | null) => {
    if(this.fields.password() !== value)
      return ['The passwords do not match.']
    return []
  }

  google() {
    this.authService.googleLoading.set(true)
    this.authService.startRequestCode()
  }
}
