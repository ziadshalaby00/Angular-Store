import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormStyle } from '../ziadshalaby/ngx-zs-component/palette-service/palette-service';
import { ActivatedRoute } from '@angular/router';
import { LoaderType } from '../ziadshalaby/ngx-zs-component/spinner/spinner';
import { Range } from '../ziadshalaby/ngx-zs-component/FormCompFolder/range/range';
import { DropdownItem, Select } from '../ziadshalaby/ngx-zs-component/FormCompFolder/select/select';
import { Brand } from '../services/brand';
import { Checkbox } from '../ziadshalaby/ngx-zs-component/FormCompFolder/checkbox/checkbox';
import { Button } from "../ziadshalaby/ngx-zs-component/FormCompFolder/button/button";

@Component({
  selector: 'app-test',
  imports: [CommonModule, Checkbox],
  templateUrl: './test.html',
  styleUrl: './test.css'
})
export class Test {
  activatedRoute: ActivatedRoute = inject(ActivatedRoute)
  brandService: Brand = inject(Brand)

  // ============ Example ============
  readonly inputStyls: FormStyle[] = ['primary', 'secondary', 'danger', 'warning', 'info', 'success', 'dark', 'teal', 'violet']
  readonly spinners: LoaderType[] = ['spinner', 'pro', 'double', 'gear', 'fan', 'pulse', 'dots', 'bars']
  
  onValueChange(value: number): void {
    console.log('Check Box:', value);
  }

  readonly value = signal<boolean>(false)
  constructor() {
    effect(() => {
      console.log(this.value())
    })
  }
}
