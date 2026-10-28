import { Injectable, signal, computed, effect } from '@angular/core';
import { Recipe, RecipeCategory } from '../models/recipe.model';

const SEED_RECIPES: Recipe[] = [
  {
    id: 'rec-1',
    title: 'Fluffy Ricotta Cloud Pancakes with Berry Compote',
    description: 'Ultra-light, souffle-like pancakes infused with lemon zest, whipped ricotta, and warm simmered wild blackberries.',
    category: 'Breakfast',
    prepTime: '15 mins',
    cookTime: '10 mins',
    servings: 3,
    difficulty: 'Easy',
    calories: 420,
    rating: 4.9,
    reviewsCount: 128,
    image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=800&auto=format&fit=crop&q=80',
    isFavorite: true,
    chef: {
      name: 'Chef Sophie Laurent',
      avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=120&auto=format&fit=crop&q=80'
    },
    ingredients: [
      { name: 'Fresh Ricotta Cheese', amount: '1 cup', category: 'Dairy & Eggs' },
      { name: 'Organic Eggs (separated)', amount: '3 large', category: 'Dairy & Eggs' },
      { name: 'All-Purpose Flour', amount: '1 cup', category: 'Pantry & Spices' },
      { name: 'Baking Powder', amount: '1 tsp', category: 'Pantry & Spices' },
      { name: 'Whole Milk', amount: '3/4 cup', category: 'Dairy & Eggs' },
      { name: 'Organic Lemon (zested)', amount: '1 whole', category: 'Produce' },
      { name: 'Fresh Blueberries & Blackberries', amount: '1.5 cups', category: 'Produce' },
      { name: 'Pure Maple Syrup', amount: '3 tbsp', category: 'Pantry & Spices' }
    ],
    steps: [
      { stepNumber: 1, instruction: 'Whisk together egg yolks, fresh ricotta, milk, and grated lemon zest until velvety smooth.', completed: false, timerMinutes: 3 },
      { stepNumber: 2, instruction: 'In a separate cold bowl, whip the egg whites with a pinch of salt until stiff peaks form.', completed: false, timerMinutes: 4 },
      { stepNumber: 3, instruction: 'Gently fold sifted flour and baking powder into the yolk mix, then delicately fold in the whipped egg whites in 3 batches.', completed: false, timerMinutes: 3 },
      { stepNumber: 4, instruction: 'Heat a non-stick griddle over medium-low heat with a dab of butter. Ladle 1/3 cup of batter and cook covered for 3 mins per side until golden puff.', completed: false, timerMinutes: 6 },
      { stepNumber: 5, instruction: 'Simmer fresh berries with maple syrup in a small saucepan for 5 mins until bubbling. Pour warm compote generously over pancakes.', completed: false, timerMinutes: 5 }
    ]
  },
  {
    id: 'rec-2',
    title: 'Truffle & Wild Mushroom Cream Fettuccine',
    description: 'Silky egg fettuccine enrobed in a rich parmesan and black truffle sauce, topped with pan-seared chanterelles and crispy sage.',
    category: 'Italian',
    prepTime: '10 mins',
    cookTime: '15 mins',
    servings: 2,
    difficulty: 'Medium',
    calories: 580,
    rating: 4.95,
    reviewsCount: 210,
    image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281745?w=800&auto=format&fit=crop&q=80',
    isFavorite: true,
    chef: {
      name: 'Marco Bellini',
      avatar: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?w=120&auto=format&fit=crop&q=80'
    },
    ingredients: [
      { name: 'Fresh Bronze-Cut Fettuccine', amount: '250g', category: 'Bakery' },
      { name: 'Wild Cremini & Chanterelle Mushrooms', amount: '300g sliced', category: 'Produce' },
      { name: 'Heavy Whipping Cream', amount: '1/2 cup', category: 'Dairy & Eggs' },
      { name: 'Parmigiano-Reggiano (Aged 24 Mo)', amount: '3/4 cup grated', category: 'Dairy & Eggs' },
      { name: 'Black Truffle Butter or Oil', amount: '2 tbsp', category: 'Pantry & Spices' },
      { name: 'Garlic Cloves (minced)', amount: '3 cloves', category: 'Produce' },
      { name: 'Fresh Sage Leaves', amount: '6 leaves', category: 'Produce' }
    ],
    steps: [
      { stepNumber: 1, instruction: 'Bring a large pot of salted water to a vigorous boil. Drop the fettuccine and cook until al dente (about 4 mins for fresh pasta). Reserve 1/2 cup pasta water.', completed: false, timerMinutes: 4 },
      { stepNumber: 2, instruction: 'In a wide skillet, melt half the butter over high heat. Sear the mushrooms without crowding until deeply caramel-browned.', completed: false, timerMinutes: 6 },
      { stepNumber: 3, instruction: 'Add minced garlic and crisp the sage leaves for 60 seconds until fragrant.', completed: false, timerMinutes: 1 },
      { stepNumber: 4, instruction: 'Lower heat to medium, stir in cream, reserved starchy pasta water, and grated parmigiano until an emulsion forms.', completed: false, timerMinutes: 3 },
      { stepNumber: 5, instruction: 'Toss pasta directly in the pan, swirl in remaining black truffle butter, and serve with fresh cracked black pepper.', completed: false, timerMinutes: 2 }
    ]
  },
  {
    id: 'rec-3',
    title: 'Crispy Honey Teriyaki Glazed Salmon Rice Bowl',
    description: 'Crispy skin Atlantic salmon glazed with sticky honey-ginger teriyaki, served over jasmine rice with sliced avocado and edamame.',
    category: 'Asian',
    prepTime: '15 mins',
    cookTime: '12 mins',
    servings: 2,
    difficulty: 'Easy',
    calories: 520,
    rating: 4.88,
    reviewsCount: 94,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
    isFavorite: false,
    chef: {
      name: 'Kenji Takahashi',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'
    },
    ingredients: [
      { name: 'Fresh Atlantic Salmon Fillets', amount: '2 portions (350g)', category: 'Meat & Seafood' },
      { name: 'Low-Sodium Tamari / Soy Sauce', amount: '3 tbsp', category: 'Pantry & Spices' },
      { name: 'Pure Honey', amount: '2 tbsp', category: 'Pantry & Spices' },
      { name: 'Fresh Grated Ginger & Garlic', amount: '1 tbsp each', category: 'Produce' },
      { name: 'Steamed Jasmine Rice', amount: '2 cups', category: 'Pantry & Spices' },
      { name: 'Ripe Hass Avocado', amount: '1 sliced', category: 'Produce' },
      { name: 'Steamed Shelled Edamame', amount: '1/2 cup', category: 'Produce' },
      { name: 'Toasted Sesame Seeds & Scallions', amount: '1 tbsp', category: 'Pantry & Spices' }
    ],
    steps: [
      { stepNumber: 1, instruction: 'Simmer soy sauce, honey, grated ginger, and garlic in a small pan until sticky glaze consistency (3 mins).', completed: false, timerMinutes: 3 },
      { stepNumber: 2, instruction: 'Pat salmon fillets bone-dry. Season generously with sea salt on both sides.', completed: false, timerMinutes: 2 },
      { stepNumber: 3, instruction: 'Heat avocado oil in a stainless pan over medium-high heat. Place salmon skin-side down and press gently with spatula for 4 mins until ultra-crisp.', completed: false, timerMinutes: 4 },
      { stepNumber: 4, instruction: 'Flip salmon, brush thick teriyaki glaze over the top, and baste for 2-3 mins until just cooked through.', completed: false, timerMinutes: 3 },
      { stepNumber: 5, instruction: 'Assemble bowls with fluffy warm rice, sliced avocado, edamame, crispy salmon, and a sprinkle of toasted sesame.', completed: false, timerMinutes: 2 }
    ]
  },
  {
    id: 'rec-4',
    title: 'Smashed Guacamole & Charred Corn Street Tacos',
    description: 'Charred corn kernels, roasted poblanos, cotija cheese, and fresh creamy guacamole folded into warm handmade corn tortillas.',
    category: 'Mexican',
    prepTime: '15 mins',
    cookTime: '10 mins',
    servings: 4,
    difficulty: 'Easy',
    calories: 340,
    rating: 4.82,
    reviewsCount: 76,
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop&q=80',
    isFavorite: false,
    chef: {
      name: 'Sofia Hernandez',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
    },
    ingredients: [
      { name: 'White Corn Tortillas', amount: '8 small', category: 'Bakery' },
      { name: 'Ripe Hass Avocados', amount: '3 medium', category: 'Produce' },
      { name: 'Sweet Corn on the Cob (or kernels)', amount: '2 ears', category: 'Produce' },
      { name: 'Lime Juice', amount: '2 fresh limes', category: 'Produce' },
      { name: 'Cotija Cheese (crumbled)', amount: '1/2 cup', category: 'Dairy & Eggs' },
      { name: 'Fresh Cilantro (chopped)', amount: '1/3 cup', category: 'Produce' },
      { name: 'Chipotle Chili Powder', amount: '1 tsp', category: 'Pantry & Spices' }
    ],
    steps: [
      { stepNumber: 1, instruction: 'Char the sweet corn kernels in a smoking hot cast-iron skillet with chili powder until blistered and smokey.', completed: false, timerMinutes: 6 },
      { stepNumber: 2, instruction: 'In a molcajete or wooden bowl, smash the avocados with fresh lime juice, sea salt, minced red onion, and cilantro.', completed: false, timerMinutes: 4 },
      { stepNumber: 3, instruction: 'Warm tortillas directly over an open flame for 20 seconds each until lightly charred and pliable.', completed: false, timerMinutes: 3 },
      { stepNumber: 4, instruction: 'Layer each taco with smashed guacamole, warm charred corn, crumbled cotija, pickled red onions, and lime wedges.', completed: false, timerMinutes: 2 }
    ]
  },
  {
    id: 'rec-5',
    title: 'Rainbow Mediterranean Quinoa & Roasted Chickpea Bowl',
    description: 'Fluffy herb quinoa, crispy zaatar chickpeas, heirloom cherry tomatoes, cucumbers, and creamy lemon-tahini drizzle.',
    category: 'Healthy',
    prepTime: '15 mins',
    cookTime: '20 mins',
    servings: 2,
    difficulty: 'Easy',
    calories: 390,
    rating: 4.91,
    reviewsCount: 165,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80',
    isFavorite: true,
    chef: {
      name: 'Dr. Leah Green',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80'
    },
    ingredients: [
      { name: 'Organic Tri-Color Quinoa', amount: '1 cup dry', category: 'Pantry & Spices' },
      { name: 'Cooked Chickpeas (drained & dried)', amount: '1 can (400g)', category: 'Pantry & Spices' },
      { name: 'Zaatar Spice Blend', amount: '1.5 tbsp', category: 'Pantry & Spices' },
      { name: 'Persian Cucumbers', amount: '2 sliced', category: 'Produce' },
      { name: 'Heirloom Cherry Tomatoes', amount: '1 cup halved', category: 'Produce' },
      { name: 'Artisan Tahini Paste', amount: '3 tbsp', category: 'Pantry & Spices' },
      { name: 'Kalamata Olives (pitted)', amount: '1/3 cup', category: 'Pantry & Spices' }
    ],
    steps: [
      { stepNumber: 1, instruction: 'Cook quinoa in vegetable broth for 15 mins until fluffy. Let steam covered off heat.', completed: false, timerMinutes: 15 },
      { stepNumber: 2, instruction: 'Toss dry chickpeas with olive oil and zaatar. Roast in oven or air fryer at 200°C (400°F) for 18 mins until super crunchy.', completed: false, timerMinutes: 18 },
      { stepNumber: 3, instruction: 'Whisk tahini with fresh lemon juice, 2 tbsp cold water, and minced garlic until light and creamy.', completed: false, timerMinutes: 3 },
      { stepNumber: 4, instruction: 'Build bowl sections: quinoa bed, cucumber ribbons, sweet tomatoes, olives, crispy chickpeas, and a generous tahini swirl.', completed: false, timerMinutes: 3 }
    ]
  },
  {
    id: 'rec-6',
    title: 'Molten Belgian Dark Chocolate Fondant Cake',
    description: 'Decadent individual chocolate cakes with an irresistibly warm, liquid ganache center, dusted with powdered sugar and sea salt flakes.',
    category: 'Desserts',
    prepTime: '15 mins',
    cookTime: '11 mins',
    servings: 2,
    difficulty: 'Medium',
    calories: 490,
    rating: 4.98,
    reviewsCount: 340,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop&q=80',
    isFavorite: false,
    chef: {
      name: 'Chef Sophie Laurent',
      avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=120&auto=format&fit=crop&q=80'
    },
    ingredients: [
      { name: '70% Valrhona Dark Chocolate', amount: '120g chopped', category: 'Pantry & Spices' },
      { name: 'Unsalted European Butter', amount: '80g', category: 'Dairy & Eggs' },
      { name: 'Whole Eggs + Egg Yolks', amount: '2 whole + 2 yolks', category: 'Dairy & Eggs' },
      { name: 'Cane Sugar', amount: '1/3 cup', category: 'Pantry & Spices' },
      { name: 'Pastry Flour', amount: '2 tbsp', category: 'Pantry & Spices' },
      { name: 'Vanilla Bean Extract', amount: '1 tsp', category: 'Pantry & Spices' }
    ],
    steps: [
      { stepNumber: 1, instruction: 'Preheat oven to 200°C (400°F). Butter two ramekins and coat thoroughly with cocoa powder.', completed: false, timerMinutes: 3 },
      { stepNumber: 2, instruction: 'Melt dark chocolate and butter together over a gentle water bath (bain-marie) until glossy.', completed: false, timerMinutes: 5 },
      { stepNumber: 3, instruction: 'Beat eggs, yolks, sugar, and vanilla until pale and doubled in volume (3 mins).', completed: false, timerMinutes: 3 },
      { stepNumber: 4, instruction: 'Fold chocolate mixture into eggs, then gently sift in the flour.', completed: false, timerMinutes: 2 },
      { stepNumber: 5, instruction: 'Bake for exactly 11 minutes until edges are set but center remains soft and molten. Invert onto dessert plate and dust with powdered sugar.', completed: false, timerMinutes: 11 }
    ]
  },
  {
    id: 'rec-7',
    title: '10-Minute Chili Garlic Crispy Sesame Noodles',
    description: 'Chewy ramen noodles slicked in hot smoking chili garlic oil, toasted sesame paste, dark soy, and scallions.',
    category: '15-Min Quick',
    prepTime: '4 mins',
    cookTime: '6 mins',
    servings: 1,
    difficulty: 'Easy',
    calories: 410,
    rating: 4.87,
    reviewsCount: 88,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80',
    isFavorite: false,
    chef: {
      name: 'Kenji Takahashi',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'
    },
    ingredients: [
      { name: 'Fresh Wheat or Ramen Noodles', amount: '1 bundle (150g)', category: 'Bakery' },
      { name: 'Garlic (finely grated)', amount: '3 cloves', category: 'Produce' },
      { name: 'Gochugaru or Chili Flakes', amount: '1.5 tbsp', category: 'Pantry & Spices' },
      { name: 'Toasted Sesame Paste (Tahini works)', amount: '1 tbsp', category: 'Pantry & Spices' },
      { name: 'Dark Soy Sauce + Chinkiang Vinegar', amount: '1 tbsp each', category: 'Pantry & Spices' },
      { name: 'Neutral Oil (piping hot)', amount: '2.5 tbsp', category: 'Pantry & Spices' },
      { name: 'Crisp Scallions & Sesame Seeds', amount: '2 tbsp', category: 'Produce' }
    ],
    steps: [
      { stepNumber: 1, instruction: 'Boil noodles for 3-4 minutes. Drain and rinse briefly under warm water.', completed: false, timerMinutes: 4 },
      { stepNumber: 2, instruction: 'In your serving bowl, add grated garlic, chili flakes, scallion whites, and sesame seeds.', completed: false, timerMinutes: 1 },
      { stepNumber: 3, instruction: 'Heat oil in a small pan until smoking hot. Pour oil directly over the garlic-chili mixture to sizzle and bloom spices.', completed: false, timerMinutes: 2 },
      { stepNumber: 4, instruction: 'Stir in soy sauce, black vinegar, and sesame paste until creamy.', completed: false, timerMinutes: 1 },
      { stepNumber: 5, instruction: 'Drop noodles into bowl, toss vigorously until every strand is coated, and top with greens.', completed: false, timerMinutes: 1 }
    ]
  }
];

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private readonly storageKey = 'yumcraft_recipes';

  readonly recipes = signal<Recipe[]>(this.loadInitialRecipes());
  readonly searchQuery = signal<string>('');
  readonly selectedCategory = signal<RecipeCategory>('All');

  // Derived filtered recipes
  readonly filteredRecipes = computed(() => {
    const list = this.recipes();
    const query = this.searchQuery().toLowerCase().trim();
    const cat = this.selectedCategory();

    return list.filter(recipe => {
      const matchesCategory = cat === 'All' || recipe.category === cat;
      const matchesQuery = !query ||
        recipe.title.toLowerCase().includes(query) ||
        recipe.description.toLowerCase().includes(query) ||
        recipe.ingredients.some(i => i.name.toLowerCase().includes(query)) ||
        recipe.chef.name.toLowerCase().includes(query);

      return matchesCategory && matchesQuery;
    });
  });

  readonly favoriteRecipes = computed(() => {
    return this.recipes().filter(r => r.isFavorite);
  });

  constructor() {
    effect(() => {
      const data = this.recipes();
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.storageKey, JSON.stringify(data));
      }
    });
  }

  private loadInitialRecipes(): Recipe[] {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return SEED_RECIPES;
  }

  getRecipeById(id: string): Recipe | undefined {
    return this.recipes().find(r => r.id === id);
  }

  toggleFavorite(id: string): boolean {
    let nowFavorite = false;
    this.recipes.update(current => 
      current.map(r => {
        if (r.id === id) {
          nowFavorite = !r.isFavorite;
          return { ...r, isFavorite: nowFavorite };
        }
        return r;
      })
    );
    return nowFavorite;
  }

  addRecipe(recipeData: Omit<Recipe, 'id' | 'rating' | 'reviewsCount'>): Recipe {
    const id = `rec-${Date.now()}`;
    const newRecipe: Recipe = {
      ...recipeData,
      id,
      rating: 5.0,
      reviewsCount: 1
    };

    this.recipes.update(current => [newRecipe, ...current]);
    return newRecipe;
  }

  toggleStepComplete(recipeId: string, stepNumber: number): void {
    this.recipes.update(current =>
      current.map(recipe => {
        if (recipe.id !== recipeId) return recipe;
        return {
          ...recipe,
          steps: recipe.steps.map(s => 
            s.stepNumber === stepNumber ? { ...s, completed: !s.completed } : s
          )
        };
      })
    );
  }

  toggleIngredientChecked(recipeId: string, ingredientName: string): void {
    this.recipes.update(current =>
      current.map(recipe => {
        if (recipe.id !== recipeId) return recipe;
        return {
          ...recipe,
          ingredients: recipe.ingredients.map(i =>
            i.name === ingredientName ? { ...i, checked: !i.checked } : i
          )
        };
      })
    );
  }

  resetRecipes(): void {
    this.recipes.set(SEED_RECIPES);
  }

  setCategory(cat: RecipeCategory): void {
    this.selectedCategory.set(cat);
  }

  setSearchQuery(q: string): void {
    this.searchQuery.set(q);
  }
}
