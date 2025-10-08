// ========================================================================
// Imports
// ========================================================================

import { CommonModule } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';


// ========================================================================
// Component Declaration
// ========================================================================

@Component({
  selector: 'ZS-pagination',
  imports: [CommonModule],
  templateUrl: './zpagination.html',
  styleUrl: './zpagination.css',
})
export class Zpagination {

  // ========================================================================
  // Inputs
  // ========================================================================

  /**
   * Total number of pages (required).
   */
  readonly totalPages = input.required<number>();

  /**
   * Current active page (required).
   */
  readonly currentPage = input.required<number>();

  /**
   * Whether to display the total items count.
   */
  readonly showTotalItems = input<boolean>(false);

  /**
   * Message shown before the total items count.
   */
  readonly totalItemsMessage = input<string>('Total items:');

  /**
   * Total number of items (used when `showTotalItems` is true).
   */
  readonly totalItems = input<number>();


  // ========================================================================
  // Outputs
  // ========================================================================

  /**
   * Emits the new page number when the user navigates.
   */
  readonly pageChangeEv = output<number>();


  // ========================================================================
  // Computed Properties
  // ========================================================================

  /**
   * Generates an array of page numbers from 1 to `totalPages`.
   */
  readonly pages = computed<number[]>(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1)
  );


  // ========================================================================
  // Event Handlers
  // ========================================================================

  /**
   * Navigates to the specified page if it's within valid range.
   */
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.pageChangeEv.emit(page);
  }

  /**
   * Navigates to the next page.
   */
  nextPage(): void {
    this.goToPage(this.currentPage() + 1);
  }

  /**
   * Navigates to the previous page.
   */
  prevPage(): void {
    this.goToPage(this.currentPage() - 1);
  }
}