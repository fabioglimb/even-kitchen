import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useGlasses } from 'even-glass/useGlasses';
import { useRecipeContext } from '../contexts/RecipeContext';
import { useCookingContext } from '../contexts/CookingContext';
import { toDisplayData, type KitchenSnapshot } from './selectors';
import { createActionHandler } from './actions';

function deriveScreen(path: string): string {
  if (path === '/') return 'recipe-list';
  if (/^\/recipe\/[^/]+\/cook$/.test(path)) return 'cooking';
  if (/^\/recipe\/[^/]+\/complete$/.test(path)) return 'complete';
  if (/^\/recipe\/[^/]+$/.test(path)) return 'recipe-detail';
  return 'recipe-list';
}

function extractRecipeId(path: string): string | null {
  const match = path.match(/^\/recipe\/([^/]+)/);
  return match ? match[1] : null;
}

export function KitchenGlasses() {
  const { recipes } = useRecipeContext();
  const { currentStepIndex, setCurrentStepIndex, timers, getTimer, setStepTimer, resetAllTimers } = useCookingContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [flashPhase, setFlashPhase] = useState(false);

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
  };
  snapshotRef.current = snapshot;

  const getSnapshot = useCallback(() => snapshotRef.current!, [snapshotRef]);

  // Flash timer for blinking active mode indicator (500ms toggle)
  // Runs whenever on cooking screen — cheap, only used when mode is active
  useEffect(() => {
    const screen = deriveScreen(location.pathname);
    if (screen !== 'cooking') return;

    const interval = setInterval(() => {
      setFlashPhase((prev) => !prev);
    }, 500);

    return () => clearInterval(interval);
  }, [location.pathname]);

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

  const onGlassAction = useMemo(
    () => createActionHandler(navigate, {
      setCurrentStepIndex,
      toggleTimer,
      resetTimer: resetAllTimers,
    }),
    [navigate, setCurrentStepIndex, toggleTimer, resetAllTimers],
  );

  useGlasses({
    getSnapshot,
    toDisplayData,
    onGlassAction,
    deriveScreen,
    appName: 'even-kitchen',
  });

  return null;
}
