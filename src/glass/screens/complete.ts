import type { GlassScreen } from 'even-toolkit/glass-screen-router';
import { line, glassHeader } from 'even-toolkit/types';
import { buildStaticActionBar } from 'even-toolkit/action-bar';
import { moveHighlight, clampIndex } from 'even-toolkit/glass-nav';
import type { KitchenSnapshot, KitchenActions } from '../shared';
import { findRecipe } from '../shared';
import { t } from '../../utils/i18n';

export const completeScreen: GlassScreen<KitchenSnapshot, KitchenActions> = {
  display(snapshot, nav) {
    const recipe = findRecipe(snapshot);
    if (!recipe) return { lines: [] };
    const lang = snapshot.language;
    const btnIdx = clampIndex(nav.highlightedIndex, 2);
    return {
      lines: [
        ...glassHeader(recipe.title, buildStaticActionBar([t('glass.recipes', lang), t('complete.cookAgain', lang)], btnIdx)),
        line(t('complete.title', lang), 'normal'),
        line(`${recipe.title} ${t('complete.ready', lang)}`, 'meta'),
        line(`${recipe.servings} ${t('glass.servings', lang)}`, 'meta'),
      ],
    };
  },

  action(action, nav, snapshot, ctx) {
    const recipe = findRecipe(snapshot);
    if (action.type === 'HIGHLIGHT_MOVE') {
      return { ...nav, highlightedIndex: moveHighlight(nav.highlightedIndex, action.direction, 1) };
    }
    if (action.type === 'SELECT_HIGHLIGHTED') {
      if (nav.highlightedIndex === 0) { ctx.navigate('/'); return nav; }
      if (nav.highlightedIndex === 1 && recipe) {
        ctx.setCurrentStepIndex(0);
        ctx.resetTimer();
        ctx.navigate(`/recipe/${recipe.id}/cook`);
        return nav;
      }
      return nav;
    }
    if (action.type === 'GO_BACK') { ctx.navigate('/'); return nav; }
    return nav;
  },
};
