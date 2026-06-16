export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, "0")}`
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

// --- Servings Scaler ---
import type { Ingredient } from '../types/recipe'

/**
 * Scale ingredient amounts from `fromServings` to `toServings`.
 * Handles numeric amounts (integers, decimals) and preserves non-numeric amounts as-is.
 */
export function scaleIngredients(
  ingredients: Ingredient[],
  fromServings: number,
  toServings: number,
): Ingredient[] {
  if (fromServings <= 0 || toServings <= 0 || fromServings === toServings) return ingredients
  const ratio = toServings / fromServings
  return ingredients.map((ing) => {
    const parsed = parseFloat(ing.amount)
    if (isNaN(parsed)) return ing
    const scaled = parsed * ratio
    // Format nicely: no unnecessary decimals
    const formatted = scaled % 1 === 0 ? String(scaled) : scaled.toFixed(1).replace(/\.0$/, '')
    return { ...ing, amount: formatted }
  })
}
