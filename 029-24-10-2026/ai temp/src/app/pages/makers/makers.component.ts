import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MarketplaceService } from '../../services/marketplace.service';
import { InquiryService } from '../../services/inquiry.service';
import { Artisan } from '../../models/marketplace.model';

@Component({
  selector: 'app-makers',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './makers.component.html',
  styleUrl: './makers.component.css'
})
export class MakersComponent {
  readonly marketplaceService = inject(MarketplaceService);
  readonly inquiryService = inject(InquiryService);

  selectedCountry = signal<string>('All');

  readonly countries = ['All', 'Mexico', 'Sweden', 'Japan', 'Ireland', 'France', 'Scotland'];

  readonly filteredArtisans = computed(() => {
    const list = this.marketplaceService.getAllArtisans();
    const c = this.selectedCountry();
    if (c === 'All') return list;
    return list.filter(a => a.country.toLowerCase() === c.toLowerCase());
  });

  getArtisanCreations(artisanId: string) {
    return this.marketplaceService.getProductsByArtisan(artisanId);
  }

  filterByCountry(country: string) {
    this.selectedCountry.set(country);
  }

  openArtisanInquiry(artisan: Artisan) {
    this.inquiryService.openInquiry(artisan);
  }
}
