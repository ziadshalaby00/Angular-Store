import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Zinput } from '../ziadshalaby/ngx-zs-component/FormFolder/zinput/zinput';
import { Zselect } from '../ziadshalaby/ngx-zs-component/FormFolder/zselect/zselect';
import { Zdate } from '../ziadshalaby/ngx-zs-component/FormFolder/zdate/zdate';
import { FormStyle, ZformService } from '../ziadshalaby/ngx-zs-component/FormFolder/zformService/zform-service';

@Component({
  selector: 'app-test',
  imports: [CommonModule, Zinput],
  templateUrl: './test.html',
  styleUrl: './test.css'
})
export class Test {

  zformService = inject(ZformService)

  // ============ Example ============
  onDateChange(event: any) {
    console.log(event)
  }

  readonly inputStyls: FormStyle[] = ['normal', 'primary', 'danger', 'warning', 'info', 'light', 'dark', 'teal', 'violet', 'success']

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
