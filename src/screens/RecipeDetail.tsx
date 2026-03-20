import { useState } from "react"
import { useParams, useNavigate } from "react-router"
import { useRecipeContext } from "../contexts/RecipeContext"
import { useCookingContext } from "../contexts/CookingContext"
import { Button, Badge, Card, SectionHeader, Divider, EmptyState, AppShell, NavHeader } from "even-toolkit/web"
import { IcChevronBack } from "even-toolkit/web/icons/svg-icons"
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
      <EmptyState title="Recipe not found" />
    )
  }

  const handleStartCooking = () => {
    setSelectedRecipe(recipe)
    setCurrentStepIndex(0)
    resetAllTimers()
    navigate(`/recipe/${recipe.id}/cook`)
  }

  return (
    <AppShell
      header={
        <NavHeader
          title={recipe.title}
          left={
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <IcChevronBack width={20} height={20} />
            </Button>
          }
        />
      }
    >
      {/* Hero */}
      <div className="h-48 flex items-center justify-center text-8xl bg-surface-light">
        <span style={{ fontFamily: '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif' }}>
          {recipe.heroEmoji}
        </span>
      </div>

      <div className="px-3 py-4 space-y-4">
        {/* Title */}
        <div>
          <h1 className="text-[24px] tracking-[-0.72px] font-normal mb-0.5">{recipe.title}</h1>
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
          <SectionHeader title="Ingredients" />
          <div className="flex flex-wrap gap-2">
            {recipe.ingredients.map((ing) => (
              <IngredientChip key={ing.name} ingredient={ing} />
            ))}
          </div>
        </section>

        {/* Steps Overview */}
        <section>
          <SectionHeader title="Steps" />
          <div className="space-y-3">
            {recipe.steps.map((step, i) => (
              <Card key={i} className="flex items-center gap-3">
                <span className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[13px] tracking-[-0.13px] font-normal text-text-highlight bg-accent">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] tracking-[-0.15px] font-normal">{step.title}</p>
                  <p className="text-[13px] tracking-[-0.13px] text-text-muted mt-0.5">{step.instructions}</p>
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
            variant="default"
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
        <Divider variant="spaced" />
        <div>
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
    </AppShell>
  )
}
