import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Brand } from '../services/brand';
import { FormStyle } from '@ziadshalaby/ngx-zs-component';

@Component({
  selector: 'app-test',
  imports: [CommonModule],
  templateUrl: './test.html',
  styleUrl: './test.css'
})
export class Test {
  activatedRoute: ActivatedRoute = inject(ActivatedRoute)
  brandService: Brand = inject(Brand)

  // ============ Example ============
  readonly inputStyls: FormStyle[] = ['primary', 'secondary', 'danger', 'warning', 'info', 'success', 'dark', 'teal', 'violet']

  constructor() {

  }
}
