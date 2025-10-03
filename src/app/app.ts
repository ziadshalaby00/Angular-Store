// TODO: Import model from @angular/core
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./navbar/navbar";
import { Zalert } from './ziadshalaby/ngx-zs-component/AlertFolder/zalert/zalert';
import { ZalertService } from './ziadshalaby/ngx-zs-component/AlertFolder/zalertService/zalert-service';
import { ZscrollToTop } from './ziadshalaby/ngx-zs-component/zscroll-to-top/zscroll-to-top';
import { ZthemeToggle } from './ziadshalaby/ngx-zs-component/ztheme-toggle/ztheme-toggle';


@Component({
  selector: 'app-root',
  imports: [FormsModule, RouterOutlet, Navbar, ZthemeToggle, ZscrollToTop, Zalert],
  template: ``,
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  zalertService = inject(ZalertService)
}
