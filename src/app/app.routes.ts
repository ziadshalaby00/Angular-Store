import { Routes } from '@angular/router';
import { Products } from './products/products';
import { Test } from './test/test';

export const routes: Routes = [
    { path: 'products', component: Products},
    { path: 'test', component: Test},
];
