import { useState, useMemo } from "react"
import { useParams, useNavigate } from "react-router"
import { useRecipeContext } from "../contexts/RecipeContext"
import { useCookingContext } from "../contexts/CookingContext"
import { useShoppingContext } from "../contexts/ShoppingContext"
import { Button, Badge, Card, SectionHeader, ConfirmDialog, EmptyState, Toast } from "even-toolkit/web"
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
  const { recipes, setSelectedRecipe, deleteRecipe, toggleArchive, servingsOverrides, setServingsOverride } = useRecipeContext()
  const { setCurrentStepIndex, resetAllTimers } = useCookingContext()
  const { addFromRecipe } = useShoppingContext()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [shoppingAdded, setShoppingAdded] = useState(false)
  const { t } = useTranslation()

  const recipe = recipes.find((r) => r.id === id)
  const currentServings = (id ? servingsOverrides[id] : undefined) ?? recipe?.servings ?? 1
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
    addFromRecipe(recipe.id, recipe.title, recipe.ingredients, recipe.servings, currentServings)
    setShoppingAdded(true)
    setTimeout(() => setShoppingAdded(false), 2000)
  }

  const recipeImages = getRecipeImages(recipe)

  return (
    <>
      {/* Hero */}
      {recipeImages.length > 0 ? (
        <div className="h-48 bg-surface-light overflow-hidden flex items-center justify-center">
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

        {/* Start Cooking */}
        <Button size="lg" className="w-full" onClick={handleStartCooking}>
          {t('recipe.startCooking')}
        </Button>

        {/* Servings Scaler */}
        <section>
          <SectionHeader title={t('recipe.scaleServings')} />
          <div className="flex items-center gap-3 bg-surface rounded-[6px] p-3">
            <Button
              size="icon"
              variant="highlight"
              onClick={() => setServingsOverride(recipe.id, Math.max(1, currentServings - 1))}
              aria-label="Decrease servings"
            >
              <span className="text-[17px] tracking-[-0.17px] font-normal">−</span>
            </Button>
            <span className="flex-1 text-center text-[20px] tracking-[-0.6px] font-normal">
              {currentServings} {t('recipe.servingsCount')}
            </span>
            <Button
              size="icon"
              variant="highlight"
              onClick={() => setServingsOverride(recipe.id, currentServings + 1)}
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
          <Button
            variant="highlight"
            className="w-full mt-3"
            onClick={handleAddToShopping}
          >
            <IcNavShopping width={16} height={16} />
            {t('shopping.addFromRecipe')}
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

        {/* Actions */}
        <div className="space-y-3">
          <Button
            variant="default"
            className="w-full"
            onClick={() => navigate(`/recipe/${recipe.id}/edit`)}
          >
            {t('recipe.edit')}
          </Button>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => toggleArchive(recipe.id)}
          >
            {recipe.archived ? t('recipe.unarchive') : t('recipe.archive')}
          </Button>
          <Button
            variant="danger"
            className="w-full"
            onClick={() => setConfirmDelete(true)}
          >
            {t('recipe.delete')}
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title={t('recipe.delete')}
        description={t('recipe.confirmDelete')}
        confirmLabel={t('recipe.delete')}
        variant="danger"
        onConfirm={() => {
          deleteRecipe(recipe.id)
          navigate("/")
        }}
      />
    </>
  )
}
