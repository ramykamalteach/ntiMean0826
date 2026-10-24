import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MarketplaceService } from '../../services/marketplace.service';
import { CartService } from '../../services/cart.service';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  readonly marketplaceService = inject(MarketplaceService);
  readonly cartService = inject(CartService);
  readonly favoritesService = inject(FavoritesService);
  private readonly router = inject(Router);

  isMobileMenuOpen = false;
  searchInput = '';

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  onSearchSubmit() {
    this.marketplaceService.setSearchQuery(this.searchInput);
    this.router.navigate(['/']);
    this.closeMobileMenu();
  }

  clearSearch() {
    this.searchInput = '';
    this.marketplaceService.setSearchQuery('');
  }
}
