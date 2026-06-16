import type { GlassScreen } from 'even-toolkit/glass-screen-router';
import { moveHighlight, clampIndex } from 'even-toolkit/glass-nav';
import { buildScrollableContent } from 'even-toolkit/glass-display-builders';
import { buildActionBar } from 'even-toolkit/action-bar';
import { truncate } from 'even-toolkit/text-utils';
import { createModeEncoder } from 'even-toolkit/glass-mode';
import type { SplitData } from 'even-toolkit/types';
import type { Recipe, Ingredient, AppLanguage } from '../../types/recipe';
import type { KitchenSnapshot, KitchenActions } from '../shared';
import {
  findRecipe,
  wordWrap,
  buildSplitHeader,
  buildPaneText,
  SPLIT_PANE_LINES,
} from '../shared';
import { t } from '../../utils/i18n';
import { scaleIngredients } from '../../utils/format';

const DETAIL_LEFT_WIDTH = 32;
const DETAIL_RIGHT_WIDTH = 24;
const DETAIL_CONTENT_WIDTH = DETAIL_LEFT_WIDTH - 2;

// Mode encoder: buttons (0-99), scroll (100-199), servings (200+)
export const detailMode = createModeEncoder({
  buttons: 0,
  scroll: 100,
  servings: 200,
});

function getScaledIngredients(recipe: Recipe, snapshot: KitchenSnapshot): Ingredient[] {
  const override = snapshot.servingsOverrides[recipe.id];
  if (!override || override === recipe.servings) return recipe.ingredients;
  return scaleIngredients(recipe.ingredients, recipe.servings, override);
}

function getCurrentServings(recipe: Recipe, snapshot: KitchenSnapshot): number {
  return snapshot.servingsOverrides[recipe.id] ?? recipe.servings;
}

function ingredientLines(ingredients: Ingredient[]): string[] {
  return ingredients.map((ing) => truncate(`• ${`${ing.amount} ${ing.unit} ${ing.name}`.trim()}`, 54));
}

function recipeDetailLines(recipe: Recipe, lang: AppLanguage, ingredients: Ingredient[], servings: number): string[] {
  const items: string[] = [];
  items.push(recipe.title);
  items.push(`${recipe.difficulty}  ${recipe.prepTime + recipe.cookTime}min  ${servings} ${t('recipe.servings', lang)}`);
  items.push('');
  items.push(t('recipe.ingredients', lang).toUpperCase());
  ingredients.forEach((ing) => {
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

export function recipeDetailLineCount(recipe: Recipe, ingredients: Ingredient[]): number {
  const contentLength = ingredientLines(ingredients).flatMap((l) => wordWrap(l, DETAIL_CONTENT_WIDTH)).length;
  return Math.max(0, contentLength - SPLIT_PANE_LINES);
}

function difficultySpades(difficulty: string): string {
  const d = difficulty.toLowerCase();
  if (d === 'easy' || d === 'beginner') return `${difficulty} ♠`;
  if (d === 'hard' || d === 'advanced') return `${difficulty} ♠♠♠`;
  return `${difficulty} ♠♠`;
}

function recipeSummaryLines(recipe: Recipe, lang: AppLanguage, servings: number): string[] {
  const totalMinutes = recipe.prepTime + recipe.cookTime;
  return [
    `◆ ${difficultySpades(recipe.difficulty)}`,
    `◆ ${totalMinutes} min`,
    `◆ ${servings} ${t('recipe.servings', lang)}`,
    `◆ ${recipe.ingredients.length} ${t('recipe.ingredients', lang).toLowerCase()}`,
    `◆ ${recipe.steps.length} ${t('recipe.steps', lang).toLowerCase()}`,
  ];
}

function getDetailButtons(lang: AppLanguage): string[] {
  return [t('glass.start', lang), t('recipe.scaleServings', lang), t('glass.scroll', lang)];
}

export function buildRecipeDetailSplit(snapshot: KitchenSnapshot, nav: { highlightedIndex: number }): SplitData {
  const recipe = findRecipe(snapshot);
  if (!recipe) {
    return { header: buildSplitHeader('Recipe'), panes: ['', ''] };
  }

  const lang = snapshot.language;
  const ingredients = getScaledIngredients(recipe, snapshot);
  const servings = getCurrentServings(recipe, snapshot);
  const mode = detailMode.getMode(nav.highlightedIndex);
  const buttons = getDetailButtons(lang);
  const selectedButtonIndex = mode === 'buttons' ? clampIndex(nav.highlightedIndex, buttons.length) : -1;
  const activeLabel = mode === 'servings' ? `${servings}x` : mode === 'scroll' ? t('glass.scroll', lang) : null;

  return {
    header: buildSplitHeader(recipe.title, buildActionBar(buttons, selectedButtonIndex, activeLabel, false)),
    panes: [
      buildPaneText(ingredientLines(ingredients), DETAIL_LEFT_WIDTH, mode === 'scroll' ? detailMode.getOffset(nav.highlightedIndex) : 0),
      buildPaneText(recipeSummaryLines(recipe, lang, servings), DETAIL_RIGHT_WIDTH, 0),
    ],
    layout: { headerHeight: 72 },
  };
}

export const recipeDetailScreen: GlassScreen<KitchenSnapshot, KitchenActions> = {
  display(snapshot, nav) {
    const recipe = findRecipe(snapshot);
    if (!recipe) return { lines: [] };
    const lang = snapshot.language;
    const ingredients = getScaledIngredients(recipe, snapshot);
    const servings = getCurrentServings(recipe, snapshot);
    const mode = detailMode.getMode(nav.highlightedIndex);
    const buttons = getDetailButtons(lang);
    const selectedButtonIndex = mode === 'buttons' ? clampIndex(nav.highlightedIndex, buttons.length) : -1;
    const activeLabel = mode === 'servings' ? `${servings}x` : mode === 'scroll' ? t('glass.scroll', lang) : null;
    const all = recipeDetailLines(recipe, lang, ingredients, servings);
    return buildScrollableContent({
      title: recipe.title,
      actionBar: buildActionBar(buttons, selectedButtonIndex, activeLabel, false),
      contentLines: all.slice(1),
      scrollPos: mode === 'scroll' ? detailMode.getOffset(nav.highlightedIndex) : 0,
    });
  },

  action(action, nav, snapshot, ctx) {
    const recipe = findRecipe(snapshot);
    if (!recipe) return nav;
    const lang = snapshot.language;
    const mode = detailMode.getMode(nav.highlightedIndex);
    const ingredients = getScaledIngredients(recipe, snapshot);
    const buttons = getDetailButtons(lang);
    const servings = getCurrentServings(recipe, snapshot);

    // === BUTTONS MODE ===
    if (mode === 'buttons') {
      if (action.type === 'HIGHLIGHT_MOVE') {
        const btnIdx = clampIndex(nav.highlightedIndex, buttons.length);
        return { ...nav, highlightedIndex: moveHighlight(btnIdx, action.direction, buttons.length - 1) };
      }
      if (action.type === 'SELECT_HIGHLIGHTED') {
        const btnIdx = clampIndex(nav.highlightedIndex, buttons.length);
        const selected = buttons[btnIdx];
        if (selected === t('glass.start', lang)) {
          ctx.setCurrentStepIndex(0);
          ctx.resetTimer();
          ctx.navigate(`/recipe/${recipe.id}/cook`);
          return nav;
        }
        if (selected === t('recipe.scaleServings', lang)) {
          return { ...nav, highlightedIndex: detailMode.encode('servings') };
        }
        if (selected === t('glass.scroll', lang)) {
          return { ...nav, highlightedIndex: detailMode.encode('scroll') };
        }
        return nav;
      }
      if (action.type === 'GO_BACK') {
        ctx.navigate('/');
        return nav;
      }
      return nav;
    }

    // === SERVINGS MODE ===
    if (mode === 'servings') {
      if (action.type === 'HIGHLIGHT_MOVE') {
        const newServings = action.direction === 'down'
          ? Math.max(1, servings - 1)
          : servings + 1;
        ctx.setServingsOverride?.(recipe.id, newServings);
        return nav;
      }
      if (action.type === 'SELECT_HIGHLIGHTED' || action.type === 'GO_BACK') {
        // Return to buttons, highlight the servings button
        const servIdx = buttons.indexOf(t('recipe.scaleServings', lang));
        return { ...nav, highlightedIndex: servIdx >= 0 ? servIdx : 0 };
      }
      return nav;
    }

    // === SCROLL MODE ===
    if (mode === 'scroll') {
      if (action.type === 'HIGHLIGHT_MOVE') {
        const offset = detailMode.getOffset(nav.highlightedIndex);
        const maxOffset = recipeDetailLineCount(recipe, ingredients);
        return { ...nav, highlightedIndex: detailMode.encode('scroll', moveHighlight(offset, action.direction, maxOffset)) };
      }
      if (action.type === 'SELECT_HIGHLIGHTED' || action.type === 'GO_BACK') {
        const scrollIdx = buttons.indexOf(t('glass.scroll', lang));
        return { ...nav, highlightedIndex: scrollIdx >= 0 ? scrollIdx : 0 };
      }
      return nav;
    }

    return nav;
  },
};
