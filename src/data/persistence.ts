import type { Recipe, AppSettings } from '../types/recipe'
import { seedRecipes } from './seed-recipes'
import { storageGet, storageSet, storageRemove } from 'even-toolkit/storage'

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

export async function loadRecipes(): Promise<Recipe[]> {
  const stored = await storageGet<Recipe[] | null>(STORAGE_KEY_RECIPES, null)
  if (stored) return stored
  return seedRecipes
}

export async function saveRecipes(recipes: Recipe[]): Promise<void> {
  await storageSet(STORAGE_KEY_RECIPES, recipes)
}

export async function loadSettings(): Promise<AppSettings> {
  const stored = await storageGet<Partial<AppSettings> | null>(STORAGE_KEY_SETTINGS, null)
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
  await storageSet(STORAGE_KEY_SETTINGS, settings)
}

export async function resetRecipes(): Promise<void> {
  await storageRemove(STORAGE_KEY_RECIPES)
}
