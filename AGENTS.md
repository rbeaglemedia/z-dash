# Z-DASH agent rules

DRAFT for Bob's review. Not in force until Bob says so. Do not move files. Paths below are the real repo layout. There is no `src/systems/` and no `src/worlds/`.

Build and test commands stay in the private repo rbeaglemedia/z-dash-tools (AGENTS.md). Read that for the tool list. This file is the app rules.

## Project

Z-DASH is the site at z.beagle.games.

- Neon World: `world.html`. The twin page `world-split.html` stays in parity with it.
- Adventure World: `adventure.html`, `adventure/src/main.js`, `adventure/app.js`.
- Kid app: `jr.html`.
- Adult app: `index.html`. Kid work never edits `index.html`.

## Shared systems (do not duplicate)

Search the repo before writing. Edit the module that already owns the job. Delete the replaced code in the same change. Do not copy a system into a world file, into `test/world/`, or into a new parallel file.

| Job | Real files | Rule |
| --- | --- | --- |
| Input and mobile controls | `world/input.js`, `shared/steering.js`, `shared/tune.js` | Edit `world/input.js`. The kid and adult chase input lives in `jr.html` and `index.html`. |
| 370Z vehicle | `world/phys-ground.js`, `world/phys-air.js`, `world/flight.js` (chase offsets only), `world/state.js`, `shared/car-draw.js`, `shared/car-model.js`, `world/garage.js` (color catalog) | One ground step and one air step. `shared/physics.js` is dead: no page loads it. |
| On-foot character and pet | `world/house.js` (`WALK_MODE`), `world/camera.js`, `world/crew.js`, `world/crew-data.js`, `shared/crew-state.js` | One enter path on `WALK_MODE`. |
| HUD | `world/hud.js` (`drawHud`) plus the DOM buttons in `world.html` | Canvas dials and DOM buttons are both live. See Mobile. |
| Event-planner builder | `world/planner-tools.js` (`PLANNER_TOOLS`), `world/interior-builder.js` (`INTERIOR_BUILDER`), `world/dev-builder.js` (`DEV_BUILDER`) | Builder logic stays in these modules. |
| World loading and transitions | `world.html`, `world-split.html`, `world/boot.js`, `shared/version.js`, `sw.js` | One script list, identical on both Neon pages. |
| Traffic | `world/traffic.js`, `shared/traffic-tune.js`, `world/towdrive.js`, `world/towtruck.js` | Neon traffic is separate from the chase inside `jr.html`. |
| FPS guard | `world/camera.js`, `shared/detail-tune.js`, `world/detail.js`, `world/boot.js`, `world/hud.js`, `shared/fps-counter.js` | `fps-counter.js` skips Neon World. Do not stack a second pill on `world.html`. |
| City picture | `world/city.js`, `world/city-layout.js`, `world/city-draw.js`, `world/gl-city.js` | Live play uses `city-draw.js`. `gl-city.js` stays behind `?gl=1`. |
| Per-world code | `world/` for Neon, `adventure/` for Adventure | A world edits its own files. It calls the builder. It does not copy the builder. |

`test/world/` is a drifted copy of `world/`. Leave it as a copy. `/test/` loads the live files or one explicit overlay. Only one agent publishes `/test/` at a time.

## Mandatory reuse

1. Search for an existing implementation before writing new code.
2. Prefer editing the shared module.
3. Delete the replaced code in the same change. No second file for the same job.
4. No copy-paste of systems into world files.
5. Builder logic only in the builder modules. Neon World and Adventure World call `PLANNER_TOOLS` and `INTERIOR_BUILDER`. Live drive edits on `/test/` go through `DEV_BUILDER`.
6. Keep public APIs stable unless Bob approves the change.
7. One system at a time. No new features while cleaning up.

## Mobile controls

**PROPOSED, needs Bob's yes:** driving and walk controls become one DOM overlay, Pointer Events only, virtual controls only on touch.

How the buttons work today:

- `world.html` has DOM round buttons for wings, brake, e-brake, throttle, NOS, pause, and start.
- `world/input.js` creates exit-car, enter-building (`#enterBldBtn`, 44px tall, 52px in pc-mode), and emote.
- `world/house.js` creates a second ENTER / EXIT button. Two functions both set `WALK_MODE.insideBuilding`: `walkEnterDoor` in `house.js` and `safeEnterDoor` in `input.js`.
- `world/hud.js` `drawHud` paints the minimap, tilt, MPH, altitude, throttle, and status on the canvas. Phone FPS is canvas text in that top cluster. iPad FPS sits in the telemetry bubble. Desktop FPS is the DOM node `#pcFps`.
- The same controls listen to pointer events and to touch events, with a short guard so one tap does not fire twice.
- `touch-action: none` is already on `html`, `body`, the canvas, and `.kround`. Some `.kround` rules also set `touch-action: manipulation`.

Leave this mix in place until Bob approves the overlay. A mobile-controls pass may then use Pointer Events only, 48px minimum targets, `touch-action: none` on the page and the controls, and virtual controls only on touch.

## Device caps

Match the caps already in the repo. The 1.5 cap in an outside draft is the Neon Paint page, and it is not the Neon World rule.

`world/camera.js` `resize()`:

- iPad (touch, and short side ≥ 680 and long side ≥ 900, or an iPad user agent): DPR 1, area cap 1440×1080, CSS-scaled.
- Phone: DPR `min(devicePixelRatio, 2)`, buffer equal to the CSS viewport.
- Desktop (no touch and width > 1024): DPR 1, area cap 1280×720.

`world/neon-paint.js` uses iPad DPR 1, otherwise `min(1.5, dpr)`. `world/dance-stage.js` uses iPad DPR 1, otherwise `min(2, dpr)`. That split is a gap, recorded in `docs/REDUNDANCY-AUDIT.md`.

Mobile renderers stay antialias off when a pass is allowed to touch them. `world/gl-city.js` already sets `antialias: false`. The 370Z renderer in `shared/car-model.js` is currently `antialias: true`. `world/towtruck.js` opens a second context with `antialias: true`, and `world/traffic.js` copies the car context's flag into `photoR`. Those are recorded gaps. A FPS pass changes them only with Bob's yes, on that system, in the same change that removes the extra context.

## Workflow

- One system at a time. Stop for Bob's phone test on a Galaxy and an iPad before the next system.
- No new features while cleaning up.
- Plan before build. Write no code until Bob writes "plan approved, build it".
- Echo first: one-line restatement before a big change, then wait.
- Risky asks (merge, deploy, branch or file deletes, DNS, secrets, force-push, another repo): restate the action and wait for "yes, do it."
- Overlap check at 844×390, 780×360, 1024×768, and 1366×768.
- Real labeled screenshots, FPS counter top-right, same camera spots before and after.
- One test browser at a time. FPS samples are 5 pairs. Run the full regression once, on the final commit, and name that sha in the end line.
- Paste prompts: `docs/AGENT-PROMPTS.md` (cleanup, mobile controls, FPS).

## Standing rules

1. Never push, merge, or commit to `main`. Work on your own branch via a PR. GitHub Pages publishes `main`.
2. Kid work never touches adult `index.html`.
3. No new `shadowBlur`. Existing uses are debt, listed in the audit.
4. Nothing deploys without Bob's explicit go. Keep a rollback commit.
5. Only one agent publishes `/test/` at a time. The builder-port owner is that agent.
6. No secrets in code, PRs, or chat.
7. End every run with one line: what changed, branch, PR link, whether checks passed, and the exact sha the tests ran on.
