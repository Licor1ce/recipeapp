import { useLocation } from "wouter";
import { ArrowLeft, Plus, Check, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/lib/hooks";
import { useQuery } from "@tanstack/react-query";

interface GroceryItem {
  id: number;
  name: string;
  quantity: string;
  checked: boolean;
  category: string;
}

interface Recipe {
  id: number;
  title: string;
  ingredients: string[];
  [key: string]: any;
}

const ShoppingListPage = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const [shoppingList, setShoppingList] = useLocalStorage<GroceryItem[]>('shoppingList', []);
  const [newItem, setNewItem] = useState({ name: '', quantity: '', category: 'produce' });
  const [isGeneratedFromMealPlan, setIsGeneratedFromMealPlan] = useState(false);

  // Get meal plan from localStorage
  const [mealPlan, setMealPlan] = useState<any[]>(() => {
    const saved = localStorage.getItem('mealPlan');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Get all recipe IDs from meal plan
  const recipeIds = Array.from(new Set(mealPlan.map((item: any) => item.recipeId)));
  
  // Get all recipes
  const [allRecipes, setAllRecipes] = useState<Recipe[]>(() => {
    // Try to get from localStorage first (for user-added recipes)
    const saved = localStorage.getItem('recipes');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Get API recipes
  const { data: apiRecipes = [] } = useQuery<Recipe[]>({
    queryKey: ['/api/recipes'],
    queryFn: async () => {
      try {
        // Get recipes from API
        let recipes: Recipe[] = [];
        for (const id of recipeIds) {
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
        return recipes;
      } catch (error) {
        console.error("Error fetching recipes:", error);
        return [];
      }
    },
    enabled: recipeIds.length > 0,
  });
  
  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newItem.name) {
      toast({
        title: "Item name required",
        description: "Please enter an item name",
      });
      return;
    }
    
    const item: GroceryItem = {
      id: Date.now(),
      name: newItem.name,
      quantity: newItem.quantity,
      checked: false,
      category: newItem.category
    };
    
    setShoppingList([...shoppingList, item]);
    setNewItem({ name: '', quantity: '', category: 'produce' });
    
    toast({
      title: "Item added",
      description: `${item.name} added to your shopping list`,
    });
  };
  
  const toggleItem = (id: number) => {
    const updatedList = shoppingList.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setShoppingList(updatedList);
  };
  
  const removeItem = (id: number) => {
    const updatedList = shoppingList.filter(item => item.id !== id);
    setShoppingList(updatedList);
    
    toast({
      title: "Item removed",
      description: "Item removed from your shopping list",
    });
  };
  
  const clearChecked = () => {
    const uncheckedItems = shoppingList.filter(item => !item.checked);
    
    if (shoppingList.length === uncheckedItems.length) {
      toast({
        title: "No items to clear",
        description: "There are no checked items to remove",
      });
      return;
    }
    
    setShoppingList(uncheckedItems);
    toast({
      title: "Items cleared",
      description: "All checked items have been removed",
    });
  };
  
  // Group items by category
  const groupedItems = shoppingList.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, GroceryItem[]>);
  
  // Combine API and local recipes
  useEffect(() => {
    const combinedRecipes = [...apiRecipes, ...allRecipes.filter(r => recipeIds.includes(r.id))];
    
    // Generate shopping list from meal plan (if coming from meal plan page)
    const urlParams = new URLSearchParams(window.location.search);
    const fromMealPlan = urlParams.get('fromMealPlan') === 'true';
    
    if (fromMealPlan && !isGeneratedFromMealPlan && combinedRecipes.length > 0) {
      // Get all ingredients from recipes in the meal plan
      const allIngredients: string[] = [];
      combinedRecipes.forEach(recipe => {
        if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
          allIngredients.push(...recipe.ingredients);
        }
      });
      
      // Create grocery items from ingredients
      const newItems: GroceryItem[] = allIngredients.map(ing => {
        return {
          id: Date.now() + Math.floor(Math.random() * 1000),
          name: ing,
          quantity: '',
          checked: false,
          category: determineCategoryFromIngredient(ing)
        };
      });
      
      // Update shopping list with new items
      setShoppingList(prevList => {
        // Only add items that aren't already in the list (by name)
        const existingNames = new Set(prevList.map(item => item.name.toLowerCase()));
        const uniqueNewItems = newItems.filter(item => 
          !existingNames.has(item.name.toLowerCase())
        );
        return [...prevList, ...uniqueNewItems];
      });
      
      setIsGeneratedFromMealPlan(true);
      
      toast({
        title: "Shopping list generated",
        description: `Added ${newItems.length} ingredients from your meal plan.`,
      });
    }
  }, [apiRecipes, allRecipes, recipeIds, isGeneratedFromMealPlan, toast, setShoppingList]);
  
  // Helper function to guess the category of an ingredient
  const determineCategoryFromIngredient = (ingredient: string): string => {
    // Convert to lowercase for easier matching
    const ing = ingredient.toLowerCase();
    
    // Common produce items
    if (/apple|banana|orange|lemon|carrot|onion|garlic|tomato|potato|lettuce|spinach|broccoli|pepper|cucumber|avocado|fruit|vegetable|berries|greens/i.test(ing)) {
      return 'produce';
    }
    
    // Dairy & eggs
    if (/milk|cheese|yogurt|cream|butter|egg|kefir|cheddar|mozzarella|parmesan|ricotta/i.test(ing)) {
      return 'dairy';
    }
    
    // Bakery
    if (/bread|roll|bun|bagel|croissant|pastry|cake|muffin|toast|loaf|dough/i.test(ing)) {
      return 'bakery';
    }
    
    // Meat & seafood
    if (/chicken|beef|pork|lamb|fish|shrimp|salmon|tuna|meat|steak|sausage|bacon|turkey|seafood|crab|lobster|clam|mussel/i.test(ing)) {
      return 'meat';
    }
    
    // Frozen foods
    if (/frozen|ice cream|popsicle|ice/i.test(ing)) {
      return 'frozen';
    }
    
    // Pantry (default for most ingredients)
    if (/flour|sugar|salt|spice|herb|oil|vinegar|sauce|pasta|rice|bean|grain|canned|dry|powder|tea|coffee/i.test(ing)) {
      return 'pantry';
    }
    
    // Default to other
    return 'other';
  };

  const categoryNames: Record<string, string> = {
    produce: "Fruits & Vegetables",
    dairy: "Dairy & Eggs",
    bakery: "Bakery",
    meat: "Meat & Seafood",
    frozen: "Frozen Foods",
    pantry: "Pantry",
    other: "Other Items"
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-baby-blue py-4 px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center">
          <button 
            onClick={() => navigate('/')}
            className="mr-4"
          >
            <ArrowLeft className="h-6 w-6 text-white" />
          </button>
          <h1 className="text-white text-2xl font-bold">Shopping List</h1>
        </div>
        <button 
          onClick={clearChecked} 
          className="bg-white px-3 py-1 rounded text-sm text-baby-blue font-medium shadow-md"
        >
          Clear Checked
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        {/* Add Item Form */}
        <div className="bg-white rounded-xl p-5 shadow-md mb-6">
          <h2 className="text-lg font-bold text-gray-700 mb-4">Add New Item</h2>
          <form onSubmit={addItem} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                <input 
                  type="text" 
                  id="name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-baby-blue focus:border-baby-blue"
                  placeholder="e.g., Apples"
                />
              </div>
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input 
                  type="text" 
                  id="quantity"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({...newItem, quantity: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-baby-blue focus:border-baby-blue"
                  placeholder="e.g., 1 kg, 2 dozen"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select 
                id="category"
                value={newItem.category}
                onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-baby-blue focus:border-baby-blue"
              >
                <option value="produce">Fruits & Vegetables</option>
                <option value="dairy">Dairy & Eggs</option>
                <option value="bakery">Bakery</option>
                <option value="meat">Meat & Seafood</option>
                <option value="frozen">Frozen Foods</option>
                <option value="pantry">Pantry</option>
                <option value="other">Other Items</option>
              </select>
            </div>
            
            <div className="text-right">
              <button 
                type="submit"
                className="bg-baby-blue text-white py-2 px-4 rounded-lg flex items-center gap-2 hover:opacity-90 transition shadow-md ml-auto"
              >
                <Plus className="h-5 w-5" />
                Add Item
              </button>
            </div>
          </form>
        </div>
        
        {/* Shopping List */}
        <div className="space-y-4">
          {Object.entries(groupedItems).length === 0 && (
            <div className="bg-white rounded-xl p-6 text-center shadow-md">
              <p className="text-gray-500">Your shopping list is empty. Add some items to get started!</p>
            </div>
          )}
          
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-baby-blue px-4 py-3">
                <h3 className="font-bold text-white">{categoryNames[category] || category}</h3>
              </div>
              <div className="p-4 space-y-2">
                {items.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-soft-beige rounded-lg">
                    <div className="flex items-center gap-3 flex-1">
                      <button
                        onClick={() => toggleItem(item.id)}
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${item.checked ? 'bg-baby-blue text-white' : 'bg-white border border-gray-300'}`}
                      >
                        {item.checked && <Check className="h-4 w-4" />}
                      </button>
                      <div className="flex-1">
                        <p className={`font-medium ${item.checked ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{item.name}</p>
                        {item.quantity && (
                          <p className="text-xs text-gray-500">{item.quantity}</p>
                        )}
                      </div>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-gray-400"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ShoppingListPage;