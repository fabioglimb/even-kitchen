import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router"
import { useRecipeContext } from "../contexts/RecipeContext"
import { Button } from "../components/ui/Button"
import { Card } from "../components/ui/Card"
import { generateId } from "../utils/format"
import type { Recipe, Ingredient, Step } from "../types/recipe"

const FOOD_EMOJIS = [
  "\uD83C\uDF5D", "\uD83C\uDF55", "\uD83C\uDF54", "\uD83C\uDF2E", "\uD83C\uDF63",
  "\uD83C\uDF5B", "\uD83E\uDD5A", "\uD83E\uDD69", "\uD83C\uDF5C", "\uD83E\uDE7D",
  "\uD83C\uDF70", "\uD83C\uDF6A", "\uD83E\uDD57", "\uD83C\uDF73", "\uD83C\uDF72",
  "\uD83C\uDF6B", "\uD83C\uDF53", "\uD83E\uDD50", "\uD83C\uDF5E", "\uD83E\uDDC1",
]

const COLOR_PRESETS = [
  "#e6b44c", "#f0c040", "#e07a5f", "#8b5e3c",
  "#6b9e78", "#5a7dba", "#9b6bb0", "#d4697a",
]

const emptyIngredient = (): Ingredient => ({ name: "", amount: "", unit: "" })
const emptyStep = (): Step => ({ title: "", instructions: "" })

export function RecipeForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { recipes, addRecipe, updateRecipe } = useRecipeContext()

  const isEdit = Boolean(id)
  const existing = isEdit ? recipes.find((r) => r.id === id) : null

  const [title, setTitle] = useState("")
  const [subtitle, setSubtitle] = useState("")
  const [category, setCategory] = useState("")
  const [prepTime, setPrepTime] = useState(0)
  const [cookTime, setCookTime] = useState(0)
  const [servings, setServings] = useState(2)
  const [difficulty, setDifficulty] = useState("Easy")
  const [heroEmoji, setHeroEmoji] = useState("\uD83C\uDF5D")
  const [accentColor, setAccentColor] = useState("#e6b44c")
  const [ingredients, setIngredients] = useState<Ingredient[]>([emptyIngredient()])
  const [steps, setSteps] = useState<Step[]>([emptyStep()])

  useEffect(() => {
    if (existing) {
      setTitle(existing.title)
      setSubtitle(existing.subtitle)
      setCategory(existing.category)
      setPrepTime(existing.prepTime)
      setCookTime(existing.cookTime)
      setServings(existing.servings)
      setDifficulty(existing.difficulty)
      setHeroEmoji(existing.heroEmoji)
      setAccentColor(existing.accentColor)
      setIngredients(existing.ingredients.length > 0 ? existing.ingredients : [emptyIngredient()])
      setSteps(existing.steps.length > 0 ? existing.steps : [emptyStep()])
    }
  }, [existing])

  const handleSave = () => {
    if (!title.trim()) return

    const recipe: Recipe = {
      id: isEdit && existing ? existing.id : generateId(),
      title: title.trim(),
      subtitle: subtitle.trim(),
      category: category.trim() || "Uncategorized",
      prepTime,
      cookTime,
      servings,
      difficulty,
      heroEmoji,
      accentColor,
      ingredients: ingredients.filter((i) => i.name.trim()),
      steps: steps.filter((s) => s.title.trim() || s.instructions.trim()),
    }

    if (isEdit) {
      updateRecipe(recipe)
    } else {
      addRecipe(recipe)
    }

    navigate(`/recipe/${recipe.id}`)
  }

  const updateIngredient = (index: number, field: keyof Ingredient, value: string) => {
    setIngredients((prev) => prev.map((ing, i) => (i === index ? { ...ing, [field]: value } : ing)))
  }

  const updateStep = (index: number, field: keyof Step, value: string | number) => {
    setSteps((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)))
  }

  const inputClass =
    "w-full rounded-lg bg-surface border border-border px-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent/30"

  return (
    <div className="min-h-dvh pb-8">
      <header className="sticky top-0 z-20 bg-bg/95 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="text-text-muted hover:text-text transition-colors cursor-pointer"
          >
            &larr; Cancel
          </button>
          <h1 className="text-lg font-semibold">{isEdit ? "Edit Recipe" : "New Recipe"}</h1>
          <Button size="sm" onClick={handleSave} disabled={!title.trim()}>
            Save
          </Button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-6 space-y-6">
        {/* Basic Info */}
        <Card className="p-5 space-y-4">
          <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Basic Info</h3>
          <input
            className={inputClass}
            placeholder="Recipe title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className={inputClass}
            placeholder="Subtitle / description"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              className={inputClass}
              placeholder="Category (e.g. Pasta)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <select
              className={inputClass}
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-text-muted mb-1 block">Prep (min)</label>
              <input
                className={inputClass}
                type="number"
                min={0}
                value={prepTime}
                onChange={(e) => setPrepTime(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="text-xs text-text-muted mb-1 block">Cook (min)</label>
              <input
                className={inputClass}
                type="number"
                min={0}
                value={cookTime}
                onChange={(e) => setCookTime(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="text-xs text-text-muted mb-1 block">Servings</label>
              <input
                className={inputClass}
                type="number"
                min={1}
                value={servings}
                onChange={(e) => setServings(Number(e.target.value))}
              />
            </div>
          </div>
        </Card>

        {/* Ingredients */}
        <Card className="p-5 space-y-4">
          <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Ingredients</h3>
          {ingredients.map((ing, i) => (
            <div key={i} className="flex gap-2 items-start">
              <input
                className={`${inputClass} flex-1`}
                placeholder="Name"
                value={ing.name}
                onChange={(e) => updateIngredient(i, "name", e.target.value)}
              />
              <input
                className={`${inputClass} w-20`}
                placeholder="Qty"
                value={ing.amount}
                onChange={(e) => updateIngredient(i, "amount", e.target.value)}
              />
              <input
                className={`${inputClass} w-20`}
                placeholder="Unit"
                value={ing.unit}
                onChange={(e) => updateIngredient(i, "unit", e.target.value)}
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIngredients((prev) => prev.filter((_, idx) => idx !== i))}
                disabled={ingredients.length <= 1}
              >
                -
              </Button>
            </div>
          ))}
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setIngredients((prev) => [...prev, emptyIngredient()])}
          >
            + Add Ingredient
          </Button>
        </Card>

        {/* Steps */}
        <Card className="p-5 space-y-4">
          <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Steps</h3>
          {steps.map((step, i) => (
            <div key={i} className="space-y-2 p-3 bg-surface rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-text-muted">Step {i + 1}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setSteps((prev) => prev.filter((_, idx) => idx !== i))}
                  disabled={steps.length <= 1}
                >
                  -
                </Button>
              </div>
              <input
                className={inputClass}
                placeholder="Step title"
                value={step.title}
                onChange={(e) => updateStep(i, "title", e.target.value)}
              />
              <textarea
                className={`${inputClass} min-h-[60px] resize-y`}
                placeholder="Instructions"
                value={step.instructions}
                onChange={(e) => updateStep(i, "instructions", e.target.value)}
              />
              <div>
                <label className="text-xs text-text-muted mb-1 block">Timer (seconds, optional)</label>
                <input
                  className={`${inputClass} w-32`}
                  type="number"
                  min={0}
                  placeholder="0"
                  value={step.timerSeconds || ""}
                  onChange={(e) => updateStep(i, "timerSeconds", Number(e.target.value) || 0)}
                />
              </div>
            </div>
          ))}
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setSteps((prev) => [...prev, emptyStep()])}
          >
            + Add Step
          </Button>
        </Card>

        {/* Appearance */}
        <Card className="p-5 space-y-4">
          <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Appearance</h3>

          <div>
            <label className="text-xs text-text-muted mb-2 block">Emoji</label>
            <div className="flex flex-wrap gap-2">
              {FOOD_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setHeroEmoji(emoji)}
                  className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center cursor-pointer transition-all ${
                    heroEmoji === emoji
                      ? "bg-accent/20 ring-2 ring-accent"
                      : "bg-surface hover:bg-surface-light"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-text-muted mb-2 block">Accent Color</label>
            <div className="flex flex-wrap gap-2">
              {COLOR_PRESETS.map((color) => (
                <button
                  key={color}
                  onClick={() => setAccentColor(color)}
                  className={`w-10 h-10 rounded-lg cursor-pointer transition-all ${
                    accentColor === color ? "ring-2 ring-white scale-110" : ""
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}
