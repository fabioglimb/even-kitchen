import type { DisplayData, GlassNavState } from 'even-glass/types';
import { line } from 'even-glass/types';
import { renderTimerLines } from 'even-glass/timer-display';
import type { Recipe } from '../types/recipe';
import type { TimerState } from '../contexts/CookingContext';

export interface KitchenSnapshot {
  recipes: Recipe[];
  currentRecipeId: string | null;
  currentStepIndex: number;
  timers: Record<number, TimerState>;
  flashPhase: boolean;
}

function truncate(text: string, maxLen: number): string {
  return text.length > maxLen ? text.slice(0, maxLen - 1) + '~' : text;
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

export function recipeDetailLineCount(recipe: Recipe): number {
  return recipeDetailLines(recipe).length;
}

function recipeDetailDisplay(recipe: Recipe, nav: GlassNavState): DisplayData {
  const all = recipeDetailLines(recipe);
  const maxVisible = 8;
  const scrollPos = nav.highlightedIndex;
  const start = Math.max(0, Math.min(scrollPos, all.length - maxVisible));
  const visible = all.slice(start, start + maxVisible);

  // Top row: recipe title + Start Cooking button
  const headerLine = `${recipe.title}  \u25B6Start Cooking\u25C0`;
  const lines = [line(headerLine, 'normal', false)];
  lines.push(line('', 'normal', false));

  // Content starts from index 1 (skip title since it's in header)
  const contentStart = start === 0 ? 1 : start;
  const contentVisible = all.slice(contentStart, contentStart + maxVisible - 2);

  for (const text of contentVisible) {
    lines.push(line(text, 'meta', false));
  }

  if (contentStart > 1 && lines.length > 2) {
    lines[2] = line('\u25B2', 'meta', false);
  }
  if (contentStart + maxVisible - 2 < all.length && lines.length > 2) {
    lines[lines.length - 1] = line('\u25BC', 'meta', false);
  }

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

function buildActionBar(buttons: string[], btnIdx: number, activeMode: 'buttons' | 'scroll' | 'steps', flash: boolean): string {
  const activeName = activeMode === 'scroll' ? 'Scroll' : activeMode === 'steps' ? 'Steps' : '';
  const activeBtnIdx = buttons.indexOf(activeName);

  return buttons.map((name, i) => {
    if (activeBtnIdx === i) {
      const L = flash ? '\u25B6' : '\u25B7';
      const R = flash ? '\u25C0' : '\u25C1';
      return `${L}${name}${R}`;
    }
    if (activeMode === 'buttons' && i === btnIdx) {
      return `\u25B6${name}\u25C0`;
    }
    return ` ${name} `;
  }).join(' ');
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
  const actionBar = buildActionBar(buttons, btnIdx, mode, flash);
  const headerLine = `${stepLabel}  ${actionBar}`;

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
      if (start > 0) lines.push(line('\u25B2', 'meta', false));
      for (const t of visible) lines.push(line(t, 'meta', false));
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
  const btns = ['Recipes', 'Cook Again'];
  const bar = btns.map((name, i) =>
    i === btnIdx ? `\u25B6${name}\u25C0` : ` ${name} `
  ).join(' ');

  const headerLine = `${recipe.title}  ${bar}`;

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
