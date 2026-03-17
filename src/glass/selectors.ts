import type { DisplayData, GlassNavState } from 'even-glass/types';
import { line } from 'even-glass/types';
import { renderTimerLines } from 'even-glass/timer-display';
import { buildActionBar, buildStaticActionBar } from 'even-glass/action-bar';
import { truncate, buildHeaderLine, applyScrollIndicators, SCROLL_UP } from 'even-glass/text-utils';
import type { Recipe } from '../types/recipe';
import type { TimerState } from '../contexts/CookingContext';

export interface KitchenSnapshot {
  recipes: Recipe[];
  currentRecipeId: string | null;
  currentStepIndex: number;
  timers: Record<number, TimerState>;
  flashPhase: boolean;
}

export function findRecipe(snapshot: KitchenSnapshot): Recipe | null {
  if (!snapshot.currentRecipeId) return null;
  return snapshot.recipes.find((r) => r.id === snapshot.currentRecipeId) ?? null;
}

export function glassRecipes(snapshot: KitchenSnapshot): Recipe[] {
  return snapshot.recipes.filter((r) => !r.archived);
}

// ── Recipe List ──

function recipeListDisplay(snapshot: KitchenSnapshot, nav: GlassNavState): DisplayData {
  const active = glassRecipes(snapshot);
  const lines = [
    line('EVENKITCHEN', 'normal'),
    line('', 'normal'),
  ];
  active.forEach((r, i) => {
    lines.push(line(truncate(r.title, 40), 'normal', i === nav.highlightedIndex));
  });
  return { lines };
}

// ── Recipe Detail ──
// Scrollable content + [Start Cooking] action button always visible at bottom
// highlightedIndex: 0..N = scroll position, click always starts cooking

function recipeDetailLines(recipe: Recipe): string[] {
  const items: string[] = [];
  items.push(recipe.title);
  items.push(`${recipe.difficulty}  ${recipe.prepTime + recipe.cookTime}min  ${recipe.servings} serv.`);
  items.push('');
  items.push('INGREDIENTS');
  recipe.ingredients.forEach((ing) => {
    items.push(truncate(`${ing.amount} ${ing.unit} ${ing.name}`, 40));
  });
  items.push('');
  items.push('STEPS');
  recipe.steps.forEach((step, i) => {
    const timer = step.timerSeconds ? ` (${Math.ceil(step.timerSeconds / 60)}min)` : '';
    items.push(truncate(`${i + 1}. ${step.title}${timer}`, 40));
  });
  return items;
}

/** Number of scrollable content lines (excluding title which is in the header) */
export function recipeDetailLineCount(recipe: Recipe): number {
  return recipeDetailLines(recipe).length - 1;
}

function recipeDetailDisplay(recipe: Recipe, nav: GlassNavState): DisplayData {
  const all = recipeDetailLines(recipe);
  // Content = everything after the title (index 0), since title is in the header
  const content = all.slice(1);
  const contentSlots = 6;

  // Fixed header
  const headerLine = buildHeaderLine(recipe.title, buildStaticActionBar(['Start Cooking'], 0));
  const lines = [line(headerLine, 'normal', false)];
  lines.push(line('', 'normal', false));

  // Window the content
  const scrollPos = nav.highlightedIndex;
  const start = Math.max(0, Math.min(scrollPos, content.length - contentSlots));
  const visible = content.slice(start, start + contentSlots);

  for (const text of visible) {
    lines.push(line(text, 'meta', false));
  }

  // Scroll indicators on content area
  const contentLines = lines.slice(2);
  applyScrollIndicators(contentLines, start, content.length, contentSlots, (t) => line(t, 'meta', false));
  lines.splice(2, contentLines.length, ...contentLines);

  return { lines };
}

// ── Cooking Mode ──
// Action buttons in top bar, [Finish] on last step
// Timer only shown when step has timerSeconds

export const COOK_MODE_SCROLL = 100;
export const COOK_MODE_STEPS = 200;

export function getCookingButtons(hasTimer: boolean, isLastStep: boolean): string[] {
  const btns: string[] = [];
  if (hasTimer) btns.push('Timer');
  btns.push('Scroll');
  btns.push('Steps');
  if (isLastStep) btns.push('Finish');
  return btns;
}

export function cookingMode(idx: number): 'buttons' | 'scroll' | 'steps' {
  if (idx >= COOK_MODE_STEPS) return 'steps';
  if (idx >= COOK_MODE_SCROLL) return 'scroll';
  return 'buttons';
}

export function cookingButtonIndex(idx: number, buttonCount: number): number {
  return Math.min(idx, buttonCount - 1);
}

export function cookingScrollOffset(idx: number): number {
  return idx - COOK_MODE_SCROLL;
}

function getStepTimer(step: Recipe['steps'][0], timers: Record<number, TimerState>, stepIndex: number): { running: boolean; remaining: number; total: number } {
  const saved = timers[stepIndex];
  if (saved && (saved.total > 0 || saved.running)) return saved;
  const dur = step?.timerSeconds ?? 0;
  return { running: false, remaining: dur, total: dur };
}

function buildStepContent(recipe: Recipe, stepIndex: number, timers: Record<number, TimerState>): string[] {
  const step = recipe.steps[stepIndex];
  const items: string[] = [];

  if (step?.timerSeconds) {
    const timer = getStepTimer(step, timers, stepIndex);
    const timerLines = renderTimerLines(timer);
    for (const tl of timerLines) items.push(tl);
    items.push('');
  }

  if (step?.instructions) {
    items.push(step.instructions);
  }

  return items;
}

export function cookingContentLineCount(recipe: Recipe, stepIndex: number, timers: Record<number, TimerState>): number {
  return buildStepContent(recipe, stepIndex, timers).length;
}


function cookingDisplay(recipe: Recipe, stepIndex: number, timers: Record<number, TimerState>, nav: GlassNavState, flash: boolean): DisplayData {
  const mode = cookingMode(nav.highlightedIndex);
  const step = recipe.steps[stepIndex];
  const hasTimer = Boolean(step?.timerSeconds);
  const isLastStep = stepIndex >= recipe.steps.length - 1;
  const buttons = getCookingButtons(hasTimer, isLastStep);
  const btnIdx = cookingButtonIndex(nav.highlightedIndex, buttons.length);

  // Top bar: step info + action buttons
  const stepLabel = `Step ${stepIndex + 1}/${recipe.steps.length}: ${step?.title ?? ''}`;
  const activeLabel = mode === 'scroll' ? 'Scroll' : mode === 'steps' ? 'Steps' : null;
  const actionBar = buildActionBar(buttons, btnIdx, activeLabel, flash);
  const headerLine = buildHeaderLine(stepLabel, actionBar);

  // Build content (timer + instructions)
  const content = buildStepContent(recipe, stepIndex, timers);

  // Split content into timer lines and instruction lines
  const instructionText = step?.instructions ?? '';
  const timerPart: string[] = [];
  const instrPart: string[] = [];
  let hitInstr = false;
  for (const t of content) {
    if (t === instructionText) { hitInstr = true; instrPart.push(t); }
    else if (hitInstr) { instrPart.push(t); }
    else { timerPart.push(t); }
  }

  // Always: header + blank + timer (fixed)
  const lines = [line(headerLine, 'normal', false)];
  lines.push(line('', 'normal', false));
  for (const t of timerPart) {
    lines.push(line(t, 'meta', false));
  }

  if (mode === 'scroll') {
    // Scroll mode: instructions scroll
    const offset = cookingScrollOffset(nav.highlightedIndex);
    if (instrPart.length > 0) {
      const start = Math.max(0, Math.min(offset, instrPart.length - 1));
      const visible = instrPart.slice(start);
      for (const t of visible) lines.push(line(t, 'meta', false));
      // Apply scroll up indicator to first instruction line
      const instrStartIdx = lines.length - visible.length;
      if (start > 0 && instrStartIdx < lines.length) {
        lines[instrStartIdx] = line(SCROLL_UP, 'meta', false);
      }
    }
    return { lines };
  }

  // Button select / steps mode: show full instructions
  for (const t of instrPart) {
    lines.push(line(t, 'meta', false));
  }
  return { lines };
}

// ── Complete ──
// Action buttons: [Back to Recipes] [Cook Again]

function completeDisplay(recipe: Recipe, nav: GlassNavState): DisplayData {
  const btnIdx = Math.min(nav.highlightedIndex, 1);
  const headerLine = buildHeaderLine(recipe.title, buildStaticActionBar(['Recipes', 'Cook Again'], btnIdx));

  return {
    lines: [
      line(headerLine, 'normal', false),
      line('', 'normal'),
      line('Bon Appetit!', 'normal'),
      line(`${recipe.title} is ready to serve.`, 'meta'),
      line(`${recipe.servings} servings prepared with care.`, 'meta'),
    ],
  };
}

// ── Router ──

export function toDisplayData(snapshot: KitchenSnapshot, nav: GlassNavState): DisplayData {
  const recipe = findRecipe(snapshot);

  switch (nav.screen) {
    case 'recipe-list':
      return recipeListDisplay(snapshot, nav);
    case 'recipe-detail':
      if (recipe) return recipeDetailDisplay(recipe, nav);
      return recipeListDisplay(snapshot, nav);
    case 'cooking':
      if (recipe) return cookingDisplay(recipe, snapshot.currentStepIndex, snapshot.timers, nav, snapshot.flashPhase);
      return recipeListDisplay(snapshot, nav);
    case 'complete':
      if (recipe) return completeDisplay(recipe, nav);
      return recipeListDisplay(snapshot, nav);
    default:
      return recipeListDisplay(snapshot, nav);
  }
}
