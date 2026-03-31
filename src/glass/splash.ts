import { createSplash, TILE_PRESETS } from 'even-toolkit/splash';

// Exact pixel grid extracted from Even Hub icon (24x24)
const KITCHEN_ICON = [
  '........................',
  '...##....##....##.......',
  '...##....##....##.......',
  '.....##....##....##.....',
  '.....##....##....##.....',
  '...##....##....##.......',
  '...##....##....##.......',
  '.....##....##....##.....',
  '.....##....##....##.....',
  '........................',
  '.######################.',
  '.######################.',
  '.##..................##.',
  '.##..................##.',
  '.##..................##.',
  '.##..................##.',
  '.##..................##.',
  '.##..................##.',
  '.##..................##.',
  '...##..............##...',
  '...##..............##...',
  '.....##############.....',
  '.....##############.....',
  '........................',
];

function drawPixelGrid(
  ctx: CanvasRenderingContext2D,
  grid: string[],
  w: number,
  h: number,
  color: string,
) {
  const rows = grid.length;
  const cols = grid[0]!.length;
  const tileH = Math.min(h, w / 2); // top half = tile area
  const iconH = tileH; // fill tile
  const cell = Math.min(w / cols, iconH / rows); // square cells, fit in icon area
  const ox = (w - cols * cell) / 2; // center horizontally
  const oy = (iconH - rows * cell) / 2; // center vertically in icon area
  ctx.fillStyle = color;
  for (let r = 0; r < rows; r++) {
    const row = grid[r]!;
    for (let c = 0; c < cols; c++) {
      if (row[c] === '#') {
        ctx.fillRect(ox + c * cell, oy + r * cell, cell + 0.5, cell + 0.5);
      }
    }
  }
}

/**
 * Kitchen icon renderer — pixel-art cooking pot with steam.
 * Exact replica of Even Hub icon.
 * Reusable: used for both G2 glasses home tile and web hero canvas.
 */
export function renderKitchenSplash(ctx: CanvasRenderingContext2D, w: number, h: number) {
  drawPixelGrid(ctx, KITCHEN_ICON, w, h, '#e0e0e0');

}

/**
 * G2 glasses home tile — cooking pot icon, top-center on display.
 */
export const kitchenSplash = createSplash({
  tiles: 1,
  tileLayout: 'vertical',
  tilePositions: TILE_PRESETS.topCenter1,
  canvasSize: { w: 200, h: 200 },
  minTimeMs: 0,
  maxTimeMs: 0,
  menuText: '',
  render: renderKitchenSplash,
});
