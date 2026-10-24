# Checks for the Dev Test Tools hub

Rebased onto `main` at `cf0a65670306860caa5b0c763e4ab7c66236ff2a`.
Viewer source under test: `59bdb55fbfbbed64f2d95ed7dbb5ca5663af32cc`.
That commit adds `<script src="../shared/fps-counter.js"></script>` to `test/tools.html`.
Character, car, and building are tabs on that one page. `test/index.html` already includes the same pill from main.

## viewer-check — PASS (exit 0)

`node tools/viewer-check.js` on `59bdb55`.

- Character sweep: 0 fails. Aussie is not in this build (optional 404, a note).
- Save Shot label: `Ellie · Front · Idle · f0`.
- Ellie vs `adventure.html?anatomy=1`: pixel MAE 0. Both heights 1.499533422099913 m. Feet 0.000307 m.
- Car sweep: 0 fails. 24 bodies. Label `370Z · 3/4 · GAME · f0`.
- Building sweep: 0 fails. Label `GARAGE · Front · GAME · f0`.
- A module whose import throws stays in `.zfail`. Three tabs remain. Characters still opens after Car and Building.
- `index.html`, `world.html`, `jr.html`, and `adventure/src/` were not edited.
- Frame times, 5 samples, ms: phone 16.2, 16.8, 16.7, 17.1, 16.2; iPad 8.7, 16.7, 16.9, 16.7, 16.8; compare 16.4, 16.9, 16.7, 16.5, 16.4; turntable 12.7, 16.8, 16.6, 16.7, 16.6; scrub 9.6, 16.5, 17.2, 16.6, 16.3.

## Anatomy — PASS (exit 0)

`node tools/adventure-anatomy.mjs` on `7ee9fe0`, before the car and room expansion. `adventure/src/main.js` on this rebase matches that Adventure tree (`git diff` against `origin/main` for that file is empty). Character rendering was not changed here.

Front head ratio 0.353, neck true, centered. Hero height 1.4995 m, feet 0.000307 m. Fox height 0.387 m. Problems: 0. Copy: `anatomy-rerun.json`.

## 370Z design — FAIL (exit 1), pre-existing

Static check from `origin/cursor/car-design-check-f3d2` against the GLB already on main. Rules 1, 2, 5, and 6 pass. Same file `shared/assets/370z-glb.js` as `assets/370z.glb`, sha256 `fdba257f6422`. Rule 3 fails: `spritePx` is 160. Not edited here. The spinner shows that report as CHECK lines.

## Architecture harness — not this PR

Exit 2 is the checker’s browser file, not a city break on this branch.

`world/`, `adventure/`, `index.html`, `world.html`, `jr.html`, and `adventure.html` match `origin/main`. A harness load of those files reports `CITY` as an object and `drawBldg` as a function. `window.ARCH` stays undefined, and `__ARCH_READY` is `missing`, because `tools/arch-check-browser.js` is not on `main` or on this branch. It lives on `origin/cursor/arch-check-652e`. Serving that file makes the same harness report `ready`. `docs/NEON-WORLD-STYLE.md` is also only on that branch. Neither file was copied here.

## Integration

Recorded after the push onto `main`.
