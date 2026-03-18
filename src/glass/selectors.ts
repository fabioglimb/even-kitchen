import type { DisplayData, GlassNavState } from 'even-toolkit/types';
import { line } from 'even-toolkit/types';
import { renderTimerLines } from 'even-toolkit/timer-display';
import { buildActionBar, buildStaticActionBar } from 'even-toolkit/action-bar';
import { truncate, buildHeaderLine, applyScrollIndicators, SCROLL_UP } from 'even-toolkit/text-utils';
import type { Recipe, AppLanguage } from '../types/recipe';
import type { TimerState } from '../contexts/CookingContext';
import { t } from '../utils/i18n';

export interface KitchenSnapshot {
  recipes: Recipe[];
  currentRecipeId: string | null;
  currentStepIndex: number;
  timers: Record<number, TimerState>;
  flashPhase: boolean;
  language: AppLanguage;
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
  const maxVisible = 6; // fits below home image tile (168px / ~26px per line)
  const hi = nav.highlightedIndex;

  // Sliding window centered on highlighted item (not start=hi, which puts it at position 0 where ▲ replaces it)
  const start = Math.max(0, Math.min(hi - Math.floor(maxVisible / 2), active.length - maxVisible));
  const visible = active.slice(start, start + maxVisible);

  const lines: DisplayData['lines'] = visible.map((r, i) =>
    line(truncate(r.title, 40), 'normal', (start + i) === hi)
  );

  // Replace first/last lines with ▲/▼ when there's more content
  applyScrollIndicators(lines, start, active.length, maxVisible, (t) => line(t, 'meta', false));

  return { lines };
}

// ── Recipe Detail ──
// Scrollable content + [Start Cooking] action button always visible at bottom
// highlightedIndex: 0..N = scroll position, click always starts cooking

/** Max total lines on G2 display (raw bridge with paddingLength 6) */
const G2_TEXT_LINES = 10;
/** Max content lines in recipe detail */
const DETAIL_CONTENT_SLOTS = G2_TEXT_LINES - 2; // 8

function recipeDetailLines(recipe: Recipe, lang: AppLanguage): string[] {
  const items: string[] = [];
  items.push(recipe.title);
  items.push(`${recipe.difficulty}  ${recipe.prepTime + recipe.cookTime}min  ${recipe.servings} ${t('recipe.servings', lang)}`);
  items.push('');
  items.push(t('recipe.ingredients', lang).toUpperCase());
  recipe.ingredients.forEach((ing) => {
    items.push(truncate(`${ing.amount} ${ing.unit} ${ing.name}`, 40));
  });
  items.push('');
  items.push(t('recipe.steps', lang).toUpperCase());
  recipe.steps.forEach((step, i) => {
    const timer = step.timerSeconds ? ` (${Math.ceil(step.timerSeconds / 60)}min)` : '';
    items.push(truncate(`${i + 1}. ${step.title}${timer}`, 40));
  });
  return items;
}

/** Max scroll position for recipe detail (content lines that overflow the visible area) */
export function recipeDetailLineCount(recipe: Recipe, lang: AppLanguage): number {
  const contentLength = recipeDetailLines(recipe, lang).length - 1; // exclude title
  return Math.max(0, contentLength - DETAIL_CONTENT_SLOTS);
}

function recipeDetailDisplay(recipe: Recipe, nav: GlassNavState, lang: AppLanguage): DisplayData {
  const all = recipeDetailLines(recipe, lang);
  // Content = everything after the title (index 0), since title is in the header
  const content = all.slice(1);
  const contentSlots = DETAIL_CONTENT_SLOTS;

  // Fixed header
  const headerLine = buildHeaderLine(recipe.title, buildStaticActionBar([t('recipe.startCooking', lang)], 0));
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

export function getCookingButtons(hasTimer: boolean, isLastStep: boolean, lang: AppLanguage): string[] {
  const btns: string[] = [];
  if (hasTimer) btns.push(t('glass.timer', lang));
  btns.push(t('glass.scroll', lang));
  btns.push(t('glass.steps', lang));
  if (isLastStep) btns.push(t('glass.finish', lang));
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

/** Word-wrap text to fit within a character width. */
function wordWrap(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    if (current.length === 0) {
      current = word;
    } else if (current.length + 1 + word.length <= maxChars) {
      current += ' ' + word;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current.length > 0) lines.push(current);
  return lines;
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
    const wrapped = wordWrap(step.instructions, 42);
    for (const wl of wrapped) items.push(wl);
  }

  return items;
}

export function cookingContentLineCount(recipe: Recipe, stepIndex: number, timers: Record<number, TimerState>): number {
  const step = recipe.steps[stepIndex];
  const content = buildStepContent(recipe, stepIndex, timers);
  const timerLineCount = step?.timerSeconds
    ? renderTimerLines(getStepTimer(step, timers, stepIndex)).length + 1
    : 0;
  const instrCount = content.length - timerLineCount;
  // Available slots for instructions (reduced by overhead for word-wrapped lines)
  const instrSlots = G2_TEXT_LINES - 2 - timerLineCount;
  return Math.max(0, instrCount - instrSlots);
}


function cookingDisplay(recipe: Recipe, stepIndex: number, timers: Record<number, TimerState>, nav: GlassNavState, flash: boolean, lang: AppLanguage): DisplayData {
  const mode = cookingMode(nav.highlightedIndex);
  const step = recipe.steps[stepIndex];
  const hasTimer = Boolean(step?.timerSeconds);
  const isLastStep = stepIndex >= recipe.steps.length - 1;
  const buttons = getCookingButtons(hasTimer, isLastStep, lang);
  const btnIdx = cookingButtonIndex(nav.highlightedIndex, buttons.length);

  // Top bar: step info + action buttons
  const stepLabel = `${t('cooking.step', lang)} ${stepIndex + 1}/${recipe.steps.length}: ${step?.title ?? ''}`;
  const activeLabel = mode === 'scroll' ? t('glass.scroll', lang) : mode === 'steps' ? t('glass.steps', lang) : null;
  const actionBar = buildActionBar(buttons, btnIdx, activeLabel, flash);
  const headerLine = buildHeaderLine(stepLabel, actionBar);

  // Build content (timer + instructions)
  const content = buildStepContent(recipe, stepIndex, timers);

  // Split content into timer lines and instruction lines
  // Timer lines come first (timer display + blank separator), then instruction lines
  const timerLineCount = step?.timerSeconds
    ? renderTimerLines(getStepTimer(step, timers, stepIndex)).length + 1 // +1 for blank separator
    : 0;
  const timerPart = content.slice(0, timerLineCount);
  const instrPart = content.slice(timerLineCount);

  // Always: header + blank + timer (fixed)
  const lines = [line(headerLine, 'normal', false)];
  lines.push(line('', 'normal', false));
  for (const t of timerPart) {
    lines.push(line(t, 'meta', false));
  }

  // Window instructions to fit available display space (all modes)
  const instrSlots = G2_TEXT_LINES - lines.length;
  const offset = mode === 'scroll' ? cookingScrollOffset(nav.highlightedIndex) : 0;
  if (instrPart.length > 0 && instrSlots > 0) {
    const start = Math.max(0, Math.min(offset, instrPart.length - instrSlots));
    const visible = instrPart.slice(start, start + instrSlots);
    const instrLines = visible.map((t) => line(t, 'meta', false));
    applyScrollIndicators(instrLines, start, instrPart.length, instrSlots, (t) => line(t, 'meta', false));
    for (const il of instrLines) lines.push(il);
  }
  return { lines };
}

// ── Complete ──
// Action buttons: [Back to Recipes] [Cook Again]

function completeDisplay(recipe: Recipe, nav: GlassNavState, lang: AppLanguage): DisplayData {
  const btnIdx = Math.min(nav.highlightedIndex, 1);
  const headerLine = buildHeaderLine(recipe.title, buildStaticActionBar([t('glass.recipes', lang), t('complete.cookAgain', lang)], btnIdx));

  return {
    lines: [
      line(headerLine, 'normal', false),
      line('', 'normal'),
      line(t('complete.title', lang), 'normal'),
      line(`${recipe.title} ${t('complete.ready', lang)}`, 'meta'),
      line(`${recipe.servings} ${t('glass.servings', lang)}`, 'meta'),
    ],
  };
}

// ── Router ──

export function toDisplayData(snapshot: KitchenSnapshot, nav: GlassNavState): DisplayData {
  const recipe = findRecipe(snapshot);
  const lang = snapshot.language;

  switch (nav.screen) {
    case 'recipe-list':
      return recipeListDisplay(snapshot, nav);
    case 'recipe-detail':
      if (recipe) return recipeDetailDisplay(recipe, nav, lang);
      return recipeListDisplay(snapshot, nav);
    case 'cooking':
      if (recipe) return cookingDisplay(recipe, snapshot.currentStepIndex, snapshot.timers, nav, snapshot.flashPhase, lang);
      return recipeListDisplay(snapshot, nav);
    case 'complete':
      if (recipe) return completeDisplay(recipe, nav, lang);
      return recipeListDisplay(snapshot, nav);
    default:
      return recipeListDisplay(snapshot, nav);
  }
}
