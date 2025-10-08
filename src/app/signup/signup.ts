import { Component, computed, signal } from '@angular/core';
import { Zinput } from '../ziadshalaby/ngx-zs-component/FormFolder/zinput/zinput';
import { Zbutton } from '../ziadshalaby/ngx-zs-component/FormFolder/zbutton/zbutton';

@Component({
  selector: 'app-signup',
  imports: [Zinput, Zbutton],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {
  readonly faUserClass = 'fas fa-user';        // أو أي كلاس أيقونة لديك
  readonly faEnvelopeClass = 'fas fa-envelope';
  readonly faLockClass = 'fas fa-lock';

  // Form fields signals
  readonly fullname = signal<string | null>(null);
  readonly username = signal<string | null>(null);
  readonly email = signal<string | null>(null);
  readonly password = signal<string | null>(null);
  readonly confirmPassword = signal<string | null>(null);

  readonly errors = signal<string[]>([]);

  // Computed to check if form is valid
  // readonly isFormValid = computed(() => {
  //   const errs: string[] = [];

  //   if (!this.fullname()) errs.push('Full Name is required');
  //   if (!this.username()) errs.push('Username is required');
  //   if (!this.email()) errs.push('Email is required');
  //   else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email()!)) errs.push('Email is invalid');
  //   if (!this.password()) errs.push('Password is required');
  //   if (this.password() !== this.confirmPassword()) errs.push('Passwords do not match');

  //   this.errors.set(errs);
  //   return errs.length === 0;
  // });

  submit() {
    // if (this.isFormValid()) {
      console.log('Form submitted', {
        fullname: this.fullname(),
        username: this.username(),
        email: this.email(),
        password: this.password(),
      });
      alert('Signup successful!');
    // } else {
      alert('Please fix the errors first');
    // }
  }
}
