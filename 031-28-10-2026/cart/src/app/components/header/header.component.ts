import { Component, inject, output, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RecipeService } from '../../services/recipe.service';
import { GroceryService } from '../../services/grocery.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule],
  template: `
    <header class="cooking-header">
      <div class="header-inner">
        <!-- Brand Logo -->
        <a routerLink="/" class="brand-link">
          <div class="brand-icon">
            <span class="material-symbols-outlined">restaurant</span>
          </div>
          <div class="brand-text">
            <span class="brand-name">CookCraft</span>
            <span class="brand-tag">Food & Recipes</span>
          </div>
        </a>

        <!-- Desktop Navigation Links -->
        <nav class="nav-links">
          <a routerLink="/recipes" routerLinkActive="active" class="nav-item">
            <span class="material-symbols-outlined">menu_book</span>
            <span>Explore</span>
          </a>
          <a routerLink="/planner" routerLinkActive="active" class="nav-item">
            <span class="material-symbols-outlined">calendar_today</span>
            <span>Meal Planner</span>
          </a>
          <a routerLink="/groceries" routerLinkActive="active" class="nav-item">
            <span class="material-symbols-outlined">shopping_basket</span>
            <span>Grocery List</span>
            @if (groceryService.remainingCount() > 0) {
              <span class="nav-counter">{{ groceryService.remainingCount() }}</span>
            }
          </a>
          <a routerLink="/favorites" routerLinkActive="active" class="nav-item">
            <span class="material-symbols-outlined">favorite</span>
            <span>Favorites</span>
            @if (recipeService.favoriteRecipes().length > 0) {
              <span class="nav-counter heart-counter">{{ recipeService.favoriteRecipes().length }}</span>
            }
          </a>
        </nav>

        <!-- Right Side: Search & CTA Button -->
        <div class="header-actions">
          <div class="search-wrap">
            <span class="material-symbols-outlined search-icon">search</span>
            <input
              type="text"
              placeholder="Search recipes, ingredients..."
              [ngModel]="recipeService.searchQuery()"
              (ngModelChange)="recipeService.setSearchQuery($event)"
              class="search-input"
            />
            @if (recipeService.searchQuery()) {
              <button class="clear-search-btn" (click)="recipeService.setSearchQuery('')">
                <span class="material-symbols-outlined">close</span>
              </button>
            }
          </div>

          <!-- Button Component from DESIGN.md:
               - Rounded corners: 12px
               - Orange background: #FF6B00
               - White text: #FFFFFF
               - Medium weight
          -->
          <button class="btn-primary" (click)="openAddModal.emit()">
            <span class="material-symbols-outlined">add</span>
            <span>Add Recipe</span>
          </button>

          <!-- Mobile Menu Button -->
          <button class="mobile-toggle btn-icon" (click)="toggleMobileMenu()" aria-label="Toggle Navigation">
            <span class="material-symbols-outlined">{{ mobileMenuOpen() ? 'close' : 'menu' }}</span>
          </button>
        </div>
      </div>

      <!-- Mobile Dropdown Navigation -->
      @if (mobileMenuOpen()) {
        <div class="mobile-menu animate-fade">
          <a routerLink="/recipes" (click)="mobileMenuOpen.set(false)" class="mobile-nav-link">
            <span class="material-symbols-outlined">menu_book</span>
            <span>Explore Recipes</span>
          </a>
          <a routerLink="/planner" (click)="mobileMenuOpen.set(false)" class="mobile-nav-link">
            <span class="material-symbols-outlined">calendar_today</span>
            <span>Meal Planner</span>
          </a>
          <a routerLink="/groceries" (click)="mobileMenuOpen.set(false)" class="mobile-nav-link">
            <span class="material-symbols-outlined">shopping_basket</span>
            <span>Grocery List ({{ groceryService.remainingCount() }})</span>
          </a>
          <a routerLink="/favorites" (click)="mobileMenuOpen.set(false)" class="mobile-nav-link">
            <span class="material-symbols-outlined">favorite</span>
            <span>Favorites ({{ recipeService.favoriteRecipes().length }})</span>
          </a>
        </div>
      }
    </header>
  `,
  styles: [`
    .cooking-header {
      background: var(--color-bg);
      border-bottom: 1px solid var(--color-border);
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
    }

    .header-inner {
      max-width: 1280px;
      margin: 0 auto;
      height: 74px;
      padding: 0 var(--space-lg);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-md);
    }

    .brand-link {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      color: inherit;
    }

    .brand-icon {
      width: 42px;
      height: 42px;
      border-radius: var(--radius-button);
      background: var(--color-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #FFFFFF;
      box-shadow: 0 4px 12px rgba(255, 107, 0, 0.3);
    }

    .brand-icon .material-symbols-outlined {
      font-size: 24px;
    }

    .brand-text {
      display: flex;
      flex-direction: column;
    }

    .brand-name {
      font-family: 'Outfit', sans-serif;
      font-size: 20px;
      font-weight: 800;
      letter-spacing: -0.03em;
      line-height: 1.1;
      color: var(--color-secondary);
    }

    .brand-tag {
      font-size: 11px;
      font-weight: 600;
      color: var(--color-primary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .nav-item {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      border-radius: var(--radius-button);
      color: var(--color-text-secondary);
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      transition: all var(--transition-fast);
      position: relative;
    }

    .nav-item:hover {
      color: var(--color-primary);
      background: var(--color-primary-light);
    }

    .nav-item.active {
      color: var(--color-primary);
      background: var(--color-primary-light);
      font-weight: 600;
    }

    .nav-counter {
      background: var(--color-secondary);
      color: #FFFFFF;
      font-size: 11px;
      font-weight: 700;
      padding: 1px 6px;
      border-radius: var(--radius-pill);
    }

    .heart-counter {
      background: var(--color-primary);
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .search-wrap {
      position: relative;
      display: flex;
      align-items: center;
      width: 240px;
    }

    .search-icon {
      position: absolute;
      left: 12px;
      color: var(--color-text-muted);
      pointer-events: none;
      font-size: 18px;
    }

    .search-input {
      width: 100%;
      height: 42px;
      padding: 0 32px 0 38px;
      border-radius: var(--radius-button);
      border: 1px solid var(--color-border);
      background: var(--color-bg-subtle);
      font-size: 13.5px;
      outline: none;
      transition: all var(--transition-fast);
    }

    .search-input:focus {
      border-color: var(--color-primary);
      background: #FFFFFF;
      box-shadow: 0 0 0 3px rgba(255, 107, 0, 0.15);
    }

    .clear-search-btn {
      position: absolute;
      right: 8px;
      color: var(--color-text-muted);
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .mobile-toggle {
      display: none;
    }

    .mobile-menu {
      display: none;
      padding: 16px 24px;
      background: #FFFFFF;
      border-top: 1px solid var(--color-border);
      flex-direction: column;
      gap: 12px;
    }

    .mobile-nav-link {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 14px;
      border-radius: var(--radius-button);
      color: var(--color-text-primary);
      text-decoration: none;
      font-weight: 500;
    }

    .mobile-nav-link:hover {
      background: var(--color-primary-light);
      color: var(--color-primary);
    }

    @media (max-width: 990px) {
      .nav-links {
        display: none;
      }
      .mobile-toggle {
        display: inline-flex;
      }
      .mobile-menu {
        display: flex;
      }
      .search-wrap {
        width: 180px;
      }
    }

    @media (max-width: 640px) {
      .search-wrap {
        display: none;
      }
      .header-inner {
        padding: 0 16px;
      }
    }
  `]
})
export class HeaderComponent {
  readonly openAddModal = output<void>();

  readonly recipeService = inject(RecipeService);
  readonly groceryService = inject(GroceryService);

  readonly mobileMenuOpen = signal(false);

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }
}
