import type { Recipe, AppSettings } from '../types/recipe'
import { seedRecipes } from './seed-recipes'
import { encryptValue, decryptValue } from '../utils/crypto'
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

/**
 * Load settings synchronously (for initial React state).
 * API keys are encrypted — they'll be decrypted async after mount.
 */
export function loadSettings(): AppSettings {
  const stored = storageGetSync<Partial<AppSettings> | null>(STORAGE_KEY_SETTINGS, null)
  if (stored) {
    return { ...DEFAULT_SETTINGS, ...stored }
  }
  return { ...DEFAULT_SETTINGS }
}

/**
 * Decrypt API keys from stored settings.
 * Call this async after mount to populate the real keys.
 */
export async function decryptSettings(settings: AppSettings): Promise<AppSettings> {
  const [openai, anthropic, deepseek] = await Promise.all([
    decryptValue(settings.openaiApiKey),
    decryptValue(settings.anthropicApiKey),
    decryptValue(settings.deepseekApiKey),
  ])
  return {
    ...settings,
    openaiApiKey: openai,
    anthropicApiKey: anthropic,
    deepseekApiKey: deepseek,
  }
}

/**
 * Save settings with encrypted API keys.
 */
export async function saveSettingsEncrypted(settings: AppSettings): Promise<void> {
  const [openai, anthropic, deepseek] = await Promise.all([
    encryptValue(settings.openaiApiKey),
    encryptValue(settings.anthropicApiKey),
    encryptValue(settings.deepseekApiKey),
  ])
  const toStore = {
    ...settings,
    openaiApiKey: openai,
    anthropicApiKey: anthropic,
    deepseekApiKey: deepseek,
  }
  storageSet(STORAGE_KEY_SETTINGS, toStore)
}

export function resetRecipes(): void {
  storageRemove(STORAGE_KEY_RECIPES)
}
