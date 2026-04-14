import { useMemo } from "react"
import { useRecipeContext } from "../contexts/RecipeContext"

export function useRecipes(category?: string) {
  const { recipes } = useRecipeContext()
  return useMemo(() => {
    if (!category || category === "All") return recipes
    return recipes.filter((r) => r.category === category)
  }, [recipes, category])
}
