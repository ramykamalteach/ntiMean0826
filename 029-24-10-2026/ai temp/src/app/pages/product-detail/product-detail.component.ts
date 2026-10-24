import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MarketplaceService } from '../../services/marketplace.service';
import { CartService } from '../../services/cart.service';
import { FavoritesService } from '../../services/favorites.service';
import { NotificationService } from '../../services/notification.service';
import { InquiryService } from '../../services/inquiry.service';
import { Product } from '../../models/marketplace.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  readonly marketplaceService = inject(MarketplaceService);
  readonly cartService = inject(CartService);
  readonly favoritesService = inject(FavoritesService);
  private readonly notificationService = inject(NotificationService);
  readonly inquiryService = inject(InquiryService);

  product = signal<Product | undefined>(undefined);
  selectedImageIndex = signal<number>(0);
  selectedVariant = signal<string>('');
  quantity = signal<number>(1);
  makerNote = signal<string>('');
  isNoteOpen = signal<boolean>(false);

  // New review form simulation
  newReviewAuthor = '';
  newReviewComment = '';
  newReviewRating = 5;
  showReviewForm = false;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        const found = this.marketplaceService.getProductById(id);
        this.product.set(found);
        this.selectedImageIndex.set(0);
        this.quantity.set(1);
        if (found?.variants && found.variants.options.length > 0) {
          this.selectedVariant.set(found.variants.options[0]);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  selectImage(index: number) {
    this.selectedImageIndex.set(index);
  }

  selectVariant(option: string) {
    this.selectedVariant.set(option);
  }

  updateQuantity(delta: number) {
    this.quantity.update(q => Math.max(1, q + delta));
  }

  toggleNote() {
    this.isNoteOpen.update(v => !v);
  }

  addToBasket() {
    const prod = this.product();
    if (!prod) return;

    this.cartService.addToCart(
      prod,
      this.quantity(),
      this.selectedVariant() || undefined,
      this.makerNote() || undefined
    );

    this.notificationService.show(
      'Added to Basket',
      `"${prod.title}" (${this.quantity()}x) added to your artisan basket.`,
      'success'
    );
  }

  toggleFavorite() {
    const prod = this.product();
    if (!prod) return;
    const isNow = this.favoritesService.toggleFavorite(prod.id);
    this.notificationService.show(
      isNow ? 'Saved to Favorites' : 'Removed from Favorites',
      `"${prod.title}"`,
      'info'
    );
  }

  openInquiry() {
    const prod = this.product();
    if (prod) {
      this.inquiryService.openInquiry(prod.artisan, prod);
    }
  }

  submitReview() {
    if (!this.newReviewAuthor || !this.newReviewComment) {
      this.notificationService.show('Review Required', 'Please enter your name and comment.', 'warning');
      return;
    }
    const prod = this.product();
    if (!prod) return;

    const newRev = {
      id: 'rev_' + Date.now(),
      author: this.newReviewAuthor,
      location: 'Community Member',
      date: 'Just now',
      rating: this.newReviewRating,
      comment: this.newReviewComment,
      verifiedPurchase: true
    };

    if (!prod.reviews) prod.reviews = [];
    prod.reviews.unshift(newRev);
    prod.reviewCount += 1;

    this.notificationService.show(
      'Review Shared',
      'Thank you for supporting independent makers with your authentic feedback.',
      'success'
    );

    this.newReviewAuthor = '';
    this.newReviewComment = '';
    this.showReviewForm = false;
  }
}
