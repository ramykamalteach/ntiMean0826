import { Injectable, signal } from '@angular/core';
import { Artisan, Product } from '../models/marketplace.model';

@Injectable({
  providedIn: 'root'
})
export class InquiryService {
  readonly isInquiryOpen = signal<boolean>(false);
  readonly activeArtisan = signal<Artisan | null>(null);
  readonly activeProduct = signal<Product | null>(null);

  openInquiry(artisan: Artisan, product?: Product) {
    this.activeArtisan.set(artisan);
    this.activeProduct.set(product ?? null);
    this.isInquiryOpen.set(true);
  }

  closeInquiry() {
    this.isInquiryOpen.set(false);
    this.activeArtisan.set(null);
    this.activeProduct.set(null);
  }
}
