// Script to add recipes from user document
// Run this in browser console when on the home page

// Recipes from the document
const recipes = [
  {
    title: "Dressing de Sesamo",
    category: "1", // Starters category
    season: "autumn-winter",
    prepTime: 10,
    cookTime: 5,
    servings: 4,
    rating: 4,
    reviews: 0,
    icon: "🍶",
    ingredients: [
      "5 cucharadas grandes de Neri goma sauce",
      "1 cucharada grande de Sesamo",
      "3 cucharadas grandes de Mayonesa",
      "1 cucharada grande de Azucar",
      "1 cucharada grande de Salsa de soja"
    ],
    preparation: [
      "Reunir todos los ingredientes",
      "Medir las cantidades correctas"
    ],
    cooking: [
      "Mezclar todo los ingredientes en un bol hasta que quede una salsa",
      "Ajustar la salsa de soja y el azucar a gusto"
    ],
    tips: [
      "Se puede guardar en el refrigerador por hasta 1 semana",
      "Ideal para ensaladas y como dip para vegetales"
    ]
  },
  {
    title: "Ensalada de Nira (Coreana)",
    category: "3", // Salads category
    season: "spring-summer",
    prepTime: 15,
    cookTime: 0,
    servings: 4,
    rating: 4,
    reviews: 0,
    icon: "🥗",
    ingredients: [
      "2 ramilletes de nira",
      "Un cuarto de una cebolla",
      "Sal una cucharada pequeña",
      "Togarashi una cuchara grande",
      "Aceite de sésamo una cucharada grande",
      "Sesamo"
    ],
    preparation: [
      "Cortar la nira entre 4 a 5 cm",
      "Cortar la cebolla en rodajas finas"
    ],
    cooking: [
      "En un bol, colocar la nora y la cebolla",
      "Incorporar la salsa y mezclar mucho"
    ],
    tips: [
      "Servir frío como acompañamiento",
      "Se puede conservar en refrigerador por 2-3 días"
    ]
  },
  {
    title: "Cerdo Hervido (Suyuk - Comida Coreana)",
    category: "7", // Meat category
    season: "autumn-winter",
    prepTime: 20,
    cookTime: 60,
    servings: 6,
    rating: 4,
    reviews: 0,
    icon: "🥩",
    ingredients: [
      "Panceta de cerdo (豚バラブロック)",
      "1 Cebolla",
      "Ajo",
      "1 Manzana",
      "2 Cebollino",
      "Laurel (5 hojas)",
      "Miso 3 Cucharadas grandes",
      "Salsa de soja 3 Cucharadas grandes",
      "焼酎 1 Cup",
      "Agua 1.5ml"
    ],
    preparation: [
      "La cebolla: entera",
      "Manzana: a la mitad",
      "Cebollino: a la mitad"
    ],
    cooking: [
      "Meter el cerdo durante 10 minutos dentro de agua que cubra el cerdo",
      "En una cacerola grande, añadir 1.5ml de agua, añadir el miso, salsa de soja, togarashi, cebolla, ajo, etc y encender el fuego",
      "Cuando empiece a hervir meter el cerdo, y el shoshu. Dejar cocinar 5 minutos sin tapar",
      "Cocinar durante 40-50 minutos a fuego bajo, luego apagar el fuego y dejar 10 minutos",
      "Cortar en rodajas finas. Se come con Kimchi y Lechuga"
    ],
    tips: [
      "El cerdo debe quedar tierno pero firme",
      "Se puede refrigerar y recalentar al día siguiente"
    ]
  },
  {
    title: "Arroz Estilo Paella",
    category: "8", // Rice category
    season: "autumn-winter",
    prepTime: 15,
    cookTime: 25,
    servings: 4,
    rating: 4,
    reviews: 0,
    icon: "🥘",
    ingredients: [
      "Pimiento verde 3 peq.",
      "Pimiento rojo 1",
      "Guisantes",
      "Cebolla 1",
      "Tomate 1",
      "Ajo 1",
      "Pimentón rojo dulce y picante",
      "Comino",
      "Sal y pimienta",
      "Caldo de pollo",
      "Arroz (2 tazas)"
    ],
    preparation: [
      "Picar todas las verduras, excepto el tomate, en brunoise",
      "Picar el tomate en dados",
      "Mezclar el agua con el pimenton dulce y picante"
    ],
    cooking: [
      "Añadir la cebolla, pimiento y ajo y un chorrito de aceite y comino. Sofreír el contenido",
      "Añadir el tomate que se ha cortado en trozos",
      "En una taza o vaso poner agua y el pimentón y mezclarlo",
      "Una vez se haya mezclado el tomate con el contenido. Añadir la mezcla de agua y pimentón",
      "Añadir unas dos tazas (vaso de medir de arrocera) de arroz",
      "Añadir 150 caldo de pollo y los guisantes. Añadir sal al gusto",
      "Dejar cocer durante 10 minutos y esperar. Una vez pasen los 10 minutos aplastar un poco el arroz y dejar cocinar durante otros 10 minutos",
      "Cerrar la tapa y dejar que se cocine"
    ],
    tips: [
      "Para más sabor, use caldo de pollo casero",
      "El arroz debe quedar suelto, no empastado" 
    ]
  },
  {
    title: "Kimchi Chigae (Coreano)",
    category: "5", // Soups category
    season: "autumn-winter",
    prepTime: 15,
    cookTime: 30,
    servings: 4,
    rating: 4,
    reviews: 0,
    icon: "🍲",
    ingredients: [
      "Tofu (1丁)",
      "Salchichas",
      "Col china (mitad)",
      "1 Cebollino",
      "Ajo",
      "Media Cebolla grande",
      "Setas (Cualquier tipo)",
      "Bote de Kimchi",
      "Gochuyan",
      "Salsa de soja (cucharada peq)",
      "Tori Gara soup",
      "Agua"
    ],
    preparation: [
      "Cortar todos los ingredientes y prepararlos"
    ],
    cooking: [
      "En una sarten, colocar el kimchi con las verduras y freir",
      "Luego incorporar el agua con el torigara soup, y las salchichas",
      "Dejar hervir e incorporar el gochuyan y salsa de soja a gusto para ajustar el sabor",
      "Incorporar el tofu en el centro y dejar cocer"
    ],
    tips: [
      "Más picante si se añade más gochuyan",
      "Servir caliente inmediatamente",
      "Acompañar con arroz blanco"
    ]
  }
];

// Save recipes to local storage
function addRecipesToLocalStorage() {
  // Get existing recipes
  const existingRecipes = JSON.parse(localStorage.getItem('recipes') || '[]');
  
  // Add new recipes with unique IDs
  const recipesWithIds = recipes.map(recipe => ({
    ...recipe,
    id: Date.now() + Math.floor(Math.random() * 1000), // Generate unique ID
    time: Number(recipe.prepTime) + Number(recipe.cookTime), // Total time
  }));
  
  // Combine existing and new recipes
  const updatedRecipes = [...existingRecipes, ...recipesWithIds];
  
  // Save to local storage
  localStorage.setItem('recipes', JSON.stringify(updatedRecipes));
  
  console.log(`✅ Added ${recipes.length} recipes to your collection!`);
  return `Added ${recipes.length} recipes: ${recipes.map(r => r.title).join(', ')}`;
}

// Run the function to add recipes
addRecipesToLocalStorage();