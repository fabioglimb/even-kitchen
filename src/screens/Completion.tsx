import { useParams, useNavigate } from "react-router"
import { useRecipeContext } from "../contexts/RecipeContext"
import { useCookingContext } from "../contexts/CookingContext"
import { Button } from "../components/ui/Button"

export function Completion() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { recipes } = useRecipeContext()
  const { setCurrentStepIndex, resetAllTimers } = useCookingContext()
  const recipe = recipes.find((r) => r.id === id)

  if (!recipe) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <p className="text-text-muted">Recipe not found.</p>
      </div>
    )
  }

  const handleCookAgain = () => {
    setCurrentStepIndex(0)
    resetAllTimers()
    navigate(`/recipe/${recipe.id}/cook`)
  }

  return (
    <div
      className="min-h-dvh flex flex-col items-center justify-center px-4 text-center"
      style={{ "--recipe-accent": recipe.accentColor } as React.CSSProperties}
    >
      <div className="text-8xl mb-6">{recipe.heroEmoji}</div>

      <h1 className="text-4xl font-bold mb-2">Bon Appetit!</h1>
      <p className="text-text-muted text-lg mb-2">{recipe.title} is ready to serve.</p>
      <p className="text-text-muted text-sm mb-10">
        {recipe.servings} servings prepared with care.
      </p>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Button
          size="lg"
          className="w-full"
          onClick={handleCookAgain}
        >
          Cook Again
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="w-full"
          onClick={() => navigate("/")}
        >
          Back to Library
        </Button>
      </div>
    </div>
  )
}
