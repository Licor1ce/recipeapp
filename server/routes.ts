import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Categories API
  app.get('/api/categories/:season', async (req, res) => {
    const { season } = req.params;
    const categories = await storage.getCategoriesBySeason(season);
    res.json(categories);
  });

  // Recipes API
  app.get('/api/recipes/:season/:category', async (req, res) => {
    const { season, category } = req.params;
    const recipes = await storage.getRecipesBySeasonAndCategory(season, category);
    res.json(recipes);
  });
  
  // Add recipe endpoint
  app.post('/api/recipes', async (req, res) => {
    const recipe = req.body;
    try {
      const result = { ...recipe, id: recipe.id || Date.now() };
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: 'Failed to add recipe' });
    }
  });

  app.get('/api/recipe/:id', async (req, res) => {
    const { id } = req.params;
    const recipe = await storage.getRecipe(parseInt(id));
    
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    
    res.json(recipe);
  });
  
  app.get('/api/recipes/byIds', async (req, res) => {
    const idsParam = req.query.ids;
    let ids: number[] = [];
    
    if (typeof idsParam === 'string') {
      ids = idsParam.split(',').map(id => parseInt(id.trim()));
    } else if (Array.isArray(idsParam)) {
      ids = idsParam.map(id => parseInt(id as string));
    }
    
    if (ids.length === 0) {
      return res.json([]);
    }
    
    const recipes = await storage.getRecipesByIds(ids);
    res.json(recipes);
  });

  // Favorites API
  app.post('/api/favorites', async (req, res) => {
    const { recipeId, userId } = req.body;
    const favorite = await storage.addFavorite({ recipeId, userId });
    res.json(favorite);
  });

  app.delete('/api/favorites/:id', async (req, res) => {
    const { id } = req.params;
    await storage.removeFavorite(parseInt(id));
    res.json({ success: true });
  });

  app.get('/api/favorites/:userId', async (req, res) => {
    const { userId } = req.params;
    const favorites = await storage.getFavoritesByUserId(userId);
    res.json(favorites);
  });

  // Meal Plan API
  app.post('/api/meal-plan', async (req, res) => {
    const { recipeId, dayId, mealType, userId, weekStart } = req.body;
    const mealPlanItem = await storage.addMealPlanItem({ 
      recipeId, dayId, mealType, userId, weekStart 
    });
    res.json(mealPlanItem);
  });

  app.delete('/api/meal-plan/:id', async (req, res) => {
    const { id } = req.params;
    await storage.removeMealPlanItem(parseInt(id));
    res.json({ success: true });
  });

  app.get('/api/meal-plan/:userId/:weekStart', async (req, res) => {
    const { userId, weekStart } = req.params;
    const mealPlan = await storage.getMealPlanByUserAndWeek(userId, weekStart);
    res.json(mealPlan);
  });

  // Grocery List API
  app.post('/api/grocery-list', async (req, res) => {
    const { name, quantity, unit, userId } = req.body;
    const groceryItem = await storage.addGroceryListItem({ 
      name, quantity, unit, checked: false, userId 
    });
    res.json(groceryItem);
  });

  app.put('/api/grocery-list/:id', async (req, res) => {
    const { id } = req.params;
    const { checked } = req.body;
    const updatedItem = await storage.updateGroceryListItem(parseInt(id), { checked });
    res.json(updatedItem);
  });

  app.delete('/api/grocery-list/:id', async (req, res) => {
    const { id } = req.params;
    await storage.removeGroceryListItem(parseInt(id));
    res.json({ success: true });
  });

  app.get('/api/grocery-list/:userId', async (req, res) => {
    const { userId } = req.params;
    const groceryList = await storage.getGroceryListByUserId(userId);
    res.json(groceryList);
  });

  const httpServer = createServer(app);
  return httpServer;
}
