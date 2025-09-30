import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Zinput } from '../ziadshalaby/ngx-zs-component/zinput/zinput';
import { Zdate } from '../ziadshalaby/ngx-zs-component/zdate/zdate';
import { ConfigTypeAndCls, FormStyle } from '../ziadshalaby/ngx-zs-component/configTypeAndClsService/configTypeAndCls';
import { Zselect } from '../ziadshalaby/ngx-zs-component/zselect/zselect';

@Component({
  selector: 'app-test',
  imports: [CommonModule, Zdate, Zinput, Zselect],
  templateUrl: './test.html',
  styleUrl: './test.css'
})
export class Test {

  configTypeAndCls = inject(ConfigTypeAndCls)

  // ============ Example ============
  onDateChange(event: any) {
    console.log(event)
  }

  readonly inputStyls: FormStyle[] = ['normal', 'primary', 'secondary', 'danger', 'warning', 'info', 'light', 'dark', 'teal', 'violet', 'success']

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
