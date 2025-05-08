import { useLocation, useParams } from "wouter";
import { ArrowLeft, Heart, Share, Check, Trash2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const RecipeDetailPage = () => {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [activeTab, setActiveTab] = useState("ingredients");
  const [isFavorite, setIsFavorite] = useState(false);
  const [localRecipe, setLocalRecipe] = useState<Recipe | null>(null);
  
  // Define a Recipe interface for proper typing
  interface Recipe {
    id: number;
    title: string;
    category?: string | number;
    categoryId?: number;
    categoryName?: string;
    season: string;
    prepTime: number;
    cookTime: number;
    servings: number;
    rating: string;
    reviews: number;
    icon: string;
    ingredients: string[];
    preparation: string[];
    cooking: string[];
    tips: string[];
    image?: string;
    time?: number;
  }

  // Type the query result from API
  const { data: apiRecipe } = useQuery<Recipe>({
    queryKey: [`/api/recipe/${id}`],
    // Disable error retries and don't show network errors for local recipes 
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity
  });

  // Check if recipe exists in local storage (for user-created recipes)
  useEffect(() => {
    const localRecipes = JSON.parse(localStorage.getItem('recipes') || '[]');
    const recipe = localRecipes.find((r: any) => r.id.toString() === id);
    if (recipe) {
      console.log("Found recipe in local storage:", recipe);
      setLocalRecipe(recipe);
    }
  }, [id]);

  // Use either API or local recipe data
  const recipe = apiRecipe || localRecipe;

  // Type guard function to check if we have a valid recipe
  const isValidRecipe = (recipe: any): recipe is Recipe => {
    return recipe && typeof recipe === 'object' && 'title' in recipe;
  };

  useEffect(() => {
    if (!isValidRecipe(recipe)) return;
    
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(favorites.includes(Number(id)));
  }, [id, recipe]);
  
  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    let newFavorites;
    
    if (isFavorite) {
      newFavorites = favorites.filter((favId: number) => favId !== Number(id));
      toast({
        title: "Removed from favorites",
        description: `${recipe?.title} has been removed from your favorites.`,
      });
    } else {
      newFavorites = [...favorites, Number(id)];
      toast({
        title: "Added to favorites",
        description: `${recipe?.title} has been added to your favorites.`,
      });
    }
    
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  };
  
  const addToMealPlan = () => {
    if (recipe) {
      try {
        // Get current meal plan from localStorage
        const mealPlan = JSON.parse(localStorage.getItem('mealPlan') || '[]');
        
        // Get the selected day if available, otherwise default to Monday
        const selectedDay = localStorage.getItem('selectedDay') || "monday";
        
        // Get the mapping of day names
        const dayNames: Record<string, string> = {
          "monday": "Monday", 
          "tuesday": "Tuesday", 
          "wednesday": "Wednesday",
          "thursday": "Thursday",
          "friday": "Friday",
          "saturday": "Saturday",
          "sunday": "Sunday"
        };
        
        // Create a new meal item
        const newMeal = {
          id: Date.now(),
          recipeId: Number(id),
          dayId: selectedDay,
          mealType: "dinner", // Default to dinner
        };
        
        // Add the new meal to the plan
        const updatedMealPlan = [...mealPlan, newMeal];
        localStorage.setItem('mealPlan', JSON.stringify(updatedMealPlan));
        
        toast({
          title: "Added to meal plan",
          description: `${recipe.title} has been added to ${dayNames[selectedDay]}'s dinner. You can change this in the meal plan page.`,
        });
        
        // Navigate to meal plan to see the result
        navigate('/meal-plan');
      } catch (error) {
        console.error("Error adding to meal plan:", error);
        toast({
          title: "Error",
          description: "There was a problem adding to your meal plan. Please try again.",
          variant: "destructive"
        });
      }
    }
  };
  
  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mint"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-light-pink py-4 px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center">
          <button 
            onClick={() => navigate("/" as any)}
            className="mr-4"
          >
            <ArrowLeft className="h-6 w-6 text-white" />
          </button>
          <h1 className="text-white text-2xl font-bold">{recipe.title}</h1>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={toggleFavorite}
            className="bg-white rounded-full p-2 shadow-md"
          >
            <Heart className={`h-6 w-6 ${isFavorite ? "fill-light-pink text-light-pink" : "text-light-pink"}`} />
          </button>
          <button className="bg-white rounded-full p-2 shadow-md">
            <Share className="h-6 w-6 text-light-pink" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        {/* Recipe Image */}
        <div className="mb-6 bg-soft-lavender bg-opacity-20 rounded-xl p-4 flex justify-center">
          {recipe.image ? (
            <div className="w-64 h-64 rounded-lg overflow-hidden">
              <img 
                src={recipe.image} 
                alt={recipe.title} 
                className="w-full h-full object-contain" 
                onError={(e) => {
                  console.error("Image failed to load", e);
                  const target = e.target as HTMLImageElement;
                  target.onerror = null; // prevent infinite loops
                  target.src = ""; // clear the image
                  target.style.display = "none"; // hide the image
                  target.parentElement!.innerHTML = `<div class="w-full h-full bg-soft-beige flex items-center justify-center text-6xl">${recipe.icon || '🍽️'}</div>`;
                }}
              />
            </div>
          ) : (
            <div className="w-48 h-48 rounded-lg bg-soft-beige flex items-center justify-center text-6xl">
              {recipe.icon}
            </div>
          )}
        </div>
        
        {/* Recipe Info */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="bg-white rounded-lg p-3 flex items-center gap-2 shadow-sm">
            <span className="text-gray-400">⏱️</span>
            <div>
              <p className="text-xs text-gray-500">Prep Time</p>
              <p className="font-bold text-gray-700">{recipe.prepTime} min</p>
            </div>
          </div>
          <div className="bg-white rounded-lg p-3 flex items-center gap-2 shadow-sm">
            <span className="text-gray-400">🍳</span>
            <div>
              <p className="text-xs text-gray-500">Cook Time</p>
              <p className="font-bold text-gray-700">{recipe.cookTime} min</p>
            </div>
          </div>
          <div className="bg-white rounded-lg p-3 flex items-center gap-2 shadow-sm">
            <span className="text-gray-400">👥</span>
            <div>
              <p className="text-xs text-gray-500">Servings</p>
              <p className="font-bold text-gray-700">{recipe.servings}</p>
            </div>
          </div>
          <div className="bg-white rounded-lg p-3 flex items-center gap-2 shadow-sm">
            <span className="text-gray-400">⭐</span>
            <div>
              <p className="text-xs text-gray-500">Rating</p>
              <p className="font-bold text-gray-700">{recipe.rating} ({recipe.reviews})</p>
            </div>
          </div>
        </div>
        
        {/* Add to Meal Plan & Delete Recipe */}
        <div className="mb-6 flex flex-col space-y-3">
          <button 
            onClick={addToMealPlan}
            className="bg-light-pink text-white py-3 px-4 rounded-lg w-full flex items-center justify-center gap-2 hover:bg-pink-400 transition shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add to Meal Plan
          </button>
          
          {/* Only show delete button for locally created recipes */}
          {localRecipe && (
            <button 
              onClick={() => {
                // Show confirmation before deleting
                if (window.confirm(`Are you sure you want to delete "${recipe.title}"?`)) {
                  // Get all recipes from local storage
                  const localRecipes = JSON.parse(localStorage.getItem('recipes') || '[]');
                  
                  // Filter out the current recipe
                  const updatedRecipes = localRecipes.filter((r: any) => r.id.toString() !== id);
                  
                  // Save back to local storage
                  localStorage.setItem('recipes', JSON.stringify(updatedRecipes));
                  
                  // Remove from meal plan if it's there
                  const mealPlan = JSON.parse(localStorage.getItem('mealPlan') || '[]');
                  const updatedMealPlan = mealPlan.filter((meal: any) => meal.recipeId.toString() !== id);
                  localStorage.setItem('mealPlan', JSON.stringify(updatedMealPlan));
                  
                  // Remove from favorites if it's there
                  const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
                  const updatedFavorites = favorites.filter((favId: number) => favId.toString() !== id);
                  localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
                  
                  // Invalidate queries to refresh data
                  queryClient.invalidateQueries({queryKey: ['/api/recipes']});
                  
                  // Show toast notification
                  toast({
                    title: "Recipe Deleted",
                    description: `"${recipe.title}" has been deleted successfully.`,
                  });
                  
                  // Navigate back to the recipe list
                  navigate(`/categories/${recipe.season}`);
                }
              }}
              className="bg-red-500 text-white py-3 px-4 rounded-lg w-full flex items-center justify-center gap-2 hover:bg-red-600 transition shadow-md"
            >
              <Trash2 className="h-5 w-5" />
              Delete Recipe
            </button>
          )}
        </div>
        
        {/* Recipe Tabs */}
        <div className="mb-6">
          <div className="flex border-b border-gray-200">
            <button 
              onClick={() => setActiveTab("ingredients")}
              className={`py-2 px-4 border-b-2 font-medium ${activeTab === "ingredients" ? "border-light-pink text-light-pink" : "border-transparent text-gray-500"}`}
            >
              Ingredients
            </button>
            <button 
              onClick={() => setActiveTab("preparation")}
              className={`py-2 px-4 border-b-2 font-medium ${activeTab === "preparation" ? "border-light-pink text-light-pink" : "border-transparent text-gray-500"}`}
            >
              Preparation
            </button>
            <button 
              onClick={() => setActiveTab("cooking")}
              className={`py-2 px-4 border-b-2 font-medium ${activeTab === "cooking" ? "border-light-pink text-light-pink" : "border-transparent text-gray-500"}`}
            >
              Cooking
            </button>
          </div>
        </div>
        
        {/* Ingredients Tab Content */}
        <div className={activeTab === "ingredients" ? "" : "hidden"}>
          <div className="bg-white rounded-xl p-5 shadow-md">
            <h3 className="font-bold text-lg text-gray-700 mb-4">Ingredientes:</h3>
            <ul className="space-y-3">
              {recipe.ingredients.map((ingredient: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="min-w-6 h-6 rounded-full bg-pale-yellow bg-opacity-40 flex items-center justify-center mt-0.5">
                    <Check className="h-4 w-4 text-yellow-500" />
                  </div>
                  <span className="text-gray-700">{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Preparation Tab Content */}
        <div className={activeTab === "preparation" ? "" : "hidden"}>
          <div className="bg-white rounded-xl p-5 shadow-md">
            <h3 className="font-bold text-lg text-gray-700 mb-4">Preparación de los ingredientes:</h3>
            <ol className="space-y-4">
              {recipe.preparation.map((step: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="min-w-6 h-6 rounded-full bg-light-pink flex items-center justify-center text-white font-bold text-sm mt-0.5">
                    {index + 1}
                  </div>
                  <span className="text-gray-700">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
        
        {/* Cooking Tab Content */}
        <div className={activeTab === "cooking" ? "" : "hidden"}>
          <div className="bg-white rounded-xl p-5 shadow-md">
            <h3 className="font-bold text-lg text-gray-700 mb-4">Cocción:</h3>
            <ol className="space-y-4">
              {recipe.cooking.map((step: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="min-w-6 h-6 rounded-full bg-baby-blue flex items-center justify-center text-white font-bold text-sm mt-0.5">
                    {index + 1}
                  </div>
                  <span className="text-gray-700">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
        
        {/* Notes and Tips */}
        {recipe.tips && recipe.tips.length > 0 && (
          <div className="mt-6">
            <div className="bg-pale-yellow rounded-xl p-5 shadow-md">
              <h3 className="font-bold text-lg text-gray-700 mb-2">Notes & Tips</h3>
              <ul className="space-y-2">
                {recipe.tips.map((tip: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-yellow-500">💡</span>
                    <span className="text-gray-700 text-sm">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default RecipeDetailPage;
