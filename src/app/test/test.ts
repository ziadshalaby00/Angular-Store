import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Zinput } from '../ziadshalaby/ngx-zs-component/zinput/zinput';
import { Zdate } from '../ziadshalaby/ngx-zs-component/zdate/zdate';
import { InputStyle } from '../ziadshalaby/ngx-zs-component/zinputService/zinput-service';

@Component({
  selector: 'app-test',
  imports: [CommonModule, Zdate, Zinput],
  templateUrl: './test.html',
  styleUrl: './test.css'
})
export class Test {

  // ============ Example ============
  onDateChange(event: any) {
    console.log(event)
  }

  readonly inputStyls: InputStyle[] = ['normal', 'primary', 'secondary', 'danger', 'warning', 'info', 'light', 'dark', 'teal', 'violet', 'success']

  ngOnInit() {
    
  }

  validateFn = (val: string | null) => {
    if (val && !/^[a-zA-Z0-9_]{4,12}$/.test(val)) {
      return ['Username must be 4–12 characters (letters, numbers, underscore)'];
    }
    return [];
  }

  valueChange(event: string | null) {
    console.log(event)
  }
}
