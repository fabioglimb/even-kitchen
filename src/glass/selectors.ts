import { createGlassScreenRouter } from 'even-toolkit/glass-screen-router';
import type { KitchenSnapshot, KitchenActions } from './shared';
import { recipeListScreen } from './screens/recipe-list';
import { recipeDetailScreen } from './screens/recipe-detail';
import { cookingScreen } from './screens/cooking';
import { completeScreen } from './screens/complete';

export type { KitchenSnapshot, KitchenActions };
export { findRecipe, glassRecipes } from './shared';

export const { toDisplayData, onGlassAction } = createGlassScreenRouter<KitchenSnapshot, KitchenActions>({
  'recipe-list': recipeListScreen,
  'recipe-detail': recipeDetailScreen,
  'cooking': cookingScreen,
  'complete': completeScreen,
}, 'recipe-list');
