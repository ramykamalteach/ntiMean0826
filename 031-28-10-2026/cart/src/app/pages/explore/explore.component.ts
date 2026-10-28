import { Component, inject } from '@angular/core';
import { RecipeCardComponent } from '../../components/recipe-card/recipe-card.component';
import { RecipeCategory } from '../../models/recipe.model';
import { RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [RecipeCardComponent],
  template: `
    <div class="explore-page animate-fade">
      <!-- Hero Banner Section: Clean, Food-focused, Playful -->
      <section class="hero-banner">
        <div class="hero-content">
          <span class="hero-tag">
            <span class="material-symbols-outlined">skillet</span>
            Chef-Crafted Flavors
          </span>
          <h1 class="hero-heading">What are you cooking today?</h1>
          <p class="hero-desc">
            Explore hundreds of fresh, wholesome recipes designed for home cooks. From 15-minute quick noodles to authentic Italian pasta.
          </p>
        </div>

        <div class="hero-illustration">
          <div class="culinary-bubble bubble-1">
            <span class="bubble-icon">🥑</span>
            <span class="bubble-text">Fresh Produce</span>
          </div>
          <div class="culinary-bubble bubble-2">
            <span class="bubble-icon">🍝</span>
            <span class="bubble-text">Artisan Pasta</span>
          </div>
          <div class="culinary-bubble bubble-3">
            <span class="bubble-icon">🥞</span>
            <span class="bubble-text">Fluffy Bakes</span>
          </div>
        </div>
      </section>

      <!-- Category Filter Pills -->
      <section class="categories-bar">
        <div class="categories-scroll">
          @for (cat of categories; track cat) {
            <button
              class="category-pill"
              [class.active]="recipeService.selectedCategory() === cat"
              (click)="recipeService.setCategory(cat)"
            >
              {{ cat }}
            </button>
          }
        </div>
      </section>

      <!-- Search & Results Count Bar -->
      <section class="results-meta-bar">
        <div class="results-text">
          Showing <strong>{{ recipeService.filteredRecipes().length }}</strong> delicious recipes
          @if (recipeService.selectedCategory() !== 'All') {
            in <strong>{{ recipeService.selectedCategory() }}</strong>
          }
          @if (recipeService.searchQuery()) {
            matching "<em>{{ recipeService.searchQuery() }}</em>"
          }
        </div>

        @if (recipeService.searchQuery() || recipeService.selectedCategory() !== 'All') {
          <button class="btn-outline btn-sm" (click)="resetFilters()">
            <span class="material-symbols-outlined">restart_alt</span>
            Reset Filters
          </button>
        }
      </section>

      <!-- Recipes Grid -->
      <section class="recipes-grid">
        @for (recipe of recipeService.filteredRecipes(); track recipe.id) {
          <app-recipe-card [recipe]="recipe" />
        } @empty {
          <div class="empty-state food-card">
            <div class="empty-icon">🍳</div>
            <h3>No recipes found</h3>
            <p>We couldn't find any recipes matching your current search or category filter.</p>
            <button class="btn-primary" (click)="resetFilters()">
              Clear Filters
            </button>
          </div>
        }
      </section>
    </div>
  `,
  styles: [`
    .explore-page {
      display: flex;
      flex-direction: column;
      gap: var(--space-lg);
    }

    /* Hero Banner */
    .hero-banner {
      background: linear-gradient(135deg, #FFF6F0 0%, #FFFFFF 100%);
      border: 1px solid rgba(255, 107, 0, 0.15);
      border-radius: var(--radius-card);
      padding: var(--space-xl);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-lg);
      position: relative;
      overflow: hidden;
      box-shadow: var(--shadow-card);
    }

    .hero-content {
      max-width: 600px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      z-index: 2;
    }

    .hero-tag {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: var(--color-primary-light);
      color: var(--color-primary);
      padding: 6px 14px;
      border-radius: var(--radius-pill);
      font-size: 13px;
      font-weight: 700;
      width: fit-content;
    }

    .hero-heading {
      font-size: 34px;
      font-weight: 800;
      line-height: 1.15;
      color: var(--color-text-primary);
    }

    .hero-desc {
      font-size: 15px;
      color: var(--color-text-secondary);
      line-height: 1.6;
    }

    .hero-illustration {
      display: flex;
      flex-direction: column;
      gap: 12px;
      position: relative;
      min-width: 200px;
    }

    .culinary-bubble {
      display: flex;
      align-items: center;
      gap: 10px;
      background: #FFFFFF;
      padding: 10px 18px;
      border-radius: var(--radius-pill);
      box-shadow: var(--shadow-soft);
      border: 1px solid var(--color-border);
      font-weight: 600;
      font-size: 13px;
      animation: float 4s ease-in-out infinite alternate;
    }

    .bubble-1 { animation-delay: 0s; transform: rotate(-2deg); }
    .bubble-2 { animation-delay: 1s; margin-left: 20px; transform: rotate(1deg); }
    .bubble-3 { animation-delay: 2s; transform: rotate(-1deg); }

    @keyframes float {
      0% { transform: translateY(0px) rotate(-1deg); }
      100% { transform: translateY(-8px) rotate(1deg); }
    }

    .bubble-icon {
      font-size: 20px;
    }

    @media (max-width: 820px) {
      .hero-banner {
        flex-direction: column;
        align-items: flex-start;
        padding: var(--space-lg);
      }
      .hero-illustration {
        display: none;
      }
      .hero-heading {
        font-size: 28px;
      }
    }

    /* Categories Bar */
    .categories-bar {
      overflow-x: auto;
      padding-bottom: 4px;
    }

    .categories-scroll {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: max-content;
    }

    /* Results Meta */
    .results-meta-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
    }

    .results-text {
      font-size: 14px;
      color: var(--color-text-secondary);
    }

    .btn-sm {
      padding: 6px 14px;
      font-size: 13px;
    }

    /* Grid */
    .recipes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
      gap: var(--space-lg);
    }

    .empty-state {
      grid-column: 1 / -1;
      padding: 48px var(--space-lg);
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 14px;
    }

    .empty-icon {
      font-size: 48px;
    }

    .empty-state h3 {
      font-size: 20px;
      font-weight: 700;
    }

    .empty-state p {
      color: var(--color-text-secondary);
      max-width: 400px;
      font-size: 14px;
    }
  `]
})
export class ExploreComponent {
  readonly recipeService = inject(RecipeService);

  readonly categories: RecipeCategory[] = [
    'All',
    'Breakfast',
    'Italian',
    'Asian',
    'Healthy',
    'Mexican',
    'Desserts',
    '15-Min Quick'
  ];

  resetFilters(): void {
    this.recipeService.setCategory('All');
    this.recipeService.setSearchQuery('');
  }
}
