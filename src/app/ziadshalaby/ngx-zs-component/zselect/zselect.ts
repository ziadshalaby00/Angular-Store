import { Component, Input, Output, EventEmitter, signal, computed, WritableSignal, input, model, output, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface DropdownItem {
  id: number | string;
  name: string;
  [key: string]: any;
}

@Component({
  selector: 'ZS-select',
  imports: [CommonModule, FormsModule],
  templateUrl: './zselect.html',
  styleUrl: './zselect.css'
})
export class Zselect {

  // ─────── Inputs ───────
  items = input.required<DropdownItem[]>();
  showSearch = input<boolean>(true);
  placeholder = input<string>('Select an option...');
  searchPlaceholder = input<string>('Search...');
  noResultsText = input<string>('No results found');
  showClearButton = input<boolean>(true);
  selectItemIdfromParent = input<number | null>(null);

  // ─────── Model (Two-way binding) ───────
  selectedItem = model<DropdownItem | null>(null);

  // ─────── Outputs ───────
  selectionCleared = output<void>();

  // ─────── Local Signals ───────
  isOpen = signal<boolean>(false);
  searchQuery = signal<string>('');

  // ─────── Computed Signals ───────
  filteredItems = computed(() => {
    if (!this.searchQuery()) return this.items();
    
    return this.items().filter(item => 
      item.name.toLowerCase().includes(this.searchQuery().toLowerCase())
    );
  });

  // ─────── Constructor & Effects ───────
  constructor() {
    effect(() => {
      const id = this.selectItemIdfromParent();
      const item = this.items().find(item => item.id === id);

      if (item) {
        this.selectItem(item);
      } else if (id === null) {
        this.clearSelection();
      }
    });
  }

  // ─────── Methods ───────
  toggleDropdown() {
    this.isOpen.set(!this.isOpen());
    if (this.isOpen()) {
      this.searchQuery.set('');
    }
  }
  
  selectItem(item: DropdownItem) {
    this.selectedItem.set(item);
    this.isOpen.set(false);
    this.searchQuery.set('');
  }
  
  clearSelection() {
    this.selectedItem.set(null);
    this.selectionCleared.emit();
  }
  
  trackByFn(index: number, item: DropdownItem) {
    return item.id;
  }
}