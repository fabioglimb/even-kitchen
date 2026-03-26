import type { Recipe, AppLanguage } from '../types/recipe';
import type { TimerState } from '../contexts/CookingContext';

export interface KitchenSnapshot {
  recipes: Recipe[];
  currentRecipeId: string | null;
  currentStepIndex: number;
  timers: Record<number, TimerState>;
  flashPhase: boolean;
  language: AppLanguage;
}

export interface KitchenActions {
  navigate: (path: string) => void;
  setCurrentStepIndex: (index: number) => void;
  toggleTimer: () => void;
  resetTimer: () => void;
}

export function findRecipe(snapshot: KitchenSnapshot): Recipe | null {
  if (!snapshot.currentRecipeId) return null;
  return snapshot.recipes.find((r) => r.id === snapshot.currentRecipeId) ?? null;
}

export function glassRecipes(snapshot: KitchenSnapshot): Recipe[] {
  return snapshot.recipes.filter((r) => !r.archived);
}

/** Word-wrap text to fit within a character width. */
export function wordWrap(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    if (current.length === 0) {
      current = word;
    } else if (current.length + 1 + word.length <= maxChars) {
      current += ' ' + word;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current.length > 0) lines.push(current);
  return lines;
}
