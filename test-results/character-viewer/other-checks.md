# Checks for the Dev Test Tools hub

Viewer source under test: `7ee9fe0400391269f330790e3d0c08a0e876efec`.
That commit matches Adventure's unlit materials after merging `6da2b83`.
This note and the refreshed `report.json` were written after that run.

## viewer-check — PASS (exit 0)

`node tools/viewer-check.js` on `7ee9fe0`.

- Character sweep: 0 fails. Aussie is not in this build (optional 404, a note).
- Save Shot label: `Ellie · Front · Idle · f0`.
- Ellie vs `adventure.html?anatomy=1`: pixel MAE 0. Both heights 1.499533422099913 m. Feet 0.000307 m.
- The copied prepare path uses MeshBasicMaterial, clears maps, drops normals, and tints a mapped fox `#d9783a`, same as `adventure/src/main.js`.
- Car sweep: 0 fails. Label `370Z · 3/4 · GAME · f0`.
- Building sweep: 0 fails. The game door fails the width and person bars; the 2.4 × 2.6 m door with an antenna roof passes. Label `GARAGE · Front · GAME · f0`.
- A module whose import throws stays in `.zfail`. Three tabs remain. Characters still opens after Car and Building.
- `index.html`, `world.html`, `jr.html`, and `adventure/src/` were not edited by this checker.
- Frame times, 5 samples, ms: phone 12.3, 17.1, 16.1, 16.8, 16.8; iPad 14.7, 15.9, 17.4, 16.5, 16.7; compare 14.7, 16.3, 16.1, 16.9, 16.6; turntable 1, 14.9, 16.2, 16.4, 17; scrub 1.3, 14.8, 16.8, 16.7, 19.2.

## Anatomy — PASS (exit 0)

`node tools/adventure-anatomy.mjs` on this tree after the material change.

Front head ratio 0.353, neck true, centered. Side 0.354, three-quarter 0.350, back 0.361. Chest front 161 / side 104 / back 160. Hero height 1.4995 m, feet 0.000307 m. Fox height 0.387 m, feet on the ground. Problems: 0.

The live spinner bar uses bone span. Ellie bone head span is 24%, inside 16–45%, so that line is PASS. The pixel checker’s 35% is a different measurement of the same pose. Copy of the rerun: `anatomy-rerun.json`. The adventure-m0 shots already on the branch were left as that branch wrote them.

## 370Z design — FAIL (exit 1), pre-existing

Static check from `origin/cursor/car-design-check-f3d2`, run against `65360f3`. `6da2b83` does not change `shared/traffic-tune.js` or the GLB.

Rules 1, 2, 5, and 6 pass. Same GLB `shared/assets/370z-glb.js` as `assets/370z.glb`, sha256 `fdba257f6422`, 1800836 bytes.

Rule 3 fails: `shared/traffic-tune.js` `spritePx` is 160. Close bakes must be at least 256 px. That file was not edited here. Visual review was not run (`--static-only`).

## Architecture — checker error (exit 2)

`tools/arch-check.mjs` from `origin/cursor/arch-check-652e`, run against `65360f3`. `6da2b83` does not change `world/` or `world.html`.

Harness did not start (`missing`) even though city state was complete. Style guide `docs/NEON-WORLD-STYLE.md` is not on this branch (1 warning). Findings: 0. Shots: 0. This is a checker/harness miss, not a reviewed building fail.

The live building bar still shows the game door: width 1.44 m fails against 1.85 + 0.15 m, person clearance fails against 1.9 m, and a blank slab roof fails. Door height 2.45 m passes. Sign is about 88 px (minimum 10). The game door was not changed.

## Integration

Branch check on `7af92d2` (and again after this note): PASS (exit 0). Systems touched: none. No missing dependents. The diff against `origin/cursor/adventure-world-plan-52cf` is `tools/dev/`, `tools/viewer-check.js`, `test/tools.html`, and `test-results/character-viewer/`.

`node /tmp/zd-checks/tools/integration-check.js --branch origin/cursor/character-viewer-f5bb --base origin/cursor/adventure-world-plan-52cf`

Self-test PASS after reading `docs/INTEGRATION-MAP.md` from `origin/cursor/integration-check-b88c`. That doc is not on this branch and was not committed.
