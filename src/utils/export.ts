import type { Recipe } from "../types/recipe"

export function downloadJson(data: unknown, filename: string): void {
  const json = JSON.stringify(data, null, 2)

  if (navigator.share) {
    const file = new File([json], filename, { type: "application/json" })
    navigator.share({ files: [file] }).catch(() => {})
    return
  }

  const blob = new Blob([json], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.style.display = "none"
  document.body.appendChild(a)
  a.click()
  setTimeout(() => {
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, 200)
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
