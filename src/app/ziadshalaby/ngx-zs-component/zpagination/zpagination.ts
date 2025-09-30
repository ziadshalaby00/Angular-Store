import { CommonModule } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'ZS-pagination',
  imports: [CommonModule],
  templateUrl: './zpagination.html',
  styleUrl: './zpagination.css'
})
export class Zpagination {

  // 🟦 Signals inputs
  readonly totalPages = input.required<number>();
  readonly currentPage = input.required<number>();

  readonly showTotalItems = input<boolean>(false);
  readonly totalItemsMessage = input<string>('Total items:');
  readonly totalItems = input<number>();

  // 🟦 Output as signal
  readonly pageChange = output<number>();

  // 🟦 Computed properties
  readonly pages = computed<number[]>(() => 
    Array.from({ length: this.totalPages() }, (_, i) => i + 1)
  );

  // 🟦 Event handlers
  goToPage(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.pageChange.emit(page);
  }

  nextPage() {
    this.goToPage(this.currentPage() + 1);
  }

  prevPage() {
    this.goToPage(this.currentPage() - 1);
  }

}