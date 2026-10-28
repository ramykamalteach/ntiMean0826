import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GroceryService } from '../../services/grocery.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-grocery-list',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="grocery-page animate-fade">
      <!-- Page Header -->
      <div class="grocery-header">
        <div>
          <h1 class="page-title">Smart Grocery Checklist</h1>
          <p class="page-subtitle">Organized by store aisles and departments. Check off items as you walk through the market.</p>
        </div>

        <div class="header-actions">
          <button class="btn-outline" (click)="clearChecked()" [disabled]="groceryService.completedCount() === 0">
            <span class="material-symbols-outlined">delete_sweep</span>
            Clear Completed ({{ groceryService.completedCount() }})
          </button>
        </div>
      </div>

      <!-- Quick Add Item Form -->
      <div class="food-card add-item-bar">
        <div class="input-wrap item-name-input">
          <span class="material-symbols-outlined input-icon">add_circle</span>
          <input
            type="text"
            placeholder="Add ingredient or grocery item..."
            [(ngModel)]="newItemName"
            (keyup.enter)="onAddItem()"
            class="clean-input"
          />
        </div>

        <div class="input-wrap item-amount-input">
          <input
            type="text"
            placeholder="Qty / Weight (e.g. 2 bunches)"
            [(ngModel)]="newItemAmount"
            (keyup.enter)="onAddItem()"
            class="clean-input"
          />
        </div>

        <div class="input-wrap item-cat-input">
          <select [(ngModel)]="newItemCategory" class="clean-select">
            @for (cat of availableCategories; track cat) {
              <option [value]="cat">{{ cat }}</option>
            }
          </select>
        </div>

        <button class="btn-primary" (click)="onAddItem()" [disabled]="!newItemName.trim()">
          <span>Add</span>
        </button>
      </div>

      <!-- Shopping Progress Metric -->
      <div class="food-card progress-card">
        <div class="progress-info">
          <span>Shopping Basket Progress</span>
          <strong>{{ groceryService.completedCount() }} of {{ groceryService.totalCount() }} items gathered</strong>
        </div>
        <div class="track-bg">
          <div
            class="track-fill"
            [style.width.%]="getProgressPct()"
          ></div>
        </div>
      </div>

      <!-- Categorized Grocery Sections -->
      <div class="categories-column">
        @for (group of groceryService.itemsByCategory(); track group.category) {
          <div class="food-card category-section">
            <div class="cat-header">
              <div class="cat-title-wrap">
                <span class="cat-dot"></span>
                <h3 class="cat-name">{{ group.category }}</h3>
              </div>
              <span class="cat-count">{{ group.list.length }} items</span>
            </div>

            <div class="items-list">
              @for (item of group.list; track item.id) {
                <div class="grocery-item-row" [class.item-checked]="item.checked">
                  <button
                    class="checkbox-btn"
                    (click)="groceryService.toggleCheck(item.id)"
                    aria-label="Toggle item status"
                  >
                    <span class="material-symbols-outlined check-icon">
                      {{ item.checked ? 'check_box' : 'check_box_outline_blank' }}
                    </span>
                  </button>

                  <div class="item-text" (click)="groceryService.toggleCheck(item.id)">
                    <span class="item-name">{{ item.name }}</span>
                    @if (item.recipeSource) {
                      <span class="recipe-source">For: {{ item.recipeSource }}</span>
                    }
                  </div>

                  <span class="item-amount-pill">{{ item.amount }}</span>

                  <button
                    class="delete-item-btn"
                    (click)="groceryService.removeItem(item.id)"
                    title="Remove item"
                  >
                    <span class="material-symbols-outlined">delete_outline</span>
                  </button>
                </div>
              }
            </div>
          </div>
        } @empty {
          <div class="food-card empty-cart-box">
            <span class="empty-emoji">🛒</span>
            <h3>Your Grocery List is Empty</h3>
            <p>Add ingredients directly from any recipe page or type items above.</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .grocery-page {
      display: flex;
      flex-direction: column;
      gap: var(--space-lg);
    }

    .grocery-header {
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

    /* Add Item Bar */
    .add-item-bar {
      padding: 12px 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    .input-wrap {
      display: flex;
      align-items: center;
      background: var(--color-bg-subtle);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-button);
      padding: 0 12px;
      height: 44px;
    }

    .item-name-input {
      flex: 2;
      min-width: 220px;
    }

    .item-amount-input {
      flex: 1;
      min-width: 140px;
    }

    .item-cat-input {
      min-width: 150px;
    }

    .input-icon {
      color: var(--color-primary);
      margin-right: 8px;
    }

    .clean-input {
      border: none;
      background: transparent;
      outline: none;
      width: 100%;
      font-size: 14px;
      color: var(--color-text-primary);
    }

    .clean-select {
      border: none;
      background: transparent;
      outline: none;
      width: 100%;
      font-size: 13.5px;
      color: var(--color-text-primary);
      cursor: pointer;
    }

    /* Progress Card */
    .progress-card {
      padding: 16px 20px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .progress-info {
      display: flex;
      justify-content: space-between;
      font-size: 13.5px;
    }

    .track-bg {
      height: 8px;
      background: var(--color-border);
      border-radius: var(--radius-pill);
      overflow: hidden;
    }

    .track-fill {
      height: 100%;
      background: var(--color-primary);
      border-radius: var(--radius-pill);
      transition: width 0.4s ease;
    }

    /* Category Section */
    .categories-column {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .category-section {
      padding: 18px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .cat-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--color-border);
    }

    .cat-title-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .cat-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--color-primary);
    }

    .cat-name {
      font-size: 16px;
      font-weight: 700;
    }

    .cat-count {
      font-size: 12px;
      color: var(--color-text-muted);
      font-weight: 600;
    }

    .items-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .grocery-item-row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 12px;
      border-radius: var(--radius-button);
      background: var(--color-bg-subtle);
      border: 1px solid var(--color-border);
      transition: all var(--transition-fast);
    }

    .grocery-item-row:hover {
      background: #FFFFFF;
      border-color: var(--color-primary);
    }

    .grocery-item-row.item-checked {
      background: #F9F9F9;
      opacity: 0.65;
    }

    .grocery-item-row.item-checked .item-name {
      text-decoration: line-through;
      color: var(--color-text-muted);
    }

    .checkbox-btn {
      color: var(--color-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
    }

    .item-text {
      flex: 1;
      display: flex;
      flex-direction: column;
      cursor: pointer;
    }

    .item-name {
      font-size: 14px;
      font-weight: 600;
      color: var(--color-text-primary);
    }

    .recipe-source {
      font-size: 11px;
      color: var(--color-text-muted);
    }

    .item-amount-pill {
      font-size: 12px;
      font-weight: 700;
      color: var(--color-primary);
      background: var(--color-primary-light);
      padding: 2px 10px;
      border-radius: var(--radius-pill);
    }

    .delete-item-btn {
      color: var(--color-text-muted);
      padding: 4px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .delete-item-btn:hover {
      color: #FF3B30;
    }

    .delete-item-btn .material-symbols-outlined {
      font-size: 18px;
    }

    .empty-cart-box {
      padding: 48px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }

    .empty-emoji {
      font-size: 40px;
    }
  `]
})
export class GroceryListComponent {
  readonly groceryService = inject(GroceryService);
  readonly toastService = inject(ToastService);

  newItemName = '';
  newItemAmount = '';
  newItemCategory = 'Produce';

  readonly availableCategories = [
    'Produce',
    'Dairy & Eggs',
    'Bakery',
    'Pantry & Spices',
    'Meat & Seafood'
  ];

  getProgressPct(): number {
    const total = this.groceryService.totalCount();
    if (total === 0) return 0;
    return Math.round((this.groceryService.completedCount() / total) * 100);
  }

  onAddItem(): void {
    if (!this.newItemName.trim()) return;
    this.groceryService.addItem(this.newItemName, this.newItemAmount, this.newItemCategory);
    this.toastService.show(`Added "${this.newItemName}" to grocery list!`, 'success');
    this.newItemName = '';
    this.newItemAmount = '';
  }

  clearChecked(): void {
    this.groceryService.clearCompleted();
    this.toastService.show('Completed grocery items cleared', 'info');
  }
}
