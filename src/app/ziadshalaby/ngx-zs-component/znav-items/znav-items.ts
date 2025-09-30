import { Component, computed, effect, inject, input, output, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ZnavItemsService } from '../znavItemsService/znav-items-service';

export interface NavbarItem {
  label: string;
  routerLink?: string;
  action?: () => void;
  children?: NavbarItem[];
  iconClass?: string;

  colorClass?: string;
  useDefultColorClass?: 'text' | 'bg';

  childrenOpenWindow?: boolean;
}

@Component({
  selector: 'ZS-nav-items',
  imports: [CommonModule, RouterModule],
  templateUrl: './znav-items.html',
  styleUrl: './znav-items.css'
})
export class ZnavItems {

  // --- Injection & Services ---
  private readonly znavItemsService: ZnavItemsService = inject(ZnavItemsService);

  // --- Inputs & Outputs ---
  readonly item = input.required<NavbarItem>();
  readonly collectionName = input.required<string>();
  readonly anyItemClicked = output<NavbarItem>();

  // --- Signals & Computed ---
  // index ثابت لكل instance (مش computed متغير)
  readonly index = signal<string>(crypto.randomUUID());

  readonly isOpen = computed<boolean>((): boolean => 
    this.znavItemsService.openIndex(this.collectionName()) === this.index()
  );

  // --- Lifecycle & Effects ---
  constructor() {
    effect((): void => {
      const col: string = this.collectionName();
      if (col) this.znavItemsService.addItemInCollection(col, this.index());
    });
  }

  // --- Event Handlers ---
  toggle(): void {
    const currentOpen: string = this.znavItemsService.openIndex(this.collectionName());
    // لازم نستدعي this.index() عشان نحصل على القيمة النصية
    if (currentOpen === this.index()) {
      this.znavItemsService.onOpenIndexChange(this.collectionName(), '');
    } else {
      this.znavItemsService.onOpenIndexChange(this.collectionName(), this.index());
    }
  }

  onItemClick(): void {
    this.item().action?.();
    this.anyItemClicked.emit(this.item());
  }

  // --- Helper Methods ---
  getItemClasses = (item: NavbarItem): string => {
    const defaultTextHover =
      'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100';

    const defaultBgHover = 'hover:bg-gray-100 dark:hover:bg-gray-700';

    if (item.colorClass) {
      return item.colorClass;
    }

    return item.useDefultColorClass === 'bg' ? defaultBgHover : defaultTextHover;
  };
}