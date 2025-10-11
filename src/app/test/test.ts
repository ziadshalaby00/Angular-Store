import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormStyle, ZformService } from '../ziadshalaby/ngx-zs-component/FormFolder/zformService/zform-service';
import { Zbutton } from '../ziadshalaby/ngx-zs-component/FormFolder/zbutton/zbutton';
import { Zinput } from '../ziadshalaby/ngx-zs-component/FormFolder/zinput/zinput';
import { Zspinner, LoaderType } from '../ziadshalaby/ngx-zs-component/zspinner/zspinner';
import { Zmodal } from '../ziadshalaby/ngx-zs-component/zmodal/zmodal';
import { Zselect } from "../ziadshalaby/ngx-zs-component/FormFolder/zselect/zselect";

@Component({
  selector: 'app-test',
  imports: [CommonModule, Zmodal, Zbutton, Zinput, Zselect],
  templateUrl: './test.html',
  styleUrl: './test.css'
})
export class Test {
  zformService = inject(ZformService)

  // ============ Example ============
  readonly inputStyls: FormStyle[] = ['primary', 'danger', 'warning', 'info', 'light', 'dark', 'teal', 'violet', 'success']
  readonly spinners: LoaderType[] = ['spinner', 'pro', 'double', 'gear', 'fan', 'pulse', 'dots', 'bars']
  save() {
    console.log('saved')
  }

  readonly isOpen = signal<boolean>(true)

  onConfirm() {
    console.log('Confirmed!');
    this.isOpen.set(false)
  }

  onCancel() {
    console.log('Cancelled!');
    this.isOpen.set(false)
  }

  onClosed() {
    console.log('Modal closed');
  }
}
