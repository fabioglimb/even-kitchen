import type { Recipe, AppSettings } from '../types/recipe'
import { seedRecipes } from './seed-recipes'
import { storageGetSync, storageSet, storageRemove } from 'even-toolkit/storage'

const STORAGE_KEY_RECIPES = 'even-kitchen:recipes'
const STORAGE_KEY_SETTINGS = 'even-kitchen:settings'

export const ALL_STORAGE_KEYS = [
  'even-kitchen:recipes',
  'even-kitchen:settings',
  'even-kitchen:cooking',
]

const DEFAULT_SETTINGS: AppSettings = {
  language: 'en',
  aiProvider: 'openai',
  aiModel: 'gpt-4o-mini',
  openaiApiKey: '',
  anthropicApiKey: '',
  deepseekApiKey: '',
}

export function loadRecipes(): Recipe[] {
  const stored = storageGetSync<Recipe[] | null>(STORAGE_KEY_RECIPES, null)
  if (stored) return stored
  return seedRecipes
}

export function saveRecipes(recipes: Recipe[]): void {
  storageSet(STORAGE_KEY_RECIPES, recipes)
}

export function loadSettings(): AppSettings {
  const stored = storageGetSync<Partial<AppSettings> | null>(STORAGE_KEY_SETTINGS, null)
  if (stored) return { ...DEFAULT_SETTINGS, ...stored }
  return { ...DEFAULT_SETTINGS }
}

/**
 * Decrypt is now a no-op — keys stored in plaintext via SDK storage.
 * Kept for API compatibility with RecipeContext.
 */
export async function decryptSettings(settings: AppSettings): Promise<AppSettings> {
  return settings
}

/**
 * Save settings directly — no encryption needed.
 * SDK storage is sandboxed per-app in Even Hub.
 */
export async function saveSettingsEncrypted(settings: AppSettings): Promise<void> {
  storageSet(STORAGE_KEY_SETTINGS, settings)
}

export function resetRecipes(): void {
  storageRemove(STORAGE_KEY_RECIPES)
}
