// TODO: Import model from @angular/core
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./navbar/navbar";
import { ZThemeToggle } from './ZiadShalaby/zui-comp/z-theme-toggle/z-theme-toggle';

@Component({
  selector: 'app-root',
  imports: [FormsModule, RouterOutlet, Navbar, ZThemeToggle],
  template: ``,
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {

}
