import { Component, Input, Output, EventEmitter, signal, computed, WritableSignal, input, model, output, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface DropdownItem {
  id: number | string;
  name: string;
  [key: string]: any;
}

@Component({
  selector: 'app-zselect',
  imports: [CommonModule, FormsModule],
  templateUrl: './zselect.html',
  styleUrl: './zselect.css'
})
export class Zselect {
  // Input signals (required)
  items = input.required<DropdownItem[]>();

  // Show Search Input
  showSearch = input<boolean>(true)

  // Input signals (optional with default values)
  placeholder = input<string>('Select an option...');
  searchPlaceholder = input<string>('Search...');
  noResultsText = input<string>('No results found');
  showClearButton = input<boolean>(true);

  // Model for two-way binding
  selectedItem = model<DropdownItem | null>(null);

  // select item from paranet
  selectItemIdfromParent = input<number | null>(null)

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


  // Output signals
  selectionCleared = output<void>();
  
  // Local signals
  isOpen = signal<boolean>(false);
  searchQuery = signal<string>('');

  // Computed signals
  filteredItems = computed(() => {
    if (!this.searchQuery()) return this.items();
    
    return this.items().filter(item => 
      item.name.toLowerCase().includes(this.searchQuery().toLowerCase())
    );
  });
  
  // Methods
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
