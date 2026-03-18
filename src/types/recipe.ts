export interface Recipe {
  id: string
  title: string
  subtitle: string
  category: string
  prepTime: number
  cookTime: number
  servings: number
  difficulty: string
  ingredients: Ingredient[]
  steps: Step[]
  heroEmoji: string
  accentColor: string
  archived?: boolean
}

export interface Step {
  title: string
  instructions: string
  timerSeconds?: number
}

export interface Ingredient {
  name: string
  amount: string
  unit: string
}

export type AIProvider = 'openai' | 'anthropic' | 'deepseek'

export interface AIProviderConfig {
  id: AIProvider
  name: string
  models: { id: string; name: string }[]
}

export const AI_PROVIDERS: AIProviderConfig[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    models: [
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini' },
      { id: 'gpt-4o', name: 'GPT-4o' },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' },
    ],
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    models: [
      { id: 'claude-sonnet-4-20250514', name: 'Claude Sonnet 4' },
      { id: 'claude-haiku-4-5-20251001', name: 'Claude Haiku 4.5' },
    ],
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    models: [
      { id: 'deepseek-chat', name: 'DeepSeek Chat' },
      { id: 'deepseek-reasoner', name: 'DeepSeek Reasoner' },
    ],
  },
]

export type AppLanguage = 'en' | 'it' | 'es' | 'fr' | 'de' | 'pt' | 'ja' | 'zh' | 'ko' | 'ru'

export const APP_LANGUAGES: { id: AppLanguage; name: string }[] = [
  { id: 'en', name: 'English' },
  { id: 'it', name: 'Italiano' },
  { id: 'es', name: 'Espanol' },
  { id: 'fr', name: 'Francais' },
  { id: 'de', name: 'Deutsch' },
  { id: 'pt', name: 'Portugues' },
  { id: 'ja', name: 'Japanese' },
  { id: 'zh', name: 'Chinese' },
  { id: 'ko', name: 'Korean' },
  { id: 'ru', name: 'Русский' },
]

export interface AppSettings {
  language: AppLanguage
  aiProvider: AIProvider
  aiModel: string
  openaiApiKey: string
  anthropicApiKey: string
  deepseekApiKey: string
}
