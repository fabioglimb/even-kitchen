import { useParams, useNavigate } from "react-router"
import { useRecipeContext } from "../contexts/RecipeContext"
import { useCookingContext } from "../contexts/CookingContext"
import { Button, Page, EmptyState, useDrawerHeader } from "even-toolkit/web"
import { useTranslation } from "../hooks/useTranslation"

export function Completion() {
  useDrawerHeader({ hidden: true })
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { recipes } = useRecipeContext()
  const { setCurrentStepIndex, resetAllTimers } = useCookingContext()
  const { t } = useTranslation()
  const recipe = recipes.find((r) => r.id === id)

  if (!recipe) {
    return (
      <Page>
        <EmptyState title={t('recipe.notFound')} />
      </Page>
    )
  }

  const handleCookAgain = () => {
    setCurrentStepIndex(0)
    resetAllTimers()
    navigate(`/recipe/${recipe.id}/cook`)
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-4 text-center">
      <div className="text-8xl mb-6" style={{ fontFamily: '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif' }}>{recipe.heroEmoji}</div>

      <h1 className="text-[24px] tracking-[-0.72px] font-normal mb-2">{t('complete.title')}</h1>
      <p className="text-text-muted text-[17px] tracking-[-0.17px] mb-2">{t('complete.readyToServe').replace('{title}', recipe.title)}</p>
      <p className="text-text-muted text-[13px] tracking-[-0.13px] mb-10">
        {t('complete.servingsPrepared').replace('{count}', String(recipe.servings))}
      </p>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Button
          size="lg"
          className="w-full"
          onClick={handleCookAgain}
        >
          {t('complete.cookAgain')}
        </Button>
        <Button
          size="lg"
          variant="default"
          className="w-full"
          onClick={() => navigate("/")}
        >
          {t('complete.backToLibrary')}
        </Button>
      </div>
    </div>
  )
}
