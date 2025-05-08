import { 
  type Category, type InsertCategory,
  type Recipe, type InsertRecipe,
  type MealPlanItem, type InsertMealPlanItem,
  type GroceryListItem, type InsertGroceryListItem,
  type Favorite, type InsertFavorite
} from "@shared/schema";

// Interface for the storage
export interface IStorage {
  // Categories
  getCategories(): Promise<Category[]>;
  getCategoriesBySeason(season: string): Promise<Category[]>;
  
  // Recipes
  getRecipe(id: number): Promise<Recipe | undefined>;
  getRecipes(): Promise<Recipe[]>;
  getRecipesBySeasonAndCategory(season: string, category: string): Promise<Recipe[]>;
  getRecipesByIds(ids: number[]): Promise<Recipe[]>;
  
  // Favorites
  addFavorite(favorite: InsertFavorite): Promise<Favorite>;
  removeFavorite(id: number): Promise<void>;
  getFavoritesByUserId(userId: string): Promise<Favorite[]>;
  
  // Meal Plan
  addMealPlanItem(mealPlanItem: InsertMealPlanItem): Promise<MealPlanItem>;
  removeMealPlanItem(id: number): Promise<void>;
  getMealPlanByUserAndWeek(userId: string, weekStart: string): Promise<MealPlanItem[]>;
  
  // Grocery List
  addGroceryListItem(groceryItem: InsertGroceryListItem): Promise<GroceryListItem>;
  updateGroceryListItem(id: number, updates: Partial<GroceryListItem>): Promise<GroceryListItem>;
  removeGroceryListItem(id: number): Promise<void>;
  getGroceryListByUserId(userId: string): Promise<GroceryListItem[]>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private categories: Map<number, Category>;
  private recipes: Map<number, Recipe>;
  private favorites: Map<number, Favorite>;
  private mealPlanItems: Map<number, MealPlanItem>;
  private groceryListItems: Map<number, GroceryListItem>;
  
  private categoryId: number;
  private recipeId: number;
  private favoriteId: number;
  private mealPlanItemId: number;
  private groceryListItemId: number;
  
  constructor() {
    this.categories = new Map();
    this.recipes = new Map();
    this.favorites = new Map();
    this.mealPlanItems = new Map();
    this.groceryListItems = new Map();
    
    this.categoryId = 1;
    this.recipeId = 1;
    this.favoriteId = 1;
    this.mealPlanItemId = 1;
    this.groceryListItemId = 1;
    
    // Initialize with some data
    this.initializeData();
  }
  
  private initializeData() {
    // Add categories
    const categories = [
      { name: "starters", icon: "🥖", season: "autumn-winter" },
      { name: "soups", icon: "🍜", season: "autumn-winter" },
      { name: "salads", icon: "🥗", season: "autumn-winter" },
      { name: "breakfast", icon: "🍳", season: "autumn-winter" },
      { name: "lunch", icon: "🍝", season: "autumn-winter" },
      { name: "dinner", icon: "🍲", season: "autumn-winter" },
      { name: "snacks", icon: "🥨", season: "autumn-winter" },
      { name: "beverages", icon: "🍹", season: "autumn-winter" },
      { name: "desserts", icon: "🍰", season: "autumn-winter" },
      
      { name: "starters", icon: "🥖", season: "spring-summer" },
      { name: "soups", icon: "🍜", season: "spring-summer" },
      { name: "salads", icon: "🥗", season: "spring-summer" },
      { name: "breakfast", icon: "🍳", season: "spring-summer" },
      { name: "lunch", icon: "🍝", season: "spring-summer" },
      { name: "dinner", icon: "🍲", season: "spring-summer" },
      { name: "snacks", icon: "🥨", season: "spring-summer" },
      { name: "beverages", icon: "🍹", season: "spring-summer" },
      { name: "desserts", icon: "🍰", season: "spring-summer" },
    ];
    
    categories.forEach(cat => {
      const category: Category = {
        id: this.categoryId++,
        ...cat
      };
      this.categories.set(category.id, category);
    });
    
    // Add some recipes
    const recipes = [
      {
        title: "Tomato Bruschetta",
        icon: "🍅",
        time: 15,
        prepTime: 10,
        cookTime: 5,
        servings: 4,
        rating: "4.8",
        reviews: 24,
        season: "spring-summer",
        categoryId: 10, // spring-summer starters
        ingredients: [
          "1 baguette, sliced into 1/2 inch pieces",
          "6 ripe tomatoes, diced",
          "1/4 cup fresh basil, chopped",
          "3 cloves garlic, minced",
          "2 tablespoons extra virgin olive oil",
          "1 tablespoon balsamic vinegar",
          "Salt and pepper to taste"
        ],
        preparation: [
          "Preheat the oven to 350°F (175°C).",
          "Dice the tomatoes into small cubes and place in a bowl.",
          "Finely chop the fresh basil leaves.",
          "Mince the garlic cloves.",
          "Slice the baguette into approximately 1/2 inch thick pieces.",
          "In a bowl, combine the diced tomatoes, chopped basil, minced garlic, olive oil, and balsamic vinegar. Season with salt and pepper to taste. Mix well and set aside to marinate for at least 15 minutes."
        ],
        cooking: [
          "Place the baguette slices on a baking sheet.",
          "Lightly brush each slice with olive oil.",
          "Bake in the preheated oven for about 5 minutes or until lightly toasted.",
          "Remove from the oven and let cool for a minute.",
          "Top each bread slice with a generous spoonful of the tomato mixture.",
          "Serve immediately and enjoy!"
        ],
        tips: [
          "For best flavor, let the tomato mixture marinate for at least 15 minutes before serving.",
          "You can add a sprinkle of grated Parmesan cheese on top if desired.",
          "This dish is best served fresh, as the bread can become soggy if left too long with the tomato mixture on top."
        ]
      },
      {
        title: "Stuffed Mushrooms",
        icon: "🍄",
        time: 30,
        prepTime: 15,
        cookTime: 15,
        servings: 6,
        rating: "4.6",
        reviews: 18,
        season: "autumn-winter",
        categoryId: 1, // autumn-winter starters
        ingredients: [
          "24 large button mushrooms",
          "2 tablespoons olive oil",
          "1 small onion, finely chopped",
          "3 cloves garlic, minced",
          "1/2 cup breadcrumbs",
          "1/4 cup grated Parmesan cheese",
          "2 tablespoons fresh parsley, chopped",
          "Salt and pepper to taste"
        ],
        preparation: [
          "Preheat oven to 375°F (190°C).",
          "Clean mushrooms and remove stems, keeping caps intact.",
          "Finely chop the mushroom stems.",
          "In a pan, heat olive oil over medium heat.",
          "Add chopped onion and cook until translucent.",
          "Add minced garlic and chopped mushroom stems, cook for 2 minutes.",
          "Remove from heat and mix in breadcrumbs, Parmesan cheese, and parsley. Season with salt and pepper."
        ],
        cooking: [
          "Place mushroom caps on a baking sheet.",
          "Stuff each cap with the filling mixture.",
          "Bake for 15-20 minutes until mushrooms are tender and tops are golden.",
          "Let cool slightly before serving."
        ],
        tips: [
          "You can add cooked bacon or sausage to the filling for extra flavor.",
          "These can be prepared a day ahead and refrigerated until ready to bake.",
          "Sprinkle with extra cheese just before serving for a more decadent appetizer."
        ]
      },
      {
        title: "Deviled Eggs",
        icon: "🥚",
        time: 25,
        prepTime: 15,
        cookTime: 10,
        servings: 6,
        rating: "4.5",
        reviews: 15,
        season: "spring-summer",
        categoryId: 10, // spring-summer starters
        ingredients: [
          "12 large eggs",
          "1/2 cup mayonnaise",
          "2 teaspoons Dijon mustard",
          "1 teaspoon white vinegar",
          "1/4 teaspoon salt",
          "1/4 teaspoon black pepper",
          "Paprika for garnish",
          "Fresh chives, chopped (optional)"
        ],
        preparation: [
          "Place eggs in a single layer in a saucepan; cover with water.",
          "Bring to a boil, then remove from heat.",
          "Cover and let stand for 12 minutes.",
          "Drain and cool in ice water.",
          "Peel eggs and cut in half lengthwise.",
          "Remove yolks and place in a bowl."
        ],
        cooking: [
          "Mash yolks with a fork.",
          "Mix in mayonnaise, mustard, vinegar, salt, and pepper.",
          "Spoon or pipe the yolk mixture back into the egg whites.",
          "Sprinkle with paprika and garnish with chives if desired.",
          "Refrigerate until ready to serve."
        ],
        tips: [
          "For easier peeling, use eggs that are a few days old rather than very fresh.",
          "You can add finely chopped pickle relish or bacon bits to the filling for variation.",
          "These can be made up to 24 hours ahead and kept covered in the refrigerator."
        ]
      },
      {
        title: "Shrimp Cocktail",
        icon: "🍤",
        time: 20,
        prepTime: 10,
        cookTime: 10,
        servings: 4,
        rating: "4.7",
        reviews: 20,
        season: "spring-summer",
        categoryId: 10, // spring-summer starters
        ingredients: [
          "1 pound large shrimp, peeled and deveined",
          "1 cup ketchup",
          "2 tablespoons horseradish",
          "1 tablespoon lemon juice",
          "1/2 teaspoon Worcestershire sauce",
          "Hot sauce to taste",
          "Lemon wedges for garnish",
          "Fresh parsley for garnish"
        ],
        preparation: [
          "Bring a large pot of salted water to a boil.",
          "Add shrimp and cook until they turn pink, about 2-3 minutes.",
          "Drain and place in ice water to stop cooking.",
          "In a bowl, mix ketchup, horseradish, lemon juice, Worcestershire sauce, and hot sauce to make the cocktail sauce."
        ],
        cooking: [
          "Drain the cooled shrimp and pat dry.",
          "Arrange shrimp on the rim of a serving glass or bowl.",
          "Pour cocktail sauce in the center.",
          "Garnish with lemon wedges and fresh parsley.",
          "Serve chilled."
        ],
        tips: [
          "For the best flavor, make the cocktail sauce a few hours ahead to allow flavors to meld.",
          "You can add a splash of vodka to the cocktail sauce for an adult twist.",
          "Use jumbo shrimp for a more impressive presentation."
        ]
      },
      {
        title: "Pumpkin Soup",
        icon: "🎃",
        time: 40,
        prepTime: 15,
        cookTime: 25,
        servings: 6,
        rating: "4.9",
        reviews: 28,
        season: "autumn-winter",
        categoryId: 2, // autumn-winter soups
        ingredients: [
          "2 pounds pumpkin, peeled and cut into chunks",
          "1 large onion, chopped",
          "2 carrots, chopped",
          "2 cloves garlic, minced",
          "4 cups vegetable broth",
          "1 cup heavy cream",
          "2 tablespoons olive oil",
          "1 teaspoon nutmeg",
          "Salt and pepper to taste",
          "Pumpkin seeds for garnish"
        ],
        preparation: [
          "Peel and dice the pumpkin into 1-inch cubes.",
          "Chop the onion and carrots.",
          "Mince the garlic.",
          "Heat olive oil in a large pot over medium heat."
        ],
        cooking: [
          "Add onion and cook until translucent.",
          "Add garlic and cook for 1 minute.",
          "Add pumpkin and carrots, cook for 5 minutes.",
          "Pour in vegetable broth and bring to a boil.",
          "Reduce heat and simmer for 20 minutes until vegetables are tender.",
          "Use an immersion blender to puree the soup.",
          "Stir in cream and nutmeg, season with salt and pepper.",
          "Heat through and serve with roasted pumpkin seeds."
        ],
        tips: [
          "For a dairy-free version, substitute coconut milk for heavy cream.",
          "Add a pinch of cinnamon or curry powder for extra flavor.",
          "This soup freezes well for up to 3 months."
        ]
      }
    ];
    
    recipes.forEach(rec => {
      const recipe: Recipe = {
        id: this.recipeId++,
        ...rec
      };
      this.recipes.set(recipe.id, recipe);
    });
  }
  
  // Categories methods
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }
  
  async getCategoriesBySeason(season: string): Promise<Category[]> {
    return Array.from(this.categories.values()).filter(cat => cat.season === season);
  }
  
  // Recipes methods
  async getRecipe(id: number): Promise<Recipe | undefined> {
    return this.recipes.get(id);
  }
  
  async getRecipes(): Promise<Recipe[]> {
    return Array.from(this.recipes.values());
  }
  
  async getRecipesBySeasonAndCategory(season: string, category: string): Promise<Recipe[]> {
    // Find the category ID first
    const categoryObj = Array.from(this.categories.values()).find(
      cat => cat.season === season && cat.name === category
    );
    
    if (!categoryObj) {
      return [];
    }
    
    return Array.from(this.recipes.values()).filter(
      recipe => recipe.season === season && recipe.categoryId === categoryObj.id
    );
  }
  
  async getRecipesByIds(ids: number[]): Promise<Recipe[]> {
    return ids.map(id => this.recipes.get(id)).filter(Boolean) as Recipe[];
  }
  
  // Favorites methods
  async addFavorite(favorite: InsertFavorite): Promise<Favorite> {
    const newFavorite: Favorite = {
      id: this.favoriteId++,
      ...favorite
    };
    this.favorites.set(newFavorite.id, newFavorite);
    return newFavorite;
  }
  
  async removeFavorite(id: number): Promise<void> {
    this.favorites.delete(id);
  }
  
  async getFavoritesByUserId(userId: string): Promise<Favorite[]> {
    return Array.from(this.favorites.values()).filter(fav => fav.userId === userId);
  }
  
  // Meal Plan methods
  async addMealPlanItem(mealPlanItem: InsertMealPlanItem): Promise<MealPlanItem> {
    const newItem: MealPlanItem = {
      id: this.mealPlanItemId++,
      ...mealPlanItem
    };
    this.mealPlanItems.set(newItem.id, newItem);
    return newItem;
  }
  
  async removeMealPlanItem(id: number): Promise<void> {
    this.mealPlanItems.delete(id);
  }
  
  async getMealPlanByUserAndWeek(userId: string, weekStart: string): Promise<MealPlanItem[]> {
    return Array.from(this.mealPlanItems.values()).filter(
      item => item.userId === userId && item.weekStart === weekStart
    );
  }
  
  // Grocery List methods
  async addGroceryListItem(groceryItem: InsertGroceryListItem): Promise<GroceryListItem> {
    const newItem: GroceryListItem = {
      id: this.groceryListItemId++,
      ...groceryItem
    };
    this.groceryListItems.set(newItem.id, newItem);
    return newItem;
  }
  
  async updateGroceryListItem(id: number, updates: Partial<GroceryListItem>): Promise<GroceryListItem> {
    const item = this.groceryListItems.get(id);
    
    if (!item) {
      throw new Error(`Grocery list item with id ${id} not found`);
    }
    
    const updatedItem = { ...item, ...updates };
    this.groceryListItems.set(id, updatedItem);
    return updatedItem;
  }
  
  async removeGroceryListItem(id: number): Promise<void> {
    this.groceryListItems.delete(id);
  }
  
  async getGroceryListByUserId(userId: string): Promise<GroceryListItem[]> {
    return Array.from(this.groceryListItems.values()).filter(item => item.userId === userId);
  }
}

export const storage = new MemStorage();
