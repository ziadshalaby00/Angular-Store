import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormStyle } from '../ziadshalaby/ngx-zs-component/zpaletteService/zform-comp-service';
import { Zbutton } from '../ziadshalaby/ngx-zs-component/FormCompFolder/zbutton/zbutton';
import { Zinput } from '../ziadshalaby/ngx-zs-component/FormCompFolder/zinput/zinput';
import { Zspinner, LoaderType } from '../ziadshalaby/ngx-zs-component/zspinner/zspinner';
import { Zmodal } from '../ziadshalaby/ngx-zs-component/zmodal/zmodal';
import { Zselect } from "../ziadshalaby/ngx-zs-component/FormCompFolder/zselect/zselect";
import { ActivatedRoute, Router } from '@angular/router';
import { Zcard } from '../ziadshalaby/ngx-zs-component/zcard/zcard';

@Component({
  selector: 'app-test',
  imports: [CommonModule, Zcard],
  templateUrl: './test.html',
  styleUrl: './test.css'
})
export class Test {
  activatedRoute: ActivatedRoute = inject(ActivatedRoute)

  // ============ Example ============
  readonly inputStyls: FormStyle[] = ['primary', 'secondary', 'danger', 'warning', 'info', 'success', 'dark', 'teal', 'violet']
  readonly spinners: LoaderType[] = ['spinner', 'pro', 'double', 'gear', 'fan', 'pulse', 'dots', 'bars']
  save() {
    console.log('saved')
  }

  readonly isOpen = signal<boolean>(true)

  onConfirm() {
    console.log('Confirm!');
  }

  onCancel() {
    console.log('Cancelled!');
    this.isOpen.set(false)
  }

  onClosed() {
    console.log('Modal closed');
  }
}
