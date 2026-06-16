import type { Recipe } from "../types/recipe";

/** All images for a recipe, returning an empty array if none. */
export function getRecipeImages(recipe: Recipe): string[] {
  return recipe.images && recipe.images.length > 0 ? recipe.images : [];
}

// Max edge of the stored image. Big enough to look sharp in the full-screen
// zoom modal, while still downscaled + JPEG-compressed to stay reasonable in
// Even Hub storage (~40-90 KB each). Small thumbnails downscale from this.
const MAX_DIM = 720;
const JPEG_QUALITY = 0.78;

/**
 * Read an image file and return a downscaled JPEG data URL.
 *
 * Recipe images are a phone-only visual aid (G2 glasses are text-only). They
 * are displayed as small thumbnails but can be tapped to zoom full-screen, so
 * we keep a viewable resolution rather than a tiny icon.
 */
export function fileToThumbnailDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Not an image file"));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error ?? new Error("Failed to read file"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Failed to decode image"));
      img.onload = () => {
        const scale = Math.min(1, MAX_DIM / Math.max(img.width, img.height));
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas not supported"));
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", JPEG_QUALITY));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
