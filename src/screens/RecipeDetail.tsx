import { useState, useMemo } from "react"
import { useParams, useNavigate } from "react-router"
import { useRecipeContext } from "../contexts/RecipeContext"
import { useCookingContext } from "../contexts/CookingContext"
import { useShoppingContext } from "../contexts/ShoppingContext"
import { Button, Badge, Card, SectionHeader, Divider, EmptyState, Toast } from "even-toolkit/web"
import { useDrawerHeader } from "even-toolkit/web"
import { IcNavShopping } from "even-toolkit/web/icons/svg-icons"
import { IngredientChip } from "../components/shared/IngredientChip"
import { ZoomableImage } from "../components/shared/ZoomableImage"
import { formatMinutes, scaleIngredients } from "../utils/format"
import { getRecipeImages } from "../utils/image"
import { useTranslation } from "../hooks/useTranslation"

export function RecipeDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { recipes, setSelectedRecipe, deleteRecipe, toggleArchive } = useRecipeContext()
  const { setCurrentStepIndex, resetAllTimers } = useCookingContext()
  const { addFromRecipe } = useShoppingContext()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [servingsOverride, setServingsOverride] = useState<number | null>(null)
  const [shoppingAdded, setShoppingAdded] = useState(false)
  const { t } = useTranslation()

  const recipe = recipes.find((r) => r.id === id)
  const currentServings = servingsOverride ?? recipe?.servings ?? 1
  const scaledIngredients = useMemo(
    () => recipe ? scaleIngredients(recipe.ingredients, recipe.servings, currentServings) : [],
    [recipe, currentServings],
  )

  useDrawerHeader({
    title: recipe?.title ?? t('form.recipe'),
    backTo: '/',
  })

  if (!recipe) {
    return (
      <EmptyState title={t('recipe.notFound')} />
    )
  }

  const handleStartCooking = () => {
    setSelectedRecipe(recipe)
    setCurrentStepIndex(0)
    resetAllTimers()
    navigate(`/recipe/${recipe.id}/cook`)
  }

  const handleAddToShopping = () => {
    // Pass original (unscaled) ingredients + servings info — the shopping context stores
    // base amounts and tracks the scale separately so users can rescale from the list.
    addFromRecipe(recipe.id, recipe.title, recipe.ingredients, recipe.servings, currentServings)
    setShoppingAdded(true)
    setTimeout(() => setShoppingAdded(false), 2000)
  }

  const recipeImages = getRecipeImages(recipe)

  return (
    <>
      {/* Hero */}
      {recipeImages.length > 0 ? (
        <div className="h-48 bg-surface-light overflow-hidden">
          <ZoomableImage
            images={recipeImages}
            alt={recipe.title}
            className="w-full h-48 object-cover"
          />
        </div>
      ) : (
        <div className="h-48 flex items-center justify-center text-8xl bg-surface-light">
          <span style={{ fontFamily: '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif' }}>
            {recipe.heroEmoji || '🍣'}
          </span>
        </div>
      )}

      <div className="px-3 py-4 space-y-4">
        {/* Title */}
        <div>
          <h1 className="text-[24px] tracking-[-0.72px] font-normal mb-0.5">{recipe.title}</h1>
          <p className="text-text-muted">{recipe.subtitle}</p>
          <div className="flex items-center gap-2 mt-3">
            <Badge variant="accent">{formatMinutes(recipe.prepTime + recipe.cookTime)}</Badge>
            <Badge>{recipe.difficulty}</Badge>
            <Badge>{recipe.category}</Badge>
          </div>
        </div>

        {/* Servings Scaler */}
        <section>
          <SectionHeader title={t('recipe.scaleServings')} />
          <div className="flex items-center gap-3 bg-surface rounded-[6px] p-3">
            <Button
              size="icon"
              variant="default"
              onClick={() => setServingsOverride(Math.max(1, currentServings - 1))}
              aria-label="Decrease servings"
            >
              <span className="text-[17px] tracking-[-0.17px] font-normal">−</span>
            </Button>
            <span className="flex-1 text-center text-[20px] tracking-[-0.6px] font-normal">
              {currentServings} {t('recipe.servingsCount')}
            </span>
            <Button
              size="icon"
              variant="default"
              onClick={() => setServingsOverride(currentServings + 1)}
              aria-label="Increase servings"
            >
              <span className="text-[17px] tracking-[-0.17px] font-normal">+</span>
            </Button>
          </div>
        </section>

        {/* Ingredients */}
        <section>
          <SectionHeader title={t('recipe.ingredients')} />
          <div className="flex flex-wrap gap-2">
            {scaledIngredients.map((ing) => (
              <IngredientChip key={ing.name} ingredient={ing} />
            ))}
          </div>
          {/* Add to Shopping List */}
          <Button
            variant="secondary"
            className="w-full mt-3"
            onClick={handleAddToShopping}
          >
            <IcNavShopping width={16} height={16} />
            <span className="ml-1.5">{t('shopping.addFromRecipe')}</span>
          </Button>
          {shoppingAdded && (
            <div className="mt-2">
              <Toast message={t('shopping.added')} variant="info" />
            </div>
          )}
        </section>

        {/* Steps Overview */}
        <section>
          <SectionHeader title={t('recipe.steps')} />
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
            {t('recipe.startCooking')}
          </Button>
          <Button
            size="lg"
            variant="default"
            onClick={() => navigate(`/recipe/${recipe.id}/edit`)}
          >
            {t('recipe.edit')}
          </Button>
        </div>

        {/* Archive */}
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => toggleArchive(recipe.id)}
        >
          {recipe.archived ? t('recipe.unarchive') : t('recipe.archive')}
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
            {confirmDelete ? t('recipe.confirmDelete') : t('recipe.delete')}
          </Button>
          {confirmDelete && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-2"
              onClick={() => setConfirmDelete(false)}
            >
              {t('form.cancel')}
            </Button>
          )}
        </div>
      </div>
    </>
  )
}
