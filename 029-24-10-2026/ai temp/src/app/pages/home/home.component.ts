import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MarketplaceService } from '../../services/marketplace.service';
import { CartService } from '../../services/cart.service';
import { FavoritesService } from '../../services/favorites.service';
import { NotificationService } from '../../services/notification.service';
import { InquiryService } from '../../services/inquiry.service';
import { Product, Artisan } from '../../models/marketplace.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  readonly marketplaceService = inject(MarketplaceService);
  readonly cartService = inject(CartService);
  readonly favoritesService = inject(FavoritesService);
  private readonly notificationService = inject(NotificationService);
  readonly inquiryService = inject(InquiryService);

  readonly categories = [
    { label: 'All Crafts', value: 'All' },
    { label: 'Ceramics & Stoneware', value: 'Ceramics' },
    { label: 'Handwoven Textiles', value: 'Textiles' },
    { label: 'Woodwork & Carvings', value: 'Woodwork' },
    { label: 'Heritage Leather', value: 'Leather' },
    { label: 'Wild Botanical Candles', value: 'Candles' },
    { label: 'Hand-Forged Jewelry', value: 'Jewelry' }
  ];

  readonly materials = [
    { label: 'All Materials', value: 'All' },
    { label: 'Wild Clay', value: 'Clay' },
    { label: 'Småland Oak', value: 'Oak' },
    { label: 'Indigo Linen', value: 'Linen' },
    { label: 'Bark Leather', value: 'Bark' },
    { label: 'Beeswax', value: 'Beeswax' },
    { label: 'Recycled Brass', value: 'Brass' }
  ];

  onSelectCategory(cat: string) {
    this.marketplaceService.setCategory(cat);
  }

  onSelectMaterial(mat: string) {
    this.marketplaceService.setMaterial(mat);
  }

  onSortChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value as 'default' | 'low-high' | 'high-low';
    this.marketplaceService.setPriceSort(value);
  }

  toggleFavorite(product: Product, event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    const isNowFav = this.favoritesService.toggleFavorite(product.id);
    if (isNowFav) {
      this.notificationService.show('Saved to Favorites', `"${product.title}" saved.`, 'info', 2500);
    } else {
      this.notificationService.show('Removed', `"${product.title}" removed from favorites.`, 'info', 2000);
    }
  }

  quickAddToCart(product: Product, event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.cartService.addToCart(product, 1);
    this.notificationService.show(
      'Added to Basket',
      `"${product.title}" by ${product.artisan.name} is in your basket.`,
      'success'
    );
  }

  openMakerInquiry(artisan: Artisan, product: Product, event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.inquiryService.openInquiry(artisan, product);
  }
}
