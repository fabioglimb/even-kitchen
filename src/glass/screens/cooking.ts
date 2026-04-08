import type { GlassScreen } from 'even-toolkit/glass-screen-router';
import { line, glassHeader } from 'even-toolkit/types';
import type { SplitData } from 'even-toolkit/types';
import { renderTimerLines } from 'even-toolkit/timer-display';
import { buildActionBar } from 'even-toolkit/action-bar';
import { truncate, applyScrollIndicators } from 'even-toolkit/text-utils';
import { G2_TEXT_LINES } from 'even-toolkit/glass-display-builders';
import { createModeEncoder } from 'even-toolkit/glass-mode';
import { moveHighlight, clampIndex } from 'even-toolkit/glass-nav';
import type { Recipe } from '../../types/recipe';
import type { TimerState } from '../../contexts/CookingContext';
import type { AppLanguage } from '../../types/recipe';
import type { KitchenSnapshot, KitchenActions } from '../shared';
import {
  findRecipe,
  wordWrap,
  buildSplitHeader,
  buildPaneText,
  SPLIT_LEFT_WIDTH,
  SPLIT_RIGHT_WIDTH,
  SPLIT_LEFT_CONTENT_WIDTH,
  SPLIT_RIGHT_CONTENT_WIDTH,
} from '../shared';
import { t } from '../../utils/i18n';

export const cookMode = createModeEncoder({
  buttons: 0,
  scroll: 100,
  steps: 200,
});

function getCookingButtons(hasTimer: boolean, hasScrollableContent: boolean, isLastStep: boolean, lang: AppLanguage): string[] {
  const btns: string[] = [];
  if (hasTimer) btns.push(t('glass.timer', lang));
  if (hasScrollableContent) btns.push(t('glass.scroll', lang));
  btns.push(t('glass.steps', lang));
  if (isLastStep) btns.push(t('glass.finish', lang));
  return btns;
}

function getStepTimer(step: Recipe['steps'][0], timers: Record<number, TimerState>, stepIndex: number) {
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
    const wrapped = wordWrap(step.instructions, 54);
    for (const wl of wrapped) items.push(wl);
  }
  return items;
}

function buildInstructionLines(recipe: Recipe, stepIndex: number): string[] {
  const step = recipe.steps[stepIndex];
  if (!step?.instructions) return [];
  return wordWrap(step.instructions, SPLIT_LEFT_CONTENT_WIDTH);
}

function buildTimerPaneLines(recipe: Recipe, stepIndex: number, timers: Record<number, TimerState>, lang: AppLanguage): string[] {
  const step = recipe.steps[stepIndex];
  if (!step) return [];
  const nextStep = recipe.steps[stepIndex + 1];
  const nextLines = nextStep
    ? wordWrap(nextStep.title || nextStep.instructions || t('glass.finish', lang), SPLIT_RIGHT_CONTENT_WIDTH)
    : [];

  if (!step.timerSeconds) {
    return [
      nextStep ? `■ ${t('glass.next', lang).toUpperCase()}` : `■ ${t('glass.finish', lang).toUpperCase()}`,
      ...nextLines,
    ];
  }

  const timer = getStepTimer(step, timers, stepIndex);
  const header = renderTimerLines(timer, 10, SPLIT_RIGHT_WIDTH);
  return [
    `■ ${t('glass.timer', lang).toUpperCase()}`,
    '',
    ...header,
    '',
    nextStep ? `■ ${t('glass.next', lang).toUpperCase()}` : `■ ${t('glass.finish', lang).toUpperCase()}`,
    ...nextLines,
  ];
}

export function cookingContentLineCount(recipe: Recipe, stepIndex: number): number {
  return Math.max(0, buildInstructionLines(recipe, stepIndex).length - 8);
}

export function buildCookingSplit(snapshot: KitchenSnapshot, nav: { highlightedIndex: number }): SplitData {
  const recipe = findRecipe(snapshot);
  if (!recipe) {
    return { header: buildSplitHeader('Cooking'), left: '', right: '' };
  }
  const { currentStepIndex, timers, flashPhase, language: lang } = snapshot;
  const step = recipe.steps[currentStepIndex];
  const isLastStep = currentStepIndex >= recipe.steps.length - 1;
  const hasTimer = Boolean(step?.timerSeconds);
  const hasScrollableContent = cookingContentLineCount(recipe, currentStepIndex) > 0;
  const buttons = getCookingButtons(hasTimer, hasScrollableContent, isLastStep, lang);
  const mode = cookMode.getMode(nav.highlightedIndex);
  const selectedButtonIndex = mode === 'buttons' ? clampIndex(nav.highlightedIndex, buttons.length) : -1;

  return {
    header: buildSplitHeader(
      `${currentStepIndex + 1}/${recipe.steps.length} ${step?.title ?? ''}`,
      buildActionBar(buttons, selectedButtonIndex, mode === 'scroll' ? t('glass.scroll', lang) : mode === 'steps' ? t('glass.steps', lang) : null, flashPhase),
    ),
    left: buildPaneText(buildInstructionLines(recipe, currentStepIndex), SPLIT_LEFT_WIDTH, mode === 'scroll' ? cookMode.getOffset(nav.highlightedIndex) : 0),
    right: buildPaneText(buildTimerPaneLines(recipe, currentStepIndex, timers, lang), SPLIT_RIGHT_WIDTH, 0),
  };
}

export const cookingScreen: GlassScreen<KitchenSnapshot, KitchenActions> = {
  display(snapshot, nav) {
    const recipe = findRecipe(snapshot);
    if (!recipe) return { lines: [] };
    const { currentStepIndex, timers, flashPhase, language: lang } = snapshot;
    const mode = cookMode.getMode(nav.highlightedIndex);
    const step = recipe.steps[currentStepIndex];
    const hasTimer = Boolean(step?.timerSeconds);
    const isLastStep = currentStepIndex >= recipe.steps.length - 1;
    const hasScrollableContent = cookingContentLineCount(recipe, currentStepIndex) > 0;
    const buttons = getCookingButtons(hasTimer, hasScrollableContent, isLastStep, lang);
    const selectedButtonIndex = mode === 'buttons' ? clampIndex(nav.highlightedIndex, buttons.length) : -1;

    const stepLabel = `${currentStepIndex + 1}/${recipe.steps.length} ${truncate(step?.title ?? '', 24)}`;
    const activeLabel = mode === 'scroll' ? t('glass.scroll', lang) : mode === 'steps' ? t('glass.steps', lang) : null;
    const actionBar = buildActionBar(buttons, selectedButtonIndex, activeLabel, flashPhase);

    const content = buildStepContent(recipe, currentStepIndex, timers);
    const timerLineCount = step?.timerSeconds
      ? renderTimerLines(getStepTimer(step, timers, currentStepIndex)).length + 1
      : 0;
    const timerPart = content.slice(0, timerLineCount);
    const instrPart = content.slice(timerLineCount);

    const lines = [...glassHeader(stepLabel, actionBar)];
    for (const tl of timerPart) {
      lines.push(line(tl, 'meta', false));
    }

    const instrSlots = G2_TEXT_LINES - lines.length;
    const offset = mode === 'scroll' ? cookMode.getOffset(nav.highlightedIndex) : 0;
    if (instrPart.length > 0 && instrSlots > 0) {
      const start = Math.max(0, Math.min(offset, instrPart.length - instrSlots));
      const visible = instrPart.slice(start, start + instrSlots);
      const instrLines = visible.map((tl) => line(tl, 'meta', false));
      applyScrollIndicators(instrLines, start, instrPart.length, instrSlots, (tl) => line(tl, 'meta', false));
      for (const il of instrLines) lines.push(il);
    }
    return { lines };
  },

  action(action, nav, snapshot, ctx) {
    const recipe = findRecipe(snapshot);
    if (!recipe) return nav;
    const mode = cookMode.getMode(nav.highlightedIndex);
    const step = recipe.steps[snapshot.currentStepIndex];
    const hasTimer = Boolean(step?.timerSeconds);
    const isLastStep = snapshot.currentStepIndex >= recipe.steps.length - 1;
    const lang = snapshot.language;
    const hasScrollableContent = cookingContentLineCount(recipe, snapshot.currentStepIndex) > 0;
    const buttons = getCookingButtons(hasTimer, hasScrollableContent, isLastStep, lang);

    if (mode === 'buttons') {
      if (action.type === 'HIGHLIGHT_MOVE') {
        const btnIdx = clampIndex(nav.highlightedIndex, buttons.length);
        return { ...nav, highlightedIndex: moveHighlight(btnIdx, action.direction, buttons.length - 1) };
      }
      if (action.type === 'SELECT_HIGHLIGHTED') {
        const btnIdx = clampIndex(nav.highlightedIndex, buttons.length);
        const selected = buttons[btnIdx];
        if (selected === t('glass.timer', lang)) { ctx.toggleTimer(); return nav; }
        if (selected === t('glass.scroll', lang)) return { ...nav, highlightedIndex: cookMode.encode('scroll') };
        if (selected === t('glass.steps', lang)) return { ...nav, highlightedIndex: cookMode.encode('steps') };
        if (selected === t('glass.finish', lang)) { ctx.navigate(`/recipe/${recipe.id}/complete`); return nav; }
        return nav;
      }
      if (action.type === 'GO_BACK') { ctx.navigate(`/recipe/${recipe.id}`); return nav; }
      return nav;
    }

    if (mode === 'scroll') {
      if (action.type === 'HIGHLIGHT_MOVE') {
        const offset = cookMode.getOffset(nav.highlightedIndex);
        const maxOffset = cookingContentLineCount(recipe, snapshot.currentStepIndex);
        return { ...nav, highlightedIndex: cookMode.encode('scroll', moveHighlight(offset, action.direction, maxOffset)) };
      }
      if (action.type === 'SELECT_HIGHLIGHTED' || action.type === 'GO_BACK') {
        const scrollIdx = buttons.indexOf(t('glass.scroll', lang));
        return { ...nav, highlightedIndex: scrollIdx >= 0 ? scrollIdx : 0 };
      }
      return nav;
    }

    if (mode === 'steps') {
      if (action.type === 'HIGHLIGHT_MOVE') {
        ctx.setCurrentStepIndex(moveHighlight(snapshot.currentStepIndex, action.direction, recipe.steps.length - 1));
        return nav;
      }
      if (action.type === 'SELECT_HIGHLIGHTED' || action.type === 'GO_BACK') {
        const stepsIdx = buttons.indexOf(t('glass.steps', lang));
        return { ...nav, highlightedIndex: stepsIdx >= 0 ? stepsIdx : 0 };
      }
      return nav;
    }

    return nav;
  },
};
