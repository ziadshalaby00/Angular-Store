import { Component, computed, effect, inject, signal } from '@angular/core';
import { Product } from '../services/product';
import { Config } from '../services/config'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Category } from '../services/category';
import { Brand } from '../services/brand';
import { Zselect } from '../zselect/zselect';
import { Zpagination } from '../zpagination/zpagination';

@Component({
  selector: 'app-products',
  imports: [FormsModule, CommonModule, Zselect, Zpagination],
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
        this.filters.ordering(),
      ];


      this.filters.page.set(1)
    });

    effect(() => {
      const _ = this.filters.page()
      this.applyFilters();
    })
  }

  ngOnInit() {
    this.categoryService.loadCategories();
    this.brandService.loadBrands();
  }

  applyFilters() { 
    this.productService.loadProducts(this.filters); 
  }

  clearAll() {
    this.filters.brand.set('')
    this.filters.category.set('')
    this.filters.min_price.set('')
    this.filters.max_price.set('')
    this.filters.stock.set('')
    this.filters.ordering.set('')
  }
}