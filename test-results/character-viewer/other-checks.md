# Other checks (character viewer)

Parent commit when these ran: `65360f3d4d5106e41c8c15d6a9b63a0724b0005e`.
`tools/viewer-check.js` ran on this same spinner source (the files in this commit, before the commit itself). `other-checks.md` is notes only.

## viewer-check — PASS (exit 0)

`node tools/viewer-check.js`

- Character sweep: 0 fails. Note: Aussie is not in this build (optional 404).
- Save Shot label: `Ellie · Front · Idle · f0` (bright pixels drawn).
- Ellie vs `adventure.html?anatomy=1`: pixel MAE 0. Height 1.499533422099913 m on both sides.
- Car sweep: 0 fails. Label `370Z · 3/4 · GAME · f0`. Visible-mesh size stays on the 4.25 × 1.315 m bar.
- Building sweep: 0 fails. Game door fails the width and person bars; the 2.4 × 2.6 m door with an antenna roof passes. Label `GARAGE · Front · GAME · f0`.
- A module whose import throws stays in `.zfail`. The three tabs remain, and Characters still opens after Car and Building.
- `index.html`, `world.html`, `jr.html`, `adventure.html`, root `sw.js`, and `adventure/src/` were not modified.
- Frame times, 5 samples, ms: phone 11.8, 16.8, 16.3, 17, 16.3; iPad 12.4, 16.8, 16.7, 16.5, 16.9; compare 7.3, 8.9, 16.4, 17.5, 16.5; turntable 4.7, 16.5, 16.3, 16.8, 16.6; scrub 8.3, 16.4, 16.6, 17.2, 16.1.

## Anatomy — PASS (exit 0)

`node tools/adventure-anatomy.mjs` (this branch). Front head ratio 0.353, neck true, centered. Hero height 1.4995 m. Fox height 0.387 m, feet on the ground. Problems: none. Log already in `test-results/adventure-m0/`.

The live spinner bar uses bone span, not the pixel checker. Ellie bone head span is 24%, inside 16–45%, so that line is PASS. The pixel checker’s 35% is a different measurement of the same pose.

## 370Z design — FAIL (exit 1), pre-existing

`node tools/car-design-check.mjs --static-only` from `origin/cursor/car-design-check-f3d2` (checker is not on this branch). Rules 1, 2, 5, and 6 pass. Same GLB `shared/assets/370z-glb.js` as `assets/370z.glb`, sha256 `fdba257f6422`, 1800836 bytes.

Rule 3 fails: `shared/traffic-tune.js` `spritePx` is 160. Close bakes must be at least 256 px. That file was not edited here. Visual review was not run (`--static-only`).

## Architecture — checker error (exit 2)

`node tools/arch-check.mjs` from `origin/cursor/arch-check-652e`. Harness did not start (`missing`) even though city state was complete. Style guide `docs/NEON-WORLD-STYLE.md` is not on this branch (1 warning). Findings: 0. Shots: 0. This is a checker/harness miss, not a reviewed building fail.

The live building bar still shows the game door: width 1.44 m fails against 1.85 + 0.15 m, person clearance fails against 1.9 m, and a blank slab roof fails. Door height 2.45 m passes. Sign is about 88 px (minimum 10). The game door was not changed.

## Integration

Not valid on the unpushed tree. Re-run after push:

`node tools/integration-check.js --branch origin/cursor/character-viewer-f5bb --base origin/cursor/adventure-world-plan-52cf`

Docs, tools, test pages, and test-results do not count as shipped runtime. This branch does not edit `world.html`, `index.html`, or `shared/`.
