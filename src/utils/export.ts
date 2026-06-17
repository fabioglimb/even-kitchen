import type { Recipe } from "../types/recipe"

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export function downloadJson(data: unknown, filename: string): Promise<"shared" | "downloaded"> {
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: "application/json;charset=utf-8" })

  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    const file = new File([blob], filename, { type: "application/json" })
    const canShareFiles =
      typeof navigator.canShare !== "function" || navigator.canShare({ files: [file] })

    const sharePromise = canShareFiles
      ? navigator.share({ title: filename, files: [file] })
      : navigator.share({ title: filename, text: json })

    return sharePromise.then(() => "shared" as const).catch((err) => {
      if (err instanceof DOMException && err.name === "AbortError") throw err
      downloadBlob(blob, filename)
      return "downloaded" as const
    })
  }

  downloadBlob(blob, filename)
  return Promise.resolve("downloaded")
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
