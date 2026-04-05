import type { GlassScreen } from 'even-toolkit/glass-screen-router';
import { moveHighlight } from 'even-toolkit/glass-nav';
import { buildScrollableContent } from 'even-toolkit/glass-display-builders';
import { buildStaticActionBar } from 'even-toolkit/action-bar';
import { truncate } from 'even-toolkit/text-utils';
import type { SplitData } from 'even-toolkit/types';
import type { Recipe, AppLanguage } from '../../types/recipe';
import type { KitchenSnapshot, KitchenActions } from '../shared';
import {
  findRecipe,
  wordWrap,
  buildSplitHeader,
  buildPaneText,
  SPLIT_LEFT_WIDTH,
  SPLIT_RIGHT_WIDTH,
  SPLIT_LEFT_CONTENT_WIDTH,
} from '../shared';
import { t } from '../../utils/i18n';

function ingredientLines(recipe: Recipe): string[] {
  return recipe.ingredients.map((ing) => truncate(`• ${`${ing.amount} ${ing.unit} ${ing.name}`.trim()}`, 54));
}

function recipeDetailLines(recipe: Recipe, lang: AppLanguage): string[] {
  const items: string[] = [];
  items.push(recipe.title);
  items.push(`${recipe.difficulty}  ${recipe.prepTime + recipe.cookTime}min  ${recipe.servings} ${t('recipe.servings', lang)}`);
  items.push('');
  items.push(t('recipe.ingredients', lang).toUpperCase());
  recipe.ingredients.forEach((ing) => {
    items.push(truncate(`• ${`${ing.amount} ${ing.unit} ${ing.name}`.trim()}`, 54));
  });
  items.push('');
  items.push(t('recipe.steps', lang).toUpperCase());
  recipe.steps.forEach((step, i) => {
    const timer = step.timerSeconds ? ` (${Math.ceil(step.timerSeconds / 60)}min)` : '';
    const stepText = `${i + 1}) ${step.title}${timer}`;
    const wrapped = wordWrap(stepText, 54);
    for (const wl of wrapped) items.push(wl);
  });
  return items;
}

export function recipeDetailLineCount(recipe: Recipe): number {
  const contentLength = ingredientLines(recipe).flatMap((line) => wordWrap(line, SPLIT_LEFT_CONTENT_WIDTH)).length;
  return Math.max(0, contentLength - 8);
}

function recipeSummaryLines(recipe: Recipe, lang: AppLanguage): string[] {
  const totalMinutes = recipe.prepTime + recipe.cookTime;
  return [
    `• ${recipe.difficulty}`,
    `• ${totalMinutes} min`,
    `• ${recipe.servings} ${t('recipe.servings', lang)}`,
    `• ${recipe.ingredients.length} ${t('recipe.ingredients', lang).toLowerCase()}`,
    `• ${recipe.steps.length} ${t('recipe.steps', lang).toLowerCase()}`,
  ];
}

export function buildRecipeDetailSplit(snapshot: KitchenSnapshot, nav: { highlightedIndex: number }): SplitData {
  const recipe = findRecipe(snapshot);
  if (!recipe) {
    return { header: buildSplitHeader('Recipe'), left: '', right: '' };
  }

  return {
    header: buildSplitHeader(recipe.title, buildStaticActionBar([t('glass.start', snapshot.language)], 0)),
    left: buildPaneText(ingredientLines(recipe), SPLIT_LEFT_WIDTH, nav.highlightedIndex),
    right: buildPaneText(recipeSummaryLines(recipe, snapshot.language), SPLIT_RIGHT_WIDTH, 0),
  };
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
    const maxScroll = recipeDetailLineCount(recipe);

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
