export type RecipeCategory = 
  | 'All' 
  | 'Breakfast' 
  | 'Italian' 
  | 'Asian' 
  | 'Healthy' 
  | 'Mexican' 
  | 'Desserts' 
  | '15-Min Quick';

export interface Ingredient {
  name: string;
  amount: string;
  category: 'Produce' | 'Dairy & Eggs' | 'Pantry & Spices' | 'Meat & Seafood' | 'Bakery';
  checked?: boolean;
}

export interface CookingStep {
  stepNumber: number;
  instruction: string;
  completed?: boolean;
  timerMinutes?: number;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  category: RecipeCategory;
  prepTime: string;
  cookTime: string;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Chef Level';
  calories: number;
  rating: number;
  reviewsCount: number;
  image: string;
  isFavorite: boolean;
  chef: {
    name: string;
    avatar: string;
  };
  ingredients: Ingredient[];
  steps: CookingStep[];
}

export interface GroceryItem {
  id: string;
  name: string;
  amount: string;
  category: string;
  checked: boolean;
  recipeSource?: string;
}

export interface DayMealPlan {
  dayName: string;
  dateStr: string;
  breakfast?: Recipe;
  lunch?: Recipe;
  dinner?: Recipe;
}
