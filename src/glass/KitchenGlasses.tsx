import { useCallback, useMemo, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useGlasses } from 'even-toolkit/useGlasses';
import { createScreenMapper, createIdExtractor } from 'even-toolkit/glass-router';
import { useRecipeContext } from '../contexts/RecipeContext';
import { useCookingContext } from '../contexts/CookingContext';
import { useShoppingContext } from '../contexts/ShoppingContext';
import { toDisplayData, toSplitData, onGlassAction, type KitchenSnapshot } from './selectors';
import type { KitchenActions } from './shared';
import { DEFAULT_SMART_VIEW } from '../types/recipe';

const deriveScreen = createScreenMapper([
  { pattern: '/', screen: 'recipe-list' },
  { pattern: '/shopping', screen: 'shopping' },
  { pattern: /^\/recipe\/[^/]+\/cook$/, screen: 'cooking' },
  { pattern: /^\/recipe\/[^/]+\/complete$/, screen: 'complete' },
  { pattern: /^\/recipe\/[^/]+$/, screen: 'recipe-detail' },
], 'recipe-list');

const extractRecipeId = createIdExtractor(/^\/recipe\/([^/]+)/);

export function KitchenGlasses() {
  const { recipes, collections, settings, favoriteIds, smartViewConfig } = useRecipeContext();
  const { currentStepIndex, setCurrentStepIndex, timers, getTimer, setStepTimer, resetAllTimers } = useCookingContext();
  const { items: shoppingItems, recipeScales: shoppingScales, toggleItem: toggleShoppingItem } = useShoppingContext();
  const [servingsOverrides, setServingsOverrides] = useState<Record<string, number>>({});
  const [glassViewMode, setGlassViewMode] = useState<'full' | 'smart'>(smartViewConfig?.defaultMode ?? DEFAULT_SMART_VIEW.defaultMode);
  const [pendingExit, setPendingExit] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const currentRecipeId = extractRecipeId(location.pathname);

  const snapshotRef = useMemo(() => ({
    current: null as KitchenSnapshot | null,
  }), []);

  const snapshot: KitchenSnapshot = {
    recipes,
    collections,
    currentRecipeId,
    currentStepIndex,
    timers,
    flashPhase: false,
    language: settings.language,
    favoriteIds,
    shoppingItems,
    shoppingScales,
    servingsOverrides,
    smartView: smartViewConfig ?? DEFAULT_SMART_VIEW,
    glassViewMode,
    pendingExit,
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

  const setServingsOverride = useCallback((recipeId: string, servings: number) => {
    setServingsOverrides((prev) => ({ ...prev, [recipeId]: servings }));
  }, []);

  const toggleViewMode = useCallback(() => {
    setGlassViewMode((prev) => (prev === 'full' ? 'smart' : 'full'));
  }, []);

  const requestExit = useCallback(() => setPendingExit(true), []);
  const cancelExit = useCallback(() => setPendingExit(false), []);

  // Build context with side effects for screen action handlers
  const ctxRef = useRef<KitchenActions>({
    navigate,
    setCurrentStepIndex,
    toggleTimer,
    resetTimer: resetAllTimers,
  });
  ctxRef.current = { navigate, setCurrentStepIndex, toggleTimer, resetTimer: resetAllTimers, toggleShoppingItem, setServingsOverride, toggleViewMode, requestExit, cancelExit };

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
    headerClock: true,
    getPageMode: (screen) => {
      if (screen === 'recipe-list' || screen === 'shopping') return 'home';
      if (screen === 'recipe-detail' || screen === 'cooking') return 'split';
      return 'text';
    },
  });

  return null;
}
