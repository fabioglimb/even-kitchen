import { useCallback, useMemo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useGlasses } from 'even-toolkit/useGlasses';
import { useFlashPhase } from 'even-toolkit/useFlashPhase';
import { createScreenMapper, createIdExtractor, getHomeTiles } from 'even-toolkit/glass-router';
import { useRecipeContext } from '../contexts/RecipeContext';
import { kitchenSplash } from './splash';
import { useCookingContext } from '../contexts/CookingContext';
import { toDisplayData, toSplitData, onGlassAction, type KitchenSnapshot } from './selectors';
import type { KitchenActions } from './shared';

const deriveScreen = createScreenMapper([
  { pattern: '/', screen: 'recipe-list' },
  { pattern: /^\/recipe\/[^/]+\/cook$/, screen: 'cooking' },
  { pattern: /^\/recipe\/[^/]+\/complete$/, screen: 'complete' },
  { pattern: /^\/recipe\/[^/]+$/, screen: 'recipe-detail' },
], 'recipe-list');

const extractRecipeId = createIdExtractor(/^\/recipe\/([^/]+)/);

const homeTiles = getHomeTiles(kitchenSplash);

export function KitchenGlasses() {
  const { recipes, settings } = useRecipeContext();
  const { currentStepIndex, setCurrentStepIndex, timers, getTimer, setStepTimer, resetAllTimers } = useCookingContext();
  const navigate = useNavigate();
  const location = useLocation();
  const isCooking = deriveScreen(location.pathname) === 'cooking';
  const flashPhase = useFlashPhase(isCooking);

  const currentRecipeId = extractRecipeId(location.pathname);

  const snapshotRef = useMemo(() => ({
    current: null as KitchenSnapshot | null,
  }), []);

  const snapshot: KitchenSnapshot = {
    recipes,
    currentRecipeId,
    currentStepIndex,
    timers,
    flashPhase,
    language: settings.language,
  };
  snapshotRef.current = snapshot;

  const getSnapshot = useCallback(() => snapshotRef.current!, [snapshotRef]);

  // Keep refs for callbacks
  const recipesRef = useRef(recipes);
  recipesRef.current = recipes;
  const recipeIdRef = useRef(currentRecipeId);
  recipeIdRef.current = currentRecipeId;
  const stepIndexRef = useRef(currentStepIndex);
  stepIndexRef.current = currentStepIndex;

  const toggleTimer = useCallback(() => {
    const idx = stepIndexRef.current;
    const t = getTimer(idx);
    const recipe = recipesRef.current.find((r) => r.id === recipeIdRef.current);
    if (!recipe) return;
    const step = recipe.steps[idx];
    if (!step?.timerSeconds) return;

    if (t.running) {
      setStepTimer(idx, { ...t, running: false });
    } else if (t.remaining > 0) {
      setStepTimer(idx, { ...t, running: true });
    } else {
      setStepTimer(idx, { running: true, remaining: step.timerSeconds, total: step.timerSeconds });
    }
  }, [getTimer, setStepTimer]);

  // Build context with side effects for screen action handlers
  const ctxRef = useRef<KitchenActions>({
    navigate,
    setCurrentStepIndex,
    toggleTimer,
    resetTimer: resetAllTimers,
  });
  ctxRef.current = { navigate, setCurrentStepIndex, toggleTimer, resetTimer: resetAllTimers };

  // Wrap the router's onGlassAction to inject context
  const handleGlassAction = useCallback(
    (action: Parameters<typeof onGlassAction>[0], nav: Parameters<typeof onGlassAction>[1], snap: KitchenSnapshot) =>
      onGlassAction(action, nav, snap, ctxRef.current),
    [],
  );

  useGlasses({
    getSnapshot,
    toDisplayData,
    toSplit: toSplitData,
    onGlassAction: handleGlassAction,
    deriveScreen,
    appName: 'ER KITCHEN',
    splash: kitchenSplash,
    getPageMode: (screen) => {
      if (screen === 'recipe-list') return 'home';
      if (screen === 'recipe-detail' || screen === 'cooking') return 'split';
      return 'text';
    },
    homeImageTiles: homeTiles,
  });

  return null;
}
