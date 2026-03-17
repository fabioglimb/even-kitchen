import type { Recipe, AppSettings } from '../types/recipe'
import { seedRecipes } from './seed-recipes'
import { encryptValue, decryptValue } from '../utils/crypto'

const STORAGE_KEY_RECIPES = 'even-kitchen:recipes'
const STORAGE_KEY_SETTINGS = 'even-kitchen:settings'

const DEFAULT_SETTINGS: AppSettings = {
  language: 'en',
  aiProvider: 'openai',
  aiModel: 'gpt-4o-mini',
  openaiApiKey: '',
  anthropicApiKey: '',
  deepseekApiKey: '',
}

export function loadRecipes(): Recipe[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_RECIPES)
    if (stored) return JSON.parse(stored)
  } catch {
    // ignore parse errors
  }
  return seedRecipes
}

export function saveRecipes(recipes: Recipe[]): void {
  localStorage.setItem(STORAGE_KEY_RECIPES, JSON.stringify(recipes))
}

/**
 * Load settings synchronously (for initial React state).
 * API keys are encrypted — they'll be decrypted async after mount.
 */
export function loadSettings(): AppSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_SETTINGS)
    if (stored) {
      const parsed = JSON.parse(stored)
      return { ...DEFAULT_SETTINGS, ...parsed }
    }
  } catch {
    // ignore parse errors
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
  localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(toStore))
}

export function resetRecipes(): void {
  localStorage.removeItem(STORAGE_KEY_RECIPES)
}
