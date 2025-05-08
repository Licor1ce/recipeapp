// Helper to get color based on season
export const getSeasonColor = (season: string) => {
  return season === 'autumn-winter' ? 'amber' : 'green';
};

// Helper to get icon based on category
export const getCategoryIcon = (category: string) => {
  const icons: Record<string, string> = {
    starters: '🥖',
    soups: '🍜',
    salads: '🥗',
    breakfast: '🍳',
    lunch: '🍝',
    dinner: '🍲',
    snacks: '🥨',
    beverages: '🍹',
    desserts: '🍰',
  };
  
  return icons[category] || '🍽️';
};

// Format date for display
export const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric'
  });
};

// Calculate total time for a recipe
export const calculateTotalTime = (prepTime: number, cookTime: number) => {
  return prepTime + cookTime;
};

// Meal type options
export const mealTypes = [
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'snack', label: 'Snack' },
];

// Days of the week
export const daysOfWeek = [
  { id: 'monday', name: 'Monday', color: 'light-pink' },
  { id: 'tuesday', name: 'Tuesday', color: 'baby-blue' },
  { id: 'wednesday', name: 'Wednesday', color: 'mint' },
  { id: 'thursday', name: 'Thursday', color: 'pale-yellow' },
  { id: 'friday', name: 'Friday', color: 'soft-lavender' },
  { id: 'saturday', name: 'Saturday', color: 'light-pink' },
  { id: 'sunday', name: 'Sunday', color: 'baby-blue' },
];
