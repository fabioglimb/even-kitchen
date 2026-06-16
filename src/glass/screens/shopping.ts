import type { GlassScreen } from 'even-toolkit/glass-screen-router';
import { moveHighlight } from 'even-toolkit/glass-nav';
import { buildScrollableList } from 'even-toolkit/glass-display-builders';
import { line } from 'even-toolkit/types';
import { truncate } from 'even-toolkit/text-utils';
import type { KitchenSnapshot, KitchenActions } from '../shared';
import { getDisplayAmount } from '../../contexts/ShoppingContext';

function progressBar(checked: number, total: number, width = 12): string {
  if (total === 0) return '';
  const filled = Math.round((checked / total) * width);
  return '█'.repeat(filled) + '─'.repeat(width - filled);
}

export const shoppingScreen: GlassScreen<KitchenSnapshot, KitchenActions> = {
  display(snapshot, nav) {
    const items = snapshot.shoppingItems ?? [];
    const checked = items.filter((i) => i.checked).length;
    const total = items.length;

    const header = line(`SHOPPING LIST  ${checked}/${total}`, 'normal');
    const sep = line('', 'separator');

    if (total === 0) {
      return { lines: [header, sep, line('  Shopping list is empty', 'normal')] };
    }

    const bar = line(`  ${progressBar(checked, total)}`, 'meta');

    // Show unchecked first, then checked
    const sorted = [...items].sort((a, b) => (a.checked === b.checked ? 0 : a.checked ? 1 : -1));

    const scales = snapshot.shoppingScales ?? {};

    const menuLines = buildScrollableList({
      items: sorted,
      highlightedIndex: nav.highlightedIndex,
      maxVisible: 6,
      formatter: (item) => {
        const check = item.checked ? '[x]' : '[ ]';
        const displayAmt = getDisplayAmount(item, scales);
        const qty = displayAmt && item.unit ? `${displayAmt}${item.unit} ` : displayAmt ? `${displayAmt} ` : '';
        return truncate(`${check} ${qty}${item.name}`, 54);
      },
    });

    return { lines: [header, sep, bar, ...menuLines] };
  },

  action(action, nav, snapshot, ctx) {
    const items = snapshot.shoppingItems ?? [];
    const sorted = [...items].sort((a, b) => (a.checked === b.checked ? 0 : a.checked ? 1 : -1));

    if (action.type === 'HIGHLIGHT_MOVE') {
      return { ...nav, highlightedIndex: moveHighlight(nav.highlightedIndex, action.direction, sorted.length - 1) };
    }
    if (action.type === 'SELECT_HIGHLIGHTED') {
      const item = sorted[nav.highlightedIndex];
      if (item && ctx.toggleShoppingItem) {
        ctx.toggleShoppingItem(item.id);
      }
      return nav;
    }
    if (action.type === 'GO_BACK') {
      ctx.navigate('/');
      return nav;
    }
    return nav;
  },
};
