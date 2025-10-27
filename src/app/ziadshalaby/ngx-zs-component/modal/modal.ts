import { Component, computed, effect, ElementRef, HostListener, inject, input, linkedSignal, model, output, signal, untracked, viewChild } from '@angular/core';
import { FormPaletteMap, BaseSize, FormStyle } from '../palette-service';
import { Button, ButtonVariant } from '../FormCompFolder/button/button';
import { CommonModule } from '@angular/common';
import { zIndices, ZIndicesType } from '../z-index';


// ==============================================
// Interfaces
// ==============================================

export interface BtnType {
  show?: boolean;
  text?: string;

  btnStyle?: FormStyle;
  variant?: ButtonVariant;
  size?: BaseSize;
  icon?: string | null
  disabled?: boolean;
}
export type BtnTypeDefault = Required<BtnType>;
export type Position = 'left top' | 'left bot' | 'right top' | 'right bot' | 'center' | 'top' | 'bot'

// ==============================================
// Maps
// ==============================================

const positionMap: Record<Position, string> = {
  'left top': 'justify-start items-start',
  'left bot': 'justify-start items-end',
  'right top': 'justify-end items-start',
  'right bot': 'justify-end items-end',
  'top': 'justify-center items-start',
  'bot': 'justify-center items-end',
  'center': 'justify-center items-center',
};

// ==============================================
// Component Metadata
// ==============================================

@Component({
  selector: 'ZS-modal',
  imports: [Button, CommonModule],
  templateUrl: './modal.html',
  styleUrl: './modal.css'
})
export class Modal {
  readonly zIndices: ZIndicesType = zIndices;

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
  readonly cancelMerged = computed(() => ({
    ...this.cancelConfigDefault,
    ...(this.cancelConfig() ?? {})
  }));

  readonly confirmMerged = computed(() => ({
    ...this.confirmConfigDefault,
    ...(this.confirmConfig() ?? {})
  }));


  // ==============================================
  // Outputs
  // ==============================================

  readonly confirmEv = output<void>();
  readonly cancelEv = output<void>();
  readonly closedEv = output<void>();


  // ==============================================
  // Computed Signals
  // ==============================================

  readonly palette = computed(() => FormPaletteMap.get(this.modalStyle())!);
  readonly isOpen = signal<boolean>(false);
  readonly positionClass = computed(() => positionMap[this.position()])

  private setTimeId?: ReturnType<typeof setTimeout>;
  constructor() {
    effect(() => {
      const state = this.open();
      if(state) this.isOpen.set(true)
      
      untracked(() => {
        clearTimeout(this.setTimeId);
        if (!state && this.isOpen()) {
          this.setTimeId = window.setTimeout(() => this.isOpen.set(false), 250);
        }
      })
    })
  }

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

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.isOpen()) this.close();
  }
}