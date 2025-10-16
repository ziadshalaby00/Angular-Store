import { Component, computed, effect, inject, signal } from '@angular/core';
import { Product } from '../services/product';
import { Config } from '../services/config'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Category } from '../services/category';
import { Brand } from '../services/brand';
import { Carousel } from '../ziadshalaby/ngx-zs-component/carousel/carousel';
import { Pagination } from '../ziadshalaby/ngx-zs-component/pagination/pagination';
import { Select } from '../ziadshalaby/ngx-zs-component/FormCompFolder/select/select';
import { Spinner } from '../ziadshalaby/ngx-zs-component/spinner/spinner';
import { Input } from '../ziadshalaby/ngx-zs-component/FormCompFolder/input/input';
import { Button } from '../ziadshalaby/ngx-zs-component/FormCompFolder/button/button';
import { Card } from '../ziadshalaby/ngx-zs-component/card/card';

@Component({
  selector: 'app-products',
  imports: [FormsModule, CommonModule, Select, Pagination, Carousel, Spinner, Input, Button, Card],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products {
  productService = inject(Product);
  categoryService = inject(Category);
  brandService = inject(Brand);
  configService = inject(Config);

  filters = {
    category: signal<number | string>(''),
    brand: signal<number | string | null>(null),
    min_price: signal<string>('10'),
    max_price: signal<string>('1000'),
    stock: signal<string | number | null>(null),
    ordering: signal<string | number | null>(null),
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

  onCategoryClick(param: any) {
    console.log(param)
  }

  get categories() {
    return this.categoryService.categories().map(cat => ({
      ...cat,
      image: cat.image ? this.configService.apiUrl +  cat.image : 'public/placeholder.png'
    }));
  }

  stockFilters = [
    {
      id: 'in',
      name: 'In Stock'
    },
    {
      id: 'out',
      name: 'Out of Stock'
    },
  ]
  orderingFilters = [
    {
      id: 'price',
      name: 'Price Low → High'
    },
    {
      id: '-price',
      name: 'Price High → Low'
    },
    {
      id: 'created_at',
      name: 'Newest'
    },
    {
      id: '-created_at',
      name: 'Oldest'
    },
  ]
}