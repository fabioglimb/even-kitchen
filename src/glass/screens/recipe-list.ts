import type { GlassAction, GlassNavState } from 'even-toolkit/types';
import { line } from 'even-toolkit/types';
import type { GlassScreen } from 'even-toolkit/glass-screen-router';
import { moveHighlight } from 'even-toolkit/glass-nav';
import { buildScrollableList } from 'even-toolkit/glass-display-builders';
import { truncate } from 'even-toolkit/text-utils';
import type { Recipe, Collection } from '../../types/recipe';
import type { KitchenSnapshot, KitchenActions } from '../shared';
import { glassRecipes } from '../shared';

/** Map recipe id → collection emoji for display. */
function buildCollectionEmojiMap(collections: Collection[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const col of collections) {
    for (const id of col.recipeIds) {
      if (!map.has(id)) map.set(id, col.emoji);
    }
  }
  return map;
}

/** Order recipes: collection recipes first (grouped), then the rest. */
function orderedRecipes(snapshot: KitchenSnapshot): Recipe[] {
  const active = glassRecipes(snapshot);
  const collections = snapshot.collections ?? [];
  if (collections.length === 0) return active;

  const result: Recipe[] = [];
  const placed = new Set<string>();

  for (const col of collections) {
    for (const id of col.recipeIds) {
      const r = active.find((a) => a.id === id);
      if (r && !placed.has(r.id)) {
        result.push(r);
        placed.add(r.id);
      }
    }
  }

  for (const r of active) {
    if (!placed.has(r.id)) result.push(r);
  }

  return result;
}

export const recipeListScreen: GlassScreen<KitchenSnapshot, KitchenActions> = {
  display(snapshot, nav) {
    const header = line('◆  E R   K I T C H E N  ◆', 'normal');
    const sep = line('', 'separator');
    const items = orderedRecipes(snapshot);
    const emojiMap = buildCollectionEmojiMap(snapshot.collections ?? []);
    const menuLines = buildScrollableList({
      items,
      highlightedIndex: nav.highlightedIndex,
      maxVisible: 7,
      formatter: (r) => {
        const star = snapshot.favoriteIds.includes(r.id) ? '★ ' : '';
        const colEmoji = emojiMap.get(r.id);
        const prefix = colEmoji ? `${colEmoji} ` : '';
        return truncate(`${star}${prefix}${r.title}`, 54);
      },
    });
    return { lines: [header, sep, ...menuLines] };
  },

  action(action, nav, snapshot, ctx) {
    const items = orderedRecipes(snapshot);
    if (action.type === 'HIGHLIGHT_MOVE') {
      return { ...nav, highlightedIndex: moveHighlight(nav.highlightedIndex, action.direction, items.length - 1) };
    }
    if (action.type === 'SELECT_HIGHLIGHTED') {
      const recipe = items[nav.highlightedIndex];
      if (recipe) ctx.navigate(`/recipe/${recipe.id}`);
      return nav;
    }
    return nav;
  },
};
