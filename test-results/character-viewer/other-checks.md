# Checks for the Dev Test Tools hub

Viewer source under test: `9b6b4d5d35fd3b4a14051aed0c753f16f34df856`.
That commit adds the car catalog (370Z, tow jump, 22 Kenney bodies), vinyl grid, kits, the Stillen hold, and the 6 rooms × 4 styles.
This note and `report.json` were written after that run. The source files were not edited between the run and the commit.

## viewer-check — PASS (exit 0)

`node tools/viewer-check.js` on `9b6b4d5`.

- Character sweep: 0 fails. Aussie is not in this build (optional 404, a note).
- Save Shot label: `Ellie · Front · Idle · f0`.
- Ellie vs `adventure.html?anatomy=1`: pixel MAE 0. Both heights 1.499533422099913 m. Feet 0.000307 m.
- The copied prepare path uses MeshBasicMaterial, clears maps, drops normals, and tints a mapped fox `#d9783a`, same as `adventure/src/main.js`.
- Car sweep: 0 fails. 24 bodies (370Z, tow jump, 6 plain traffic, 16 meshopt `k-*`). Kenney colormap loads from `shared/assets/traffic/colormap.js`. Label `370Z · 3/4 · GAME · f0`. Official design findings are CHECK lines. The 370Z length and height lines are PASS.
- Building sweep: 0 fails. City garage door still fails the width and person bars; the 2.4 × 2.6 m door with an antenna roof passes. Each of the 6 × 4 interiors uses a 2.0 × 2.2 m door. Label `GARAGE · Front · GAME · f0`.
- A module whose import throws stays in `.zfail`. Three tabs remain. Characters still opens after Car and Building.
- `index.html`, `world.html`, `jr.html`, and `adventure/src/` were not edited by this checker.
- Frame times, 5 samples, ms: phone 8.5, 16.9, 16.6, 16.4, 17; iPad 0.4, 14.3, 16.6, 17.1, 16.7; compare 7.6, 16.6, 16.5, 16.7, 17; turntable 17.3, 13.7, 16.7, 17.4, 15.9; scrub 3.3, 16.8, 16.1, 16.6, 17.1.

## Anatomy — PASS (exit 0)

`node tools/adventure-anatomy.mjs` on `7ee9fe0`, before this car and room expansion. Character rendering did not change in `9b6b4d5`.

Front head ratio 0.353, neck true, centered. Side 0.354, three-quarter 0.350, back 0.361. Chest front 161 / side 104 / back 160. Hero height 1.4995 m, feet 0.000307 m. Fox height 0.387 m, feet on the ground. Problems: 0.

The live spinner bar uses bone span. Ellie bone head span is 24%, inside 16–45%, so that line is PASS. The pixel checker’s 35% is a different measurement of the same pose. Copy of the rerun: `anatomy-rerun.json`. The adventure-m0 shots already on the branch were left as that branch wrote them.

## 370Z design — FAIL (exit 1), pre-existing

Static check from `origin/cursor/car-design-check-f3d2`, run against `65360f3`. Later adventure commits do not change `shared/traffic-tune.js` or the GLB.

Rules 1, 2, 5, and 6 pass on the 370Z GLB. Same file `shared/assets/370z-glb.js` as `assets/370z.glb`, sha256 `fdba257f6422`, 1800836 bytes.

Rule 3 fails: `shared/traffic-tune.js` `spritePx` is 160. Close bakes must be at least 256 px. That file was not edited here. Visual review was not run (`--static-only`).

The spinner shows those official findings as CHECK lines (report `PR 78 ffac55c`, agent bc-3a1ede89). Kenney bodies stay at native size and are marked CHECK because they are not `assets/370z.glb`. The Stillen bumper can be selected so the old fascia is visible, and the stock look hides it.

## Architecture — checker error (exit 2)

`tools/arch-check.mjs` from `origin/cursor/arch-check-652e`, run against `65360f3`. Later commits on this branch do not change `world/` or `world.html`.

Harness did not start (`missing`) even though city state was complete. Style guide `docs/NEON-WORLD-STYLE.md` is not on this branch (1 warning). Findings: 0. Shots: 0. This is a checker/harness miss, not a reviewed building fail. The official titles from that agent’s report (sha 896fb969, 24 buildings, 8 fails, 2 warns) are shown as CHECK lines. The live city bar still shows the game door fail.

## Integration — PASS (exit 0)

`node /tmp/zd-checks/tools/integration-check.js --branch origin/cursor/character-viewer-f5bb --base origin/cursor/adventure-world-plan-52cf` on `94407f7`.

Systems touched: none. No missing dependents. The diff against `origin/cursor/adventure-world-plan-52cf` is `tools/dev/`, `tools/viewer-check.js`, `test/tools.html`, and `test-results/character-viewer/`.

Self-test PASS after reading `docs/INTEGRATION-MAP.md` from `origin/cursor/integration-check-b88c`. That doc is not on this branch and was not committed.
