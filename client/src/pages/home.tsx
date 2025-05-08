import { useLocation } from "wouter";
import { Menu } from "lucide-react";

const HomePage = () => {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-mint py-4 px-6 flex items-center justify-center shadow-sm">
        <h1 className="text-white text-2xl font-bold">Recipe Book</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        {/* Welcome Banner */}
        <div className="bg-mint rounded-2xl overflow-hidden shadow-md mb-8">
          <div className="relative">
            <div className="pt-4 pb-8 px-6 text-center">
              <h2 className="text-white text-3xl font-bold mb-2">Recipe Book</h2>
              <p className="text-white opacity-80">Your seasonal cooking companion</p>
              
              <div className="mt-6 relative flex justify-center">
                <img 
                  src="/images/cat-chef.png" 
                  alt="Cat Chef" 
                  className="h-40 object-contain rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Season Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div 
            onClick={() => navigate('/categories/autumn-winter')} 
            className="bg-white rounded-2xl overflow-hidden shadow-md cursor-pointer transform transition hover:scale-105"
          >
            <div className="h-40 bg-gradient-to-r from-amber-100 to-amber-200 flex items-center justify-center p-6">
              <img 
                src="/images/tea-cup.png" 
                alt="Autumn Winter Tea Cup" 
                className="h-32 object-contain"
              />
            </div>
            <div className="p-4 text-center">
              <h3 className="text-xl font-bold text-gray-700">Autumn/Winter Recipes</h3>
              <p className="text-gray-500 text-sm mt-1">Warm, comforting dishes for cold days</p>
            </div>
          </div>
          
          <div 
            onClick={() => navigate('/categories/spring-summer')} 
            className="bg-white rounded-2xl overflow-hidden shadow-md cursor-pointer transform transition hover:scale-105"
          >
            <div className="h-40 bg-gradient-to-r from-green-100 to-blue-100 flex items-center justify-center p-6">
              <img 
                src="/images/green-drink.png" 
                alt="Spring Summer Green Drink" 
                className="h-32 object-contain"
              />
            </div>
            <div className="p-4 text-center">
              <h3 className="text-xl font-bold text-gray-700">Spring/Summer Recipes</h3>
              <p className="text-gray-500 text-sm mt-1">Fresh, light dishes for warm days</p>
            </div>
          </div>
        </div>

        {/* Quick Access */}
        <div className="bg-white rounded-2xl p-6 shadow-md mb-8">
          <h3 className="text-lg font-bold text-gray-700 mb-4">Quick Access</h3>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => navigate('/meal-plan')}
              className="bg-light-pink text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-pink-300 transition"
            >
              <span>🗓️</span> Meal Plan
            </button>
            <button 
              onClick={() => navigate('/shopping-list')}
              className="bg-mint text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-green-300 transition"
            >
              <span>📝</span> Shopping List
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
