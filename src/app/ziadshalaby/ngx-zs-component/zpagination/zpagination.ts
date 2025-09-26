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
  totalPages = input.required<number>();
  currentPage = input.required<number>();

  showTotalItems = input<boolean>(false)
  totalItemsMessage = input<string>('Total items:')
  totalItems = input<number>();

  // 🟦 Output as signal
  pageChange = output<number>();

  pages = computed<number[]>(() => 
    Array.from({ length: this.totalPages() }, (_, i) => i + 1)
  );

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
