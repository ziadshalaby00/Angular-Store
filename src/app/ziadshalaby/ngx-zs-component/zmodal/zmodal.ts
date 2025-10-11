import { Component, computed, input, model, output } from '@angular/core';
import { FormPaletteMap, FormStyle } from '../FormFolder/zformService/zform-service';
import { Zbutton } from '../FormFolder/zbutton/zbutton';

export interface InputsType {
  show: boolean,
  text: string,
  style?: FormStyle,
}

@Component({
  selector: 'ZS-modal',
  imports: [Zbutton],
  templateUrl: './zmodal.html',
  styleUrl: './zmodal.css'
})
export class Zmodal {
  /** 🔹 Model لتحديد الفتح والإغلاق */
  open = model<boolean>(false);

  /** 🔹 Inputs */
  title = input<string>('Modal Title');
  modalStyle = input<FormStyle>('primary');
  showFooter = input<boolean>(true);

  cancelConfig = input<InputsType>({
    show: true,
    text: 'Cancel',
    style: 'light'
  });
  confirmConfig = input<InputsType>({
    show: true,
    text: 'Confirm',
  });

  closeOnOverlay = input<boolean>(true);

  /** 🔹 Outputs */
  confirm = output<void>();
  cancel = output<void>();
  closed = output<void>();

  /** 🔹 Signals */
  palette = computed(() => FormPaletteMap.get(this.modalStyle())!);
  isOpen = computed(() => this.open());

  /** 🔹 Methods */
  close() {
    this.open.set(false);
    this.closed.emit();
  }

  onOverlayClick(event: MouseEvent) {
    if (this.closeOnOverlay()) this.close();
  }
}
