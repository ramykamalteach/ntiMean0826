import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FavoritesService } from '../../services/favorites.service';
import { MarketplaceService } from '../../services/marketplace.service';
import { CartService } from '../../services/cart.service';
import { NotificationService } from '../../services/notification.service';
import { Product } from '../../models/marketplace.model';

@Component({
  selector: 'app-favorites-drawer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './favorites-drawer.component.html',
  styleUrl: './favorites-drawer.component.css'
})
export class FavoritesDrawerComponent {
  readonly favoritesService = inject(FavoritesService);
  private readonly marketplaceService = inject(MarketplaceService);
  private readonly cartService = inject(CartService);
  private readonly notificationService = inject(NotificationService);

  readonly favoriteProducts = computed(() => {
    const ids = this.favoritesService.favoriteIds();
    const all = this.marketplaceService.getAllProducts();
    return all.filter(p => ids.includes(p.id));
  });

  moveToCart(product: Product) {
    this.cartService.addToCart(product, 1);
    this.favoritesService.closeDrawer();
    this.notificationService.show('Moved to Basket', `"${product.title}" is in your artisan basket.`, 'success');
  }

  removeFavorite(productId: string) {
    this.favoritesService.toggleFavorite(productId);
  }
}
