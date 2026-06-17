import type { Recipe } from "../types/recipe"

export function downloadJson(data: unknown, filename: string): void {
  const json = JSON.stringify(data, null, 2)
  const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(json)
  const a = document.createElement("a")
  a.href = dataUri
  a.download = filename
  a.style.display = "none"
  document.body.appendChild(a)
  a.click()
  setTimeout(() => document.body.removeChild(a), 100)
}

export function validateImportedRecipes(data: unknown): Recipe[] | null {
  if (!Array.isArray(data)) return null

  const valid = data.every(
    (item) =>
      typeof item === "object" &&
      item !== null &&
      typeof item.id === "string" &&
      typeof item.title === "string" &&
      typeof item.category === "string" &&
      Array.isArray(item.ingredients) &&
      Array.isArray(item.steps),
  )

  return valid ? (data as Recipe[]) : null
}
