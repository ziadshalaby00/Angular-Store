import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormStyle, ZformService } from '../ziadshalaby/ngx-zs-component/FormFolder/zformService/zform-service';
import { Zbutton } from '../ziadshalaby/ngx-zs-component/FormFolder/zbutton/zbutton';

@Component({
  selector: 'app-test',
  imports: [CommonModule, Zbutton],
  templateUrl: './test.html',
  styleUrl: './test.css'
})
export class Test {
  zformService = inject(ZformService)

  // ============ Example ============
  readonly inputStyls: FormStyle[] = ['normal', 'primary', 'danger', 'warning', 'info', 'light', 'dark', 'teal', 'violet', 'success']

  save() {
    console.log('saved')
  }
}
