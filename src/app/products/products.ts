import { Component, inject } from '@angular/core';
import { Product } from '../services/product';
import { Config } from '../services/config';

@Component({
  selector: 'app-products',
  imports: [],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products {
  productService = inject(Product);
  configService = inject(Config);

  ngOnInit() {
    this.productService.loadProducts();
  }
}