import { Injectable, signal } from '@angular/core';

interface CollectionEntry {
  openIndex: string;
  indexes: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ZnavItemService {

  // --- State ---
  // Map<collectionName, CollectionEntry>
  readonly collections = signal<Map<string, CollectionEntry>>(new Map());

  // --- Public API (Read) ---
  openIndex(collectionName: string): string {
    const entry: CollectionEntry | undefined = this.collections().get(collectionName);
    return entry ? entry.openIndex : '';
  }

  // --- Public API (Write) ---
  addItemInCollection(collectionName: string, index: string): void {
    this.collections.update((prev: Map<string, CollectionEntry>) => {
      const m: Map<string, CollectionEntry> = new Map(prev);
      const entry: CollectionEntry | undefined = m.get(collectionName);
      if (entry) {
        // لا تغير المصفوفة مكانياً — ارجع نسخة جديدة
        m.set(collectionName, { ...entry, indexes: [...entry.indexes, index] });
      } else {
        m.set(collectionName, { openIndex: '', indexes: [index] });
      }
      return m;
    });
  }

  onOpenIndexChange(collectionName: string, index: string): void {
    this.collections.update((prev: Map<string, CollectionEntry>) => {
      const m: Map<string, CollectionEntry> = new Map(prev);
      const entry: CollectionEntry | undefined = m.get(collectionName);
      if (entry) {
        m.set(collectionName, { ...entry, openIndex: index });
      } else {
        m.set(collectionName, { openIndex: index, indexes: [] });
      }
      return m;
    });
  }
}