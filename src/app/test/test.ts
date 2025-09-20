import { Component, inject } from '@angular/core';
import { Category } from '../services/category';
import { Config } from '../services/config';

@Component({
  selector: 'app-test',
  imports: [],
  templateUrl: './test.html',
  styleUrl: './test.css'
})
export class Test {
  categoryService = inject(Category);
  configService = inject(Config);
  
  ngOnInit() {
    this.categoryService.loadCategories();
  }
}
