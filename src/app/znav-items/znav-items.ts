import { Component, input, output, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface NavbarItem {
  label: string;
  routerLink?: string;
  action?: () => void;
  children?: NavbarItem[];
  textColor?: string;
  icon?: string;
}

@Component({
  selector: 'app-znav-items',
  imports: [CommonModule, RouterModule],
  templateUrl: './znav-items.html',
  styleUrl: './znav-items.css'
})
export class ZnavItems {
  forMobile = input.required<boolean>();
  item = input.required<NavbarItem>();
  index = input<number>();

  openIndex = input<number | null | undefined>(null);
  openIndexChange = output<number | null | undefined>();

  toggle() {
    if (this.openIndex() === this.index()) {
      this.openIndexChange.emit(null);   // يقفل الكل
    } else {
      this.openIndexChange.emit(this.index()); // يفتح ده ويقفل الباقي
    }
  }

  isOpen() {
    return this.openIndex() === this.index();
  }

  onItemClick() {
    this.item().action?.();
  }

  onChildClick(child: NavbarItem) {
    child.action?.();
  }
}
