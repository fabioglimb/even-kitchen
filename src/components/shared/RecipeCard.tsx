import { useNavigate } from "react-router"
import { Card, Badge, cn } from "even-toolkit/web"
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
      className="cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform overflow-hidden"
      onClick={() => navigate(`/recipe/${recipe.id}`)}
    >
      <div className="flex flex-col h-full">
        <div className="h-32 flex items-center justify-center text-6xl bg-surface-light">
          <span style={{ fontFamily: '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif' }}>
            {recipe.heroEmoji}
          </span>
        </div>
        <div className="p-4 flex flex-col gap-2 flex-1">
          <h3 className="text-[17px] tracking-[-0.17px] font-normal leading-tight">{recipe.title}</h3>
          <p className="text-[13px] tracking-[-0.13px] text-text-muted leading-snug">{recipe.subtitle}</p>
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
