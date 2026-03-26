import type { GlassAction, GlassNavState } from 'even-toolkit/types';
import type { GlassScreen } from 'even-toolkit/glass-screen-router';
import { moveHighlight } from 'even-toolkit/glass-nav';
import { buildScrollableList } from 'even-toolkit/glass-display-builders';
import { truncate } from 'even-toolkit/text-utils';
import type { KitchenSnapshot, KitchenActions } from '../shared';
import { glassRecipes } from '../shared';

export const recipeListScreen: GlassScreen<KitchenSnapshot, KitchenActions> = {
  display(snapshot, nav) {
    return {
      lines: buildScrollableList({
        items: glassRecipes(snapshot),
        highlightedIndex: nav.highlightedIndex,
        maxVisible: 5,
        formatter: (r) => truncate(r.title, 54),
      }),
    };
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
