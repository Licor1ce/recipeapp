import { useLocation } from "wouter";
import { ArrowLeft, Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

interface MealItem {
  id: number;
  recipeId: number;
  dayId: string;
  mealType: string;
}

interface DayPlan {
  id: string;
  name: string;
  color: string;
  meals: MealItem[];
}

const MealPlanPage = () => {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  
  // Get the recipeId from URL if redirected from recipe detail
  const searchParams = new URLSearchParams(location.split("?")[1] || "");
  const recipeIdParam = searchParams.get("recipeId");
  
  // Create a weekly plan with days
  const daysOfWeek: DayPlan[] = [
    { id: "monday", name: "Monday", color: "light-pink", meals: [] },
    { id: "tuesday", name: "Tuesday", color: "baby-blue", meals: [] },
    { id: "wednesday", name: "Wednesday", color: "mint", meals: [] },
    { id: "thursday", name: "Thursday", color: "pale-yellow", meals: [] },
    { id: "friday", name: "Friday", color: "light-pink", meals: [] },
    { id: "saturday", name: "Saturday", color: "baby-blue", meals: [] },
    { id: "sunday", name: "Sunday", color: "mint", meals: [] },
  ];
  
  // Load meal plan from localStorage
  const [mealPlan, setMealPlan] = useState<MealItem[]>(() => {
    const saved = localStorage.getItem('mealPlan');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Define Recipe interface
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
  
  // If there's a recipeId in the URL, fetch that recipe
  const { data: recipeToAdd, isLoading: recipeLoading } = useQuery<Recipe>({
    queryKey: [`/api/recipe/${recipeIdParam}`],
    enabled: !!recipeIdParam,
  });
  
  // Fetch all recipes mentioned in the meal plan
  const recipeIds = Array.from(new Set(mealPlan.map(item => item.recipeId)));
  
  // Get recipes from server API - individually fetch each recipe
  const { data: apiRecipes = [] } = useQuery<any[]>({
    queryKey: ['/api/recipes/byIds', ...recipeIds],
    queryFn: async () => {
      if (recipeIds.length === 0 && !recipeIdParam) return [];
      
      try {
        const recipes = [];
        
        // First check if there's a recipe being added through URL param
        if (recipeIdParam) {
          try {
            const response = await fetch(`/api/recipe/${recipeIdParam}`);
            if (response.ok) {
              const recipe = await response.json();
              recipes.push(recipe);
            }
          } catch (error) {
            console.error(`Error fetching recipe by param ${recipeIdParam}:`, error);
          }
        }
        
        // Then fetch all recipes from the meal plan
        for (const id of recipeIds) {
          if (id === Number(recipeIdParam)) continue; // Skip if already fetched
          
          try {
            const response = await fetch(`/api/recipe/${id}`);
            if (response.ok) {
              const recipe = await response.json();
              recipes.push(recipe);
            }
          } catch (error) {
            console.error(`Error fetching recipe ${id}:`, error);
          }
        }
        
        console.log("All recipes fetched from API:", recipes);
        return recipes;
      } catch (error) {
        console.error("Error fetching recipes:", error);
        return [];
      }
    },
    enabled: recipeIds.length > 0 || !!recipeIdParam,
  });
  
  // Get recipes from local storage
  const [localRecipes, setLocalRecipes] = useState<any[]>(() => {
    const saved = localStorage.getItem('recipes');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Log data for debugging
  console.log("Meal Plan:", mealPlan);
  console.log("Recipe IDs in meal plan:", recipeIds);
  console.log("Recipe ID from params:", recipeIdParam);
  console.log("API Recipes:", apiRecipes);
  console.log("Local Recipes:", localRecipes);
  
  // Combine recipes from API and local storage
  const recipes = [
    ...apiRecipes,
    ...localRecipes.filter(r => {
      // Include recipe if it's the one being added or if it's already in the meal plan
      const isInMealPlan = recipeIds.includes(r.id);
      const isBeingAdded = recipeIdParam && r.id === parseInt(recipeIdParam);
      return isInMealPlan || isBeingAdded;
    })
  ];
  
  console.log("Combined recipes for meal plan:", recipes);
  
  // Fill in days with meals
  const dayPlans = daysOfWeek.map(day => {
    const dayMeals = mealPlan.filter(meal => meal.dayId === day.id);
    return { ...day, meals: dayMeals };
  });
  
  // Handle adding a recipe to the meal plan
  const [showDaySelection, setShowDaySelection] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [mealType, setMealType] = useState<string>("breakfast");

  // Define meal types
  const mealTypes = [
    { id: "breakfast", name: "Breakfast" },
    { id: "lunch", name: "Lunch" },
    { id: "dinner", name: "Dinner" },
    { id: "snack", name: "Snack" }
  ];
  
  useEffect(() => {
    if (recipeToAdd && recipeIdParam) {
      setShowDaySelection(true);
      setSelectedDay("monday"); // Default to Monday
      
      // Clear the URL parameter after handling
      navigate('/meal-plan', { replace: true });
    }
  }, [recipeToAdd, recipeIdParam, navigate]);
  
  const addMeal = (dayId: string, mealType: string) => {
    if (!recipeToAdd && !recipeIdParam) {
      setShowDaySelection(false);
      return;
    }
    
    // Find the recipe to add
    const recipeId = parseInt(recipeIdParam || "0");
    
    // Double check if the recipe exists in either API or local storage
    const recipeExists = apiRecipes.some((r: any) => r.id === recipeId) || 
                         localRecipes.some((r: any) => r.id === recipeId);
    
    if (!recipeExists) {
      console.error(`Recipe with ID ${recipeId} not found in API or local storage`);
      toast({
        title: "Error",
        description: "Recipe not found. Please try again.",
        variant: "destructive",
      });
      setShowDaySelection(false);
      return;
    }
    
    // Proceed with adding the meal to the plan
    const newMeal: MealItem = {
      id: Date.now(),
      recipeId: recipeId,
      dayId: dayId,
      mealType: mealType,
    };
    
    // Log the meal we're adding for debugging
    console.log("Adding meal:", newMeal);
    
    const updatedMealPlan = [...mealPlan, newMeal];
    setMealPlan(updatedMealPlan);
    localStorage.setItem('mealPlan', JSON.stringify(updatedMealPlan));
    
    toast({
      title: "Added to meal plan",
      description: `Recipe has been added to ${dayId}'s ${mealType}.`,
    });
    
    setShowDaySelection(false);
  };
  
  const removeMeal = (mealId: number) => {
    const updatedMealPlan = mealPlan.filter(meal => meal.id !== mealId);
    setMealPlan(updatedMealPlan);
    localStorage.setItem('mealPlan', JSON.stringify(updatedMealPlan));
    
    toast({
      title: "Removed from meal plan",
      description: "The meal has been removed from your plan.",
    });
  };
  
  // Add a recipe to the meal plan from browse page
  const addRecipeToMealPlan = () => {
    navigate('/categories/autumn-winter');
  };
  
  const generateShoppingList = () => {
    toast({
      title: "Shopping list generated",
      description: "Your shopping list has been created based on your meal plan.",
    });
    // Add fromMealPlan=true parameter to signal the shopping list to generate from meal plan
    navigate('/shopping-list?fromMealPlan=true');
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-soft-lavender py-4 px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center">
          <button 
            onClick={() => navigate('/')}
            className="mr-4"
          >
            <ArrowLeft className="h-6 w-6 text-white" />
          </button>
          <h1 className="text-white text-2xl font-bold">My Meal Plan</h1>
        </div>
        <button 
          onClick={addRecipeToMealPlan}
          className="bg-white rounded-full p-2 shadow-md"
        >
          <Plus className="h-6 w-6 text-soft-lavender" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        <div className="mb-6">
          <h2 className="font-bold text-lg text-center">Weekly Meal Plan</h2>
          <p className="text-sm text-gray-500 text-center">Plan your meals for each day of the week</p>
        </div>
        
        {/* Modal for day and meal type selection */}
        {showDaySelection && recipeToAdd && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-bold mb-4">Add {recipeToAdd.title} to meal plan</h3>
              
              {/* Day selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Day:</label>
                <div className="grid grid-cols-2 gap-2">
                  {daysOfWeek.map(day => (
                    <button 
                      key={day.id}
                      onClick={() => setSelectedDay(day.id)}
                      className={`py-2 px-3 rounded-lg border ${
                        selectedDay === day.id 
                          ? `bg-${day.color} text-white border-transparent` 
                          : 'bg-white text-gray-700 border-gray-300'
                      }`}
                    >
                      {day.name}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Meal type selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Meal Type:</label>
                <div className="grid grid-cols-2 gap-2">
                  {mealTypes.map(type => (
                    <button 
                      key={type.id}
                      onClick={() => setMealType(type.id)}
                      className={`py-2 px-3 rounded-lg border ${
                        mealType === type.id 
                          ? 'bg-light-pink text-white border-transparent' 
                          : 'bg-white text-gray-700 border-gray-300'
                      }`}
                    >
                      {type.name}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between mt-4">
                <button 
                  onClick={() => setShowDaySelection(false)}
                  className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg"
                >
                  Cancel
                </button>
                
                <button 
                  onClick={() => selectedDay && addMeal(selectedDay, mealType)}
                  className="bg-soft-lavender text-white py-2 px-4 rounded-lg"
                  disabled={!selectedDay}
                >
                  Add to Meal Plan
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Weekly Meal Plan */}
        <div className="space-y-4">
          {dayPlans.map(day => (
            <div key={day.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className={`bg-${day.color} px-4 py-3`}>
                <h3 className="font-bold text-white">{day.name}</h3>
              </div>
              <div className="p-4 space-y-3">
                {/* Display meals for this day */}
                {day.meals.map(meal => {
                  const recipe = recipes.find((r: any) => r.id === meal.recipeId);
                  return recipe ? (
                    <div key={meal.id} className="flex items-center justify-between p-3 bg-soft-beige rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-mint bg-opacity-20 flex items-center justify-center">
                          <span>{recipe.icon}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">{recipe.title}</p>
                          <p className="text-xs text-gray-500">{meal.mealType}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeMeal(meal.id)}
                        className="text-gray-400"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ) : null;
                })}
                
                {day.meals.length === 0 && (
                  <div className="py-4 text-center text-gray-500">
                    <p>No recipes added to {day.name.toLowerCase()} yet</p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => {
                      localStorage.setItem('selectedDay', day.id);
                      navigate('/categories/autumn-winter');
                    }}
                    className={`py-2 text-${day.color} flex items-center justify-center gap-1 border border-dashed border-${day.color} rounded-lg text-sm`}
                  >
                    <span>🍂</span> Autumn/Winter
                  </button>
                  
                  <button 
                    onClick={() => {
                      localStorage.setItem('selectedDay', day.id);
                      navigate('/categories/spring-summer');
                    }}
                    className={`py-2 text-${day.color} flex items-center justify-center gap-1 border border-dashed border-${day.color} rounded-lg text-sm`}
                  >
                    <span>🌱</span> Spring/Summer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Generate Shopping List */}
        <div className="mt-8">
          <button 
            onClick={generateShoppingList}
            className="bg-baby-blue text-white py-3 px-4 rounded-lg w-full flex items-center justify-center gap-2 hover:opacity-90 transition shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Generate Shopping List
          </button>
        </div>
      </main>
    </div>
  );
};

export default MealPlanPage;
