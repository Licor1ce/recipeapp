import { useLocation, useParams } from "wouter";
import { ArrowLeft, Search } from "lucide-react";
import { CategoryIcons, ToolIcons } from "@/components/icons/food-icons";
import { useQuery } from "@tanstack/react-query";

const CategoriesPage = () => {
  const { season } = useParams();
  const [, navigate] = useLocation();
  
  const seasonTitle = season === "autumn-winter" ? "Autumn/Winter Recipes" : "Spring/Summer Recipes";
  
  const { data: categories = [] } = useQuery({
    queryKey: [`/api/categories/${season}`],
  });

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-mint py-4 px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center">
          <button 
            onClick={() => navigate('/')}
            className="mr-4"
          >
            <ArrowLeft className="h-6 w-6 text-white" />
          </button>
          <h1 className="text-white text-2xl font-bold">{seasonTitle}</h1>
        </div>
        <button className="bg-white rounded-full p-2 shadow-md">
          <Search className="h-6 w-6 text-mint" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        {/* Cute Character */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-mint rounded-full flex items-center justify-center">
            <span className="text-3xl">👨‍🍳</span>
          </div>
        </div>
        
        {/* Add Recipe Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => navigate(`/add-recipe/${season}`)}
            className="bg-mint text-white py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-green-500 transition shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add New Recipe
          </button>
        </div>
        
        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.entries(CategoryIcons).map(([category, icon]) => (
            <div 
              key={category}
              onClick={() => navigate(`/recipes/${season}/${category}`)}
              className="bg-white rounded-xl overflow-hidden shadow-md cursor-pointer transform transition hover:scale-105"
            >
              <div className="h-32 bg-mint bg-opacity-20 flex items-center justify-center">
                <div className="w-16 h-16 rounded-lg bg-soft-beige flex items-center justify-center text-2xl">
                  {icon}
                </div>
              </div>
              <div className="p-3 text-center">
                <h3 className="font-bold text-gray-700 capitalize">{category}</h3>
              </div>
            </div>
          ))}
        </div>
        
        {/* Templates Section */}
        <div className="mt-8">
          <h3 className="text-lg font-bold text-gray-700 mb-4">Templates & Tools</h3>
          <div className="bg-white rounded-xl p-4 shadow-md">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div 
                onClick={() => navigate('/meal-plan')}
                className="bg-pale-yellow rounded-lg p-3 text-center cursor-pointer transform transition hover:scale-105"
              >
                <div className="flex justify-center mb-2">
                  <div className="w-10 h-10 rounded-full bg-soft-beige flex items-center justify-center">{ToolIcons.mealPlan}</div>
                </div>
                <p className="text-sm font-semibold">Meal Plan</p>
              </div>
              <div className="bg-pale-yellow rounded-lg p-3 text-center cursor-pointer transform transition hover:scale-105">
                <div className="flex justify-center mb-2">
                  <div className="w-10 h-10 rounded-full bg-soft-beige flex items-center justify-center">{ToolIcons.groceryList}</div>
                </div>
                <p className="text-sm font-semibold">Grocery List</p>
              </div>
              <div className="bg-pale-yellow rounded-lg p-3 text-center cursor-pointer transform transition hover:scale-105">
                <div className="flex justify-center mb-2">
                  <div className="w-10 h-10 rounded-full bg-soft-beige flex items-center justify-center">{ToolIcons.inventory}</div>
                </div>
                <p className="text-sm font-semibold">Inventory</p>
              </div>
              <div className="bg-pale-yellow rounded-lg p-3 text-center cursor-pointer transform transition hover:scale-105">
                <div className="flex justify-center mb-2">
                  <div className="w-10 h-10 rounded-full bg-soft-beige flex items-center justify-center">{ToolIcons.notes}</div>
                </div>
                <p className="text-sm font-semibold">Notes</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CategoriesPage;
