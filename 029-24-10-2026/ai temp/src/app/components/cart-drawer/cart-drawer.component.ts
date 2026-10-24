import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './cart-drawer.component.html',
  styleUrl: './cart-drawer.component.css'
})
export class CartDrawerComponent {
  readonly cartService = inject(CartService);
  private readonly notificationService = inject(NotificationService);

  activeNoteIndex: number | null = null;

  toggleNote(index: number) {
    this.activeNoteIndex = this.activeNoteIndex === index ? null : index;
  }

  saveNote(productId: string, note: string, variant?: string) {
    this.cartService.updateNote(productId, note, variant);
    this.notificationService.show('Note Attached', 'Your note has been saved for the artisan.', 'info', 2500);
  }

  removeItem(productId: string, title: string, variant?: string) {
    this.cartService.removeFromCart(productId, variant);
    this.notificationService.show('Item Removed', `"${title}" was removed from your basket.`, 'info');
  }

  onCheckout() {
    this.cartService.openCheckout();
  }
}
