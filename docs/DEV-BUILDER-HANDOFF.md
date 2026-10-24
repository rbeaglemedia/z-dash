# Handoff for Integration Check

To Integration Check agent `bc-5076c55e`, before the build report. Interiors agent `bc-80a1fc6f` is building Ellie's Builder L1 and the R1 drop tool on these same tools.

## What landed

DEV Builder M2 and the Q2 tools (roof, measure, align, group, 15° rotate), on branch `cursor/dev-builder-m2-cbd5`.

- Shared tools: `world/planner-tools.js` (`PLANNER_TOOLS`). One copy. Interiors should load this script and call it. Do not duplicate snap, rotate, history, roof, measure, align, or group.
- Editor: `world/dev-builder.js`. `CITY.editorDoc()` export and import. Bob only. Hidden corner latch. Not on the driver HUD and not in Ellie's menus.
- Wired into `world.html` and `world-split.html`. Adult `index.html` is not touched.
- P2: a save on the live page stays in `zdash.city.editor.v1`. `/test/world.html` and `/test/world-split.html` are the pages that apply it. No deploy. No second go.

## Checks already run

- `node tools/dev-builder-check.js` passed. Spawn lock, highway lock, street-through-building, new street, roof parts, measure, 15° and quarter turn, group move, 100-step history. No `.shadowBlur` in the new scripts.
- Chrome on `/test/dev-builder.html?demo=1`: 24 buildings, one new street, a pitched roof on the house, measure readout, `CITY.editorDoc` present, `applies` false on that review page.
- Chrome on `/test/world.html`: Neon World boots, `CITY.editorDoc` present, `applies` true, the kid shell is present.
- UI polish on the editor (`node tools/ui-polish-audit.js --only dev-builder`): 7 viewports (phone 844×390 and 667×375, iPad 1180×820, 1024×768, and 820×1180, PC 1366×768 and 1920×1080). 14 controls each. 0 errors, 0 warnings. Report: `test-results/dev-builder/ui-polish/audit.md`. Labeled shots: `test-results/dev-builder/phone.png`, `ipad.png`, `pc.png`.
- Architecture Check, plan review of `docs/DEV-BUILDER-ARCHITECTURE.md`: capability pass, on brand pass. The city shot pass was not run. `world/city.js` is unchanged, so today's 24 buildings are still the published city. Report: `test-results/dev-builder/arch-check/report.md`.
- Cache: `ZD_WORLD` is 31 and the world pages use `?v=31`. Adult `index.html` was not bumped.

## What Integration should watch

- Interiors' L1 and R1 work should script-tag `world/planner-tools.js` rather than reimplement it.
- A live `world.html` load must not apply `zdash.city.editor.v1`. Only a `/test/` address does.
- Building moves and new streets stay inside `guardM2`. The highway and both spawns stay locked.
- Do not publish this to the live map. P2's second go is still a separate explicit yes.
