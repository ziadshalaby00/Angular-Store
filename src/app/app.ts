import { AuthService } from './services/auth-service';
// TODO: Import model from @angular/core
import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { NavbarComp } from "./navbar/navbar";
import { ScrollToTop } from './ziadshalaby/ngx-zs-component/scroll-to-top/scroll-to-top';
import { ThemeToggle } from './ziadshalaby/ngx-zs-component/theme-toggle/theme-toggle';
import { Spinner } from './ziadshalaby/ngx-zs-component/spinner/spinner';
import { Alert } from './ziadshalaby/ngx-zs-component/AlertFolder/alert/alert';

@Component({
  selector: 'app-root',
  imports: [FormsModule, RouterOutlet, NavbarComp, ThemeToggle, ScrollToTop, Alert, Spinner],
  template: ``,
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  authService: AuthService = inject(AuthService)

  readonly isMobileMenuOpen = signal<boolean>(false)

  ngAfterViewInit() {
    this.authService.verifyloading.set(true)
    this.authService.verifyAccess()
  }
  constructor() {
    effect(() => {
      console.log('userData: ', this.authService.userData())
      console.log('isLoggedin: ',this.authService.isLoggedin())
    })
  }
}
