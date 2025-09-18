import { Component, computed, effect, inject, signal } from '@angular/core';
import { Product } from '../services/product';
import { Config } from '../services/config'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Category } from '../services/category';
import { Brand } from '../services/brand';
import { Zselect } from '../zselect/zselect';

@Component({
  selector: 'app-products',
  imports: [FormsModule, CommonModule, Zselect],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products {
  productService = inject(Product);
  categoryService = inject(Category);
  brandService = inject(Brand);
  configService = inject(Config);

  filters = {
    category: signal<any>(''),
    brand: signal<any>(''),
    min_price: signal<any>(''),
    max_price: signal<any>(''),
    stock: signal<any>(''),
    ordering: signal<any>(''),
    page: signal<number>(1)
  };


  constructor() {
    effect(() => {
      const _ = [
        this.filters.brand(),
        this.filters.category(),
        this.filters.min_price(),
        this.filters.max_price(),
        this.filters.stock(),
        this.filters.ordering()
      ];

      this.applyFilters();
    });
  }

  ngOnInit() {
    this.categoryService.loadCategories();
    this.brandService.loadBrands();
  }

  applyFilters() { 
    console.log(this.filters.brand()) 
    this.productService.loadProducts(this.filters); 
  }

  prevPage() {
    if (this.filters.page() > 1) {
      this.filters.page.update(p => p - 1);
    }
  }
  nextPage() {
    if (this.filters.page() < this.productService.totalPages()) {
      this.filters.page.update(p => p + 1);
    }
  }
  goToPage(page: number) {
    if (page >= 1 && page <= this.productService.totalPages()) {
      this.filters.page.set(page);
    }
  }
  getVisiblePages(): number[] {
    const visiblePages = [];
    const startPage = Math.max(1, this.productService.currentPage() - 2);
    const endPage = Math.min(this.productService.totalPages(), this.productService.currentPage() + 2);
    
    for (let i = startPage; i <= endPage; i++) {
      visiblePages.push(i);
    }
    
    return visiblePages;
  }
}