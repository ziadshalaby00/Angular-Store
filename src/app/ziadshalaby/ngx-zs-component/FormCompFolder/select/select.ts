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

import { ChangeEventType, Input, ValidatorFn } from '../input/input';
import { Label } from '../label/label';
import { FormPaletteEntry, FormPaletteMap, FormStyle } from '../../palette-service/palette-service';
import { InputErrors } from '../input-errors/input-errors';


// =================================================================================================
// Interfaces
// =================================================================================================
export interface DropdownItem<T> {
  id: T;
  name: string;
  [key: string]: any;
}

// =================================================================================================
// Component Declaration
// =================================================================================================
@Component({
  selector: 'ZS-select',
  imports: [CommonModule, FormsModule, Input, Label, InputErrors],
  templateUrl: './select.html',
  styleUrl: './select.css'
})
export class Select<T> {

  // =================================================================================================
  // Inputs
  // =================================================================================================
  readonly Id = input<string>(crypto.randomUUID());
  readonly items = input.required<DropdownItem<T>[]>();

  readonly label = input<string | null>(null);
  readonly hint = input<string | null>(null);

  readonly required = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly isReadonly = input<boolean>(false);

  readonly inputStyle = input<FormStyle>('secondary');
  readonly placeholder = input<string>('Select an option...');

  readonly showSearch = input<boolean>(true);
  readonly searchPlaceholder = input<string>('Search...');

  readonly noResultsText = input<string>('No results found');
  readonly showClearButton = input<boolean>(true);

  readonly searchDebounceDelay = input<number>(300);
  readonly showLoaderIconOnSearchInput = input<boolean>(false);

  readonly preselectedIds = input<(number | string)[]>([]);
  readonly multiple = input<boolean>(false);
  readonly validateFns = input<ValidatorFn<DropdownItem<T>[]>[]>([]);

  // =================================================================================================
  // Model (Two-way Binding)
  // =================================================================================================
  readonly selectedItems = model<DropdownItem<T>[]>([]);
  readonly touched = model<boolean>(false); // Tracks if the user has interacted with the input


  // =================================================================================================
  // Outputs
  // =================================================================================================
  readonly selectedItemsEv = output<ChangeEventType<DropdownItem<T>[]>>();
  readonly selectionClearedEv = output<void>();


  // =================================================================================================
  // Local Signals
  // =================================================================================================
  readonly isOpen = signal<boolean>(false);
  readonly searchQuery = signal<string | null>(null);


  // =================================================================================================
  // Computed Signals
  // =================================================================================================
  readonly styleEntry = computed<FormPaletteEntry>(() => {
    const hasError = this.error().length;

    let styleEntry = FormPaletteMap.get(this.inputStyle()) ?? FormPaletteMap.get('secondary')!;
    if(hasError) {
      styleEntry = FormPaletteMap.get('danger')!;
    }

    return styleEntry
  })

  readonly disabledOrReadonly = computed<boolean>(
    () => this.disabled() || this.isReadonly()
  );

  readonly filteredItems = computed<DropdownItem<T>[]>(() => {
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

    const disabledCls = this.disabled() ? 'opacity-60' : '';
    const cursorCls = this.disabledOrReadonly()
      ? 'cursor-not-allowed'
      : 'cursor-text';

    return [
      base,
      this.styleEntry().border,
      this.styleEntry().inputBg,
      this.styleEntry().text,
      this.styleEntry().borderHover,
      disabledCls,
      cursorCls
    ].filter(Boolean).join(' ');
  });

  readonly clearClass = computed<string>(() => {
    const base = 'mt-2 text-sm flex items-center transition-colors';
    return [base, this.styleEntry().text, this.styleEntry().textHover].filter(Boolean).join(' ');
  });

  readonly showItemsClass = computed<string>(() => {
    return this.styleEntry()?.bgSelect ?? '';
  });

  readonly error = computed<string[]>(() => {
    const selectedItems = this.selectedItems();
    const required = this.required();

    // Only validate after user interaction
    if (!this.touched()) return [];

    const errors: string[] = [];

    // Required validation
    if (required && !selectedItems.length) {
      errors.push('This field is required');
    }

    // Custom validator
    for (const fn of this.validateFns()) {
      const result = fn(selectedItems);
      if (Array.isArray(result)) errors.push(...result);
    }

    return errors.length > 0 ? errors : [];
  });


  // =================================================================================================
  // Utility Methods
  // =================================================================================================
  readonly getBgSelectClasses = (selected: boolean): string => {
    return selected
      ? `${this.styleEntry().bgSelect} hover:opacity-80`
      : 'hover:bg-gray-200/50 dark:hover:bg-gray-600/40';
  };


  // =================================================================================================
  // Lifecycle & Effects
  // =================================================================================================
  constructor() {
    effect(() => {
      const ids = this.preselectedIds();
      const items: DropdownItem<T>[] = ids
        ?.map(id => this.items().find(item => item.id === id))
        .filter((item): item is DropdownItem<T> => item !== undefined) ?? [];

      if (items.length > 0) {
        this.selectItem(items, true);
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
    if (!this.isOpen())  this.touched.set(true)
  }

  selectItem(items: DropdownItem<T>[], isPreselectedIds: boolean = false): void {
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

    if(isPreselectedIds) return;
    this.touched.set(true)
    this.emitChangeValue(this.selectedItems(), false);
  }

  clearSelection(): void {
    if (this.disabledOrReadonly()) return;

    this.selectedItems.set([]);
    this.selectionClearedEv.emit();
  }

  inSelectItems(item?: DropdownItem<T>): boolean {
    if (!item) return false;
    return this.selectedItems()?.some(i => i?.id === item.id) ?? false;
  }

  trackByFn(_index: number, item: DropdownItem<T>): T {
    return item.id;
  }

  /** Forces the input to trigger a manual change event */
  public forceChange(fromForce: boolean = true): void {
    // Applies the same logic as natural change.
    this.touched.set(true);
    this.emitChangeValue(this.selectedItems(), fromForce);
  }

  emitChangeValue(value: DropdownItem<T>[], fromForce: boolean = true): void {
    const valid = this.error().length === 0;
    this.selectedItemsEv.emit({ value, valid, fromForce });
  }
}