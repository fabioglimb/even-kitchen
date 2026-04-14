import type { Recipe } from "../types/recipe"

export const seedRecipes: Recipe[] = [
  {
    id: "cacio-e-pepe",
    title: "Cacio e Pepe",
    subtitle: "Roman classic with pecorino & black pepper",
    category: "Pasta",
    prepTime: 5,
    cookTime: 15,
    servings: 2,
    difficulty: "Medium",
    heroEmoji: "\uD83C\uDF5D",
    accentColor: "#e6b44c",
    ingredients: [
      { name: "Spaghetti", amount: "320", unit: "g" },
      { name: "Pecorino Romano", amount: "200", unit: "g" },
      { name: "Black Pepper", amount: "2", unit: "tbsp" },
      { name: "Salt", amount: "1", unit: "pinch" },
    ],
    steps: [
      {
        title: "Toast the pepper",
        instructions:
          "Toast whole black peppercorns in a dry skillet over medium heat until fragrant, about 2 minutes. Crush coarsely with a mortar and pestle.",
        timerSeconds: 120,
      },
      {
        title: "Boil the pasta",
        instructions:
          "Bring a large pot of well-salted water to a boil. Cook spaghetti until 1 minute short of al dente. Reserve 2 cups of pasta water before draining.",
        timerSeconds: 480,
      },
      {
        title: "Make the sauce",
        instructions:
          "Finely grate the pecorino into a bowl. Add a ladleful of hot pasta water and whisk vigorously to create a smooth, creamy paste.",
      },
      {
        title: "Combine & serve",
        instructions:
          "Add drained pasta to the skillet with toasted pepper. Remove from heat, pour in the pecorino paste, and toss energetically, adding pasta water as needed until silky. Serve immediately with extra pecorino and pepper.",
      },
    ],
  },
  {
    id: "french-omelette",
    title: "French Omelette",
    subtitle: "Silky, custardy perfection in minutes",
    category: "Breakfast",
    prepTime: 3,
    cookTime: 5,
    servings: 1,
    difficulty: "Hard",
    heroEmoji: "\uD83E\uDD5A",
    accentColor: "#f0c040",
    ingredients: [
      { name: "Eggs", amount: "3", unit: "large" },
      { name: "Butter", amount: "1", unit: "tbsp" },
      { name: "Chives", amount: "1", unit: "tbsp" },
      { name: "Salt", amount: "1", unit: "pinch" },
      { name: "White Pepper", amount: "1", unit: "pinch" },
    ],
    steps: [
      {
        title: "Beat the eggs",
        instructions:
          "Crack eggs into a bowl. Season with salt and white pepper. Beat vigorously with a fork until completely homogeneous \u2014 no streaks of white should remain.",
      },
      {
        title: "Heat the pan",
        instructions:
          "Place a nonstick 8-inch pan over medium-high heat. Add butter and swirl until fully melted and foamy but not browned.",
        timerSeconds: 30,
      },
      {
        title: "Cook the omelette",
        instructions:
          "Pour in beaten eggs. Stir rapidly with chopsticks or a fork, shaking the pan constantly. When the eggs are mostly set but still slightly wet on top, stop stirring and let sit for 10 seconds.",
        timerSeconds: 90,
      },
      {
        title: "Roll & serve",
        instructions:
          "Tilt the pan and use a spatula to fold the omelette in thirds. Roll it onto a warm plate seam-side down. Brush with a tiny bit of butter for shine, sprinkle chives, and serve immediately.",
      },
    ],
  },
  {
    id: "pan-seared-salmon",
    title: "Pan-Seared Salmon",
    subtitle: "Crispy skin, buttery flesh, lemon herb finish",
    category: "Seafood",
    prepTime: 10,
    cookTime: 12,
    servings: 2,
    difficulty: "Easy",
    heroEmoji: "🍣",
    accentColor: "#e07a5f",
    ingredients: [
      { name: "Salmon Fillets", amount: "2", unit: "6oz" },
      { name: "Olive Oil", amount: "2", unit: "tbsp" },
      { name: "Butter", amount: "2", unit: "tbsp" },
      { name: "Garlic", amount: "3", unit: "cloves" },
      { name: "Lemon", amount: "1", unit: "whole" },
      { name: "Fresh Thyme", amount: "4", unit: "sprigs" },
      { name: "Salt & Pepper", amount: "1", unit: "to taste" },
    ],
    steps: [
      {
        title: "Prep the fish",
        instructions:
          "Pat salmon fillets completely dry with paper towels. Season generously with salt and pepper on both sides. Let sit at room temperature for 5 minutes.",
        timerSeconds: 300,
      },
      {
        title: "Sear skin-side down",
        instructions:
          "Heat olive oil in a stainless steel or cast-iron skillet over medium-high heat until shimmering. Place salmon skin-side down. Press gently to ensure full contact. Cook without moving for 4 minutes.",
        timerSeconds: 240,
      },
      {
        title: "Flip & baste",
        instructions:
          "Flip salmon. Add butter, crushed garlic, thyme, and lemon halves (cut-side down). Tilt pan and baste salmon with foaming butter for 3 minutes.",
        timerSeconds: 180,
      },
      {
        title: "Rest & serve",
        instructions:
          "Transfer salmon to plates. Squeeze the caramelized lemon over the fish. Spoon pan butter on top. Serve with your favorite sides.",
      },
    ],
  },
  {
    id: "chocolate-lava-cake",
    title: "Chocolate Lava Cake",
    subtitle: "Molten center, crisp shell, pure indulgence",
    category: "Dessert",
    prepTime: 15,
    cookTime: 14,
    servings: 4,
    difficulty: "Medium",
    heroEmoji: "\uD83C\uDF70",
    accentColor: "#8b5e3c",
    ingredients: [
      { name: "Dark Chocolate", amount: "170", unit: "g" },
      { name: "Butter", amount: "115", unit: "g" },
      { name: "Eggs", amount: "2", unit: "large" },
      { name: "Egg Yolks", amount: "2", unit: "large" },
      { name: "Sugar", amount: "65", unit: "g" },
      { name: "Flour", amount: "30", unit: "g" },
      { name: "Salt", amount: "1", unit: "pinch" },
    ],
    steps: [
      {
        title: "Melt chocolate & butter",
        instructions:
          "Preheat oven to 425\u00B0F (220\u00B0C). Melt chocolate and butter together in a double boiler or microwave in 30-second bursts, stirring between each. Let cool slightly.",
        timerSeconds: 180,
      },
      {
        title: "Mix the batter",
        instructions:
          "Whisk eggs, yolks, and sugar until thick and pale, about 2 minutes. Fold in the melted chocolate mixture. Sift in flour and salt, fold gently until just combined.",
      },
      {
        title: "Fill ramekins",
        instructions:
          "Butter and cocoa-dust four 6-oz ramekins. Divide batter evenly. Place on a baking sheet. (Can refrigerate up to 8 hours at this point.)",
      },
      {
        title: "Bake & serve",
        instructions:
          "Bake for 12\u201314 minutes until edges are firm but center jiggles. Let cool 1 minute, then invert onto plates. Serve immediately with powdered sugar and whipped cream.",
        timerSeconds: 780,
      },
    ],
  },
]
