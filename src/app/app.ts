// TODO: Import model from @angular/core
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./navbar/navbar";
import { ZThemeToggle } from './ziadshalaby/zui-component/z-theme-toggle/z-theme-toggle';
import { ZscrollToTop } from "./ziadshalaby/zui-component/zscroll-to-top/zscroll-to-top";
import { Zalert } from './ziadshalaby/zui-component/zalert/zalert';
import { ZalertService } from './ziadshalaby/zui-component/zalertService/zalert-service';

@Component({
  selector: 'app-root',
  imports: [FormsModule, RouterOutlet, Navbar, ZThemeToggle, ZscrollToTop, ZscrollToTop, Zalert],
  template: ``,
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  zalertService = inject(ZalertService)
}
