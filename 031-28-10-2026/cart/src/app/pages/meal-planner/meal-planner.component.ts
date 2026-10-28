import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MealPlanService } from '../../services/meal-plan.service';
import { RecipeService } from '../../services/recipe.service';
import { GroceryService } from '../../services/grocery.service';
import { ToastService } from '../../services/toast.service';
import { Recipe } from '../../models/recipe.model';

@Component({
  selector: 'app-meal-planner',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="planner-page animate-fade">
      <!-- Header & Action Row -->
      <div class="planner-header">
        <div>
          <h1 class="page-title">Weekly Culinary Meal Planner</h1>
          <p class="page-subtitle">Schedule your meals from Monday to Sunday. Auto-sync all necessary ingredients to your grocery list.</p>
        </div>

        <div class="header-actions">
          <button class="btn-outline" (click)="clearAll()">
            <span class="material-symbols-outlined">restart_alt</span>
            Reset Week
          </button>
          <button class="btn-primary" (click)="addWeekToGrocery()">
            <span class="material-symbols-outlined">shopping_cart</span>
            Add Week to Grocery List
          </button>
        </div>
      </div>

      <!-- 7-Day Interactive Grid -->
      <div class="days-grid">
        @for (day of mealPlanService.weekPlan(); track day.dayName) {
          <div class="day-column food-card">
            <div class="day-header">
              <span class="day-name">{{ day.dayName }}</span>
              <span class="day-tag">{{ day.dateStr }}</span>
            </div>

            <div class="slots-container">
              <!-- Breakfast Slot -->
              <div class="meal-slot">
                <div class="slot-label">
                  <span class="material-symbols-outlined">bakery_dining</span>
                  <span>Breakfast</span>
                </div>
                @if (day.breakfast; as meal) {
                  <div class="assigned-meal">
                    <img [src]="meal.image" [alt]="meal.title" class="meal-thumb" />
                    <div class="meal-meta">
                      <a [routerLink]="['/recipe', meal.id]" class="meal-link">{{ meal.title }}</a>
                      <span class="meal-cal">{{ meal.calories }} kcal &bull; {{ meal.cookTime }}</span>
                    </div>
                    <button class="remove-btn" (click)="removeMeal(day.dayName, 'breakfast')" title="Remove meal">
                      <span class="material-symbols-outlined">close</span>
                    </button>
                  </div>
                } @else {
                  <button class="empty-slot-btn" (click)="openPicker(day.dayName, 'breakfast')">
                    <span class="material-symbols-outlined">add</span>
                    <span>Assign Breakfast</span>
                  </button>
                }
              </div>

              <!-- Lunch Slot -->
              <div class="meal-slot">
                <div class="slot-label">
                  <span class="material-symbols-outlined">lunch_dining</span>
                  <span>Lunch</span>
                </div>
                @if (day.lunch; as meal) {
                  <div class="assigned-meal">
                    <img [src]="meal.image" [alt]="meal.title" class="meal-thumb" />
                    <div class="meal-meta">
                      <a [routerLink]="['/recipe', meal.id]" class="meal-link">{{ meal.title }}</a>
                      <span class="meal-cal">{{ meal.calories }} kcal &bull; {{ meal.cookTime }}</span>
                    </div>
                    <button class="remove-btn" (click)="removeMeal(day.dayName, 'lunch')" title="Remove meal">
                      <span class="material-symbols-outlined">close</span>
                    </button>
                  </div>
                } @else {
                  <button class="empty-slot-btn" (click)="openPicker(day.dayName, 'lunch')">
                    <span class="material-symbols-outlined">add</span>
                    <span>Assign Lunch</span>
                  </button>
                }
              </div>

              <!-- Dinner Slot -->
              <div class="meal-slot">
                <div class="slot-label">
                  <span class="material-symbols-outlined">dinner_dining</span>
                  <span>Dinner</span>
                </div>
                @if (day.dinner; as meal) {
                  <div class="assigned-meal">
                    <img [src]="meal.image" [alt]="meal.title" class="meal-thumb" />
                    <div class="meal-meta">
                      <a [routerLink]="['/recipe', meal.id]" class="meal-link">{{ meal.title }}</a>
                      <span class="meal-cal">{{ meal.calories }} kcal &bull; {{ meal.cookTime }}</span>
                    </div>
                    <button class="remove-btn" (click)="removeMeal(day.dayName, 'dinner')" title="Remove meal">
                      <span class="material-symbols-outlined">close</span>
                    </button>
                  </div>
                } @else {
                  <button class="empty-slot-btn" (click)="openPicker(day.dayName, 'dinner')">
                    <span class="material-symbols-outlined">add</span>
                    <span>Assign Dinner</span>
                  </button>
                }
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Quick Recipe Picker Modal -->
      @if (pickerActive()) {
        <div class="modal-overlay" (click)="closePicker()">
          <div class="modal-card picker-card animate-fade" (click)="$event.stopPropagation()">
            <div class="picker-header">
              <h3>Select Recipe for {{ selectedDay() }} {{ selectedSlot() }}</h3>
              <button class="btn-icon" (click)="closePicker()">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>

            <div class="picker-list">
              @for (recipe of recipeService.recipes(); track recipe.id) {
                <div class="picker-item" (click)="assignSelectedMeal(recipe)">
                  <img [src]="recipe.image" [alt]="recipe.title" class="picker-thumb" />
                  <div class="picker-info">
                    <h4>{{ recipe.title }}</h4>
                    <span class="picker-sub">{{ recipe.category }} &bull; {{ recipe.cookTime }} &bull; {{ recipe.calories }} kcal</span>
                  </div>
                  <button class="btn-primary picker-select-btn">Select</button>
                </div>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .planner-page {
      display: flex;
      flex-direction: column;
      gap: var(--space-lg);
    }

    .planner-header {
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

    .header-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    /* 7-Day Grid */
    .days-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 18px;
    }

    .day-column {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .day-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 10px;
      border-bottom: 1px solid var(--color-border);
    }

    .day-name {
      font-size: 16px;
      font-weight: 700;
      color: var(--color-text-primary);
    }

    .day-tag {
      font-size: 11px;
      font-weight: 600;
      color: var(--color-primary);
      background: var(--color-primary-light);
      padding: 2px 8px;
      border-radius: var(--radius-pill);
    }

    .slots-container {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .meal-slot {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .slot-label {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      font-weight: 600;
      color: var(--color-text-muted);
      text-transform: uppercase;
    }

    .slot-label .material-symbols-outlined {
      font-size: 16px;
      color: var(--color-primary);
    }

    .empty-slot-btn {
      width: 100%;
      padding: 12px;
      border: 1px dashed var(--color-border);
      border-radius: var(--radius-button);
      background: var(--color-bg-subtle);
      color: var(--color-text-secondary);
      font-size: 12.5px;
      font-weight: 500;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: all var(--transition-fast);
      cursor: pointer;
    }

    .empty-slot-btn:hover {
      border-color: var(--color-primary);
      color: var(--color-primary);
      background: var(--color-primary-light);
    }

    .empty-slot-btn .material-symbols-outlined {
      font-size: 18px;
    }

    .assigned-meal {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 10px;
      background: var(--color-bg-subtle);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-button);
      position: relative;
    }

    .meal-thumb {
      width: 44px;
      height: 44px;
      border-radius: 8px;
      object-fit: cover;
    }

    .meal-meta {
      display: flex;
      flex-direction: column;
      flex: 1;
      overflow: hidden;
    }

    .meal-link {
      font-size: 13px;
      font-weight: 700;
      color: var(--color-text-primary);
      text-decoration: none;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .meal-link:hover {
      color: var(--color-primary);
    }

    .meal-cal {
      font-size: 11px;
      color: var(--color-text-muted);
    }

    .remove-btn {
      color: var(--color-text-muted);
      padding: 4px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .remove-btn:hover {
      color: #FF3B30;
    }

    .remove-btn .material-symbols-outlined {
      font-size: 16px;
    }

    /* Recipe Picker Modal */
    .picker-card {
      width: 100%;
      max-width: 600px;
      background: #FFFFFF;
      border-radius: var(--radius-card);
      overflow: hidden;
      box-shadow: var(--shadow-dropdown);
    }

    .picker-header {
      padding: 16px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--color-border);
      background: var(--color-bg-subtle);
    }

    .picker-list {
      max-height: 400px;
      overflow-y: auto;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .picker-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px;
      border-radius: var(--radius-button);
      border: 1px solid var(--color-border);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .picker-item:hover {
      border-color: var(--color-primary);
      background: var(--color-primary-light);
    }

    .picker-thumb {
      width: 50px;
      height: 50px;
      border-radius: 8px;
      object-fit: cover;
    }

    .picker-info {
      flex: 1;
    }

    .picker-info h4 {
      font-size: 14px;
      font-weight: 700;
    }

    .picker-sub {
      font-size: 12px;
      color: var(--color-text-secondary);
    }

    .picker-select-btn {
      padding: 8px 14px;
      font-size: 12px;
    }
  `]
})
export class MealPlannerComponent {
  readonly mealPlanService = inject(MealPlanService);
  readonly recipeService = inject(RecipeService);
  readonly groceryService = inject(GroceryService);
  readonly toastService = inject(ToastService);

  readonly pickerActive = signal(false);
  readonly selectedDay = signal('');
  readonly selectedSlot = signal<'breakfast' | 'lunch' | 'dinner'>('breakfast');

  openPicker(dayName: string, slot: 'breakfast' | 'lunch' | 'dinner'): void {
    this.selectedDay.set(dayName);
    this.selectedSlot.set(slot);
    this.pickerActive.set(true);
  }

  closePicker(): void {
    this.pickerActive.set(false);
  }

  assignSelectedMeal(recipe: Recipe): void {
    this.mealPlanService.assignMeal(this.selectedDay(), this.selectedSlot(), recipe);
    this.toastService.show(
      `Assigned "${recipe.title}" for ${this.selectedDay()} ${this.selectedSlot()}! 🗓️`,
      'success'
    );
    this.closePicker();
  }

  removeMeal(dayName: string, slot: 'breakfast' | 'lunch' | 'dinner'): void {
    this.mealPlanService.removeMeal(dayName, slot);
    this.toastService.show(`Meal removed from ${dayName}`, 'info');
  }

  addWeekToGrocery(): void {
    let totalAdded = 0;
    for (const day of this.mealPlanService.weekPlan()) {
      if (day.breakfast) totalAdded += this.groceryService.addIngredientsFromRecipe(day.breakfast);
      if (day.lunch) totalAdded += this.groceryService.addIngredientsFromRecipe(day.lunch);
      if (day.dinner) totalAdded += this.groceryService.addIngredientsFromRecipe(day.dinner);
    }

    this.toastService.show(
      totalAdded > 0 
        ? `Added ${totalAdded} week's ingredients to your Grocery List! 🛒`
        : `All week ingredients are already in your grocery list!`,
      'success'
    );
  }

  clearAll(): void {
    this.mealPlanService.clearWeek();
    this.toastService.show('Weekly meal schedule reset', 'info');
  }
}
