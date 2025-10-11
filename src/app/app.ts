import { AuthService } from './services/auth-service';
// TODO: Import model from @angular/core
import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./navbar/navbar";
import { Zalert } from './ziadshalaby/ngx-zs-component/AlertFolder/zalert/zalert';
import { ZalertService } from './ziadshalaby/ngx-zs-component/AlertFolder/zalertService/zalert-service';
import { ZscrollToTop } from './ziadshalaby/ngx-zs-component/zscroll-to-top/zscroll-to-top';
import { ZthemeToggle } from './ziadshalaby/ngx-zs-component/ztheme-toggle/ztheme-toggle';
import { Zspinner } from './ziadshalaby/ngx-zs-component/zspinner/zspinner';

@Component({
  selector: 'app-root',
  imports: [FormsModule, RouterOutlet, Navbar, ZthemeToggle, ZscrollToTop, Zalert, Zspinner],
  template: ``,
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  zalertService: ZalertService = inject(ZalertService)
  authService: AuthService = inject(AuthService)

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
