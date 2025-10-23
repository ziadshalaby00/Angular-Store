// ==============================================
// Types
// ==============================================

export interface NavbarItem {
  label: string;
  routerLink?: string;
  routerLinkActive?: string;
  action?: () => void;
  children?: NavbarItem[];
  iconClass?: string;
  colorClass?: string;
  useDefaultColorClass?: 'text' | 'bg';
  childrenOpenWindow?: boolean;
}

// ==============================================
// Imports
// ==============================================

import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavItemService } from '../nav-item-service/nav-item-service';

// ==============================================
// Component Metadata
// ==============================================

@Component({
  selector: 'ZS-nav-item',
  imports: [CommonModule, RouterModule],
  templateUrl: './nav-item.html',
  styleUrl: './nav-item.css'
})
export class NavItem {

  // ==============================================
  // Injection & Services
  // ==============================================

  private readonly znavItemService = inject(NavItemService);

  // ==============================================
  // Inputs & Outputs
  // ==============================================

  readonly item = input.required<NavbarItem>();
  readonly collectionName = input.required<string>();
  readonly anyItemClickedEv = output<NavbarItem>();

  // ==============================================
  // Signals & Computed Properties
  // ==============================================

  readonly index = signal<string>(crypto.randomUUID());

  readonly isOpen = computed<boolean>(() =>
    this.znavItemService.openIndex(this.collectionName()) === this.index()
  );

  // ==============================================
  // Lifecycle & Effects
  // ==============================================

  constructor() {
    effect(() => {
      const collection = this.collectionName();
      if (collection) {
        this.znavItemService.addItemInCollection(collection, this.index());
      }
    });
  }

  // ==============================================
  // Event Handlers
  // ==============================================

  toggle(): void {
    const currentOpen = this.znavItemService.openIndex(this.collectionName());
    const myIndex = this.index();

    if (currentOpen === myIndex) {
      this.znavItemService.onOpenIndexChange(this.collectionName(), '');
    } else {
      this.znavItemService.onOpenIndexChange(this.collectionName(), myIndex);
    }
  }

  onItemClick(): void {
    this.item().action?.();
    this.anyItemClickedEv.emit(this.item());
  }

  // ==============================================
  // Helper Methods
  // ==============================================

  getItemClasses = (item: NavbarItem): string => {
    const defaultTextClass =
      'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100';
    const defaultBgClass =
      'hover:bg-gray-100 dark:hover:bg-gray-700';

    if (item.colorClass) {
      return item.colorClass;
    }

    return item.useDefaultColorClass === 'bg'
      ? defaultBgClass
      : defaultTextClass;
  };
}