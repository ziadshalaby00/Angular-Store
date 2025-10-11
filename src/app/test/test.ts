import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormStyle } from '../ziadshalaby/ngx-zs-component/FormCompFolder/zformCompService/zform-comp-service';
import { Zbutton } from '../ziadshalaby/ngx-zs-component/FormCompFolder/zbutton/zbutton';
import { Zinput } from '../ziadshalaby/ngx-zs-component/FormCompFolder/zinput/zinput';
import { Zspinner, LoaderType } from '../ziadshalaby/ngx-zs-component/zspinner/zspinner';
import { Zmodal } from '../ziadshalaby/ngx-zs-component/zmodal/zmodal';
import { Zselect } from "../ziadshalaby/ngx-zs-component/FormCompFolder/zselect/zselect";

@Component({
  selector: 'app-test',
  imports: [CommonModule, Zmodal, Zbutton, Zinput, Zselect],
  templateUrl: './test.html',
  styleUrl: './test.css'
})
export class Test {
  // ============ Example ============
  readonly inputStyls: FormStyle[] = ['primary', 'secondary', 'danger', 'warning', 'info', 'success', 'dark', 'teal', 'violet']
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
