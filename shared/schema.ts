import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Recipe categories
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
  season: text("season").notNull(),
});

// Recipes table
export const recipes = pgTable("recipes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  icon: text("icon").notNull(),
  time: integer("time").notNull(),
  prepTime: integer("prep_time").notNull(),
  cookTime: integer("cook_time").notNull(),
  servings: integer("servings").notNull(),
  rating: text("rating").notNull(),
  reviews: integer("reviews").notNull().default(0),
  season: text("season").notNull(),
  categoryId: integer("category_id").notNull(),
  ingredients: jsonb("ingredients").notNull().$type<string[]>(),
  preparation: jsonb("preparation").notNull().$type<string[]>(),
  cooking: jsonb("cooking").notNull().$type<string[]>(),
  tips: jsonb("tips").notNull().$type<string[]>(),
});

// Meal plan items
export const mealPlanItems = pgTable("meal_plan_items", {
  id: serial("id").primaryKey(),
  recipeId: integer("recipe_id").notNull(),
  dayId: text("day_id").notNull(),
  mealType: text("meal_type").notNull(),
  userId: text("user_id").notNull(),
  weekStart: text("week_start").notNull(),
});

// Grocery list items
export const groceryListItems = pgTable("grocery_list_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  quantity: text("quantity").notNull(),
  unit: text("unit"),
  checked: boolean("checked").notNull().default(false),
  userId: text("user_id").notNull(),
});

// Favorites
export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  recipeId: integer("recipe_id").notNull(),
  userId: text("user_id").notNull(),
});

// Insert schemas
export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  icon: true,
  season: true,
});

export const insertRecipeSchema = createInsertSchema(recipes).pick({
  title: true,
  icon: true,
  time: true,
  prepTime: true,
  cookTime: true,
  servings: true,
  rating: true,
  reviews: true,
  season: true,
  categoryId: true,
  ingredients: true,
  preparation: true,
  cooking: true,
  tips: true,
});

export const insertMealPlanItemSchema = createInsertSchema(mealPlanItems).pick({
  recipeId: true,
  dayId: true,
  mealType: true,
  userId: true,
  weekStart: true,
});

export const insertGroceryListItemSchema = createInsertSchema(groceryListItems).pick({
  name: true,
  quantity: true,
  unit: true,
  checked: true,
  userId: true,
});

export const insertFavoriteSchema = createInsertSchema(favorites).pick({
  recipeId: true,
  userId: true,
});

// Types
export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Recipe = typeof recipes.$inferSelect;
export type InsertRecipe = z.infer<typeof insertRecipeSchema>;

export type MealPlanItem = typeof mealPlanItems.$inferSelect;
export type InsertMealPlanItem = z.infer<typeof insertMealPlanItemSchema>;

export type GroceryListItem = typeof groceryListItems.$inferSelect;
export type InsertGroceryListItem = z.infer<typeof insertGroceryListItemSchema>;

export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
