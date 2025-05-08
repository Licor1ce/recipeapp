import { useLocation, useParams } from "wouter";
import { ArrowLeft, Search, Filter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const RecipeListPage = () => {
  const { season, category } = useParams();
  const [, navigate] = useLocation();
  const [favorites, setFavorites] = useState<number[]>(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });
  
  // First load categories to help with matching
  const { data: categories = [] } = useQuery<any[]>({
    queryKey: [`/api/categories/${season}`],
  });
  
  // Load recipes from server API
  const { data: apiRecipes = [] } = useQuery({
    queryKey: [`/api/recipes/${season}/${category}`],
  });
  
  // Load locally stored recipes
  const [localRecipes, setLocalRecipes] = useState<any[]>(() => {
    const saved = localStorage.getItem('recipes');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Log what we have in local storage for debugging
  console.log("Local recipes in storage:", localRecipes);
  console.log("Current season:", season, "Current category:", category);

  // Combine recipes from API and local storage
  const recipes = [
    ...apiRecipes,
    ...localRecipes.filter(r => {
      console.log("Checking recipe:", r);
      
      // Check if we're in a particular category view
      const currentCategory = categories.find((c: any) => c.id.toString() === category);
      const currentCategoryName = currentCategory?.name?.toLowerCase();
      
      // Get the URL parameter for the current category
      const urlParamCategory = category || "";
      
      // Convert the URL category (which is a string like "salads") to the actual category ID
      // This is needed because our recipes store category information differently
      const categoryById = categories.find(c => c.name && c.name.toLowerCase() === urlParamCategory.toLowerCase());
      const categoryId = categoryById ? categoryById.id.toString() : null;
      
      console.log("URL category:", urlParamCategory);
      console.log("Mapped category ID:", categoryId);
      
      // We need to handle all possible ways that category info might be stored
      const matchesCategory = 
        // Match by categoryId (number format) - compare with the ID we found
        (categoryId && r.category && r.category.toString() === categoryId) ||
        // Match by category (string format) - direct match with URL param
        (r.category && typeof r.category === 'string' && 
         r.category.toLowerCase() === urlParamCategory.toLowerCase()) ||
        // Match by categoryName (string compare)
        (r.categoryName && r.categoryName.toLowerCase() === urlParamCategory.toLowerCase());
      
      console.log(`Recipe ${r.title}: category=${r.category}, matches=${matchesCategory}`);
      
      const matchesSeason = r.season === season;
      
      return matchesSeason && matchesCategory;
    })
  ];
  
  console.log("Combined recipes:", recipes);
  
  const toggleFavorite = (id: number) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter(favId => favId !== id)
      : [...favorites, id];
    
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-mint py-4 px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center">
          <button 
            onClick={() => navigate(`/categories/${season}`)}
            className="mr-4"
          >
            <ArrowLeft className="h-6 w-6 text-white" />
          </button>
          <h1 className="text-white text-2xl font-bold capitalize">{category}</h1>
        </div>
        <div className="flex space-x-2">
          <button className="bg-white rounded-full p-2 shadow-md">
            <Search className="h-6 w-6 text-mint" />
          </button>
          <button className="bg-white rounded-full p-2 shadow-md">
            <Filter className="h-6 w-6 text-mint" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        {/* Recipe List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recipes.map((recipe: any) => (
            <div 
              key={recipe.id}
              onClick={() => navigate(`/recipe/${recipe.id}`)}
              className="bg-white rounded-xl overflow-hidden shadow-md cursor-pointer transform transition hover:scale-105"
            >
              <div className="h-48 bg-soft-lavender bg-opacity-30 flex items-center justify-center p-4">
                <div className="w-32 h-32 rounded-lg bg-pale-yellow flex items-center justify-center text-4xl">
                  {recipe.icon}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-700">{recipe.title}</h3>
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center text-gray-500 text-sm space-x-2">
                    <span>⏱️ {recipe.time} min</span>
                    <span>|</span>
                    <span>⭐ {recipe.rating}</span>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(recipe.id);
                    }}
                    className={favorites.includes(recipe.id) ? "text-red-500" : "text-light-pink"}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={favorites.includes(recipe.id) ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default RecipeListPage;
