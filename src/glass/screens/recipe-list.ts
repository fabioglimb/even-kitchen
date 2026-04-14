import type { GlassAction, GlassNavState } from 'even-toolkit/types';
import { line } from 'even-toolkit/types';
import type { GlassScreen } from 'even-toolkit/glass-screen-router';
import { moveHighlight } from 'even-toolkit/glass-nav';
import { buildScrollableList } from 'even-toolkit/glass-display-builders';
import { truncate } from 'even-toolkit/text-utils';
import type { KitchenSnapshot, KitchenActions } from '../shared';
import { glassRecipes } from '../shared';

export const recipeListScreen: GlassScreen<KitchenSnapshot, KitchenActions> = {
  display(snapshot, nav) {
    const header = line('◆  E R   K I T C H E N  ◆', 'normal');
    const sep = line('', 'separator');
    const menuLines = buildScrollableList({
      items: glassRecipes(snapshot),
      highlightedIndex: nav.highlightedIndex,
      maxVisible: 7,
      formatter: (r) => {
        const star = snapshot.favoriteIds.includes(r.id) ? '★ ' : '';
        return truncate(`${star}${r.title}`, 54);
      },
    });
    return { lines: [header, sep, ...menuLines] };
  },

  action(action, nav, snapshot, ctx) {
    const active = glassRecipes(snapshot);
    if (action.type === 'HIGHLIGHT_MOVE') {
      return { ...nav, highlightedIndex: moveHighlight(nav.highlightedIndex, action.direction, active.length - 1) };
    }
    if (action.type === 'SELECT_HIGHLIGHTED') {
      const recipe = active[nav.highlightedIndex];
      if (recipe) ctx.navigate(`/recipe/${recipe.id}`);
      return nav;
    }
    return nav;
  },
};
