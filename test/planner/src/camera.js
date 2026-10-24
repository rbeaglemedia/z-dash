// Pure camera + touch guards (no DOM) so the selftest can check them.
export const LIM = { minDist: 6, maxDist: 2400, minPitch: 0.35, maxPitch: 1.45 };
export const DEFAULT_VIEW = { yaw: Math.PI / 4, pitch: 0.95, dist: 46, tx: 0, tz: 0 };
export const DRAG_PX = 8, MIN_PINCH_PX = 12;
export const fin = (v) => typeof v === 'number' && Number.isFinite(v);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export function wrapAng(a) { if (!fin(a)) return 0; a = a % (2 * Math.PI); if (a > Math.PI) a -= 2 * Math.PI; if (a < -Math.PI) a += 2 * Math.PI; return a; }
export function sanitize(V, fb = DEFAULT_VIEW) {
  for (const k of ['yaw', 'pitch', 'dist', 'tx', 'tz']) if (!fin(V[k])) V[k] = fb[k];
  V.dist = clamp(V.dist, LIM.minDist, LIM.maxDist); V.pitch = clamp(V.pitch, LIM.minPitch, LIM.maxPitch); V.yaw = wrapAng(V.yaw); return V;
}
export const twoState = (a, b) => ({ d: Math.hypot(a.x - b.x, a.y - b.y), ang: Math.atan2(b.y - a.y, b.x - a.x), mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2 });
// v3.8: two-finger drag pans (the midpoint moves the view); pinch zooms and twist turns. Tilt is one-finger Turn only.
export const panDelta = (a, b) => { if (!a || !b) return [0, 0]; const dx = b.mx - a.mx, dy = b.my - a.my; return [fin(dx) ? dx : 0, fin(dy) ? dy : 0]; };
export const TOP_PITCH = 1.5695; // v3.8 top-down plan view (just under straight down, so the camera stays well defined)
// Two-finger update: zoom only when both spreads are big enough (a pinch to zero can't divide by 0), angle deltas wrapped.
export function pinch(V, a, b) {
  if (!a || !b) return sanitize(V);
  if (fin(a.d) && fin(b.d) && a.d >= MIN_PINCH_PX && b.d >= MIN_PINCH_PX) V.dist *= a.d / b.d;
  const da = wrapAng(b.ang - a.ang); if (fin(da)) V.yaw -= da;
  return sanitize(V);
}
export function orbitBy(V, dx, dy) { if (fin(dx)) V.yaw -= dx * 0.008; if (fin(dy)) V.pitch += dy * 0.006; return sanitize(V); }
export function zoomBy(V, f) { if (fin(f) && f > 0) V.dist *= f; return sanitize(V); }
export const passedThreshold = (x0, y0, x, y) => Math.hypot(x - x0, y - y0) >= DRAG_PX;
// Booths and pipe and drape are wall-like: they only move after a tap selects them first. Walls and tiles never move.
export const canDragItem = (d, isSelected) => !(d.booth || d.wallHost) || !!isSelected;
