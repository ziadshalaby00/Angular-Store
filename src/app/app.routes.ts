import { Routes } from '@angular/router';
import { Products } from './products/products';
import { Test } from './test/test';
import { Login } from './login/login';
import { ProductDetail } from './product-detail/product-detail';
import { Signup } from './signup/signup';
import { ResetPassword } from './reset-password/reset-password';

export const routes: Routes = [
    { path: 'products', component: Products},
    { path: 'home', component: Products},
    { path: 'test', component: Test},
    { path: 'login', component: Login},
    { path: 'signup', component: Signup},
    { path: 'product-detail/:id', component: ProductDetail },
    { path: 'reset-password/:uid/:token', component: ResetPassword }
];
