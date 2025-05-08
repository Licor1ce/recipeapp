// Initial recipes from the user's document
export const initialRecipes = [
  {
    id: 1001,
    title: "Dressing de Sesamo",
    category: 1, // Starters category
    categoryId: 1,
    season: "autumn-winter",
    prepTime: 10,
    cookTime: 5,
    time: 15,
    servings: 4,
    rating: "4.5",
    reviews: 3,
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
    id: 1002,
    title: "Ensalada de Nira (Coreana)",
    category: 3, // Salads category
    categoryId: 3,
    season: "spring-summer",
    prepTime: 15,
    cookTime: 0,
    time: 15,
    servings: 4,
    rating: "4.3",
    reviews: 5,
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
    id: 1003,
    title: "Cerdo Hervido (Suyuk - Coreano)",
    category: 7, // Meat category
    categoryId: 7,
    season: "autumn-winter",
    prepTime: 20,
    cookTime: 60,
    time: 80,
    servings: 6,
    rating: "4.7",
    reviews: 4,
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
    id: 1004,
    title: "Arroz Estilo Paella",
    category: 8, // Rice category
    categoryId: 8,
    season: "autumn-winter",
    prepTime: 15,
    cookTime: 25,
    time: 40,
    servings: 4,
    rating: "4.4",
    reviews: 6,
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
    id: 1005,
    title: "Kimchi Chigae (Coreano)",
    category: 5, // Soups category
    categoryId: 5,
    season: "autumn-winter",
    prepTime: 15,
    cookTime: 30,
    time: 45,
    servings: 4,
    rating: "4.8",
    reviews: 7,
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