// Export stand-in for this bundle only. The planner's autoDoor lives in src/sim.js, which is not included.
// A size preset with no door gets one 3 ft door at the middle of its longest wall.
import { placeDoor, DOOR_W } from './walls.js';
export function autoDoor(world) {
  if (!world || world.env === 'outdoor') return 0;
  let added = 0;
  for (let pi = 0; pi < (world.walls || []).length; pi++) {
    const p = world.walls[pi];
    if (!p || !p.closed || (p.doors || []).length || !p.pts || p.pts.length < 3) continue;
    let best = 0, bi = 0;
    for (let i = 0; i < p.pts.length; i++) {
      const a = p.pts[i], b = p.pts[(i + 1) % p.pts.length];
      const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
      if (L > best) { best = L; bi = i; }
    }
    if (best < DOOR_W + 1) continue;
    const r = placeDoor(world.walls, pi, bi, best / 2);
    if (r && !r.error) added++;
  }
  return added;
}
