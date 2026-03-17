import { useState } from "react"
import { useParams, useNavigate } from "react-router"
import { useRecipeContext } from "../contexts/RecipeContext"
import { useCookingContext } from "../contexts/CookingContext"
import { Button } from "../components/ui/Button"
import { Badge } from "../components/ui/Badge"
import { Card } from "../components/ui/Card"
import { IngredientChip } from "../components/shared/IngredientChip"
import { formatMinutes } from "../utils/format"

export function RecipeDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { recipes, setSelectedRecipe, deleteRecipe, toggleArchive } = useRecipeContext()
  const { setCurrentStepIndex, resetAllTimers } = useCookingContext()
  const [confirmDelete, setConfirmDelete] = useState(false)

  const recipe = recipes.find((r) => r.id === id)

  if (!recipe) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <p className="text-text-muted">Recipe not found.</p>
      </div>
    )
  }

  const handleStartCooking = () => {
    setSelectedRecipe(recipe)
    setCurrentStepIndex(0)
    resetAllTimers()
    navigate(`/recipe/${recipe.id}/cook`)
  }

  return (
    <div
      className="min-h-dvh"
      style={{ "--recipe-accent": recipe.accentColor } as React.CSSProperties}
    >
      {/* Hero */}
      <div
        className="h-56 flex items-center justify-center text-8xl relative"
        style={{ background: `${recipe.accentColor}18` }}
      >
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 left-4 text-sm text-text-muted hover:text-text transition-colors cursor-pointer"
        >
          &larr; Back
        </button>
        {recipe.heroEmoji}
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Title */}
        <div>
          <h1 className="text-3xl font-bold mb-1">{recipe.title}</h1>
          <p className="text-text-muted">{recipe.subtitle}</p>
          <div className="flex items-center gap-2 mt-3">
            <Badge variant="accent">{formatMinutes(recipe.prepTime + recipe.cookTime)}</Badge>
            <Badge>{recipe.difficulty}</Badge>
            <Badge>{recipe.servings} servings</Badge>
            <Badge>{recipe.category}</Badge>
          </div>
        </div>

        {/* Ingredients */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Ingredients</h2>
          <div className="flex flex-wrap gap-2">
            {recipe.ingredients.map((ing) => (
              <IngredientChip key={ing.name} ingredient={ing} />
            ))}
          </div>
        </section>

        {/* Steps Overview */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Steps</h2>
          <div className="space-y-3">
            {recipe.steps.map((step, i) => (
              <Card key={i} className="flex items-start gap-3">
                <span
                  className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  style={{ backgroundColor: recipe.accentColor }}
                >
                  {i + 1}
                </span>
                <div>
                  <p className="font-medium">{step.title}</p>
                  <p className="text-sm text-text-muted mt-0.5">{step.instructions}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="flex gap-3">
          <Button size="lg" className="flex-1" onClick={handleStartCooking}>
            Start Cooking
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate(`/recipe/${recipe.id}/edit`)}
          >
            Edit
          </Button>
        </div>

        {/* Archive */}
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => toggleArchive(recipe.id)}
        >
          {recipe.archived ? "Unarchive Recipe" : "Archive Recipe"}
        </Button>

        {/* Delete */}
        <div className="pt-4 border-t border-border">
          <Button
            variant={confirmDelete ? "danger" : "danger"}
            className="w-full"
            onClick={() => {
              if (!confirmDelete) {
                setConfirmDelete(true)
                return
              }
              deleteRecipe(recipe.id)
              navigate("/")
            }}
          >
            {confirmDelete ? "Tap Again to Confirm Delete" : "Delete Recipe"}
          </Button>
          {confirmDelete && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-2"
              onClick={() => setConfirmDelete(false)}
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
