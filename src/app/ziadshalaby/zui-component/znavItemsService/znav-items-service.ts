import { Injectable, signal } from '@angular/core';

type CollectionEntry = [openIndex: string, indexes: string[]];

@Injectable({
  providedIn: 'root'
})
export class ZnavItemsService {
  // Map<collectionName, CollectionEntry>
  collections = signal<Map<string, CollectionEntry>>(new Map());

  addItemInCollection(collectionName: string, index: string): void {
    this.collections.update((prev: Map<string, CollectionEntry>) => {
      const m: Map<string, CollectionEntry> = new Map(prev);
      const entry: CollectionEntry | undefined = m.get(collectionName);
      if (entry) {
        // لا تغير المصفوفة مكانياً — ارجع نسخة جديدة
        m.set(collectionName, [entry[0], [...entry[1], index]]);
      } else {
        m.set(collectionName, ['', [index]]);
      }
      return m;
    });
  }

  onOpenIndexChange(collectionName: string, index: string): void {
    this.collections.update((prev: Map<string, CollectionEntry>) => {
      const m: Map<string, CollectionEntry> = new Map(prev);
      const entry: CollectionEntry | undefined = m.get(collectionName);
      if (entry) {
        m.set(collectionName, [index, entry[1]]);
      } else {
        m.set(collectionName, [index, []]);
      }
      return m;
    });
  }

  openIndex(collectionName: string): string {
    const entry: CollectionEntry | undefined = this.collections().get(collectionName);
    return entry ? entry[0] : '';
  }
}
