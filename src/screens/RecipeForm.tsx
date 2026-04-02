import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router"
import { useRecipeContext } from "../contexts/RecipeContext"
import { Button, Input, Select, Textarea, Card, useDrawerHeader } from "even-toolkit/web"
import { IcTrash } from "even-toolkit/web/icons/svg-icons"
import { generateId } from "../utils/format"
import type { Recipe, Ingredient, Step } from "../types/recipe"
import { useTranslation } from "../hooks/useTranslation"

const FOOD_EMOJIS = [
  "\uD83C\uDF5D", "\uD83C\uDF55", "\uD83C\uDF54", "\uD83C\uDF2E", "\uD83C\uDF63",
  "\uD83C\uDF5B", "\uD83E\uDD5A", "\uD83E\uDD69", "\uD83C\uDF5C", "\uD83C\uDF72",
  "\uD83C\uDF70", "\uD83C\uDF6A", "\uD83E\uDD57", "\uD83C\uDF73", "\uD83C\uDF71",
  "\uD83C\uDF6B", "\uD83C\uDF53", "\uD83E\uDD50", "\uD83C\uDF5E", "\uD83E\uDDC1",
]

const EMOJI_FONT = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif'

const COLOR_PRESETS = [
  "#e6b44c", "#f0c040", "#e07a5f", "#8b5e3c",
  "#6b9e78", "#5a7dba", "#9b6bb0", "#d4697a",
]

const emptyIngredient = (): Ingredient => ({ name: "", amount: "", unit: "" })
const emptyStep = (): Step => ({ title: "", instructions: "" })

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-1.5 mt-2">
      <span className="text-[11px] tracking-[-0.11px] text-text-dim font-normal uppercase">{children}</span>
      <div className="flex-1 h-[1px] bg-border" />
    </div>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="py-3 border-b border-border last:border-b-0">
      <span className="text-[11px] tracking-[-0.11px] text-text-dim font-normal">{label}</span>
      <div className="mt-1">{children}</div>
    </div>
  );
}

export function RecipeForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { recipes, addRecipe, updateRecipe } = useRecipeContext()

  const { t } = useTranslation()
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
      category: category.trim() || t('form.uncategorized'),
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

  useDrawerHeader({
    title: isEdit ? t('form.editRecipe') : t('form.newRecipe'),
    left: (
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="text-[15px] tracking-[-0.15px] text-text-dim hover:text-text cursor-pointer px-2 py-1"
      >
        {t('form.cancel')}
      </button>
    ),
    right: <Button size="sm" onClick={handleSave} disabled={!title.trim()}>{t('form.save')}</Button>,
  })

  return (
    <main className="px-3 pt-4 pb-8">
      {/* Recipe Details */}
      <SectionLabel>{t('form.recipe')}</SectionLabel>
      <Card className="mb-4">
        <FieldRow label={t('form.name')}>
          <Input
            placeholder={t('form.recipeName')}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FieldRow>
        <FieldRow label={t('form.description')}>
          <Input
            placeholder={t('form.descriptionPlaceholder')}
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
          />
        </FieldRow>
        <FieldRow label={t('form.category')}>
          <Input
            placeholder={t('form.categoryPlaceholder')}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </FieldRow>
        <FieldRow label={t('form.difficulty')}>
          <Select
            options={[
              { value: "Easy", label: t('form.easy') },
              { value: "Medium", label: t('form.medium') },
              { value: "Hard", label: t('form.hard') },
            ]}
            value={difficulty}
            onValueChange={setDifficulty}
          />
        </FieldRow>
        <div className="grid grid-cols-3 gap-3 py-3 border-b border-border last:border-b-0">
          <div>
            <span className="text-[11px] tracking-[-0.11px] text-text-dim font-normal">{t('form.prepMin')}</span>
            <Input
              className="mt-1"
              type="number"
              min={0}
              value={prepTime}
              onChange={(e) => setPrepTime(Number(e.target.value))}
            />
          </div>
          <div>
            <span className="text-[11px] tracking-[-0.11px] text-text-dim font-normal">{t('form.cookMin')}</span>
            <Input
              className="mt-1"
              type="number"
              min={0}
              value={cookTime}
              onChange={(e) => setCookTime(Number(e.target.value))}
            />
          </div>
          <div>
            <span className="text-[11px] tracking-[-0.11px] text-text-dim font-normal">{t('form.servings')}</span>
            <Input
              className="mt-1"
              type="number"
              min={1}
              value={servings}
              onChange={(e) => setServings(Number(e.target.value))}
            />
          </div>
        </div>
      </Card>

      {/* Appearance */}
      <SectionLabel>{t('form.appearance')}</SectionLabel>
      <Card className="mb-4">
        <div className="py-3 border-b border-border">
          <span className="text-[11px] tracking-[-0.11px] text-text-dim font-normal">{t('form.emoji')}</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {FOOD_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => setHeroEmoji(emoji)}
                style={{ fontFamily: EMOJI_FONT }}
                className={`w-10 h-10 rounded-[6px] text-[20px] flex items-center justify-center cursor-pointer transition-all ${
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
        <div className="py-3">
          <span className="text-[11px] tracking-[-0.11px] text-text-dim font-normal">{t('form.accentColor')}</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {COLOR_PRESETS.map((color) => (
              <button
                key={color}
                onClick={() => setAccentColor(color)}
                className={`w-10 h-10 rounded-[6px] cursor-pointer transition-all ${
                  accentColor === color ? "ring-2 ring-surface scale-110" : ""
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </Card>

      {/* Ingredients */}
      <SectionLabel>{t('form.ingredients')}</SectionLabel>
      <Card className="mb-4">
        {ingredients.map((ing, i) => (
          <div key={i} className="py-3 border-b border-border last:border-b-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] tracking-[-0.11px] text-text-dim font-normal">{t('form.ingredient')} {i + 1}</span>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIngredients((prev) => prev.filter((_, idx) => idx !== i))}
                disabled={ingredients.length <= 1}
              >
                <IcTrash width={16} height={16} />
              </Button>
            </div>
            <div className="flex gap-2">
              <Input
                className="flex-1"
                placeholder={t('form.name')}
                value={ing.name}
                onChange={(e) => updateIngredient(i, "name", e.target.value)}
              />
              <Input
                className="w-20"
                placeholder={t('form.qty')}
                value={ing.amount}
                onChange={(e) => updateIngredient(i, "amount", e.target.value)}
              />
              <Input
                className="w-20"
                placeholder={t('form.unit')}
                value={ing.unit}
                onChange={(e) => updateIngredient(i, "unit", e.target.value)}
              />
            </div>
          </div>
        ))}
        <div className="py-3">
          <Button
            size="sm"
            variant="ghost"
            className="w-full"
            onClick={() => setIngredients((prev) => [...prev, emptyIngredient()])}
          >
            {t('form.addIngredient')}
          </Button>
        </div>
      </Card>

      {/* Steps */}
      <SectionLabel>{t('form.steps')}</SectionLabel>
      <Card className="mb-4">
        {steps.map((step, i) => (
          <div key={i} className="py-3 border-b border-border last:border-b-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] tracking-[-0.11px] text-text-dim font-normal">{t('form.step')} {i + 1}</span>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setSteps((prev) => prev.filter((_, idx) => idx !== i))}
                disabled={steps.length <= 1}
              >
                <IcTrash width={16} height={16} />
              </Button>
            </div>
            <div className="space-y-2">
              <div>
                <span className="text-[11px] tracking-[-0.11px] text-text-dim font-normal">{t('form.title')}</span>
                <Input
                  className="mt-1"
                  placeholder={t('form.stepTitle')}
                  value={step.title}
                  onChange={(e) => updateStep(i, "title", e.target.value)}
                />
              </div>
              <div>
                <span className="text-[11px] tracking-[-0.11px] text-text-dim font-normal">{t('form.instructions')}</span>
                <Textarea
                  className="mt-1 min-h-[60px]"
                  placeholder={t('form.instructions')}
                  value={step.instructions}
                  onChange={(e) => updateStep(i, "instructions", e.target.value)}
                />
              </div>
              <div>
                <span className="text-[11px] tracking-[-0.11px] text-text-dim font-normal">{t('form.timerSeconds')}</span>
                <Input
                  className="mt-1 w-32"
                  type="number"
                  min={0}
                  placeholder="0"
                  value={step.timerSeconds || ""}
                  onChange={(e) => updateStep(i, "timerSeconds", Number(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>
        ))}
        <div className="py-3">
          <Button
            size="sm"
            variant="ghost"
            className="w-full"
            onClick={() => setSteps((prev) => [...prev, emptyStep()])}
          >
            {t('form.addStep')}
          </Button>
        </div>
      </Card>

      {/* Bottom Buttons */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <Button variant="ghost" onClick={() => navigate(-1)}>{t('form.cancel')}</Button>
        <Button onClick={handleSave} disabled={!title.trim()}>
          {isEdit ? t('form.saveChanges') : t('form.createRecipe')}
        </Button>
      </div>
    </main>
  )
}
