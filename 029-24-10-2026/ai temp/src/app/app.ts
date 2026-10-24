import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { CartDrawerComponent } from './components/cart-drawer/cart-drawer.component';
import { FavoritesDrawerComponent } from './components/favorites-drawer/favorites-drawer.component';
import { CheckoutModalComponent } from './components/checkout-modal/checkout-modal.component';
import { InquiryModalComponent } from './components/inquiry-modal/inquiry-modal.component';
import { ToastComponent } from './components/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    CartDrawerComponent,
    FavoritesDrawerComponent,
    CheckoutModalComponent,
    InquiryModalComponent,
    ToastComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
