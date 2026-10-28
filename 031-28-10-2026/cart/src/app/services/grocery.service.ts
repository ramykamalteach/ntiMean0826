import { Injectable, signal, computed, effect } from '@angular/core';
import { GroceryItem, Recipe } from '../models/recipe.model';

const SEED_GROCERIES: GroceryItem[] = [
  { id: 'g-1', name: 'Fresh Ricotta Cheese', amount: '1 cup', category: 'Dairy & Eggs', checked: false, recipeSource: 'Cloud Pancakes' },
  { id: 'g-2', name: 'Fresh Blueberries', amount: '1.5 cups', category: 'Produce', checked: false, recipeSource: 'Cloud Pancakes' },
  { id: 'g-3', name: 'Bronze-Cut Fettuccine', amount: '250g', category: 'Bakery', checked: true, recipeSource: 'Truffle Fettuccine' },
  { id: 'g-4', name: 'Parmigiano-Reggiano', amount: '3/4 cup', category: 'Dairy & Eggs', checked: false, recipeSource: 'Truffle Fettuccine' },
  { id: 'g-5', name: 'Ripe Hass Avocados', amount: '3 pieces', category: 'Produce', checked: false, recipeSource: 'Street Tacos' }
];

@Injectable({
  providedIn: 'root'
})
export class GroceryService {
  private readonly storageKey = 'yumcraft_groceries';

  readonly items = signal<GroceryItem[]>(this.loadInitial());

  readonly totalCount = computed(() => this.items().length);
  readonly remainingCount = computed(() => this.items().filter(i => !i.checked).length);
  readonly completedCount = computed(() => this.items().filter(i => i.checked).length);

  readonly itemsByCategory = computed(() => {
    const map = new Map<string, GroceryItem[]>();
    for (const item of this.items()) {
      const cat = item.category || 'Other';
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(item);
    }
    return Array.from(map.entries()).map(([category, list]) => ({ category, list }));
  });

  constructor() {
    effect(() => {
      const data = this.items();
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.storageKey, JSON.stringify(data));
      }
    });
  }

  private loadInitial(): GroceryItem[] {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        try { return JSON.parse(saved); } catch {}
      }
    }
    return SEED_GROCERIES;
  }

  addIngredientsFromRecipe(recipe: Recipe): number {
    let added = 0;
    const currentList = this.items();
    const newItems: GroceryItem[] = [];

    for (const ing of recipe.ingredients) {
      const exists = currentList.some(i => i.name.toLowerCase() === ing.name.toLowerCase());
      if (!exists) {
        newItems.push({
          id: `g-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          name: ing.name,
          amount: ing.amount,
          category: ing.category,
          checked: false,
          recipeSource: recipe.title
        });
        added++;
      }
    }

    if (newItems.length > 0) {
      this.items.update(current => [...newItems, ...current]);
    }
    return added;
  }

  addItem(name: string, amount: string, category: string = 'Produce'): void {
    if (!name.trim()) return;
    const newItem: GroceryItem = {
      id: `g-${Date.now()}`,
      name: name.trim(),
      amount: amount.trim() || '1 qty',
      category: category || 'Pantry & Spices',
      checked: false
    };
    this.items.update(current => [newItem, ...current]);
  }

  toggleCheck(id: string): void {
    this.items.update(current =>
      current.map(i => i.id === id ? { ...i, checked: !i.checked } : i)
    );
  }

  removeItem(id: string): void {
    this.items.update(current => current.filter(i => i.id !== id));
  }

  clearCompleted(): void {
    this.items.update(current => current.filter(i => !i.checked));
  }

  resetGroceries(): void {
    this.items.set(SEED_GROCERIES);
  }
}
