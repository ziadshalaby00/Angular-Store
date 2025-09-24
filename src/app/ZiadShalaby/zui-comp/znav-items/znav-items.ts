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
  textColorClass?: string;
  hoverType?: 'text' | 'bg';
  hoverTextColorClass?: string;
  childrenOpenWindow?: boolean;
}

@Component({
  selector: 'app-znav-items',
  imports: [CommonModule, RouterModule],
  templateUrl: './znav-items.html',
  styleUrl: './znav-items.css'
})
export class ZnavItems {
  private znavItemsService: ZnavItemsService = inject(ZnavItemsService);

  item = input.required<NavbarItem>();
  collectionName = input.required<string>();
  anyItemClicked = output<NavbarItem>();

  // index ثابت لكل instance (مش computed متغير)
  index = signal<string>(crypto.randomUUID());

  constructor() {
    effect((): void => {
      const col: string = this.collectionName();
      if (col) this.znavItemsService.addItemInCollection(col, this.index());
    });
  }

  toggle(): void {
    const currentOpen: string = this.znavItemsService.openIndex(this.collectionName());
    // لازم نستدعي this.index() عشان نحصل على القيمة النصية
    if (currentOpen === this.index()) {
      this.znavItemsService.onOpenIndexChange(this.collectionName(), '');
    } else {
      this.znavItemsService.onOpenIndexChange(this.collectionName(), this.index());
    }
  }

  isOpen = computed<boolean>((): boolean => 
    this.znavItemsService.openIndex(this.collectionName()) === this.index()
  );

  onItemClick(): void {
    this.item().action?.();
    this.anyItemClicked.emit(this.item());
  }

  getItemClasses = (item: NavbarItem): string => {
    const textColor: string = item.textColorClass || 'text-gray-600 dark:text-gray-300';

    let hover: string = '';
    if (item.hoverType === 'text') {
      hover = item.hoverTextColorClass || 'hover:text-gray-900 dark:hover:text-gray-100';
    } else {
      hover = 'hover:bg-gray-100 dark:hover:bg-gray-700';
    }

    return `${textColor} ${hover}`;
  }
}
