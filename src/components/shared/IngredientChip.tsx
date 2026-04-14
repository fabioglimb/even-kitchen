import type { Ingredient } from "../../types/recipe"

interface IngredientChipProps {
  ingredient: Ingredient
}

export function IngredientChip({ ingredient }: IngredientChipProps) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-lighter px-3 py-1.5 text-[13px] tracking-[-0.13px]">
      <span className="font-normal text-accent">
        {ingredient.amount} {ingredient.unit}
      </span>
      <span className="text-text-muted">{ingredient.name}</span>
    </span>
  )
}
