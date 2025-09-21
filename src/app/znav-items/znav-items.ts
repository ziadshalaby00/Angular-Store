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
  hoverColor?: string;
}

@Component({
  selector: 'app-znav-items',
  imports: [CommonModule, RouterModule],
  templateUrl: './znav-items.html',
  styleUrl: './znav-items.css'
})
export class ZnavItems {
  openWindow = input.required<boolean>();
  item = input.required<NavbarItem>();
  index = input.required<number>();

  openIndex = input.required<number | null | undefined>();
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

  getItemClasses(item: NavbarItem) {
    return {
      [item.textColor || 'text-gray-600']: true,
      [item.hoverColor || 'hover:text-gray-900']: true,
    };
  }
}
