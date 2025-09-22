// TODO: Import model from @angular/core
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./navbar/navbar";
import { ZThemeToggle } from './ZiadShalaby/zui-comp/z-theme-toggle/z-theme-toggle';
import { ZscrollToTop } from "./ZiadShalaby/zui-comp/zscroll-to-top/zscroll-to-top";
import { Zalert } from './ZiadShalaby/zui-comp/zalert/zalert';
import { ZalertService } from './ZiadShalaby/zui-comp/zalertService/zalert-service';

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
