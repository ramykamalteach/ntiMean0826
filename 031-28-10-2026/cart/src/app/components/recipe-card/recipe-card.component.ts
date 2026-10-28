import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Recipe } from '../../models/recipe.model';
import { RecipeService } from '../../services/recipe.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  imports: [RouterLink],
  template: `
    <article class="food-card recipe-card-wrap">
      <!-- Recipe Image & Badges -->
      <div class="card-media">
        <a [routerLink]="['/recipe', recipe().id]" class="media-link" aria-label="View recipe details">
          <img [src]="recipe().image" [alt]="recipe().title" loading="lazy" class="dish-image" />
        </a>
        <div class="category-badge">{{ recipe().category }}</div>
        <button
          class="favorite-toggle"
          [class.favorited]="recipe().isFavorite"
          (click)="onToggleFavorite($event)"
          [title]="recipe().isFavorite ? 'Remove from favorites' : 'Save to favorites'"
          aria-label="Toggle favorite"
        >
          <span class="material-symbols-outlined heart-icon">
            {{ recipe().isFavorite ? 'favorite' : 'favorite_border' }}
          </span>
        </button>
      </div>

      <!-- Card Body Content -->
      <div class="card-content">
        <!-- Quick Meta Row (Time, Difficulty, Calories) -->
        <div class="meta-row">
          <div class="meta-chip">
            <span class="material-symbols-outlined">schedule</span>
            <span>{{ recipe().cookTime }}</span>
          </div>
          <span class="meta-dot">&bull;</span>
          <div class="meta-chip">
            <span class="material-symbols-outlined">local_fire_department</span>
            <span>{{ recipe().calories }} kcal</span>
          </div>
          <span class="meta-dot">&bull;</span>
          <div class="difficulty-tag">{{ recipe().difficulty }}</div>
        </div>

        <!-- Recipe Title & Description -->
        <h3 class="recipe-title">
          <a [routerLink]="['/recipe', recipe().id]">{{ recipe().title }}</a>
        </h3>
        <p class="recipe-desc">{{ recipe().description }}</p>

        <!-- Footer: Chef & Rating -->
        <div class="card-footer">
          <div class="chef-info">
            <img [src]="recipe().chef.avatar" [alt]="recipe().chef.name" class="chef-avatar" />
            <span class="chef-name">{{ recipe().chef.name }}</span>
          </div>

          <div class="rating-badge">
            <span class="material-symbols-outlined star-icon">star</span>
            <strong>{{ recipe().rating }}</strong>
            <span class="reviews-count">({{ recipe().reviewsCount }})</span>
          </div>
        </div>
      </div>
    </article>
  `,
  styles: [`
    .recipe-card-wrap {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: var(--color-surface);
      border-radius: var(--radius-card);
      box-shadow: var(--shadow-soft);
      border: 1px solid var(--color-border);
      transition: all var(--transition-normal);
      overflow: hidden;
    }

    .recipe-card-wrap:hover {
      box-shadow: var(--shadow-hover);
      transform: translateY(-4px);
      border-color: rgba(255, 107, 0, 0.3);
    }

    .card-media {
      position: relative;
      width: 100%;
      height: 200px;
      overflow: hidden;
      background: #F0F0F0;
    }

    .media-link {
      display: block;
      width: 100%;
      height: 100%;
    }

    .dish-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }

    .recipe-card-wrap:hover .dish-image {
      transform: scale(1.05);
    }

    .category-badge {
      position: absolute;
      top: 12px;
      left: 12px;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(4px);
      color: #FFFFFF;
      font-size: 11.5px;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: var(--radius-pill);
      letter-spacing: 0.3px;
    }

    .favorite-toggle {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: #FFFFFF;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-text-secondary);
      transition: all var(--transition-fast);
    }

    .favorite-toggle:hover {
      transform: scale(1.1);
      color: var(--color-primary);
    }

    .favorite-toggle.favorited {
      color: #FF3B30;
      background: #FFFFFF;
    }

    .favorite-toggle.favorited .heart-icon {
      font-variation-settings: 'FILL' 1;
    }

    .card-content {
      padding: 16px;
      display: flex;
      flex-direction: column;
      flex: 1;
      gap: 10px;
    }

    .meta-row {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: var(--color-text-secondary);
    }

    .meta-chip {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .meta-chip .material-symbols-outlined {
      font-size: 15px;
      color: var(--color-primary);
    }

    .meta-dot {
      color: var(--color-text-muted);
    }

    .difficulty-tag {
      font-weight: 600;
      color: var(--color-primary);
      background: var(--color-primary-light);
      padding: 2px 8px;
      border-radius: var(--radius-pill);
      font-size: 11px;
    }

    .recipe-title {
      font-size: 17px;
      font-weight: 700;
      line-height: 1.3;
    }

    .recipe-title a {
      color: var(--color-text-primary);
      text-decoration: none;
      transition: color var(--transition-fast);
    }

    .recipe-title a:hover {
      color: var(--color-primary);
    }

    .recipe-desc {
      font-size: 13px;
      color: var(--color-text-secondary);
      line-height: 1.45;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      flex: 1;
    }

    .card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 12px;
      margin-top: 4px;
      border-top: 1px solid var(--color-border);
    }

    .chef-info {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .chef-avatar {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      object-fit: cover;
    }

    .chef-name {
      font-size: 12px;
      color: var(--color-text-secondary);
      font-weight: 500;
    }

    .rating-badge {
      display: flex;
      align-items: center;
      gap: 3px;
      font-size: 12.5px;
      color: var(--color-text-primary);
    }

    .star-icon {
      color: var(--color-star);
      font-size: 17px;
      font-variation-settings: 'FILL' 1;
    }

    .reviews-count {
      color: var(--color-text-muted);
      font-size: 11px;
    }
  `]
})
export class RecipeCardComponent {
  readonly recipe = input.required<Recipe>();

  readonly recipeService = inject(RecipeService);
  readonly toastService = inject(ToastService);

  onToggleFavorite(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();
    const isNowFav = this.recipeService.toggleFavorite(this.recipe().id);
    this.toastService.show(
      isNowFav ? `"${this.recipe().title}" added to your Favorites! ❤️` : `Removed from Favorites`,
      isNowFav ? 'success' : 'info'
    );
  }
}
