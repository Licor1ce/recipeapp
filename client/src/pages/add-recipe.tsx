import { useLocation, useParams } from "wouter";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { CategoryIcons } from "@/components/icons/food-icons";
import { queryClient } from "@/lib/queryClient";

const AddRecipePage = () => {
  const { season } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const [recipeData, setRecipeData] = useState({
    title: '',
    category: '',
    season: season || '',
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    rating: 4,
    reviews: 0,
    icon: '🍲',
    ingredients: [],
    preparation: [],
    cooking: [],
    tips: [],
    image: ''
  });
  
  // For image handling
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Fetch categories with proper typing
  const { data: categories = [] } = useQuery<any[]>({
    queryKey: [`/api/categories/${season}`],
    queryFn: async () => {
      const response = await fetch(`/api/categories/${season}`);
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      return response.json();
    }
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setRecipeData(prev => ({ ...prev, [id]: value }));
  };
  
  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Convert to base64 for storage
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setRecipeData(prev => ({ ...prev, image: base64String }));
      setImagePreview(base64String);
    };
    reader.readAsDataURL(file);
  };
  
  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    const lines = value.split('\n').filter(line => line.trim());
    setRecipeData(prev => ({ ...prev, [id]: lines }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Create a new recipe object
      // Log the recipe data
      console.log("Submitting recipe with data:", recipeData);
      
      // Find the category name from selected category ID
      const selectedCategory = categories.find(
        (cat: any) => cat.id.toString() === recipeData.category
      );
      
      // Create a properly formatted recipe object
      const newRecipe = {
        ...recipeData,
        id: Date.now(), // Generate a temporary ID
        time: Number(recipeData.prepTime) + Number(recipeData.cookTime), // Total time
        prepTime: Number(recipeData.prepTime),
        cookTime: Number(recipeData.cookTime),
        servings: Number(recipeData.servings),
        season: season,
        categoryId: Number(recipeData.category), // Always store categoryId as a number
        category: recipeData.category, // Store category as string for filtering
        categoryName: selectedCategory ? selectedCategory.name : "", // Store category name
        rating: "4.0",
        reviews: 0,
      };
      
      // Log categories before saving for debugging
      console.log("Available categories:", categories);
      console.log("Selected category ID:", recipeData.category);
      console.log("Selected category object:", selectedCategory);
      console.log("Final recipe to save:", newRecipe);
      
      console.log("Saving new recipe:", newRecipe);
      
      // Store the recipe in local storage for this demo
      const existingRecipes = JSON.parse(localStorage.getItem('recipes') || '[]');
      const updatedRecipes = [...existingRecipes, newRecipe];
      localStorage.setItem('recipes', JSON.stringify(updatedRecipes));
      
      // Invalidate all recipe-related queries to refresh data
      queryClient.invalidateQueries({queryKey: ['/api/recipes']});
      
      toast({
        title: "Recipe Added!",
        description: "Your recipe has been successfully added.",
      });
      
      navigate(`/categories/${season}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error adding your recipe. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-light-pink py-4 px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center">
          <button 
            onClick={() => navigate(`/categories/${season}`)}
            className="mr-4"
          >
            <ArrowLeft className="h-6 w-6 text-white" />
          </button>
          <h1 className="text-white text-2xl font-bold">Add New Recipe</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Recipe Basics */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="text-lg font-bold text-gray-700 mb-4">Recipe Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Recipe Title</label>
                  <input 
                    type="text" 
                    id="title"
                    value={recipeData.title}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-mint focus:border-mint"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select 
                    id="category"
                    value={recipeData.category}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-mint focus:border-mint"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category: any) => (
                      <option key={category.id} value={category.id}>
                        {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="prepTime" className="block text-sm font-medium text-gray-700 mb-1">Prep Time (min)</label>
                    <input 
                      type="number" 
                      id="prepTime"
                      value={recipeData.prepTime}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-mint focus:border-mint"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="cookTime" className="block text-sm font-medium text-gray-700 mb-1">Cook Time (min)</label>
                    <input 
                      type="number" 
                      id="cookTime"
                      value={recipeData.cookTime}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-mint focus:border-mint"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="servings" className="block text-sm font-medium text-gray-700 mb-1">Servings</label>
                  <input 
                    type="number" 
                    id="servings"
                    value={recipeData.servings}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-mint focus:border-mint"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="icon" className="block text-sm font-medium text-gray-700 mb-1">Recipe Icon</label>
                  <div className="grid grid-cols-5 gap-2 p-2 border border-gray-300 rounded-md">
                    {["🍲", "🍝", "🥗", "🍜", "🍕", "🍔", "🥪", "🍣", "🍱", "🥘", "🍛", "🍤", "🍗", "🥩", "🍖", "🌮", "🌯", "🥙", "🥟", "🍚"].map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setRecipeData({ ...recipeData, icon })}
                        className={`w-10 h-10 rounded-md flex items-center justify-center text-xl ${recipeData.icon === icon ? 'bg-mint text-white' : 'bg-gray-100'}`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="recipeImage" className="block text-sm font-medium text-gray-700 mb-1">
                    Recipe Photo (Optional)
                  </label>
                  <div className="mt-1 flex flex-col space-y-2">
                    <input
                      type="file"
                      id="recipeImage"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-mint file:text-white
                        hover:file:bg-green-600"
                    />
                    
                    {imagePreview && (
                      <div className="mt-2 relative">
                        <img 
                          src={imagePreview} 
                          alt="Recipe preview" 
                          className="h-40 w-full object-cover rounded-md" 
                        />
                        <button 
                          type="button"
                          onClick={() => {
                            setImagePreview(null);
                            setRecipeData(prev => ({ ...prev, image: '' }));
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Ingredients */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="text-lg font-bold text-gray-700 mb-4">Ingredients</h2>
              <div>
                <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700 mb-1">Ingredients (one per line)</label>
                <textarea 
                  id="ingredients"
                  rows={6}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-mint focus:border-mint"
                  placeholder="1 cup flour&#10;2 eggs&#10;1 tsp salt"
                  onChange={handleTextAreaChange}
                  required
                ></textarea>
              </div>
            </div>
            
            {/* Preparation */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="text-lg font-bold text-gray-700 mb-4">Preparation</h2>
              <div>
                <label htmlFor="preparation" className="block text-sm font-medium text-gray-700 mb-1">Preparation Steps (one per line)</label>
                <textarea 
                  id="preparation"
                  rows={6}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-mint focus:border-mint"
                  placeholder="Mix the flour and salt&#10;Add eggs and stir&#10;Let rest for 10 minutes"
                  onChange={handleTextAreaChange}
                  required
                ></textarea>
              </div>
            </div>
            
            {/* Cooking */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="text-lg font-bold text-gray-700 mb-4">Cooking</h2>
              <div>
                <label htmlFor="cooking" className="block text-sm font-medium text-gray-700 mb-1">Cooking Steps (one per line)</label>
                <textarea 
                  id="cooking"
                  rows={6}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-mint focus:border-mint"
                  placeholder="Heat pan over medium heat&#10;Cook for 5 minutes on each side&#10;Serve hot"
                  onChange={handleTextAreaChange}
                  required
                ></textarea>
              </div>
            </div>
            
            {/* Tips */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="text-lg font-bold text-gray-700 mb-4">Tips (Optional)</h2>
              <div>
                <label htmlFor="tips" className="block text-sm font-medium text-gray-700 mb-1">Tips and Notes (one per line)</label>
                <textarea 
                  id="tips"
                  rows={4}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-mint focus:border-mint"
                  placeholder="For extra flavor, add fresh herbs&#10;Can be stored in refrigerator for up to 3 days"
                  onChange={handleTextAreaChange}
                ></textarea>
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-end">
              <button 
                type="submit"
                className="bg-light-pink text-white py-3 px-6 rounded-lg shadow-md hover:bg-pink-500 transition"
              >
                Add Recipe
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddRecipePage;