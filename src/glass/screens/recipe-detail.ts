import type { GlassScreen } from 'even-toolkit/glass-screen-router';
import { moveHighlight } from 'even-toolkit/glass-nav';
import { buildScrollableContent, DEFAULT_CONTENT_SLOTS } from 'even-toolkit/glass-display-builders';
import { buildStaticActionBar } from 'even-toolkit/action-bar';
import { truncate } from 'even-toolkit/text-utils';
import type { Recipe, AppLanguage } from '../../types/recipe';
import type { KitchenSnapshot, KitchenActions } from '../shared';
import { findRecipe, wordWrap } from '../shared';
import { t } from '../../utils/i18n';

function recipeDetailLines(recipe: Recipe, lang: AppLanguage): string[] {
  const items: string[] = [];
  items.push(recipe.title);
  items.push(`${recipe.difficulty}  ${recipe.prepTime + recipe.cookTime}min  ${recipe.servings} ${t('recipe.servings', lang)}`);
  items.push('');
  items.push(t('recipe.ingredients', lang).toUpperCase());
  recipe.ingredients.forEach((ing) => {
    items.push(truncate(`${ing.amount} ${ing.unit} ${ing.name}`, 54));
  });
  items.push('');
  items.push(t('recipe.steps', lang).toUpperCase());
  recipe.steps.forEach((step, i) => {
    const timer = step.timerSeconds ? ` (${Math.ceil(step.timerSeconds / 60)}min)` : '';
    const stepText = `${i + 1}. ${step.title}${timer}`;
    const wrapped = wordWrap(stepText, 54);
    for (const wl of wrapped) items.push(wl);
  });
  return items;
}

export function recipeDetailLineCount(recipe: Recipe, lang: AppLanguage): number {
  const contentLength = recipeDetailLines(recipe, lang).length - 1;
  return Math.max(0, contentLength - DEFAULT_CONTENT_SLOTS);
}

export const recipeDetailScreen: GlassScreen<KitchenSnapshot, KitchenActions> = {
  display(snapshot, nav) {
    const recipe = findRecipe(snapshot);
    if (!recipe) return { lines: [] };
    const all = recipeDetailLines(recipe, snapshot.language);
    return buildScrollableContent({
      title: recipe.title,
      actionBar: buildStaticActionBar([t('recipe.startCooking', snapshot.language)], 0),
      contentLines: all.slice(1),
      scrollPos: nav.highlightedIndex,
    });
  },

  action(action, nav, snapshot, ctx) {
    const recipe = findRecipe(snapshot);
    if (!recipe) return nav;
    const maxScroll = recipeDetailLineCount(recipe, snapshot.language);

    if (action.type === 'HIGHLIGHT_MOVE') {
      return { ...nav, highlightedIndex: moveHighlight(nav.highlightedIndex, action.direction, maxScroll) };
    }
    if (action.type === 'SELECT_HIGHLIGHTED') {
      ctx.setCurrentStepIndex(0);
      ctx.resetTimer();
      ctx.navigate(`/recipe/${recipe.id}/cook`);
      return nav;
    }
    if (action.type === 'GO_BACK') {
      ctx.navigate('/');
      return nav;
    }
    return nav;
  },
};
