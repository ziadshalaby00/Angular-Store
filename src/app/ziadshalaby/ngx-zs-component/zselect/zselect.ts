import { Component, signal, computed, input, model, output, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputStyle, paletteMap } from '../zinputService/zinput-service';
import { Zinput } from '../zinput/zinput';

export interface DropdownItem {
  id: number | string;
  name: string;
  [key: string]: any;
}

@Component({
  selector: 'ZS-select',
  imports: [CommonModule, FormsModule, Zinput],
  templateUrl: './zselect.html',
  styleUrl: './zselect.css'
})
export class Zselect {

  // ─────── Inputs ───────
  readonly id = input<string>(crypto.randomUUID());
  readonly label = input<string | undefined>(undefined)
  readonly hint = input<string | undefined>(undefined)
  readonly required = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly inputStyle = input<InputStyle>('normal');
  readonly items = input.required<DropdownItem[]>();
  readonly showSearch = input<boolean>(true);
  readonly placeholder = input<string>('Select an option...');
  readonly searchPlaceholder = input<string>('Search...');
  readonly noResultsText = input<string>('No results found');
  readonly showClearButton = input<boolean>(true);
  readonly selectItemIdfromParent = input<number | null>(null);

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

  readonly containerClasses = computed(() => {
    const base = `border transition-all duration-150 flex items-center justify-between w-full min-w-48 px-3 py-2 rounded-lg shadow-sm`
          // hover:border-gray-400 dark:hover:border-gray-600`
    const styleEntry = paletteMap.get(this.inputStyle()) ?? paletteMap.get('normal');
    const disabledCls = this.disabled() ? 'opacity-60 cursor-not-allowed' : 'cursor-text';
    return [
      base, styleEntry?.border, 
      styleEntry?.bg, 
      styleEntry?.text,
      styleEntry?.borderHover,
      disabledCls,
    ].join(' ');
  });

  readonly clearClass = computed(() => {
    const base = `mt-2 text-sm flex items-center transition-colors`
    const styleEntry = paletteMap.get(this.inputStyle()) ?? paletteMap.get('normal');
    return [base, styleEntry?.text, styleEntry?.textHover].join(' ');
  })

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
    if(this.disabled()) return;

    this.isOpen.set(!this.isOpen());
    if (this.isOpen()) {
      this.searchQuery.set('');
    }
  }
  
  selectItem(item: DropdownItem) {
    if(this.disabled()) return;
    
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