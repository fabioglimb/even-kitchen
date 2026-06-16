import { useMemo } from "react"
import { useRecipeContext } from "../contexts/RecipeContext"

export function useRecipes(category?: string, collectionId?: string) {
  const { recipes, collections } = useRecipeContext()
  return useMemo(() => {
    let filtered = recipes

    // Filter by collection first
    if (collectionId && collectionId !== 'All') {
      const collection = collections.find((c) => c.id === collectionId)
      if (collection) {
        const idSet = new Set(collection.recipeIds)
        filtered = filtered.filter((r) => idSet.has(r.id))
      }
    }

    // Then by category
    if (category && category !== 'All') {
      filtered = filtered.filter((r) => r.category === category)
    }

    return filtered
  }, [recipes, collections, category, collectionId])
}
