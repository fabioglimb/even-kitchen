import { createContext, useContext, useReducer, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Recipe, AppSettings, Collection, SmartViewConfig } from '../types/recipe'
import { DEFAULT_SMART_VIEW } from '../types/recipe'
import { loadRecipes, saveRecipes, loadSettings, decryptSettings, saveSettingsEncrypted } from '../data/persistence'
import { storageGet, storageSet } from 'even-toolkit/storage'
import { seedRecipes, seedCollections } from '../data/seed-recipes'

// --- State ---
interface RecipeState {
  recipes: Recipe[]
  collections: Collection[]
  settings: AppSettings
  selectedRecipe: Recipe | null
  categoryFilter: string
  collectionFilter: string
  favoriteIds: string[]
  smartViewConfig: SmartViewConfig
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
  | { type: 'SET_COLLECTION_FILTER'; collectionId: string }
  | { type: 'ADD_RECIPE'; recipe: Recipe }
  | { type: 'UPDATE_RECIPE'; recipe: Recipe }
  | { type: 'DELETE_RECIPE'; id: string }
  | { type: 'IMPORT_RECIPES'; recipes: Recipe[] }
  | { type: 'TOGGLE_ARCHIVE'; id: string }
  | { type: 'RESET_TO_DEFAULTS' }
  | { type: 'SET_SETTINGS'; settings: AppSettings }
  | { type: 'TOGGLE_FAVORITE'; id: string }
  | { type: 'SET_SMART_VIEW'; config: SmartViewConfig }
  | { type: 'ADD_COLLECTION'; collection: Collection }
  | { type: 'UPDATE_COLLECTION'; collection: Collection }
  | { type: 'DELETE_COLLECTION'; id: string }
  | { type: 'ADD_RECIPE_TO_COLLECTION'; recipeId: string; collectionId: string }
  | { type: 'REMOVE_RECIPE_FROM_COLLECTION'; recipeId: string; collectionId: string }
  | { type: 'INIT'; recipes: Recipe[]; collections: Collection[]; settings: AppSettings; favoriteIds: string[]; smartViewConfig: SmartViewConfig }

// --- Context value ---
interface RecipeContextValue {
  recipes: Recipe[]
  collections: Collection[]
  settings: AppSettings
  categories: string[]
  selectedRecipe: Recipe | null
  categoryFilter: string
  collectionFilter: string
  favoriteIds: string[]
  smartViewConfig: SmartViewConfig
  servingsOverrides: Record<string, number>
  loaded: boolean
  setSelectedRecipe: (recipe: Recipe | null) => void
  toggleFavorite: (id: string) => void
  setSmartViewConfig: (config: SmartViewConfig) => void
  setServingsOverride: (recipeId: string, servings: number) => void
  setCategoryFilter: (category: string) => void
  setCollectionFilter: (collectionId: string) => void
  addCollection: (collection: Collection) => void
  updateCollection: (collection: Collection) => void
  deleteCollection: (id: string) => void
  addRecipeToCollection: (recipeId: string, collectionId: string) => void
  removeRecipeFromCollection: (recipeId: string, collectionId: string) => void
  getRecipeCollectionIds: (recipeId: string) => string[]
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
      return { ...state, recipes: action.recipes, collections: action.collections, settings: action.settings, favoriteIds: action.favoriteIds, smartViewConfig: action.smartViewConfig }
    case 'SET_SMART_VIEW':
      return { ...state, smartViewConfig: action.config }
    case 'TOGGLE_FAVORITE': {
      const isFav = state.favoriteIds.includes(action.id)
      return { ...state, favoriteIds: isFav ? state.favoriteIds.filter((f) => f !== action.id) : [...state.favoriteIds, action.id] }
    }
    case 'SET_SELECTED':
      return { ...state, selectedRecipe: action.recipe }
    case 'SET_CATEGORY_FILTER':
      return { ...state, categoryFilter: action.category }
    case 'SET_COLLECTION_FILTER':
      return { ...state, collectionFilter: action.collectionId }
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
      return { ...state, recipes: seedRecipes, collections: seedCollections, selectedRecipe: null, categoryFilter: 'All', collectionFilter: 'All' }
    case 'SET_SETTINGS':
      return { ...state, settings: action.settings }
    case 'ADD_COLLECTION':
      return { ...state, collections: [...state.collections, action.collection] }
    case 'UPDATE_COLLECTION':
      return { ...state, collections: state.collections.map((c) => c.id === action.collection.id ? action.collection : c) }
    case 'DELETE_COLLECTION':
      return { ...state, collections: state.collections.filter((c) => c.id !== action.id), collectionFilter: state.collectionFilter === action.id ? 'All' : state.collectionFilter }
    case 'ADD_RECIPE_TO_COLLECTION':
      return { ...state, collections: state.collections.map((c) => c.id === action.collectionId && !c.recipeIds.includes(action.recipeId) ? { ...c, recipeIds: [...c.recipeIds, action.recipeId] } : c) }
    case 'REMOVE_RECIPE_FROM_COLLECTION':
      return { ...state, collections: state.collections.map((c) => c.id === action.collectionId ? { ...c, recipeIds: c.recipeIds.filter((id) => id !== action.recipeId) } : c) }
    default:
      return state
  }
}

// --- Provider ---
export function RecipeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(recipeReducer, {
    recipes: seedRecipes,
    collections: seedCollections,
    settings: DEFAULT_SETTINGS,
    selectedRecipe: null,
    categoryFilter: 'All',
    collectionFilter: 'All',
    favoriteIds: [],
    smartViewConfig: DEFAULT_SMART_VIEW,
  })
  const [loaded, setLoaded] = useState(false)
  const [servingsOverrides, setServingsOverrides] = useState<Record<string, number>>({})

  const persistRecipesNow = (recipes: Recipe[]) => {
    void saveRecipes(recipes)
  }

  // Load data async on mount
  useEffect(() => {
    async function init() {
      const [recipes, rawSettings, favoriteIds, collections, smartView] = await Promise.all([
        loadRecipes(),
        loadSettings(),
        storageGet<string[]>('kitchen-favorites', []),
        storageGet<Collection[]>('kitchen-collections', seedCollections),
        storageGet<SmartViewConfig>('kitchen-smart-view', DEFAULT_SMART_VIEW),
      ])
      const settings = await decryptSettings(rawSettings)
      dispatch({ type: 'INIT', recipes, collections: collections ?? seedCollections, settings, favoriteIds: favoriteIds ?? [], smartViewConfig: smartView ?? DEFAULT_SMART_VIEW })
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
    saveSettingsEncrypted(state.settings)
  }, [state.settings, loaded])

  useEffect(() => {
    if (!loaded) return
    storageSet('kitchen-favorites', state.favoriteIds)
  }, [state.favoriteIds, loaded])

  useEffect(() => {
    if (!loaded) return
    storageSet('kitchen-collections', state.collections)
  }, [state.collections, loaded])

  useEffect(() => {
    if (!loaded) return
    storageSet('kitchen-smart-view', state.smartViewConfig)
  }, [state.smartViewConfig, loaded])

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(state.recipes.map((r) => r.category)))],
    [state.recipes],
  )

  const value: RecipeContextValue = {
    recipes: state.recipes,
    collections: state.collections,
    settings: state.settings,
    favoriteIds: state.favoriteIds,
    smartViewConfig: state.smartViewConfig,
    servingsOverrides,
    categories,
    selectedRecipe: state.selectedRecipe,
    categoryFilter: state.categoryFilter,
    collectionFilter: state.collectionFilter,
    loaded,
    setSelectedRecipe: (recipe) => dispatch({ type: 'SET_SELECTED', recipe }),
    toggleFavorite: (id) => dispatch({ type: 'TOGGLE_FAVORITE', id }),
    setCategoryFilter: (category) => dispatch({ type: 'SET_CATEGORY_FILTER', category }),
    setCollectionFilter: (collectionId) => dispatch({ type: 'SET_COLLECTION_FILTER', collectionId }),
    addCollection: (collection) => dispatch({ type: 'ADD_COLLECTION', collection }),
    updateCollection: (collection) => dispatch({ type: 'UPDATE_COLLECTION', collection }),
    deleteCollection: (id) => dispatch({ type: 'DELETE_COLLECTION', id }),
    addRecipeToCollection: (recipeId, collectionId) => dispatch({ type: 'ADD_RECIPE_TO_COLLECTION', recipeId, collectionId }),
    removeRecipeFromCollection: (recipeId, collectionId) => dispatch({ type: 'REMOVE_RECIPE_FROM_COLLECTION', recipeId, collectionId }),
    getRecipeCollectionIds: (recipeId) => state.collections.filter((c) => c.recipeIds.includes(recipeId)).map((c) => c.id),
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
    setSmartViewConfig: (config) => {
      dispatch({ type: 'SET_SMART_VIEW', config })
    },
    setServingsOverride: (recipeId, servings) => {
      setServingsOverrides((prev) => ({ ...prev, [recipeId]: servings }))
    },
  }

  return <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>
}

export function useRecipeContext() {
  const ctx = useContext(RecipeContext)
  if (!ctx) throw new Error('useRecipeContext must be used within RecipeProvider')
  return ctx
}
