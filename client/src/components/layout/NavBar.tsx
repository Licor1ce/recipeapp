import { Home, Calendar, ClipboardList } from "lucide-react";
import { useLocation } from "wouter";

const NavBar = () => {
  const [location, navigate] = useLocation();

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path === "/meal-plan" && location === "/meal-plan") return true;
    if (path === "/shopping-list" && location === "/shopping-list") return true;
    return false;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2 px-4 shadow-lg z-50">
      <button 
        className={`flex flex-col items-center p-2 ${isActive("/") ? "text-mint" : "text-gray-400"}`}
        onClick={() => navigate("/")}
      >
        <Home className="h-6 w-6" />
        <span className="text-xs">Home</span>
      </button>
      
      <button 
        className={`flex flex-col items-center p-2 ${isActive("/meal-plan") ? "text-mint" : "text-gray-400"}`}
        onClick={() => navigate("/meal-plan")}
      >
        <Calendar className="h-6 w-6" />
        <span className="text-xs">Meal Plan</span>
      </button>
      
      <button 
        className={`flex flex-col items-center p-2 ${isActive("/shopping-list") ? "text-mint" : "text-gray-400"}`}
        onClick={() => navigate("/shopping-list")}
      >
        <ClipboardList className="h-6 w-6" />
        <span className="text-xs">Shopping List</span>
      </button>
    </nav>
  );
};

export default NavBar;
