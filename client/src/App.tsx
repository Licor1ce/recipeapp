import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import NavBar from "@/components/layout/NavBar";
import HomePage from "@/pages/home";
import CategoriesPage from "@/pages/categories";
import RecipeListPage from "@/pages/recipe-list";
import RecipeDetailPage from "@/pages/recipe-detail";
import MealPlanPage from "@/pages/meal-plan";
import AddRecipePage from "@/pages/add-recipe";
import ShoppingListPage from "@/pages/shopping-list";
import { useEffect, useState } from "react";
import { initialRecipes } from "./data/initial-recipes";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/categories/:season" component={CategoriesPage} />
      <Route path="/recipes/:season/:category" component={RecipeListPage} />
      <Route path="/recipe/:id" component={RecipeDetailPage} />
      <Route path="/meal-plan" component={MealPlanPage} />
      <Route path="/add-recipe/:season" component={AddRecipePage} />
      <Route path="/shopping-list" component={ShoppingListPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [mounted, setMounted] = useState(false);

  // Initialize local storage data on first load
  useEffect(() => {
    const mealPlan = localStorage.getItem('mealPlan');
    const favorites = localStorage.getItem('favorites');
    const recipes = localStorage.getItem('recipes');
    
    if (!mealPlan) {
      localStorage.setItem('mealPlan', JSON.stringify([]));
    }
    
    if (!favorites) {
      localStorage.setItem('favorites', JSON.stringify([]));
    }
    
    // Add our initial recipes if they don't exist yet
    if (!recipes) {
      localStorage.setItem('recipes', JSON.stringify(initialRecipes));
    }
    
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen pb-16">
          <Toaster />
          <Router />
          <NavBar />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
