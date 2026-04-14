import { useState } from "react"
import { useRecipeContext } from "../../contexts/RecipeContext"
import { useRecipeExtractor } from "../../hooks/useRecipeExtractor"
import { Button, Card, Badge, Input } from "even-toolkit/web"
import { formatMinutes } from "../../utils/format"
import { useTranslation } from "../../hooks/useTranslation"

export function AIImportTab() {
  const { addRecipe } = useRecipeContext()
  const { loading, error, extractedRecipe, extractFromUrl, reset } = useRecipeExtractor()
  const [url, setUrl] = useState("")
  const [saved, setSaved] = useState(false)
  const { t } = useTranslation()

  const handleExtract = () => {
    if (!url.trim()) return
    setSaved(false)
    extractFromUrl(url.trim())
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setUrl(text)
    } catch {
      // clipboard not available
    }
  }

  const handleSave = () => {
    if (!extractedRecipe) return
    addRecipe(extractedRecipe)
    setSaved(true)
  }

  const handleReset = () => {
    setUrl("")
    setSaved(false)
    reset()
  }

  return (
    <div className="space-y-6">
      {/* URL Input */}
      <Card className="p-5 space-y-3">
        <h3 className="text-[13px] tracking-[-0.13px] font-normal text-text-muted uppercase">
          {t('ai.extractTitle')}
        </h3>
        <div className="flex gap-2">
          <Input
            className="flex-1"
            placeholder={t('ai.urlPlaceholder')}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleExtract()}
          />
          <Button size="sm" variant="ghost" onClick={handlePaste}>
            {t('ai.paste')}
          </Button>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExtract} disabled={loading || !url.trim()}>
            {loading ? t('ai.extracting') : t('ai.extract')}
          </Button>
          {(extractedRecipe || error) && (
            <Button variant="ghost" onClick={handleReset}>
              {t('ai.clear')}
            </Button>
          )}
        </div>
      </Card>

      {/* Loading */}
      {loading && (
        <Card className="p-5 flex items-center justify-center gap-3">
          <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <span className="text-[13px] tracking-[-0.13px] text-text-muted">{t('ai.analyzing')}</span>
        </Card>
      )}

      {/* Error */}
      {error && (
        <Card className="p-5">
          <p className="text-[13px] tracking-[-0.13px] text-negative">{error}</p>
        </Card>
      )}

      {/* Recipe Preview */}
      {extractedRecipe && (
        <Card className="p-5 space-y-4">
          <div className="flex items-start gap-3">
            <span className="text-[24px] tracking-[-0.72px]">{extractedRecipe.heroEmoji}</span>
            <div className="flex-1">
              <h3 className="text-[17px] tracking-[-0.17px] font-normal">{extractedRecipe.title}</h3>
              <p className="text-[13px] tracking-[-0.13px] text-text-muted">{extractedRecipe.subtitle}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="accent">
                  {formatMinutes(extractedRecipe.prepTime + extractedRecipe.cookTime)}
                </Badge>
                <Badge>{extractedRecipe.difficulty}</Badge>
                <Badge>{extractedRecipe.servings} {t('ai.servings')}</Badge>
                <Badge>{extractedRecipe.category}</Badge>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-[13px] tracking-[-0.13px] font-normal mb-2">
              {t('ai.ingredientsCount').replace('{count}', String(extractedRecipe.ingredients.length))}
            </h4>
            <div className="flex flex-wrap gap-1">
              {extractedRecipe.ingredients.map((ing, i) => (
                <span
                  key={i}
                  className="text-[11px] tracking-[-0.11px] bg-surface-light rounded-full px-2 py-1 text-text-muted"
                >
                  {ing.amount} {ing.unit} {ing.name}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[13px] tracking-[-0.13px] font-normal mb-2">
              {t('ai.stepsCount').replace('{count}', String(extractedRecipe.steps.length))}
            </h4>
            <ol className="space-y-1 text-[13px] tracking-[-0.13px] text-text-muted">
              {extractedRecipe.steps.map((step, i) => (
                <li key={i}>
                  <span className="font-normal text-text">{i + 1}. {step.title}</span>
                  {step.timerSeconds && (
                    <span className="text-[11px] tracking-[-0.11px] text-accent ml-1">
                      ({Math.round(step.timerSeconds / 60)}min)
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </div>

          {saved ? (
            <p className="text-[13px] tracking-[-0.13px] text-positive font-normal">{t('ai.saved')}</p>
          ) : (
            <Button className="w-full" onClick={handleSave}>
              {t('ai.saveToLibrary')}
            </Button>
          )}
        </Card>
      )}
    </div>
  )
}
