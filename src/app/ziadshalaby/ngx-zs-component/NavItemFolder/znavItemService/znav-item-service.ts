// ==============================================
// Types
// ==============================================

interface CollectionEntry {
  openIndex: string;
  indexes: string[];
}

// ==============================================
// Imports
// ==============================================

import { Injectable, signal } from '@angular/core';

// ==============================================
// Injectable Metadata
// ==============================================

@Injectable({
  providedIn: 'root'
})
export class ZnavItemService {

  // ==============================================
  // State
  // ==============================================

  /**
   * Map of collections, where each collection tracks:
   * - openIndex: the currently open item's unique index
   * - indexes: list of all registered item indexes in this collection
   */
  readonly collections = signal<Map<string, CollectionEntry>>(new Map());

  // ==============================================
  // Public Read API
  // ==============================================

  openIndex(collectionName: string): string {
    const entry = this.collections().get(collectionName);
    return entry ? entry.openIndex : '';
  }

  // ==============================================
  // Public Write API
  // ==============================================

  addItemInCollection(collectionName: string, index: string): void {
    this.collections.update((prev) => {
      const updated = new Map(prev);
      const entry = updated.get(collectionName);

      if (entry) {
        updated.set(collectionName, {
          ...entry,
          indexes: [...entry.indexes, index]
        });
      } else {
        updated.set(collectionName, {
          openIndex: '',
          indexes: [index]
        });
      }

      return updated;
    });
  }

  onOpenIndexChange(collectionName: string, index: string): void {
    this.collections.update((prev) => {
      const updated = new Map(prev);
      const entry = updated.get(collectionName);

      if (entry) {
        updated.set(collectionName, {
          ...entry,
          openIndex: index
        });
      } else {
        updated.set(collectionName, {
          openIndex: index,
          indexes: []
        });
      }

      return updated;
    });
  }
}