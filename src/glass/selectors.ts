import { createGlassScreenRouter } from 'even-toolkit/glass-screen-router';
import type { KitchenSnapshot, KitchenActions } from './shared';
import { recipeListScreen } from './screens/recipe-list';
import { recipeDetailScreen, buildRecipeDetailSplit } from './screens/recipe-detail';
import { cookingScreen, buildCookingSplit } from './screens/cooking';
import { completeScreen } from './screens/complete';
import type { GlassNavState, SplitData } from 'even-toolkit/types';

export type { KitchenSnapshot, KitchenActions };
export { findRecipe, glassRecipes } from './shared';

export const { toDisplayData, onGlassAction } = createGlassScreenRouter<KitchenSnapshot, KitchenActions>({
  'recipe-list': recipeListScreen,
  'recipe-detail': recipeDetailScreen,
  'cooking': cookingScreen,
  'complete': completeScreen,
}, 'recipe-list');

export function toSplitData(snapshot: KitchenSnapshot, nav: GlassNavState): SplitData {
  switch (nav.screen) {
    case 'recipe-detail':
      return buildRecipeDetailSplit(snapshot, nav);
    case 'cooking':
      return buildCookingSplit(snapshot, nav);
    default:
      return { header: '', left: '', right: '' };
  }
}
