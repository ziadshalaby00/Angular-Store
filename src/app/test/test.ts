import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormStyle } from '../ziadshalaby/ngx-zs-component/palette-service/palette-service';
import { ActivatedRoute } from '@angular/router';
import { LoaderType } from '../ziadshalaby/ngx-zs-component/spinner/spinner';
import { Range } from '../ziadshalaby/ngx-zs-component/FormCompFolder/range/range';
import { DropdownItem, Select } from '../ziadshalaby/ngx-zs-component/FormCompFolder/select/select';
import { Brand } from '../services/brand';

@Component({
  selector: 'app-test',
  imports: [CommonModule, Range],
  templateUrl: './test.html',
  styleUrl: './test.css'
})
export class Test {
  activatedRoute: ActivatedRoute = inject(ActivatedRoute)
  brandService: Brand = inject(Brand)

  // ============ Example ============
  readonly inputStyls: FormStyle[] = ['primary', 'secondary', 'danger', 'warning', 'info', 'success', 'dark', 'teal', 'violet']
  readonly spinners: LoaderType[] = ['spinner', 'pro', 'double', 'gear', 'fan', 'pulse', 'dots', 'bars']
  
  onRangeChange(value: number): void {
    console.log('Range value changed:', value);
  }
}
