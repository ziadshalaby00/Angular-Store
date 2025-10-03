// =================================================================================================
// Imports
// =================================================================================================
import { 
  Component, 
  signal, 
  computed, 
  input, 
  model, 
  output, 
  effect 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Zinput } from '../zinput/zinput';
import { Zlabel } from '../zlabel/zlabel';
import { FormPaletteMap, FormStyle } from '../zformService/zform-service';


// =================================================================================================
// Interfaces
// =================================================================================================
export interface DropdownItem {
  id: number | string;
  name: string;
  [key: string]: any;
}


// =================================================================================================
// Component Declaration
// =================================================================================================
@Component({
  selector: 'ZS-select',
  imports: [CommonModule, FormsModule, Zinput, Zlabel],
  templateUrl: './zselect.html',
  styleUrl: './zselect.css'
})
export class Zselect {

  // =================================================================================================
  // Inputs
  // =================================================================================================
  readonly id = input<string>(crypto.randomUUID());
  readonly items = input.required<DropdownItem[]>();

  readonly label = input<string | null>(null);
  readonly hint = input<string | null>(null);

  readonly required = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly isReadonly = input<boolean>(false);

  readonly inputStyle = input<FormStyle>('normal');
  readonly placeholder = input<string>('Select an option...');

  readonly showSearch = input<boolean>(true);
  readonly searchPlaceholder = input<string>('Search...');

  readonly noResultsText = input<string>('No results found');
  readonly showClearButton = input<boolean>(true);

  readonly searchDebounceDelay = input<number>(300);
  readonly showLoaderIconOnSearchInput = input<boolean>(false);

  readonly preselectedIds = input<(number | string)[]>([]);
  readonly multiple = input<boolean>(false);


  // =================================================================================================
  // Model (Two-way Binding)
  // =================================================================================================
  readonly selectedItems = model<DropdownItem[]>([]);


  // =================================================================================================
  // Outputs
  // =================================================================================================
  readonly selectionCleared = output<void>();


  // =================================================================================================
  // Local Signals
  // =================================================================================================
  readonly isOpen = signal<boolean>(false);
  readonly searchQuery = signal<string | null>(null);


  // =================================================================================================
  // Computed Signals
  // =================================================================================================
  readonly disabledOrReadonly = computed<boolean>(
    () => this.disabled() || this.isReadonly()
  );

  readonly filteredItems = computed<DropdownItem[]>(() => {
    const query = this.searchQuery();
    if (!query) return this.items();

    const lowerQuery = query.toLowerCase();
    return this.items().filter(item =>
      item.name.toLowerCase().includes(lowerQuery)
    );
  });

  readonly containerClasses = computed<string>(() => {
    const base = `
      border transition-all duration-150
      flex items-center justify-between
      w-full min-w-48 px-3 py-2
      rounded-lg shadow-sm
    `.trim();

    const styleEntry = FormPaletteMap.get(this.inputStyle()) ?? FormPaletteMap.get('normal')!;

    const disabledCls = this.disabled() ? 'opacity-60' : '';
    const cursorCls = this.disabledOrReadonly()
      ? 'cursor-not-allowed'
      : 'cursor-text';

    return [
      base,
      styleEntry.border,
      styleEntry.bg,
      styleEntry.text,
      styleEntry.borderHover,
      disabledCls,
      cursorCls
    ].filter(Boolean).join(' ');
  });

  readonly clearClass = computed<string>(() => {
    const base = 'mt-2 text-sm flex items-center transition-colors';
    const styleEntry = FormPaletteMap.get(this.inputStyle()) ?? FormPaletteMap.get('normal')!;
    return [base, styleEntry.text, styleEntry.textHover].filter(Boolean).join(' ');
  });

  readonly showItemsClass = computed<string>(() => {
    const styleEntry = FormPaletteMap.get(this.inputStyle());
    return styleEntry?.bgSelect ?? '';
  });


  // =================================================================================================
  // Utility Methods
  // =================================================================================================
  readonly getBgSelectClasses = (selected: boolean): string => {
    const styleEntry = FormPaletteMap.get(this.inputStyle()) ?? FormPaletteMap.get('normal')!;
    return selected
      ? `${styleEntry.bgSelect} hover:opacity-80`
      : 'hover:bg-gray-200/50 dark:hover:bg-gray-600/40';
  };


  // =================================================================================================
  // Lifecycle & Effects
  // =================================================================================================
  constructor() {
    effect(() => {
      const ids = this.preselectedIds();
      const items: DropdownItem[] = ids
        ?.map(id => this.items().find(item => item.id === id))
        .filter((item): item is DropdownItem => item !== undefined) ?? [];

      if (items.length > 0) {
        this.selectItem(items);
      } else if (ids.length === 0) {
        this.clearSelection();
      }
    });
  }


  // =================================================================================================
  // Public Methods
  // =================================================================================================
  toggleDropdown(): void {
    if (this.disabledOrReadonly()) return;

    this.isOpen.set(!this.isOpen());
    if (this.isOpen()) {
      this.searchQuery.set(null);
    }
  }

  selectItem(items: DropdownItem[]): void {
    if (!items?.length || !items[0]) return;

    if (this.multiple()) {
      this.selectedItems.update(current => {
        const existing = current ?? [];
        const clicked = items[0];

        const alreadySelected = existing.some(i => i?.id === clicked.id);
        if (alreadySelected) {
          return existing.filter(i => i?.id !== clicked.id);
        } else {
          return [...existing, clicked];
        }
      });
    } else {
      this.selectedItems.set([items[0]]);
      this.isOpen.set(false);
      this.searchQuery.set(null);
    }
  }

  clearSelection(): void {
    if (this.disabledOrReadonly()) return;

    this.selectedItems.set([]);
    this.selectionCleared.emit();
  }

  inSelectItems(item?: DropdownItem): boolean {
    if (!item) return false;
    return this.selectedItems()?.some(i => i?.id === item.id) ?? false;
  }

  trackByFn(_index: number, item: DropdownItem): number | string {
    return item.id;
  }
}