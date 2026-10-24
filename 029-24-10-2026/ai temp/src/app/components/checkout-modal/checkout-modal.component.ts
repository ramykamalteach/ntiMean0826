import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-checkout-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './checkout-modal.component.html',
  styleUrl: './checkout-modal.component.css'
})
export class CheckoutModalComponent {
  readonly cartService = inject(CartService);
  private readonly notificationService = inject(NotificationService);

  step: 'details' | 'payment' | 'confirmation' = 'details';

  // Form fields
  fullName = 'Clara Sterling';
  email = 'clara.sterling@artisanmail.com';
  address = '428 Timber Hill Road';
  city = 'Portland';
  postalCode = '97201';
  country = 'United States';
  deliveryMethod: 'standard' | 'express' = 'standard';
  paymentMethod: 'card' | 'escrow' = 'card';
  agreeTerms = true;

  // Generated order info
  orderTrackingCode = '';
  orderDate = '';

  goToPayment() {
    if (!this.fullName || !this.email || !this.address || !this.city) {
      this.notificationService.show('Incomplete Details', 'Please complete your shipping address.', 'warning');
      return;
    }
    this.step = 'payment';
  }

  backToDetails() {
    this.step = 'details';
  }

  completeOrder() {
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.orderTrackingCode = `MN-2026-MAK-${randomHex}`;
    this.orderDate = new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
    this.step = 'confirmation';
    this.notificationService.show('Order Dispatched to Makers', `Order #${this.orderTrackingCode} placed successfully!`, 'success');
  }

  finish() {
    this.cartService.clearCart();
    this.cartService.closeCheckout();
    this.step = 'details';
  }
}
