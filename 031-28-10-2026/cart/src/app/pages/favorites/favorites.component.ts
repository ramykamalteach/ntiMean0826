import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RecipeCardComponent } from '../../components/recipe-card/recipe-card.component';
import { RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [RouterLink, RecipeCardComponent],
  template: `
    <div class="favorites-page animate-fade">
      <div class="fav-header">
        <div>
          <h1 class="page-title">Saved Cookbook & Favorites</h1>
          <p class="page-subtitle">Your personal collection of go-to breakfasts, dinners, and chef masteries.</p>
        </div>

        <span class="badge-fav">{{ recipeService.favoriteRecipes().length }} Recipes</span>
      </div>

      <div class="recipes-grid">
        @for (recipe of recipeService.favoriteRecipes(); track recipe.id) {
          <app-recipe-card [recipe]="recipe" />
        } @empty {
          <div class="food-card empty-fav-box">
            <span class="empty-icon">❤️</span>
            <h3>No Favorite Recipes Yet</h3>
            <p>Tap the heart icon on any recipe card to save it here for instant access whenever you cook.</p>
            <a routerLink="/recipes" class="btn-primary">
              Explore Delicious Recipes
            </a>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .favorites-page {
      display: flex;
      flex-direction: column;
      gap: var(--space-lg);
    }

    .fav-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 16px;
    }

    .page-title {
      font-size: 26px;
      font-weight: 800;
    }

    .page-subtitle {
      font-size: 14px;
      color: var(--color-text-secondary);
      margin-top: 4px;
    }

    .badge-fav {
      font-size: 13px;
      font-weight: 700;
      color: var(--color-primary);
      background: var(--color-primary-light);
      padding: 6px 14px;
      border-radius: var(--radius-pill);
    }

    .recipes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
      gap: var(--space-lg);
    }

    .empty-fav-box {
      grid-column: 1 / -1;
      padding: 56px var(--space-lg);
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }

    .empty-icon {
      font-size: 48px;
    }

    .empty-fav-box h3 {
      font-size: 22px;
      font-weight: 700;
    }

    .empty-fav-box p {
      font-size: 14px;
      color: var(--color-text-secondary);
      max-width: 420px;
    }
  `]
})
export class FavoritesComponent {
  readonly recipeService = inject(RecipeService);
}
