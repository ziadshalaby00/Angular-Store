// ==============================================
// Imports
// ==============================================

import { Component, computed, ElementRef, input, model, output, signal, viewChild } from '@angular/core';
import { FormPaletteMap, FormSize, FormStyle } from '../zpaletteService/zform-comp-service';
import { Zbutton, ButtonVariant } from '../FormCompFolder/zbutton/zbutton';


// ==============================================
// Interfaces
// ==============================================

export interface BtnType {
  show?: boolean;
  text?: string;

  btnStyle?: FormStyle;
  variant?: ButtonVariant;
  size?: FormSize;
  icon?: string | null
  disabled?: boolean;
}
export type BtnTypeDefault = Required<BtnType>;
export type Position = 'left top' | 'left bot' | 'right top' | 'right bot' | 'center'

// ==============================================
// Maps
// ==============================================

const positionMap: Record<Position, string> = {
  'left top': 'justify-start items-start',
  'left bot': 'justify-start items-end',
  'right top': 'justify-end items-start',
  'right bot': 'justify-end items-end',
  'center': 'justify-center items-center',
};

// ==============================================
// Component Metadata
// ==============================================

@Component({
  selector: 'ZS-modal',
  imports: [Zbutton],
  templateUrl: './zmodal.html',
  styleUrl: './zmodal.css'
})
export class Zmodal {


  // ==============================================
  // Model
  // ==============================================

  /** 🔹 Model لتحديد الفتح والإغلاق */
  readonly open = model<boolean>(false);


  // ==============================================
  // Inputs
  // ==============================================

  readonly title = input<string>('Modal Title');
  readonly modalStyle = input<FormStyle>('primary');

  readonly showCancelIcon = input<boolean>(true)
  readonly showFooter = input<boolean>(true);

  readonly cancelConfig = input<BtnType>();
  readonly confirmConfig = input<BtnType>();

  readonly position = input<Position>('center');
  readonly closeOnOverlay = input<boolean>(true);

  // ==============================================
  // Defaults
  // ==============================================

  readonly cancelConfigDefault: BtnTypeDefault = {
    show: true,
    text: 'Cancel',

    btnStyle: 'secondary',
    variant: 'solid',
    size: 'md',
    icon: null,
    disabled: false
  }
  readonly confirmConfigDefault: BtnTypeDefault = {
    show: true,
    text: 'Confirm',

    btnStyle: 'primary',
    variant: 'solid',
    size: 'md',
    icon: null,
    disabled: false
  }
  configMerged = (type: 'confirm' | 'cancel'): BtnTypeDefault => {
    const def = type === 'confirm' ? this.confirmConfigDefault : this.cancelConfigDefault;
    const cfg = type === 'confirm' ? this.confirmConfig() : this.cancelConfig();

    return {
      ...def,
      ...(cfg ?? {})
    };
  };

  // ==============================================
  // Outputs
  // ==============================================

  confirmEv = output<void>();
  cancelEv = output<void>();
  closedEv = output<void>();


  // ==============================================
  // Computed Signals
  // ==============================================

  palette = computed(() => FormPaletteMap.get(this.modalStyle())!);
  isOpen = computed(() => this.open());
  positionClass = computed(() => positionMap[this.position()])


  // ==============================================
  // Methods
  // ==============================================

  close() {
    this.open.set(false);
    this.closedEv.emit();
  }

  onOverlayClick(event: MouseEvent) {
    if (this.closeOnOverlay()) {
      this.close();
    }
  }
}