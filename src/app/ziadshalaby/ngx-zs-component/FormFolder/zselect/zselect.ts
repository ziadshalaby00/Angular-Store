import { Component, signal, computed, input, model, output, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Zinput } from '../zinput/zinput';
import { FormPaletteMap, FormStyle } from '../zformService/zform-service';

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
  readonly items = input.required<DropdownItem[]>();

  readonly id = input<string>(crypto.randomUUID());
  readonly label = input<string | undefined>(undefined)
  readonly hint = input<string | undefined>(undefined)
  readonly required = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly inputStyle = input<FormStyle>('normal');
  readonly showSearch = input<boolean>(true);
  readonly placeholder = input<string>('Select an option...');
  readonly searchPlaceholder = input<string>('Search...');
  readonly noResultsText = input<string>('No results found');
  readonly showClearButton = input<boolean>(true);
  readonly isReadonly = input<boolean>(false)
  
  readonly searchDebounceDelay = input<number>(300);

  readonly showLoaderIconOnSerachInput = input<boolean>(false)

  readonly selectItemIdfromParent = input<number | null>(null);

  // ─────── Model (Two-way binding) ───────
  readonly selectedItem = model<DropdownItem | null>(null);

  // ─────── Outputs ───────
  readonly selectionCleared = output<void>();

  // ─────── Local Signals ───────
  readonly isOpen = signal<boolean>(false);
  readonly searchQuery = signal<string | null>(null);

  // ─────── Computed Signals ───────
  readonly disabledOrReadonly = computed<boolean>(() => (this.disabled() || this.isReadonly()))

  readonly filteredItems = computed<DropdownItem[]>(() => {
    if (!this.searchQuery()) return this.items();
    
    return this.items().filter(item => 
      item.name.toLowerCase().includes((this.searchQuery() ?? '').toLowerCase())
    );
  });

  readonly containerClasses = computed<string>(() => {
    const base = `border transition-all duration-150 flex items-center justify-between w-full min-w-48 px-3 py-2 rounded-lg shadow-sm`
          // hover:border-gray-400 dark:hover:border-gray-600`
    const styleEntry = FormPaletteMap.get(this.inputStyle()) ?? FormPaletteMap.get('normal');
    6
    const disabledCls = this.disabled() ? 'opacity-60' : '';
    const disabledOrReadonlyCls = this.disabledOrReadonly()
      ? 'cursor-not-allowed'
      : 'cursor-text';

    return [
      base, styleEntry?.border, 
      styleEntry?.bg, 
      styleEntry?.text,
      styleEntry?.borderHover,
      disabledCls,
      disabledOrReadonlyCls,
    ].join(' ');
  });

  readonly clearClass = computed(() => {
    const base = `mt-2 text-sm flex items-center transition-colors`
    const styleEntry = FormPaletteMap.get(this.inputStyle()) ?? FormPaletteMap.get('normal');
    return [base, styleEntry?.text, styleEntry?.textHover].join(' ');
  })

  readonly getBgSelectClasses = (selected: boolean) => {
    const styleEntry = FormPaletteMap.get(this.inputStyle()) ?? FormPaletteMap.get('normal');
    return selected ? styleEntry?.bgSelect : ''
  }

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
    if(this.disabledOrReadonly()) return;

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
    if(this.disabledOrReadonly()) return;

    this.selectedItem.set(null);
    this.selectionCleared.emit();
  }
  
  trackByFn(index: number, item: DropdownItem) {
    return item.id;
  }
}