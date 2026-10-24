import { Injectable, signal, computed } from '@angular/core';
import { CartItem, Product } from '../models/marketplace.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly STORAGE_KEY = 'marketnest_cart';

  readonly cartItems = signal<CartItem[]>(this.loadCartFromStorage());
  readonly isCartOpen = signal<boolean>(false);
  readonly isCheckoutModalOpen = signal<boolean>(false);

  readonly itemCount = computed(() => {
    return this.cartItems().reduce((sum, item) => sum + item.quantity, 0);
  });

  readonly subtotal = computed(() => {
    return this.cartItems().reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  });

  // Direct-to-maker metric: 90% goes straight to the independent artisan
  readonly makerDirectContribution = computed(() => {
    return Math.round(this.subtotal() * 0.90);
  });

  readonly shippingEstimate = computed(() => {
    const total = this.subtotal();
    if (total === 0) return 0;
    return total >= 150 ? 0 : 12;
  });

  readonly orderTotal = computed(() => {
    return this.subtotal() + this.shippingEstimate();
  });

  addToCart(product: Product, quantity: number = 1, selectedVariant?: string, noteToMaker?: string) {
    this.cartItems.update(items => {
      const existingIndex = items.findIndex(
        i => i.product.id === product.id && i.selectedVariant === selectedVariant
      );

      if (existingIndex > -1) {
        const updated = [...items];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
          noteToMaker: noteToMaker ?? updated[existingIndex].noteToMaker
        };
        this.saveCartToStorage(updated);
        return updated;
      } else {
        const newItem: CartItem = {
          product,
          quantity,
          selectedVariant: selectedVariant ?? (product.variants?.options[0]),
          noteToMaker: noteToMaker ?? ''
        };
        const updated = [...items, newItem];
        this.saveCartToStorage(updated);
        return updated;
      }
    });

    this.openCart();
  }

  removeFromCart(productId: string, variant?: string) {
    this.cartItems.update(items => {
      const updated = items.filter(
        i => !(i.product.id === productId && (!variant || i.selectedVariant === variant))
      );
      this.saveCartToStorage(updated);
      return updated;
    });
  }

  updateQuantity(productId: string, delta: number, variant?: string) {
    this.cartItems.update(items => {
      const updated = items.map(i => {
        if (i.product.id === productId && (!variant || i.selectedVariant === variant)) {
          const newQty = Math.max(1, i.quantity + delta);
          return { ...i, quantity: newQty };
        }
        return i;
      });
      this.saveCartToStorage(updated);
      return updated;
    });
  }

  updateNote(productId: string, note: string, variant?: string) {
    this.cartItems.update(items => {
      const updated = items.map(i => {
        if (i.product.id === productId && (!variant || i.selectedVariant === variant)) {
          return { ...i, noteToMaker: note };
        }
        return i;
      });
      this.saveCartToStorage(updated);
      return updated;
    });
  }

  toggleCart() {
    this.isCartOpen.update(v => !v);
  }

  openCart() {
    this.isCartOpen.set(true);
  }

  closeCart() {
    this.isCartOpen.set(false);
  }

  openCheckout() {
    this.isCartOpen.set(false);
    this.isCheckoutModalOpen.set(true);
  }

  closeCheckout() {
    this.isCheckoutModalOpen.set(false);
  }

  clearCart() {
    this.cartItems.set([]);
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  private loadCartFromStorage(): CartItem[] {
    if (typeof localStorage === 'undefined') return [];
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveCartToStorage(items: CartItem[]) {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to persist cart:', e);
    }
  }
}
