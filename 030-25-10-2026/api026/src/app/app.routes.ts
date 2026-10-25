import { Routes } from '@angular/router';
import { Products } from './components/products/products';
import { Login } from './pages/login/login';
import { authGuard } from './guards/auth-guard-guard';

export const routes: Routes = [
    { path: 'login', component: Login },
    { path: '', component: Products, canActivate: [authGuard] },    
    { path: '**', redirectTo: '' }
];
