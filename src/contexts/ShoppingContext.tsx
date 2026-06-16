import { createContext, useContext, useReducer, useEffect, useState, useCallback, type ReactNode } from 'react'
import type { ShoppingItem, Ingredient } from '../types/recipe'
import { storageGet, storageSet } from '../data/bridge-storage'
import { generateId } from '../utils/format'

const STORAGE_KEY = 'even-kitchen:shopping'
const SCALES_KEY = 'even-kitchen:shopping-scales'

export interface RecipeScale {
  recipeServings: number
  currentServings: number
}

interface ShoppingState {
  items: ShoppingItem[]
  recipeScales: Record<string, RecipeScale>
}

type ShoppingAction =
  | { type: 'INIT'; items: ShoppingItem[]; recipeScales: Record<string, RecipeScale> }
  | { type: 'ADD_ITEMS'; items: ShoppingItem[] }
  | { type: 'ADD_ITEM'; item: ShoppingItem }
  | { type: 'SET_RECIPE_SCALE'; recipeId: string; scale: RecipeScale }
  | { type: 'TOGGLE_ITEM'; id: string }
  | { type: 'REMOVE_ITEM'; id: string }
  | { type: 'CLEAR_ALL' }
  | { type: 'CLEAR_CHECKED' }

interface ShoppingContextValue {
  items: ShoppingItem[]
  recipeScales: Record<string, RecipeScale>
  checkedCount: number
  totalCount: number
  addFromRecipe: (recipeId: string, recipeTitle: string, ingredients: Ingredient[], recipeServings: number, addedServings: number) => void
  addItem: (name: string, amount?: string, unit?: string) => void
  setRecipeScale: (recipeId: string, servings: number) => void
  toggleItem: (id: string) => void
  removeItem: (id: string) => void
  clearAll: () => void
  clearChecked: () => void
}

const ShoppingContext = createContext<ShoppingContextValue | null>(null)

function shoppingReducer(state: ShoppingState, action: ShoppingAction): ShoppingState {
  switch (action.type) {
    case 'INIT':
      return { items: action.items, recipeScales: action.recipeScales }
    case 'ADD_ITEMS': {
      // Merge: if same name+unit exists, sum amounts; otherwise add
      const merged = [...state.items]
      for (const newItem of action.items) {
        const existing = merged.find(
          (m) => m.name.toLowerCase() === newItem.name.toLowerCase() && m.unit.toLowerCase() === newItem.unit.toLowerCase(),
        )
        if (existing) {
          const a = parseFloat(existing.amount)
          const b = parseFloat(newItem.amount)
          if (!isNaN(a) && !isNaN(b)) {
            const sum = a + b
            existing.amount = sum % 1 === 0 ? String(sum) : sum.toFixed(1)
          }
        } else {
          merged.push(newItem)
        }
      }
      return { ...state, items: merged }
    }
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.item] }
    case 'SET_RECIPE_SCALE':
      return { ...state, recipeScales: { ...state.recipeScales, [action.recipeId]: action.scale } }
    case 'TOGGLE_ITEM':
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.id ? { ...item, checked: !item.checked } : item,
        ),
      }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((item) => item.id !== action.id) }
    case 'CLEAR_ALL':
      return { items: [], recipeScales: {} }
    case 'CLEAR_CHECKED': {
      const remaining = state.items.filter((item) => !item.checked)
      // Clean up recipeScales for recipes with no remaining items
      const activeRecipeIds = new Set(remaining.map((i) => i.recipeId).filter(Boolean))
      const cleanedScales: Record<string, RecipeScale> = {}
      for (const [id, scale] of Object.entries(state.recipeScales)) {
        if (activeRecipeIds.has(id)) cleanedScales[id] = scale
      }
      return { items: remaining, recipeScales: cleanedScales }
    }
    default:
      return state
  }
}

/** Scale an amount string by a ratio. Returns the original if non-numeric. */
export function scaleAmount(amount: string, ratio: number): string {
  const parsed = parseFloat(amount)
  if (isNaN(parsed) || ratio === 1) return amount
  const scaled = parsed * ratio
  return scaled % 1 === 0 ? String(scaled) : scaled.toFixed(1).replace(/\.0$/, '')
}

/** Get the display amount for a shopping item, accounting for recipe scale. */
export function getDisplayAmount(item: ShoppingItem, recipeScales: Record<string, RecipeScale>): string {
  if (!item.recipeId) return item.amount
  const scale = recipeScales[item.recipeId]
  if (!scale || scale.currentServings === scale.recipeServings) return item.amount
  return scaleAmount(item.amount, scale.currentServings / scale.recipeServings)
}

export function ShoppingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(shoppingReducer, { items: [], recipeScales: {} })
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    Promise.all([
      storageGet<ShoppingItem[] | null>(STORAGE_KEY, null),
      storageGet<Record<string, RecipeScale> | null>(SCALES_KEY, null),
    ]).then(([stored, scales]) => {
      dispatch({ type: 'INIT', items: stored ?? [], recipeScales: scales ?? {} })
      setLoaded(true)
    })
  }, [])

  useEffect(() => {
    if (!loaded) return
    storageSet(STORAGE_KEY, state.items)
  }, [state.items, loaded])

  useEffect(() => {
    if (!loaded) return
    storageSet(SCALES_KEY, state.recipeScales)
  }, [state.recipeScales, loaded])

  const addFromRecipe = useCallback(
    (recipeId: string, _recipeTitle: string, ingredients: Ingredient[], recipeServings: number, addedServings: number) => {
      // Store UNSCALED amounts (per recipe's default servings)
      const newItems: ShoppingItem[] = ingredients.map((ing) => ({
        id: generateId(),
        name: ing.name,
        amount: ing.amount,
        unit: ing.unit,
        checked: false,
        recipeId,
      }))
      dispatch({ type: 'ADD_ITEMS', items: newItems })
      // Track the servings scale for this recipe
      dispatch({ type: 'SET_RECIPE_SCALE', recipeId, scale: { recipeServings, currentServings: addedServings } })
    },
    [],
  )

  const addItem = useCallback(
    (name: string, amount?: string, unit?: string) => {
      if (!name.trim()) return
      dispatch({
        type: 'ADD_ITEM',
        item: { id: generateId(), name: name.trim(), amount: amount?.trim() ?? '', unit: unit?.trim() ?? '', checked: false },
      })
    },
    [],
  )

  const setRecipeScale = useCallback(
    (recipeId: string, servings: number) => {
      const existing = state.recipeScales[recipeId]
      if (!existing) return
      dispatch({
        type: 'SET_RECIPE_SCALE',
        recipeId,
        scale: { ...existing, currentServings: Math.max(1, servings) },
      })
    },
    [state.recipeScales],
  )

  const toggleItem = useCallback((id: string) => dispatch({ type: 'TOGGLE_ITEM', id }), [])
  const removeItem = useCallback((id: string) => dispatch({ type: 'REMOVE_ITEM', id }), [])
  const clearAll = useCallback(() => dispatch({ type: 'CLEAR_ALL' }), [])
  const clearChecked = useCallback(() => dispatch({ type: 'CLEAR_CHECKED' }), [])

  const value: ShoppingContextValue = {
    items: state.items,
    recipeScales: state.recipeScales,
    checkedCount: state.items.filter((i) => i.checked).length,
    totalCount: state.items.length,
    addFromRecipe,
    addItem,
    setRecipeScale,
    toggleItem,
    removeItem,
    clearAll,
    clearChecked,
  }

  return <ShoppingContext.Provider value={value}>{children}</ShoppingContext.Provider>
}

export function useShoppingContext() {
  const ctx = useContext(ShoppingContext)
  if (!ctx) throw new Error('useShoppingContext must be used within ShoppingProvider')
  return ctx
}
