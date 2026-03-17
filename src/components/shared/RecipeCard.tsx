import { useNavigate } from "react-router"
import { Card } from "../ui/Card"
import { Badge } from "../ui/Badge"
import { cn } from "../../utils/cn"
import { formatMinutes } from "../../utils/format"
import type { Recipe } from "../../types/recipe"

interface RecipeCardProps {
  recipe: Recipe
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const navigate = useNavigate()

  return (
    <Card
      padding="none"
      variant="elevated"
      className={cn(
        "cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform overflow-hidden",
        "border-l-4"
      )}
      style={
        {
          borderLeftColor: recipe.accentColor,
          "--recipe-accent": recipe.accentColor,
        } as React.CSSProperties
      }
      onClick={() => navigate(`/recipe/${recipe.id}`)}
    >
      <div className="flex flex-col h-full">
        <div
          className="h-32 flex items-center justify-center text-6xl"
          style={{ background: `${recipe.accentColor}15` }}
        >
          {recipe.heroEmoji}
        </div>
        <div className="p-4 flex flex-col gap-2 flex-1">
          <h3 className="text-lg font-semibold leading-tight">{recipe.title}</h3>
          <p className="text-sm text-text-muted leading-snug">{recipe.subtitle}</p>
          <div className="flex items-center gap-2 mt-auto pt-2">
            <Badge>{formatMinutes(recipe.prepTime + recipe.cookTime)}</Badge>
            <Badge>{recipe.difficulty}</Badge>
            <Badge>{recipe.servings} serv.</Badge>
          </div>
        </div>
      </div>
    </Card>
  )
}
