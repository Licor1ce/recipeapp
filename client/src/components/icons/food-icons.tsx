import { SVGProps } from "react";

export const FoodIcons = {
  Apple: (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 2a4 4 0 0 0-4 4v9a3 3 0 0 0 3 3h2a3 3 0 0 0 3-3V6a4 4 0 0 0-4-4Z" />
      <path d="M10 8v13" />
      <path d="M14 8v13" />
      <path d="M12 2v2" />
      <path d="M9 5H6a2 2 0 0 0-2 2v3" />
      <path d="M15 5h3a2 2 0 0 1 2 2v3" />
    </svg>
  ),
  Tomato: (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 2a4 10 0 0 0-4 4v8a4 4 0 0 0 8 0V6a4 4 0 0 0-4-4Z" />
      <path d="M12 2v2" />
      <path d="M12 17v3" />
      <path d="M10 7H7m10 0h-3" />
    </svg>
  ),
  Carrot: (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 2a4 4 0 0 0-4 4v12a4 4 0 0 0 8 0V6a4 4 0 0 0-4-4Z" />
      <path d="M12 2v2" />
      <path d="M12 16v4" />
      <path d="M12 12c2 0 3 .5 4 1.5"></path>
      <path d="M12 8c-2 0-3 .5-4 1.5"></path>
    </svg>
  ),
  Grapes: (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="9" r="3" />
      <circle cx="8" cy="14" r="3" />
      <circle cx="16" cy="14" r="3" />
      <path d="M12 6V1" />
    </svg>
  ),
  Pot: (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 8h16a0 0 0 0 1 0 0v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8a0 0 0 0 1 0 0z" />
      <path d="M6 8V7a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v1" />
      <path d="M8 18l-2 4" />
      <path d="M16 18l2 4" />
    </svg>
  )
};

export const CategoryIcons: Record<string, string> = {
  starters: "🥖",
  soups: "🍜",
  salads: "🥗",
  breakfast: "🍳",
  lunch: "🍝",
  dinner: "🍲",
  snacks: "🥨",
  beverages: "🍹",
  desserts: "🍰",
};

export const ToolIcons: Record<string, string> = {
  mealPlan: "🗓️",
  groceryList: "🛒",
  inventory: "📦",
  notes: "📝",
};

export const SeasonIcons: Record<string, string[]> = {
  "autumn-winter": ["🍂", "❄️", "🍲", "🍵"],
  "spring-summer": ["🌱", "☀️", "🥗", "🍓"],
};
