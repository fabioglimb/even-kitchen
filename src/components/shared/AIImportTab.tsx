import { useState } from "react"
import { useRecipeContext } from "../../contexts/RecipeContext"
import { useRecipeExtractor } from "../../hooks/useRecipeExtractor"
import { Button } from "../ui/Button"
import { Card } from "../ui/Card"
import { Badge } from "../ui/Badge"
import { formatMinutes } from "../../utils/format"

export function AIImportTab() {
  const { addRecipe } = useRecipeContext()
  const { loading, error, extractedRecipe, extractFromUrl, reset } = useRecipeExtractor()
  const [url, setUrl] = useState("")
  const [saved, setSaved] = useState(false)

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

  const inputClass =
    "w-full rounded-lg bg-surface border border-border px-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent/30"

  return (
    <div className="space-y-6">
      {/* URL Input */}
      <Card className="p-5 space-y-3">
        <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider">
          Extract Recipe from URL
        </h3>
        <div className="flex gap-2">
          <input
            className={`${inputClass} flex-1`}
            placeholder="https://example.com/recipe..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleExtract()}
          />
          <Button size="sm" variant="ghost" onClick={handlePaste}>
            Paste
          </Button>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExtract} disabled={loading || !url.trim()}>
            {loading ? "Extracting..." : "Extract Recipe"}
          </Button>
          {(extractedRecipe || error) && (
            <Button variant="ghost" onClick={handleReset}>
              Clear
            </Button>
          )}
        </div>
      </Card>

      {/* Loading */}
      {loading && (
        <Card className="p-5 flex items-center justify-center gap-3">
          <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-text-muted">Analyzing recipe...</span>
        </Card>
      )}

      {/* Error */}
      {error && (
        <Card className="p-5">
          <p className="text-sm text-red-400">{error}</p>
        </Card>
      )}

      {/* Recipe Preview */}
      {extractedRecipe && (
        <Card className="p-5 space-y-4">
          <div className="flex items-start gap-3">
            <span className="text-4xl">{extractedRecipe.heroEmoji}</span>
            <div className="flex-1">
              <h3 className="text-lg font-bold">{extractedRecipe.title}</h3>
              <p className="text-sm text-text-muted">{extractedRecipe.subtitle}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="accent">
                  {formatMinutes(extractedRecipe.prepTime + extractedRecipe.cookTime)}
                </Badge>
                <Badge>{extractedRecipe.difficulty}</Badge>
                <Badge>{extractedRecipe.servings} servings</Badge>
                <Badge>{extractedRecipe.category}</Badge>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-2">
              Ingredients ({extractedRecipe.ingredients.length})
            </h4>
            <div className="flex flex-wrap gap-1">
              {extractedRecipe.ingredients.map((ing, i) => (
                <span
                  key={i}
                  className="text-xs bg-surface-light rounded-full px-2 py-1 text-text-muted"
                >
                  {ing.amount} {ing.unit} {ing.name}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-2">
              Steps ({extractedRecipe.steps.length})
            </h4>
            <ol className="space-y-1 text-sm text-text-muted">
              {extractedRecipe.steps.map((step, i) => (
                <li key={i}>
                  <span className="font-medium text-text">{i + 1}. {step.title}</span>
                  {step.timerSeconds && (
                    <span className="text-xs text-accent ml-1">
                      ({Math.round(step.timerSeconds / 60)}min)
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </div>

          {saved ? (
            <p className="text-sm text-green-400 font-medium">Saved to library!</p>
          ) : (
            <Button className="w-full" onClick={handleSave}>
              Save to Library
            </Button>
          )}
        </Card>
      )}
    </div>
  )
}
