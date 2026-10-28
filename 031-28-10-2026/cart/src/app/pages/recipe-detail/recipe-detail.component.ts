import { Component, inject, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { GroceryService } from '../../services/grocery.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (recipe(); as currentRecipe) {
      <div class="recipe-detail-page animate-fade">
        <!-- Navigation Breadcrumbs -->
        <nav class="breadcrumb-row">
          <a routerLink="/recipes" class="back-link">
            <span class="material-symbols-outlined">arrow_back</span>
            <span>Back to All Recipes</span>
          </a>
          <span class="crumb-separator">/</span>
          <span class="crumb-current">{{ currentRecipe.category }}</span>
        </nav>

        <!-- Hero Section: Culinary Image + Key Info -->
        <div class="detail-hero-grid">
          <div class="hero-image-wrap food-card">
            <img [src]="currentRecipe.image" [alt]="currentRecipe.title" class="recipe-hero-img" />
            <div class="hero-overlay-tags">
              <span class="category-tag">{{ currentRecipe.category }}</span>
              <span class="difficulty-tag">{{ currentRecipe.difficulty }}</span>
            </div>
          </div>

          <div class="hero-meta-card food-card">
            <div class="title-action-row">
              <h1 class="detail-title">{{ currentRecipe.title }}</h1>
              <button
                class="favorite-circle-btn"
                [class.active]="currentRecipe.isFavorite"
                (click)="toggleFav(currentRecipe.id)"
                aria-label="Save to favorites"
              >
                <span class="material-symbols-outlined heart-icon">
                  {{ currentRecipe.isFavorite ? 'favorite' : 'favorite_border' }}
                </span>
              </button>
            </div>

            <p class="detail-desc">{{ currentRecipe.description }}</p>

            <!-- Chef Attribution -->
            <div class="chef-strip">
              <img [src]="currentRecipe.chef.avatar" [alt]="currentRecipe.chef.name" class="chef-avatar-lg" />
              <div>
                <span class="chef-role">Recipe Crafted by</span>
                <strong class="chef-full-name">{{ currentRecipe.chef.name }}</strong>
              </div>
              <div class="rating-strip">
                <span class="material-symbols-outlined star-icon">star</span>
                <strong>{{ currentRecipe.rating }}</strong>
                <span class="reviews-count">({{ currentRecipe.reviewsCount }} reviews)</span>
              </div>
            </div>

            <!-- Stats Matrix -->
            <div class="stats-matrix">
              <div class="matrix-box">
                <span class="material-symbols-outlined stat-icon">timer</span>
                <span class="stat-value">{{ currentRecipe.prepTime }}</span>
                <span class="stat-label">Prep Time</span>
              </div>
              <div class="matrix-box">
                <span class="material-symbols-outlined stat-icon">skillet</span>
                <span class="stat-value">{{ currentRecipe.cookTime }}</span>
                <span class="stat-label">Cook Time</span>
              </div>
              <div class="matrix-box">
                <span class="material-symbols-outlined stat-icon">group</span>
                <span class="stat-value">{{ currentRecipe.servings }} Servings</span>
                <span class="stat-label">Portion Size</span>
              </div>
              <div class="matrix-box">
                <span class="material-symbols-outlined stat-icon">local_fire_department</span>
                <span class="stat-value">{{ currentRecipe.calories }}</span>
                <span class="stat-label">Calories</span>
              </div>
            </div>

            <!-- Quick Action: Add all ingredients to grocery list -->
            <div class="hero-action-buttons">
              <!-- Button Component from DESIGN.md:
                   - Rounded corners: 12px
                   - Orange background: #FF6B00
                   - White text: #FFFFFF
              -->
              <button class="btn-primary" (click)="addAllToGroceries(currentRecipe)">
                <span class="material-symbols-outlined">add_shopping_cart</span>
                <span>Add Ingredients to Grocery List</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Recipe Content Columns: Ingredients + Cooking Steps -->
        <div class="recipe-content-grid">
          <!-- Ingredients Column -->
          <div class="ingredients-column">
            <div class="food-card section-card">
              <div class="section-card-header">
                <div class="header-left">
                  <span class="material-symbols-outlined header-icon">egg_alt</span>
                  <h2 class="section-title">Ingredients</h2>
                </div>
                <span class="badge-count">{{ currentRecipe.ingredients.length }} items</span>
              </div>
              <p class="section-tip">Tap any ingredient to cross it off as you gather supplies:</p>

              <div class="ingredients-list">
                @for (ing of currentRecipe.ingredients; track ing.name) {
                  <div
                    class="ingredient-item"
                    [class.checked]="ing.checked"
                    (click)="recipeService.toggleIngredientChecked(currentRecipe.id, ing.name)"
                  >
                    <span class="material-symbols-outlined check-box-icon">
                      {{ ing.checked ? 'check_box' : 'check_box_outline_blank' }}
                    </span>
                    <div class="ing-details">
                      <span class="ing-name">{{ ing.name }}</span>
                      <span class="ing-category">{{ ing.category }}</span>
                    </div>
                    <span class="ing-amount">{{ ing.amount }}</span>
                  </div>
                }
              </div>
            </div>

            <!-- Nutrition Highlights Card -->
            <div class="food-card nutrition-card">
              <h3 class="nutrition-title">Nutritional Breakdown</h3>
              <div class="nutrition-grid">
                <div class="nutri-pill">
                  <span class="nutri-num">{{ currentRecipe.calories }}</span>
                  <span class="nutri-name">Calories</span>
                </div>
                <div class="nutri-pill">
                  <span class="nutri-num">24g</span>
                  <span class="nutri-name">Protein</span>
                </div>
                <div class="nutri-pill">
                  <span class="nutri-num">48g</span>
                  <span class="nutri-name">Carbs</span>
                </div>
                <div class="nutri-pill">
                  <span class="nutri-num">16g</span>
                  <span class="nutri-name">Fats</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Cooking Steps Column -->
          <div class="steps-column">
            <div class="food-card section-card">
              <div class="section-card-header">
                <div class="header-left">
                  <span class="material-symbols-outlined header-icon">menu_book</span>
                  <h2 class="section-title">Cooking Method</h2>
                </div>
                <span class="badge-count">{{ currentRecipe.steps.length }} Steps</span>
              </div>

              <div class="steps-list">
                @for (step of currentRecipe.steps; track step.stepNumber) {
                  <div class="step-card" [class.step-completed]="step.completed">
                    <div class="step-top">
                      <div class="step-number-badge">
                        Step {{ step.stepNumber }}
                      </div>
                      @if (step.timerMinutes) {
                        <div class="step-timer">
                          <span class="material-symbols-outlined">timer</span>
                          <span>{{ step.timerMinutes }} mins</span>
                        </div>
                      }
                      <button
                        class="step-check-btn"
                        (click)="recipeService.toggleStepComplete(currentRecipe.id, step.stepNumber)"
                        [title]="step.completed ? 'Mark incomplete' : 'Mark completed'"
                      >
                        <span class="material-symbols-outlined">
                          {{ step.completed ? 'task_alt' : 'radio_button_unchecked' }}
                        </span>
                      </button>
                    </div>

                    <p class="step-text">{{ step.instruction }}</p>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    } @else {
      <div class="not-found food-card animate-fade">
        <h2>Recipe not found</h2>
        <p>The requested recipe could not be found or has been removed.</p>
        <a routerLink="/recipes" class="btn-primary">Browse All Recipes</a>
      </div>
    }
  `,
  styles: [`
    .recipe-detail-page {
      display: flex;
      flex-direction: column;
      gap: var(--space-lg);
    }

    .breadcrumb-row {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13.5px;
    }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: var(--color-primary);
      text-decoration: none;
      font-weight: 600;
    }

    .back-link:hover {
      text-decoration: underline;
    }

    .crumb-separator {
      color: var(--color-text-muted);
    }

    .crumb-current {
      color: var(--color-text-secondary);
    }

    /* Detail Hero Grid */
    .detail-hero-grid {
      display: grid;
      grid-template-columns: 1.1fr 1fr;
      gap: var(--space-lg);
    }

    @media (max-width: 900px) {
      .detail-hero-grid {
        grid-template-columns: 1fr;
      }
    }

    .hero-image-wrap {
      position: relative;
      height: 420px;
      overflow: hidden;
      border-radius: var(--radius-card);
    }

    .recipe-hero-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .hero-overlay-tags {
      position: absolute;
      top: 16px;
      left: 16px;
      display: flex;
      gap: 8px;
    }

    .category-tag {
      background: var(--color-secondary);
      color: #FFFFFF;
      padding: 6px 14px;
      border-radius: var(--radius-pill);
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.5px;
    }

    .difficulty-tag {
      background: var(--color-primary);
      color: #FFFFFF;
      padding: 6px 14px;
      border-radius: var(--radius-pill);
      font-size: 12px;
      font-weight: 700;
    }

    .hero-meta-card {
      padding: var(--space-xl);
      display: flex;
      flex-direction: column;
      gap: 16px;
      justify-content: center;
    }

    .title-action-row {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
    }

    .detail-title {
      font-size: 30px;
      font-weight: 800;
      line-height: 1.2;
    }

    .favorite-circle-btn {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: var(--color-bg-subtle);
      border: 1px solid var(--color-border);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-text-secondary);
      transition: all var(--transition-fast);
      flex-shrink: 0;
    }

    .favorite-circle-btn:hover {
      color: var(--color-primary);
      transform: scale(1.08);
    }

    .favorite-circle-btn.active {
      color: #FF3B30;
      background: #FFF0F0;
      border-color: #FFD2D2;
    }

    .favorite-circle-btn.active .heart-icon {
      font-variation-settings: 'FILL' 1;
    }

    .detail-desc {
      font-size: 15px;
      color: var(--color-text-secondary);
      line-height: 1.6;
    }

    .chef-strip {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      background: var(--color-bg-subtle);
      border-radius: var(--radius-button);
      border: 1px solid var(--color-border);
    }

    .chef-avatar-lg {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
    }

    .chef-role {
      display: block;
      font-size: 11px;
      color: var(--color-text-muted);
      text-transform: uppercase;
      font-weight: 600;
    }

    .chef-full-name {
      font-size: 14px;
      color: var(--color-text-primary);
    }

    .rating-strip {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 13px;
    }

    .star-icon {
      color: var(--color-star);
      font-variation-settings: 'FILL' 1;
      font-size: 18px;
    }

    .reviews-count {
      color: var(--color-text-muted);
      font-size: 12px;
    }

    .stats-matrix {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
    }

    @media (max-width: 500px) {
      .stats-matrix {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .matrix-box {
      background: var(--color-bg-subtle);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-button);
      padding: 10px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    }

    .stat-icon {
      color: var(--color-primary);
      font-size: 20px;
    }

    .stat-value {
      font-size: 14px;
      font-weight: 700;
      color: var(--color-text-primary);
    }

    .stat-label {
      font-size: 11px;
      color: var(--color-text-muted);
      text-transform: uppercase;
      font-weight: 600;
    }

    .hero-action-buttons {
      display: flex;
      gap: 12px;
      margin-top: 6px;
    }

    /* Content Grid */
    .recipe-content-grid {
      display: grid;
      grid-template-columns: 1fr 1.3fr;
      gap: var(--space-lg);
      align-items: start;
    }

    @media (max-width: 900px) {
      .recipe-content-grid {
        grid-template-columns: 1fr;
      }
    }

    .section-card {
      padding: var(--space-lg);
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .section-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--color-border);
      padding-bottom: 12px;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .header-icon {
      color: var(--color-primary);
      font-size: 24px;
    }

    .section-title {
      font-size: 20px;
      font-weight: 700;
    }

    .badge-count {
      font-size: 12px;
      font-weight: 700;
      color: var(--color-primary);
      background: var(--color-primary-light);
      padding: 3px 10px;
      border-radius: var(--radius-pill);
    }

    .section-tip {
      font-size: 12.5px;
      color: var(--color-text-secondary);
      font-style: italic;
    }

    /* Ingredients List */
    .ingredients-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .ingredient-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 14px;
      border-radius: var(--radius-button);
      background: var(--color-bg-subtle);
      border: 1px solid var(--color-border);
      cursor: pointer;
      transition: all var(--transition-fast);
      user-select: none;
    }

    .ingredient-item:hover {
      border-color: var(--color-primary);
      background: #FFFFFF;
    }

    .ingredient-item.checked {
      background: #F4FBF7;
      border-color: #B2E8D2;
      opacity: 0.7;
    }

    .ingredient-item.checked .ing-name {
      text-decoration: line-through;
      color: var(--color-text-muted);
    }

    .check-box-icon {
      color: var(--color-primary);
      font-size: 22px;
    }

    .ingredient-item.checked .check-box-icon {
      color: var(--color-success);
    }

    .ing-details {
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .ing-name {
      font-size: 14px;
      font-weight: 600;
      color: var(--color-text-primary);
    }

    .ing-category {
      font-size: 11px;
      color: var(--color-text-muted);
    }

    .ing-amount {
      font-size: 13px;
      font-weight: 700;
      color: var(--color-primary);
    }

    /* Nutrition Card */
    .nutrition-card {
      padding: var(--space-lg);
      margin-top: var(--space-lg);
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .nutrition-title {
      font-size: 16px;
      font-weight: 700;
    }

    .nutrition-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
    }

    .nutri-pill {
      background: var(--color-bg-subtle);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-button);
      padding: 10px;
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .nutri-num {
      font-size: 16px;
      font-weight: 800;
      color: var(--color-text-primary);
    }

    .nutri-name {
      font-size: 11px;
      color: var(--color-text-muted);
      text-transform: uppercase;
      font-weight: 600;
    }

    /* Steps List */
    .steps-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .step-card {
      background: var(--color-bg-subtle);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-card);
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      transition: all var(--transition-fast);
    }

    .step-card:hover {
      border-color: var(--color-primary);
    }

    .step-card.step-completed {
      background: #F4FBF7;
      border-color: #B2E8D2;
    }

    .step-card.step-completed .step-text {
      color: var(--color-text-muted);
    }

    .step-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .step-number-badge {
      font-size: 12px;
      font-weight: 700;
      color: #FFFFFF;
      background: var(--color-secondary);
      padding: 3px 10px;
      border-radius: var(--radius-pill);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .step-timer {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      font-weight: 600;
      color: var(--color-primary);
      background: var(--color-primary-light);
      padding: 3px 8px;
      border-radius: var(--radius-pill);
    }

    .step-timer .material-symbols-outlined {
      font-size: 15px;
    }

    .step-check-btn {
      color: var(--color-text-muted);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 4px;
      transition: color var(--transition-fast);
    }

    .step-card.step-completed .step-check-btn {
      color: var(--color-success);
    }

    .step-text {
      font-size: 14.5px;
      line-height: 1.55;
      color: var(--color-text-primary);
    }

    .not-found {
      padding: 48px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }
  `]
})
export class RecipeDetailComponent {
  private readonly route = inject(ActivatedRoute);
  readonly recipeService = inject(RecipeService);
  readonly groceryService = inject(GroceryService);
  readonly toastService = inject(ToastService);

  readonly recipe = computed(() => {
    const id = this.route.snapshot.paramMap.get('id');
    return id ? this.recipeService.getRecipeById(id) : undefined;
  });

  toggleFav(id: string): void {
    const isNow = this.recipeService.toggleFavorite(id);
    this.toastService.show(
      isNow ? 'Saved to your favorites! ❤️' : 'Removed from favorites',
      isNow ? 'success' : 'info'
    );
  }

  addAllToGroceries(recipe: any): void {
    const addedCount = this.groceryService.addIngredientsFromRecipe(recipe);
    this.toastService.show(
      `Added ${addedCount} ingredients to your Grocery List! 🛒`,
      'success'
    );
  }
}
