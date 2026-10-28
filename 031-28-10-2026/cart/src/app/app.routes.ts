import { Routes } from '@angular/router';
import { ExploreComponent } from './pages/explore/explore.component';
import { RecipeDetailComponent } from './pages/recipe-detail/recipe-detail.component';
import { MealPlannerComponent } from './pages/meal-planner/meal-planner.component';
import { GroceryListComponent } from './pages/grocery-list/grocery-list.component';
import { FavoritesComponent } from './pages/favorites/favorites.component';

export const routes: Routes = [
  { path: '', redirectTo: 'recipes', pathMatch: 'full' },
  { path: 'recipes', component: ExploreComponent, title: 'Explore Recipes — CookCraft' },
  { path: 'recipe/:id', component: RecipeDetailComponent, title: 'Recipe Details — CookCraft' },
  { path: 'planner', component: MealPlannerComponent, title: 'Weekly Meal Planner — CookCraft' },
  { path: 'groceries', component: GroceryListComponent, title: 'Grocery Shopping List — CookCraft' },
  { path: 'favorites', component: FavoritesComponent, title: 'Saved Favorites — CookCraft' },
  { path: '**', redirectTo: 'recipes' }
];
