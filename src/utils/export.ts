import type { Recipe } from "../types/recipe"

export function downloadJson(data: unknown, filename: string): Promise<"shared" | "copied"> {
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: "application/json;charset=utf-8" })
  const file = new File([blob], filename, { type: "application/json" })

  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    const canShareFiles =
      typeof navigator.canShare !== "function" || navigator.canShare({ files: [file] })

    if (canShareFiles) {
      return navigator.share({ title: filename, files: [file] })
        .then(() => "shared" as const)
        .catch((err) => {
          if (err instanceof DOMException && err.name === "AbortError") throw err
          return navigator.clipboard.writeText(json).then(() => "copied" as const)
        })
    }
  }

  return navigator.clipboard.writeText(json).then(() => "copied" as const)
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
