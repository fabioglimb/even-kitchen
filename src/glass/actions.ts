import type { GlassAction, GlassNavState } from 'even-toolkit/types';
import type { KitchenSnapshot } from './selectors';
import {
  findRecipe,
  glassRecipes,
  recipeDetailLineCount,
  cookingMode,
  cookingButtonIndex,
  cookingScrollOffset,
  cookingContentLineCount,
  getCookingButtons,
  COOK_MODE_SCROLL,
  COOK_MODE_STEPS,
} from './selectors';
import { t } from '../utils/i18n';

type Navigate = (path: string) => void;

interface KitchenActions {
  setCurrentStepIndex: (index: number) => void;
  toggleTimer: () => void;
  resetTimer: () => void;
}

export function createActionHandler(navigate: Navigate, actions: KitchenActions) {
  return function onGlassAction(
    action: GlassAction,
    nav: GlassNavState,
    snapshot: KitchenSnapshot,
  ): GlassNavState {
    switch (nav.screen) {
      // ── Recipe List ──
      case 'recipe-list': {
        const active = glassRecipes(snapshot);
        const maxIndex = active.length - 1;
        if (action.type === 'HIGHLIGHT_MOVE') {
          const delta = action.direction === 'up' ? -1 : 1;
          const next = Math.max(0, Math.min(maxIndex, nav.highlightedIndex + delta));
          return { ...nav, highlightedIndex: next };
        }
        if (action.type === 'SELECT_HIGHLIGHTED') {
          const recipe = active[nav.highlightedIndex];
          if (recipe) navigate(`/recipe/${recipe.id}`);
          return nav;
        }
        return nav;
      }

      // ── Recipe Detail ──
      case 'recipe-detail': {
        const recipe = findRecipe(snapshot);
        if (!recipe) return nav;
        const maxScroll = recipeDetailLineCount(recipe, snapshot.language);

        if (action.type === 'HIGHLIGHT_MOVE') {
          const delta = action.direction === 'up' ? -1 : 1;
          const next = Math.max(0, Math.min(maxScroll, nav.highlightedIndex + delta));
          return { ...nav, highlightedIndex: next };
        }
        if (action.type === 'SELECT_HIGHLIGHTED') {
          // Start cooking
          actions.setCurrentStepIndex(0);
          actions.resetTimer();
          navigate(`/recipe/${recipe.id}/cook`);
          return nav;
        }
        if (action.type === 'GO_BACK') {
          navigate('/');
          return nav;
        }
        return nav;
      }

      // ── Cooking ──
      case 'cooking': {
        const recipe = findRecipe(snapshot);
        if (!recipe) return nav;
        const mode = cookingMode(nav.highlightedIndex);
        const step = recipe.steps[snapshot.currentStepIndex];
        const hasTimer = Boolean(step?.timerSeconds);
        const isLastStep = snapshot.currentStepIndex >= recipe.steps.length - 1;
        const lang = snapshot.language;
        const buttons = getCookingButtons(hasTimer, isLastStep, lang);

        // ── Button select mode ──
        if (mode === 'buttons') {
          if (action.type === 'HIGHLIGHT_MOVE') {
            const btnIdx = cookingButtonIndex(nav.highlightedIndex, buttons.length);
            const delta = action.direction === 'up' ? -1 : 1;
            const next = Math.max(0, Math.min(buttons.length - 1, btnIdx + delta));
            return { ...nav, highlightedIndex: next };
          }
          if (action.type === 'SELECT_HIGHLIGHTED') {
            const btnIdx = cookingButtonIndex(nav.highlightedIndex, buttons.length);
            const selected = buttons[btnIdx];
            if (selected === t('glass.timer', lang)) {
              actions.toggleTimer();
              return nav;
            }
            if (selected === t('glass.scroll', lang)) {
              return { ...nav, highlightedIndex: COOK_MODE_SCROLL };
            }
            if (selected === t('glass.steps', lang)) {
              return { ...nav, highlightedIndex: COOK_MODE_STEPS };
            }
            if (selected === t('glass.finish', lang)) {
              navigate(`/recipe/${recipe.id}/complete`);
              return nav;
            }
            return nav;
          }
          if (action.type === 'GO_BACK') {
            navigate(`/recipe/${recipe.id}`);
            return nav;
          }
          return nav;
        }

        // ── Scroll mode ──
        if (mode === 'scroll') {
          if (action.type === 'HIGHLIGHT_MOVE') {
            const offset = cookingScrollOffset(nav.highlightedIndex);
            const maxOffset = cookingContentLineCount(recipe, snapshot.currentStepIndex, snapshot.timers);
            const delta = action.direction === 'up' ? -1 : 1;
            const next = Math.max(0, Math.min(maxOffset, offset + delta));
            return { ...nav, highlightedIndex: COOK_MODE_SCROLL + next };
          }
          if (action.type === 'SELECT_HIGHLIGHTED' || action.type === 'GO_BACK') {
            const scrollIdx = buttons.indexOf(t('glass.scroll', lang));
            return { ...nav, highlightedIndex: scrollIdx >= 0 ? scrollIdx : 0 };
          }
          return nav;
        }

        // ── Steps mode ──
        if (mode === 'steps') {
          if (action.type === 'HIGHLIGHT_MOVE') {
            const maxStep = recipe.steps.length - 1;
            const delta = action.direction === 'up' ? -1 : 1;
            const next = Math.max(0, Math.min(maxStep, snapshot.currentStepIndex + delta));
            actions.setCurrentStepIndex(next);
            return nav;
          }
          if (action.type === 'SELECT_HIGHLIGHTED' || action.type === 'GO_BACK') {
            const stepsIdx = buttons.indexOf(t('glass.steps', lang));
            return { ...nav, highlightedIndex: stepsIdx >= 0 ? stepsIdx : 0 };
          }
          return nav;
        }

        return nav;
      }

      // ── Complete ──
      case 'complete': {
        const recipe = findRecipe(snapshot);
        if (action.type === 'HIGHLIGHT_MOVE') {
          const delta = action.direction === 'up' ? -1 : 1;
          const next = Math.max(0, Math.min(1, nav.highlightedIndex + delta));
          return { ...nav, highlightedIndex: next };
        }
        if (action.type === 'SELECT_HIGHLIGHTED') {
          if (nav.highlightedIndex === 0) {
            // Back to Recipes
            navigate('/');
            return nav;
          }
          if (nav.highlightedIndex === 1 && recipe) {
            // Cook Again — reset and go to step 1
            actions.setCurrentStepIndex(0);
            actions.resetTimer();
            navigate(`/recipe/${recipe.id}/cook`);
            return nav;
          }
          return nav;
        }
        if (action.type === 'GO_BACK') {
          navigate('/');
          return nav;
        }
        return nav;
      }

      default:
        return nav;
    }
  };
}
