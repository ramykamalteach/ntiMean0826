import { Injectable, signal, effect } from '@angular/core';
import { DayMealPlan, Recipe } from '../models/recipe.model';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

@Injectable({
  providedIn: 'root'
})
export class MealPlanService {
  private readonly storageKey = 'yumcraft_meal_plan';

  readonly weekPlan = signal<DayMealPlan[]>(this.loadInitial());

  constructor() {
    effect(() => {
      const data = this.weekPlan();
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.storageKey, JSON.stringify(data));
      }
    });
  }

  private loadInitial(): DayMealPlan[] {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        try { return JSON.parse(saved); } catch {}
      }
    }
    return DAYS.map((day, idx) => ({
      dayName: day,
      dateStr: `Day ${idx + 1}`
    }));
  }

  assignMeal(dayName: string, slot: 'breakfast' | 'lunch' | 'dinner', recipe: Recipe): void {
    this.weekPlan.update(plan =>
      plan.map(d => {
        if (d.dayName === dayName) {
          return { ...d, [slot]: recipe };
        }
        return d;
      })
    );
  }

  removeMeal(dayName: string, slot: 'breakfast' | 'lunch' | 'dinner'): void {
    this.weekPlan.update(plan =>
      plan.map(d => {
        if (d.dayName === dayName) {
          const updated = { ...d };
          delete updated[slot];
          return updated;
        }
        return d;
      })
    );
  }

  clearWeek(): void {
    this.weekPlan.set(
      DAYS.map((day, idx) => ({
        dayName: day,
        dateStr: `Day ${idx + 1}`
      }))
    );
  }
}
