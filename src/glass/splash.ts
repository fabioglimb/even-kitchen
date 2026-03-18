import { createSplash, TILE_PRESETS } from 'even-toolkit/splash';

/**
 * Kitchen splash renderer — cooking pot with steam + app name (tile 1),
 * "Loading..." text (tile 2). Canvas is 200x200 (vertical 2-tile layout).
 * Reusable: used for both G2 glasses splash and web hero canvas.
 */
export function renderKitchenSplash(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const fg = '#e0e0e0';
  const dim = '#808080';
  const cx = w / 2;

  // Scale factor (designed for 200x200 canvas, tile 1 = top 100px, tile 2 = bottom 100px)
  const s = Math.min(w / 200, h / 200);

  // ── Tile 1: Logo + Name (top 100px) ──

  const logoMidY = 40 * s;

  // Steam particles
  ctx.strokeStyle = dim;
  ctx.lineWidth = 1.5 * s;
  ctx.lineCap = 'round';

  const steamOffsets = [-18, -4, 10];
  for (const dx of steamOffsets) {
    const sx = cx + dx * s;
    const baseY = logoMidY - 18 * s;
    ctx.beginPath();
    ctx.moveTo(sx, baseY);
    ctx.bezierCurveTo(sx - 4 * s, baseY - 8 * s, sx + 4 * s, baseY - 14 * s, sx, baseY - 22 * s);
    ctx.stroke();
  }

  // Pot
  const potW = 60 * s;
  const potLeft = cx - potW / 2;
  const potRight = cx + potW / 2;
  const rimY = logoMidY - 15 * s;

  ctx.fillStyle = fg;
  ctx.fillRect(potLeft - 5 * s, rimY, potW + 10 * s, 4 * s);

  ctx.beginPath();
  ctx.moveTo(potLeft, rimY + 4 * s);
  ctx.lineTo(potLeft + 4 * s, rimY + 29 * s);
  ctx.lineTo(potRight - 4 * s, rimY + 29 * s);
  ctx.lineTo(potRight, rimY + 4 * s);
  ctx.closePath();
  ctx.fillStyle = '#404040';
  ctx.fill();
  ctx.strokeStyle = fg;
  ctx.lineWidth = 2 * s;
  ctx.stroke();

  ctx.fillStyle = fg;
  ctx.fillRect(potLeft + 4 * s, rimY + 27 * s, potW - 8 * s, 3 * s);

  ctx.strokeStyle = fg;
  ctx.lineWidth = 2.5 * s;
  for (const side of [-1, 1]) {
    const hx = side === -1 ? potLeft - 5 * s : potRight + 5 * s;
    const hxOuter = hx + side * 9 * s;
    ctx.beginPath();
    ctx.moveTo(hx, rimY + 2 * s);
    ctx.lineTo(hxOuter, rimY + 2 * s);
    ctx.lineTo(hxOuter, rimY + 10 * s);
    ctx.lineTo(hx, rimY + 10 * s);
    ctx.stroke();
  }

  ctx.fillStyle = fg;
  ctx.beginPath();
  ctx.arc(cx, rimY - 3 * s, 3 * s, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = fg;
  ctx.font = `bold ${14 * s}px "Courier New", monospace`;
  ctx.textAlign = 'center';
  ctx.fillText('EVENKITCHEN', cx, 88 * s);

  // ── Tile 2: Loading text (bottom 100px, y=100..200) ──

  ctx.fillStyle = dim;
  ctx.font = `bold ${20 * s}px "Courier New", monospace`;
  ctx.fillText('Loading...', cx, 155 * s);

  ctx.textAlign = 'left';
}

/**
 * G2 glasses splash — 2 vertical tiles, top-center on display.
 * Tile 1: Logo + name. Tile 2: "Loading..." (cleared with black on home transition).
 */
export const kitchenSplash = createSplash({
  tiles: 2,
  tileLayout: 'vertical',
  tilePositions: TILE_PRESETS.topCenterVertical2,
  minTimeMs: 2500,
  maxTimeMs: 5000,
  menuText: '',
  render: renderKitchenSplash,
});
