import { Component, inject, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RecipeCategory } from '../../models/recipe.model';
import { RecipeService } from '../../services/recipe.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-add-recipe-modal',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="modal-overlay" (click)="onOverlayClick($event)">
      <div class="modal-card animate-fade" role="dialog" aria-modal="true">
        <div class="modal-head">
          <div class="head-title">
            <span class="material-symbols-outlined chef-hat">outdoor_grill</span>
            <h3>Add New Recipe</h3>
          </div>
          <button class="btn-icon close-btn" (click)="close.emit()" aria-label="Close modal">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <form (ngSubmit)="onSubmit()" class="modal-body">
          <div class="form-group">
            <label for="recipe-title">Recipe Title *</label>
            <input
              id="recipe-title"
              type="text"
              name="title"
              [(ngModel)]="title"
              placeholder="e.g. Handmade Tagliatelle with Sage Butter"
              required
              class="form-control"
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="recipe-cat">Category</label>
              <select id="recipe-cat" name="category" [(ngModel)]="category" class="form-control">
                @for (cat of categories; track cat) {
                  <option [value]="cat">{{ cat }}</option>
                }
              </select>
            </div>

            <div class="form-group">
              <label for="recipe-time">Cook Time</label>
              <input
                id="recipe-time"
                type="text"
                name="cookTime"
                [(ngModel)]="cookTime"
                placeholder="e.g. 25 mins"
                class="form-control"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="recipe-calories">Calories (kcal)</label>
              <input
                id="recipe-calories"
                type="number"
                name="calories"
                [(ngModel)]="calories"
                placeholder="e.g. 450"
                class="form-control"
              />
            </div>

            <div class="form-group">
              <label for="recipe-servings">Servings</label>
              <input
                id="recipe-servings"
                type="number"
                name="servings"
                [(ngModel)]="servings"
                placeholder="e.g. 4"
                class="form-control"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="recipe-image">Image URL</label>
            <input
              id="recipe-image"
              type="url"
              name="image"
              [(ngModel)]="image"
              placeholder="https://images.unsplash.com/..."
              class="form-control"
            />
          </div>

          <div class="form-group">
            <label for="recipe-desc">Short Story / Description</label>
            <textarea
              id="recipe-desc"
              name="description"
              [(ngModel)]="description"
              rows="3"
              placeholder="What makes this dish delicious, aromatic, or special?"
              class="form-control"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="recipe-ing">Ingredients (comma separated)</label>
            <textarea
              id="recipe-ing"
              name="ingredientsRaw"
              [(ngModel)]="ingredientsRaw"
              rows="2"
              placeholder="2 cups flour, 3 eggs, 1 tbsp olive oil, pinch sea salt"
              class="form-control"
            ></textarea>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn-outline" (click)="close.emit()">
              Cancel
            </button>
            <button type="submit" class="btn-primary" [disabled]="!title.trim()">
              <span class="material-symbols-outlined">restaurant</span>
              Publish Recipe
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .modal-card {
      width: 100%;
      max-width: 580px;
      max-height: 90vh;
      overflow-y: auto;
      background: var(--color-surface);
      border-radius: var(--radius-card);
      box-shadow: var(--shadow-dropdown);
      border: 1px solid var(--color-border);
    }

    .modal-head {
      padding: var(--space-lg);
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--color-border);
      background: var(--color-bg-subtle);
    }

    .head-title {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .chef-hat {
      color: var(--color-primary);
      font-size: 26px;
    }

    .head-title h3 {
      font-size: 20px;
      font-weight: 700;
    }

    .close-btn {
      width: 36px;
      height: 36px;
    }

    .modal-body {
      padding: var(--space-lg);
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    @media (max-width: 540px) {
      .form-row {
        grid-template-columns: 1fr;
      }
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .form-group label {
      font-size: 13px;
      font-weight: 600;
      color: var(--color-text-primary);
    }

    .form-control {
      padding: 11px 14px;
      border-radius: var(--radius-button);
      border: 1px solid var(--color-border);
      background: var(--color-bg-subtle);
      font-size: 14px;
      color: var(--color-text-primary);
      outline: none;
      transition: all var(--transition-fast);
    }

    .form-control:focus {
      border-color: var(--color-primary);
      background: #FFFFFF;
      box-shadow: 0 0 0 3px rgba(255, 107, 0, 0.15);
    }

    textarea.form-control {
      resize: vertical;
    }

    .modal-footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 8px;
      padding-top: 16px;
      border-top: 1px solid var(--color-border);
    }
  `]
})
export class AddRecipeModalComponent {
  readonly close = output<void>();

  readonly recipeService = inject(RecipeService);
  readonly toastService = inject(ToastService);

  title = '';
  category: RecipeCategory = 'Italian';
  cookTime = '20 mins';
  calories = 480;
  servings = 4;
  image = 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80';
  description = '';
  ingredientsRaw = '1 cup arborio rice, 4 cups warm broth, 1 cup mushrooms, 1/2 cup parmesan cheese';

  readonly categories: RecipeCategory[] = [
    'Breakfast',
    'Italian',
    'Asian',
    'Healthy',
    'Mexican',
    'Desserts',
    '15-Min Quick'
  ];

  onSubmit(): void {
    if (!this.title.trim()) return;

    const parsedIngredients = this.ingredientsRaw
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0)
      .map(item => ({
        name: item,
        amount: 'to taste',
        category: 'Pantry & Spices' as const
      }));

    this.recipeService.addRecipe({
      title: this.title.trim(),
      category: this.category,
      cookTime: this.cookTime.trim() || '20 mins',
      prepTime: '10 mins',
      calories: this.calories || 400,
      servings: this.servings || 2,
      difficulty: 'Easy',
      image: this.image.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
      description: this.description.trim() || 'A delicious home-cooked delight.',
      isFavorite: false,
      chef: {
        name: 'You (Home Chef)',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
      },
      ingredients: parsedIngredients.length > 0 ? parsedIngredients : [
        { name: 'Fresh Ingredients', amount: 'as needed', category: 'Produce' }
      ],
      steps: [
        { stepNumber: 1, instruction: 'Prep all fresh ingredients, wash produce, and measure seasonings.', completed: false, timerMinutes: 5 },
        { stepNumber: 2, instruction: 'Cook according to instructions over gentle medium heat.', completed: false, timerMinutes: 15 },
        { stepNumber: 3, instruction: 'Plate carefully, garnish with fresh herbs, and serve warm!', completed: false, timerMinutes: 2 }
      ]
    });

    this.toastService.show(`"${this.title}" published to your recipe collection! 🍳`, 'success');
    this.close.emit();
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.close.emit();
    }
  }
}
