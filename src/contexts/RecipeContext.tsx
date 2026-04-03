import { createContext, useContext, useReducer, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Recipe, AppSettings } from '../types/recipe'
import { loadRecipes, saveRecipes, loadSettings, decryptSettings, saveSettingsEncrypted } from '../data/persistence'
import { seedRecipes } from '../data/seed-recipes'

// --- State ---
interface RecipeState {
  recipes: Recipe[]
  settings: AppSettings
  selectedRecipe: Recipe | null
  categoryFilter: string
}

const DEFAULT_SETTINGS: AppSettings = {
  language: 'en',
  aiProvider: 'openai',
  aiModel: 'gpt-4o-mini',
  openaiApiKey: '',
  anthropicApiKey: '',
  deepseekApiKey: '',
}

// --- Actions ---
type RecipeAction =
  | { type: 'SET_SELECTED'; recipe: Recipe | null }
  | { type: 'SET_CATEGORY_FILTER'; category: string }
  | { type: 'ADD_RECIPE'; recipe: Recipe }
  | { type: 'UPDATE_RECIPE'; recipe: Recipe }
  | { type: 'DELETE_RECIPE'; id: string }
  | { type: 'IMPORT_RECIPES'; recipes: Recipe[] }
  | { type: 'TOGGLE_ARCHIVE'; id: string }
  | { type: 'RESET_TO_DEFAULTS' }
  | { type: 'SET_SETTINGS'; settings: AppSettings }
  | { type: 'INIT'; recipes: Recipe[]; settings: AppSettings }

// --- Context value ---
interface RecipeContextValue {
  recipes: Recipe[]
  settings: AppSettings
  categories: string[]
  selectedRecipe: Recipe | null
  categoryFilter: string
  loaded: boolean
  setSelectedRecipe: (recipe: Recipe | null) => void
  setCategoryFilter: (category: string) => void
  addRecipe: (recipe: Recipe) => void
  updateRecipe: (recipe: Recipe) => void
  deleteRecipe: (id: string) => void
  toggleArchive: (id: string) => void
  importRecipes: (recipes: Recipe[]) => void
  resetToDefaults: () => void
  setSettings: (settings: AppSettings) => void
}

const RecipeContext = createContext<RecipeContextValue | null>(null)

// --- Reducer ---
function recipeReducer(state: RecipeState, action: RecipeAction): RecipeState {
  switch (action.type) {
    case 'INIT':
      return { ...state, recipes: action.recipes, settings: action.settings }
    case 'SET_SELECTED':
      return { ...state, selectedRecipe: action.recipe }
    case 'SET_CATEGORY_FILTER':
      return { ...state, categoryFilter: action.category }
    case 'ADD_RECIPE':
      return { ...state, recipes: [...state.recipes, action.recipe] }
    case 'UPDATE_RECIPE':
      return {
        ...state,
        recipes: state.recipes.map((r) => (r.id === action.recipe.id ? action.recipe : r)),
      }
    case 'DELETE_RECIPE':
      return {
        ...state,
        recipes: state.recipes.filter((r) => r.id !== action.id),
        selectedRecipe: state.selectedRecipe?.id === action.id ? null : state.selectedRecipe,
      }
    case 'TOGGLE_ARCHIVE':
      return {
        ...state,
        recipes: state.recipes.map((r) =>
          r.id === action.id ? { ...r, archived: !r.archived } : r,
        ),
      }
    case 'IMPORT_RECIPES': {
      const existingIds = new Set(state.recipes.map((r) => r.id))
      const newRecipes = action.recipes.filter((r) => !existingIds.has(r.id))
      return { ...state, recipes: [...state.recipes, ...newRecipes] }
    }
    case 'RESET_TO_DEFAULTS':
      return { ...state, recipes: seedRecipes, selectedRecipe: null, categoryFilter: 'All' }
    case 'SET_SETTINGS':
      return { ...state, settings: action.settings }
    default:
      return state
  }
}

// --- Provider ---
export function RecipeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(recipeReducer, {
    recipes: seedRecipes,
    settings: DEFAULT_SETTINGS,
    selectedRecipe: null,
    categoryFilter: 'All',
  })
  const [loaded, setLoaded] = useState(false)

  const persistRecipesNow = (recipes: Recipe[]) => {
    void saveRecipes(recipes)
  }

  // Load data async on mount
  useEffect(() => {
    async function init() {
      const [recipes, rawSettings] = await Promise.all([loadRecipes(), loadSettings()])
      const settings = await decryptSettings(rawSettings)
      dispatch({ type: 'INIT', recipes, settings })
      setLoaded(true)
    }
    init()
  }, [])

  useEffect(() => {
    if (!loaded) return
    saveRecipes(state.recipes)
  }, [state.recipes, loaded])

  useEffect(() => {
    if (!loaded) return
    // Save with encryption (async, fire-and-forget)
    saveSettingsEncrypted(state.settings)
  }, [state.settings, loaded])

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(state.recipes.map((r) => r.category)))],
    [state.recipes],
  )

  const value: RecipeContextValue = {
    recipes: state.recipes,
    settings: state.settings,
    categories,
    selectedRecipe: state.selectedRecipe,
    categoryFilter: state.categoryFilter,
    loaded,
    setSelectedRecipe: (recipe) => dispatch({ type: 'SET_SELECTED', recipe }),
    setCategoryFilter: (category) => dispatch({ type: 'SET_CATEGORY_FILTER', category }),
    addRecipe: (recipe) => {
      const next = [...state.recipes, recipe]
      dispatch({ type: 'ADD_RECIPE', recipe })
      persistRecipesNow(next)
    },
    updateRecipe: (recipe) => {
      const next = state.recipes.map((r) => (r.id === recipe.id ? recipe : r))
      dispatch({ type: 'UPDATE_RECIPE', recipe })
      persistRecipesNow(next)
    },
    deleteRecipe: (id) => {
      const next = state.recipes.filter((r) => r.id !== id)
      dispatch({ type: 'DELETE_RECIPE', id })
      persistRecipesNow(next)
    },
    toggleArchive: (id) => dispatch({ type: 'TOGGLE_ARCHIVE', id }),
    importRecipes: (recipes) => {
      const existingIds = new Set(state.recipes.map((r) => r.id))
      const newRecipes = recipes.filter((r) => !existingIds.has(r.id))
      const next = [...state.recipes, ...newRecipes]
      dispatch({ type: 'IMPORT_RECIPES', recipes })
      persistRecipesNow(next)
    },
    resetToDefaults: () => {
      dispatch({ type: 'RESET_TO_DEFAULTS' })
      persistRecipesNow(seedRecipes)
    },
    setSettings: (settings) => {
      dispatch({ type: 'SET_SETTINGS', settings })
      void saveSettingsEncrypted(settings)
    },
  }

  return <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>
}

export function useRecipeContext() {
  const ctx = useContext(RecipeContext)
  if (!ctx) throw new Error('useRecipeContext must be used within RecipeProvider')
  return ctx
}
