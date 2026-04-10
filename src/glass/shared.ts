import type { Recipe, AppLanguage } from '../types/recipe';
import type { TimerState } from '../contexts/CookingContext';
import { truncate } from 'even-toolkit/text-utils';
import { glassHeader, renderTextPageLines } from 'even-toolkit/types';

export interface KitchenSnapshot {
  recipes: Recipe[];
  currentRecipeId: string | null;
  currentStepIndex: number;
  timers: Record<number, TimerState>;
  flashPhase: boolean;
  language: AppLanguage;
  favoriteIds: string[];
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
  const active = snapshot.recipes.filter((r) => !r.archived);
  const favSet = new Set(snapshot.favoriteIds);
  return [...active].sort((a, b) => {
    const aFav = favSet.has(a.id) ? 0 : 1;
    const bFav = favSet.has(b.id) ? 0 : 1;
    return aFav - bFav;
  });
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

export const SPLIT_PANE_LINES = 8;
const SPLIT_LINE_PREFIX = '  ';

export function buildSplitHeader(title: string, actionBar?: string): string {
  return renderTextPageLines(glassHeader(title, actionBar));
}

export function buildPaneText(lines: string[], width: number, scrollPos = 0, slots = SPLIT_PANE_LINES): string {
  const contentWidth = Math.max(1, width - SPLIT_LINE_PREFIX.length);
  const normalized = lines.flatMap((entry) => {
    if (!entry) return [''];
    return wordWrap(entry, contentWidth);
  });

  const start = Math.max(0, Math.min(scrollPos, Math.max(0, normalized.length - slots)));
  const visible = normalized.slice(start, start + slots);

  while (visible.length < slots) visible.push('');

  if (start > 0 && visible.length > 0) visible[0] = '▲';
  if (start + slots < normalized.length && visible.length > 0) visible[visible.length - 1] = '▼';

  return visible
    .map((entry) => (entry ? `${SPLIT_LINE_PREFIX}${truncate(entry, contentWidth)}` : ''))
    .join('\n');
}
