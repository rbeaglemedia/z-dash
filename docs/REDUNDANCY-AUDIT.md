# Z-DASH redundancy audit

Plan only. No game file was edited, nothing was deployed, and `/test/` was not published. This document is the map. The slim paths are proposals for Bob. They are not a build.

Draft rules for review live in the root `AGENTS.md` and in `docs/AGENT-PROMPTS.md`. They are not in force until Bob says so.

## Baseline

| SHA | What it is |
| --- | --- |
| `f05d3d08e311723d3dd9319fdb4b36c482a3fcbd` | Bob's named main, "Add the Dev Test Tools hub". Every mark below is ahead/behind this commit. jscpd "main" ran here. |
| `8135fd9e85708fe0a39bd0f2226f830978db6bfe` | Live `origin/main` when this audit was written. One commit after `f05d3d0`. It only changes `/test/` ("Publish the combined /test/ walk-in and traffic preview"). jscpd was not re-run on this tip. |
| `5d8296515a7ba60de7cf0041d0b7093fd94614bc` | PR #94 head, `cursor/dev-builder-m2-cbd5`. Ahead 6, behind 0 of `f05d3d0`. Diverged 6/1 from `8135fd9`. |
| `54199cb5bc7b6e51d89a4d0c2bb1a82f5ec89693` | PR #111 head, `cursor/traffic-follow-2bdb`. Ahead 1, behind 0 of `f05d3d0`. Diverged 1/1 from `8135fd9`. |

`#94` and `#111` are not contained in `8135fd9`. `world.html` and `world-split.html` are byte-identical at `f05d3d0` (293 lines). `ZD_WORLD` is `'42'` in `shared/version.js`. The Neon script tags mix `?v=37`, `39`, `40`, `41`, and `42`.

There is no symbol `zdWalkCrew` anywhere in git history. Bob's walk-in example is the legacy path `walkCrewBuf` plus `WALK_MODE.insideBuilding` in `world/house.js`.

Structure notes from [grok-build-skills](https://github.com/byron-public/grok-build-skills) (controls, building-games, design-ui), used only as a yardstick: one chase-cam basis, one sign for steer, one `requestAnimationFrame` loop, one delta, no per-frame allocation, `touch-action: none`, one primary action. They do not justify a new framework, and they do not justify moving files.

## Top 10 by impact

jscpd backs the copy-paste rows. It misses the enter-building fight, because that fight is rewritten logic, not a 5-line clone. Row 1 is first for that reason.

1. **Two enter-building implementations on the legacy interior.** `world/house.js` `walkEnterDoor` (about line 1079) and `walkLockEnter` install `enterDoor` as a getter. `world/input.js` `safeEnterDoor` (about line 352) and `installSafeEnter` replace that getter. The comment at `input.js` 349–351 says the garage hub and the dance stage were already wrapping each other. Both paths set `insideBuilding` and call `walkShowInterior`. `house.js` draws one ENTER button. `input.js` draws `#enterBldBtn` (44px). jscpd does not flag this pair.
2. **`test/world/` is a full second Neon World.** Largest jscpd pairs on `f05d3d0`: dance-stage 3910 lines, neon-paint 2961, icon-garage 2089, detail 1827, dev-builder 1756, house 1395, crew 891, traffic 863, soccer 749, interior-builder 549, input 446, towdrive 398. Copying that tree back onto `world/` would put a second dance stage, paint shop, detail pass, and builder on the frame.
3. **PR #94 grew the traffic mirror and forked the interior builder.** Traffic clone 863 lines on `f05d3d0` to 1211 on #94 (+348). Interior-builder clone 549 to 453, because `test/world/interior-builder.js` diverged (+1146/−102 in that file). Walk-act and walk-planner JSON logs add 1015 and 991 self-clone lines. Live tip `8135fd9` already published a `/test/` walk-in and traffic preview. One publisher.
4. **Planner catalog cloned inside itself, and two more planner apps are proposed.** `test/planner/objects/catalog.json` 3440 lines across 268 clones. `sets.json` 2799 lines across 31 clones. PR #82 adds `test/planner-port/` (app.js 550, bake.js 190, catalog.js 222). PR #92 adds a second `world/planner-tools.js` (671 lines) plus `ellie-builder.js`, `room-place.js`, and edits to `planner-props.js`.
5. **Four interior painters on one flag.** (1) `house.js` `walkPaintRoom` / `walkPaintCrew` on `#walk-interior`. (2) `world/interior-try.js`, query `?interiorTry=1` only. (3) `world/detail.js` `loadInterior`, called from `walkShowInterior`. (4) `world/interior-builder.js` wraps `walkShowInterior` and stores `zdash.interior.layout.v1`. `house-styles.js` shares 35 cloned lines with `interior-try.js`. `walkCrewBuf` is an offscreen canvas that `getImageData`s every paint, then falls back to a stick figure.
6. **Vendored three.js copied beside the game.** `shared/car-model.js` and `test/shared/car-model.js` are one 3845-line clone, 226155 tokens, the largest single clone. `jr.html` (13839 lines) and `index.html` (12907 lines) each carry their own page bundle. PR #83 copies another three.js into `test/driver/three.module.js`.
7. **Traffic has a live cloner, a test copy, a kid chase, and four open rewrites.** Live `world/traffic.js` (1217) bakes sprites from the player's 370Z graph. `test/world/traffic.js` is the 863-line clone. `jr.html` has its own WANTED chase and is not Neon traffic. PR #78 rewrites `traffic.js` +873/−254. PR #97 adds +240. PR #93 adds `shared/next-traffic-lod.js` (697). PR #111 is the only traffic branch even with `f05d3d0`, and the mirror shrank to 828 lines. PR #73's "do not clone the 3D car" is not what the live file does.
8. **Dead `shared/physics.js` (131 lines) sits beside the split that replaced it.** `world/phys-air.js` (104) and `world/phys-ground.js` (186) both say they were split from it. No HTML loads `shared/physics.js`. jscpd still finds 28 lines against `test/world/phys-air.js` and 23 against `test/world/phys-ground.js`. NOS sparks and `shadowBlur` are still in `phys-ground.js`, so PR #45 did not finish that job.
9. **FPS policy is per device, and the devices disagree.** Caps, antialias, and per-frame allocations are listed in the gaps section. Phone FPS is canvas text, not the shared top-right pill. `shared/fps-counter.js` skips Neon on purpose.
10. **Open PRs add parallel files on top of modules that already exist.** `world/walk-items.js` (#57, #60), `world/style-sampler.js` + `world/planner-props.js` (#81), `world/ellie-builder.js` + a second `planner-tools.js` + `world/room-place.js` (#92), `world/interiors-review.js` (#74), `shared/next-traffic-lod.js` (#93), `world/weather.js` (#89, and it edits the same script list as the boulevard pages).

`world.html` and `world-split.html` are a 293-line clone because they are the same page twice. Keep both. Share one script list. Do not delete a page to shrink the clone report.

`tools/dev/dist` versus `tools/dev/src` (character.js 670 lines, car.js 537) is a build output. `test-results/` clones (arch-check reports 1659 / 1414 / 1296) are evidence files. Neither is a runtime system to delete from the game.

## jscpd

Command, from a clean worktree of each SHA: `npx --yes jscpd . --min-tokens 30 --min-lines 5 --reporters json`.

| Tree | SHA | Sources | Lines | Clones | Duplicated lines | Percent |
| --- | --- | --- | --- | --- | --- | --- |
| Named main | `f05d3d0` | 354 | 127873 | 1418 | 46883 | 36.66% |
| PR #94 | `5d82965` | 362 | 134768 | 1548 | 49961 | 37.07% |
| PR #111 | `54199cb` | 355 | 128085 | 1420 | 46844 | 36.57% |

Duplicated lines on `f05d3d0` by bucket: world mirror 20421, test-results 10366, planner JSON 6623, car-model copy 3845, tools/dev build 2865, other 2272.

Largest pairs on `f05d3d0` (sum of clone fragments):

| Lines | Pair |
| --- | --- |
| 3910 | `test/world/dance-stage.js` <> `world/dance-stage.js` |
| 3845 | `shared/car-model.js` <> `test/shared/car-model.js` |
| 3440 | `test/planner/objects/catalog.json` with itself |
| 2961 | `test/world/neon-paint.js` <> `world/neon-paint.js` |
| 2799 | `test/planner/objects/sets.json` with itself |
| 2089 | `test/world/icon-garage.js` <> `world/icon-garage.js` |
| 1827 | `test/world/detail.js` <> `world/detail.js` |
| 1756 | `test/world/dev-builder.js` <> `world/dev-builder.js` |
| 1395 | `test/world/house.js` <> `world/house.js` |
| 891 | `test/world/crew.js` <> `world/crew.js` |
| 863 | `test/world/traffic.js` <> `world/traffic.js` |
| 749 | `test/world/soccer.js` <> `world/soccer.js` |
| 670 | `tools/dev/dist/character.js` <> `tools/dev/src/character.js` |
| 549 | `test/world/interior-builder.js` <> `world/interior-builder.js` |
| 537 | `tools/dev/dist/car.js` <> `tools/dev/src/car.js` |
| 446 | `test/world/input.js` <> `world/input.js` |
| 293 | `world-split.html` <> `world.html` |

On #94 the traffic pair is 1211 lines and dev-builder is 1760. On #111 the traffic pair is 828 and the rest of the top of the table matches `f05d3d0`. #111 does not add a new large clone pair. #94 does.

Files in `world/` with no twin under `test/world/` at `f05d3d0`: `city-layout.js`, `gl-city.js`, `house-styles.js`, `interior-try.js`, `nos-station.js`, `resume-safe.js`. `test/world/` adds `drive-shot.js`.

## Per system

Line counts are `f05d3d0`.

### Interiors and walk-in

Live files: `world/house.js` 1368, `world/interior-builder.js` 554, `world/interior-try.js` 486, `world/detail.js` 1919, `world/planner-tools.js` 272, `world/dev-builder.js` 1773, `world/house-styles.js`.

`WALK_INDOOR` purposes include HOME, SHOWROOM, NEON_PAINT, GARAGE, DANCE, PETS, CAFE, ARCADE, BUILDER, SOCCER. Some purposes launch another page (`neon-paint.html`, `dance-stage.html`, `jr.html#garage`, `crew.html`).

`walkShowInterior` in `house.js` calls `DETAIL.loadInterior`. `interior-builder.js` wraps `walkShowInterior`. `interior-try.js` is a second room painter gated on `?interiorTry=1`, save key `zdash.interior.try.v1`, and it does not write the kid save. `dev-builder.js` is the DEV map editor, key `zdash.city.editor.v1`. Its header limits live drive edits to `/test/`. `planner-tools.js` header says to load the file and not copy it.

Dead or competing: the second enter path in `input.js`; `walkCrewBuf` chroma-key blit; four painters; every PR that adds another builder file (see top 10).

Who added the pile: home stack #57 #60 #65 #70, sampler #81, room hook #87, Ellie builder #92, interiors review #74, doors #71 #77, torso #75, humanoid #58. The legacy `insideBuilding` path was already on `f05d3d0` before those PRs.

### Traffic

Live: `world/traffic.js` 1217, `shared/traffic-tune.js`, `world/towdrive.js`, `world/towtruck.js`. Header on the live file: every traffic car is the player's 370Z, the graph is cloned once, sprites are baked, lanes come from `CITY.ROADS`. A meeting slows the car. The test copy's header still talks about a hit wrecking the traffic car.

`world/towtruck.js` line 76 creates a second WebGL renderer with `antialias: true`. `world/traffic.js` `photoR` (about line 937) creates another renderer and copies the car context's antialias.

Kid chase `wKnock` / `wFlip` lives in `jr.html`, not in live `world/traffic.js`.

PRs: #35 superseded by later traffic work, #53 tow pin, #73 plan, #78 large rewrite, #93 LOD experiment, #97 rules, #111 the current head. #56 and #64 also touch `traffic.js`.

### On-foot walking and camera

`world/house.js` owns `WALK_MODE`. `world/camera.js` 283 owns projection and the device buffer. `world/crew.js` 895 and `world/crew-data.js` own the person and pet. `shared/crew-state.js` is the shared save side.

`world/flight.js` is 4 lines (`FLYCAM` and a rotation bar). It is not a second physics step.

Competing camera work: #38 (enter from the top bar, already absorbed into the two enter buttons), #55 pet camera flip inside `dance-stage.js`, #56 iPad resize, #64 buffer clamp, #65 pet on the garage turntable (`world/garage-pet.js`), #70 room preview (`world/room-preview.js`).

### Car physics and flight

`world/phys-ground.js` 186 is the ground step, and it still draws NOS sparks with `shadowBlur`. `world/phys-air.js` 104 is the air step (`step` near line 55). `world/state.js` holds `P`. `shared/car-draw.js` draws the sprite. `shared/car-model.js` 3845 is the vendored car and three.js, and the game renderer is constructed with `antialias: true`. `world/garage.js` is 28 lines, a color catalog from `zdash.kid.v1`. `world/garagez.js` is the small Z garage helper. `world/icon-garage.js` 2089 is the kid menu, not the physics.

`shared/physics.js` 131 is unreferenced. PR #45 is one stale line on `phys-ground.js` and does not remove the sparks that are still there. PR #44 piles wing color into `input.js`. PR #110 edits `car-draw.js` and both HTML files to stop a high-speed sprite stall.

### HUD and buttons

See the gaps section. Short version: DOM buttons and a canvas HUD together, plus two ENTER buttons. `world/hud.js` is 326 lines. Phone FPS is canvas text inside `drawHud`. Desktop uses `#pcFps`. `shared/fps-counter.js` (190) refuses to draw on Neon World when those files are present. `adventure.html` line 68 already includes `shared/fps-counter.js`.

### Menus and garage

`jr.html` is the kid app (13839 lines) and includes its own driver bundle. `index.html` is the adult app (12907). `world/icon-garage.js` writes the kid, house, character, pet, crew, paint, and vinyl keys. `world/neon-paint.js` also migrates vinyl keys. Two writers.

PR #50 edits live `jr.html` and `index.html` and is 65 behind. PR #83 is the later kid-settings attempt and only changes `test/`, including a copied `test/driver/` tree. PR #49 touches `index.html` for fullscreen. PR #72 adds a dashboard tile on `test/jr.html` only. PR #80 adds idle Spotify/OBD on `/test/` only.

### Paint

`world/neon-paint.js` is 2961 lines and has a 2961-line twin in `test/world/`. `neon-paint.html` is the page. DPR there is `min(1.5, devicePixelRatio)` off iPad. PR #71 opens it from the building and edits `house.js`, `input.js`, and both Neon pages.

### Buildings and city

Live picture is `world/city-draw.js`. Layout is `world/city.js` plus `world/city-layout.js`. `world/gl-city.js` is 753 lines, WebGL1, `antialias: false` at line 258, gated on `?gl=1`. Default play stays on the 2D canvas.

PR #59 adds the same `gl-city.js` the tree already has, 62 behind, 458 files, almost all test-results. PR #91 edits `gl-city.js` +272/−118 on top of the boulevard branch. PR #68 is the Option 1 plan; `city-layout.js` is already on `f05d3d0`. PR #96 edits live `city-draw.js` and `boot.js` with five road experiments. PR #34 edits city draw, city, and ramps for signs and parking, 124 behind. PR #17's dome work is already in `world/soccer.js`, 153 behind.

### FPS guards

`world/camera.js` `resize()` is the Neon World table:

- iPad (touch, and short ≥ 680 and long ≥ 900, or an iPad UA): DPR 1, area cap 1440×1080, CSS-scaled.
- Phone: DPR `min(devicePixelRatio, 2)`, buffer equals the CSS viewport.
- Desktop (no touch, width > 1024): DPR 1, area cap 1280×720.

`shared/detail-tune.js` (49) holds the shape budgets. `world/boot.js` (103) is the frame. `world/detail.js` skips the on-foot pass while `insideBuilding` is set.

PR #36, #51, #52, and #62 are older benches or notes. The detail gate and the camera caps are already on `f05d3d0`. PR #56 and #64 still edit the live buffer, HUD, house, and traffic together. PR #109 adds the FPS script to `adventure.html`, which already has it.

`shadowBlur` occurrences on `f05d3d0` under `world/` (the identifier, including zeros): dance-stage 56, city-draw 21, hud 19, neon-paint 19, towtruck 5, soccer 4, house 3, boot 2, objectives 2, phys-ground 2, interior-try 1, planner-tools 1, dev-builder 1. `shared/physics.js` has 1. Test copies mirror these. The standing rule is no new `shadowBlur`. This audit does not remove the old ones.

### Save and resume

`world/resume-safe.js` (140), key `zdash.world.resume.v1`. The file comment still says the safe spawn exists while PR #79 is open. #79 is how that file landed; the branch is now 56 behind. House keys include `zdash.house.v1` and `zdash.kid.v1`. Interior builder uses `zdash.interior.layout.v1`. DEV builder uses `zdash.city.editor.v1`. Interior-try uses `zdash.interior.try.v1`. `world/state.js` uses `zdw_start`. HUD uses `zdw_rwxray`. Vinyl keys are written from both `neon-paint.js` and `icon-garage.js`.

### DEV builder and planner port

`world/planner-tools.js` is the narrow API (`PLANNER_TOOLS`, 272). `world/interior-builder.js` is the room layout (`INTERIOR_BUILDER`, 554). `world/dev-builder.js` is the map editor (1773). `test/planner/` is a copied planner app, and its catalog JSON is the self-clone in the jscpd table. `8135fd9` swaps that bundle and edits `test/world/interior-builder.js` (+1248) and `test/world/traffic.js`.

PR #82 adds a second stand-in app at `test/planner-port/` because the private planner repo could not be read. PR #94 retargets `/test/` again (65 files, test tree only) after `8135fd9` already published one preview. PR #105 re-adds the Dev Test Tools hub that `f05d3d0` already is. PR #112 is a plan for an Adventure sandbox and must call the builder API.

### Adventure World

`adventure/app.js` is 30720 lines. `adventure/src/main.js` is 1623. Both are on `f05d3d0`. PR #95 adds another copy of the page, the bundle, and `main.js`, 56 behind. PR #90 and #112 are plans. PR #109's one-line FPS include is already on the page.

## HUD, DPR, antialias, allocations

Gaps only. No patch is proposed in this PR.

**Buttons today are both DOM and canvas.** DOM in `world.html`: `#wng`, `#brk`, `#ebpad`, `#tup`, `#nos`, `#kMenuB`, `#ready`, plus the pause menu `#kHome`. `world/input.js` creates `#exitCarBtn`, `#enterBldBtn`, `#emoteBtn`. `world/house.js` creates its own ENTER / EXIT button. Canvas `drawHud` draws the minimap, the tilt box, the MPH dial, altitude, throttle, and status. A DOM-only overlay is proposed in `AGENTS.md` and is not approved.

**DPR is per device, and the table is not one table.** Neon World uses `world/camera.js` as written above (phone cap 2, iPad cap 1 with an area cap, desktop cap 1 with an area cap). Neon Paint uses 1.5 off iPad. The dance stage uses 2 off iPad. An outside draft's "DPR 1.5 on mobile" matches only `neon-paint.js`.

**Antialias is off for the optional city GL and on for the car.** `world/gl-city.js` sets `antialias: false`. `shared/car-model.js` sets `antialias: true` on the 370Z renderer (three.js's own default in that file is false; the car constructor overrides it). `towtruck.js` and traffic `photoR` open more contexts. Dev tools under `tools/dev/src/` use `antialias: false`. The planner preview path uses `antialias: true`.

**Per-frame allocations that are still open:**

- `world/boot.js` assigns `items = []` every frame. The sky gradient is cached when `gkey` changes, so that gradient is not a per-frame allocation.
- `world/hud.js` builds a linear gradient for the MPH panel inside `drawHud`.
- `world/house.js` `walkPaintCrew` calls `getImageData` on every interior paint. The offscreen canvas itself is allocated once.
- `towtruck.js` and traffic `photoR` are extra WebGL contexts, created lazily and then kept.
- `world/detail.js` float buffers are built when the interior bakes, not on every city frame.

**Phone FPS is not the shared pill.** `drawHud` paints the phone number on the canvas. iPad draws it inside the telemetry bubble. Desktop updates `#pcFps`. `shared/fps-counter.js` sees `#pcFps` or `world/hud.js` or `world/boot.js` and skips. A labeled "FPS top-right" screenshot on a phone has to show that canvas number, or a future pass has to move it. This audit does not move it.

**Input is mixed.** Pointer and touch listeners are both attached, with a time guard so a touch does not double-fire. Pointer Events only is a proposed rule. `#enterBldBtn` is 44px tall (52px in pc-mode). The proposed minimum is 48px. `touch-action: none` is already on `html`, `body`, the canvas, and `.kround`, and some `.kround` rules also set `manipulation`.

## Slim path

Each row is a proposal. Risk and FPS are the reason to stop after one system and wait for a Galaxy and an iPad.

| System | Keep | Delete in the same change | Risk | FPS |
| --- | --- | --- | --- | --- |
| Enter / interiors | `WALK_MODE` in `house.js`, `PLANNER_TOOLS`, `INTERIOR_BUILDER` | `input.js` `safeEnterDoor`, `installSafeEnter`, and `#enterBldBtn` once `house.js` owns the button. Stop adding `ellie-builder.js`, `style-sampler.js`, `planner-props.js`, `interiors-review.js`, `walk-items.js`. | `enterDoor` is load-order sensitive. Interior-builder, dance-stage, and icon-garage all wrap `walkShowInterior` or `enterDoor`. | One interior canvas. The crew `getImageData` blit leaves with the old painter. |
| Builder port | `planner-tools.js`, `interior-builder.js`, `dev-builder.js` on `/test/` | The second app in #82 and the second planner-tools in #92. Do not hand-merge `test/world/` back into `world/`. | One `/test/` publisher. `8135fd9` and #94 both claim that preview. | Forking the builder onto the live frame duplicates `dev-builder.js` (1773) and the room painter. |
| Traffic | `world/traffic.js` as continued by #111 | Extra WebGL contexts in towtruck and `photoR` when that pass is allowed. Do not add `next-traffic-lod.js`. Do not land #78 or #97 beside #111. | #111 also touches `car-draw.js`, `boot.js`, and `world.html`, so #110 and #64 collide with it. | A second renderer is a context, not a sprite. #111's own title drops the extra context while driving. |
| Vehicle | `phys-ground.js` and `phys-air.js` | Stop loading `shared/physics.js`. Sparks in `phys-ground.js` come out only when the drive owner does that pass. | #45 is 106 behind and is not a clean delete of the sparks that remain. | Sparks use `shadowBlur` on the ground canvas. |
| City | `city-draw.js` plus `city-layout.js` | Leave `gl-city.js` behind `?gl=1`. Do not merge #91's second look, #96's five experiments, or #89's weather script into the live list in the same week as anything else that edits `world.html`. | The script list is the merge hotspot (`?v=` bumps). | WebGL buildings plus the 2D city is two pictures. Default play should stay one. |
| Pages | Both `world.html` and `world-split.html` | One shared script list, versions aligned with `ZD_WORLD`. Do not delete either page. | A one-sided script tag is how weather and doors have been conflicting. | Duplicate script tags double-init the frame. |
| Kid shell | `jr.html`, `icon-garage.js`, `neon-paint.js`, `resume-safe.js` | Do not copy `test/driver/` up into the live kid page. Do not edit `index.html` from a kid pass. | Vinyl and kid keys have two writers. | `jr.html` is a 13839-line bundle. A second three.js beside it is the #83 copy. |
| Adventure | The copy already on `f05d3d0` | #95's diverged bundle. Call `PLANNER_TOOLS` from Adventure. Do not paste the builder in. | #95 is 56 behind and would replace a 30720-line file. | `fps-counter.js` is already on `adventure.html`. |
| FPS guard | `camera.js` caps, `detail-tune.js`, `fps-counter.js` skip | Per-frame `items = []` in `boot.js` and the HUD gradient, when that pass owns the file. No new `shadowBlur`. | Changing DPR changes HUD hit coordinates. Pointer code uses CSS pixels and `getBoundingClientRect` so the cap can stay, but a new cap still needs a phone test. | The win is fewer canvases and fewer GL contexts, not a lower number written into a new file. |

## Roster

Eight owners. Checkers sit with the owner they test. They are not a ninth agent. Suffixes on old branches (`cbd5` builder, `2bdb` traffic, `9e5c` FPS and kid settings, `52cf` adventure, `ef23` city, `039c` next world, `c773` weather, `52fc` interiors, `58d4` webgl, `b88c` integration) fold into the owner below.

1. **Neon Drive.** Physics, flight offsets, chase cam, car-draw, driving input, driving HUD. Folds #44, #45, #110, and the buffer half of #64. Checker #84 (car design) sits here.
2. **Neon City.** `city-layout.js`, `city-draw.js`, `gl-city.js`, `detail.js`, minimap roads. Folds #68, #59, #91, #96, #66, #69, #76, #34, #17. Checker #66 (architecture) sits here.
3. **Neon Traffic.** `traffic.js`, `traffic-tune.js`, tow. Folds #78, #97, #111, #73, #35, #53, #93. **#111 is the head to keep.** #73's "do not clone the car" idea is still open work for this owner, and the open plan PR itself is superseded.
4. **On-foot and interiors.** `house.js`, `crew.js`, `interior-builder.js`, `interior-try.js`, `house-styles.js`. Folds #57, #60, #65, #70, #81, #87, #92, #74, #38, #75, #58, #71, #77. One owner, so `enterDoor` stops being two functions. Checker #61 (anatomy) sits here.
5. **Kid shell.** `jr.html`, `icon-garage.js`, `neon-paint.js`, saves, resume, dance page. Folds #83, #80, #72, #50, #49, #79, #55, #39. Does not edit `index.html`.
6. **FPS guard.** `camera.js` caps, `detail-tune.js`, `fps-counter.js`, boot skips. Folds #56, #62, #64 (the cap, coordinated with Drive and Traffic), #52, #51, #36. One browser, five FPS pairs.
7. **Builder port.** `planner-tools.js`, `dev-builder.js`, `test/planner/`. **The only agent who publishes `/test/`.** Folds #82, #94, #105, #112. #94 conflicts with the preview already at `8135fd9`.
8. **Adventure World.** `adventure.html` and `adventure/` only. Does not edit Neon. Folds #95, #109, #90, and #112 if that plan stays a plan. Calls the builder API.

Integration checker #88 stays with whoever is checking a seam. It is not an eighth gameplay owner. This audit branch is based on that PR.

## Open PRs

62 open pull requests. Ahead/behind is versus `f05d3d0`. "Merge" means the branch is the right artifact after a rebase, and it does not add a second system. It is not permission to merge.

| PR | Mark | Reason |
| --- | --- | --- |
| [#17](https://github.com/rbeaglemedia/z-dash/pull/17) | superseded | Dome and tunnel are already in `world/soccer.js`. Branch is 153 behind. |
| [#34](https://github.com/rbeaglemedia/z-dash/pull/34) | close | Signs and parking on `city-draw.js`, `city.js`, and `ramps.js`, 124 behind. Replay onto City if Bob still wants them. |
| [#35](https://github.com/rbeaglemedia/z-dash/pull/35) | superseded | Early traffic physics. #78, #97, and #111 continued the same files. |
| [#36](https://github.com/rbeaglemedia/z-dash/pull/36) | superseded | `shared/detail-tune.js` is on `f05d3d0`. Branch is 124 behind. |
| [#37](https://github.com/rbeaglemedia/z-dash/pull/37) | superseded | Minimap work landed in `world/hud.js`. Branch is 138 behind. |
| [#38](https://github.com/rbeaglemedia/z-dash/pull/38) | superseded | Enter-from-the-top-bar is already the two ENTER buttons. The duplication is the bug. Branch is 106 behind. |
| [#39](https://github.com/rbeaglemedia/z-dash/pull/39) | superseded | `world/dance-stage.js` is already on `f05d3d0` (the 3910-line clone). Branch is 124 behind. |
| [#44](https://github.com/rbeaglemedia/z-dash/pull/44) | close | Wing color adds 119 lines to `input.js` and touches `sw.js`, 106 behind. That piles onto the enter fight. |
| [#45](https://github.com/rbeaglemedia/z-dash/pull/45) | close | One stale edit to `phys-ground.js`, 106 behind. Sparks and `shadowBlur` are still in the live file, so the job is not done. Drive owner removes them on the current file if Bob still wants that. |
| [#49](https://github.com/rbeaglemedia/z-dash/pull/49) | close | Fullscreen polish edits `index.html` and is 82 behind. Kid work stays off the adult page. |
| [#50](https://github.com/rbeaglemedia/z-dash/pull/50) | close | JR menu tiles, 65 behind, and it edits `index.html`. #83 is the later attempt, and #83 is also a close. |
| [#51](https://github.com/rbeaglemedia/z-dash/pull/51) | superseded | v28 FPS notes under `test-results/` only. Proof was never a game change. |
| [#52](https://github.com/rbeaglemedia/z-dash/pull/52) | superseded | Interior-on-entry and the camera cap are on `f05d3d0`. Branch is 65 behind and also touches traffic and car-draw. |
| [#53](https://github.com/rbeaglemedia/z-dash/pull/53) | close | Tow-pin fix is one stale commit on `towdrive.js`, 65 behind. Fold the idea into #111. Do not merge the branch. |
| [#54](https://github.com/rbeaglemedia/z-dash/pull/54) | close | Dance-stage video clip, stacked on the old dance branch, 124 behind. |
| [#55](https://github.com/rbeaglemedia/z-dash/pull/55) | close | Pet back-camera flip is `dance-stage.js` +170/−35, 62 behind. Replay the flip onto current dance-stage. Do not merge a second dance system. |
| [#56](https://github.com/rbeaglemedia/z-dash/pull/56) | conflicting | iPad FPS edits house, traffic, boot, hud, car-draw, camera, input, and detail, and adds `shared/char-closet.js`. Overlaps #111 and #64. |
| [#57](https://github.com/rbeaglemedia/z-dash/pull/57) | conflicting | Adds `world/walk-items.js` (810) beside `house.js`. |
| [#58](https://github.com/rbeaglemedia/z-dash/pull/58) | conflicting | Second humanoid via `shared/char-closet.js` beside `world/crew.js`. |
| [#59](https://github.com/rbeaglemedia/z-dash/pull/59) | superseded | `world/gl-city.js` is already on `f05d3d0`. Branch is 62 behind, 458 files, almost all test-results. |
| [#60](https://github.com/rbeaglemedia/z-dash/pull/60) | conflicting | Stacked on #57. Edits `walk-items.js` again. Cannot merge alone. |
| [#61](https://github.com/rbeaglemedia/z-dash/pull/61) | merge | Anatomy checker is `tools/anatomy-check.mjs` plus evidence. Rebase. It does not change gameplay. |
| [#62](https://github.com/rbeaglemedia/z-dash/pull/62) | merge | Advisory PERF-GUARD bench under `tools/`. Rebase. It does not change the game. |
| [#63](https://github.com/rbeaglemedia/z-dash/pull/63) | superseded | Speed and separation notes. #98 is the later split plan, and the pages are already split. |
| [#64](https://github.com/rbeaglemedia/z-dash/pull/64) | conflicting | Neon buffer edits car-draw, camera, house, hud, boot, and adds `world/res.js`, including test copies. Overlaps #111 and #56. |
| [#65](https://github.com/rbeaglemedia/z-dash/pull/65) | conflicting | Pet turntable adds `world/garage-pet.js` and edits `jr.html` and `crew.js`. Stacked on the home stack. |
| [#66](https://github.com/rbeaglemedia/z-dash/pull/66) | merge | Architecture checker, workflow, and `docs/NEON-WORLD-STYLE.md`. test-results are evidence. Rebase. |
| [#67](https://github.com/rbeaglemedia/z-dash/pull/67) | close | Idea list only (`docs/IDEAS.md`). Not a system to merge. |
| [#68](https://github.com/rbeaglemedia/z-dash/pull/68) | superseded | Option 1 plan. `city-layout.js` is on `f05d3d0`. |
| [#69](https://github.com/rbeaglemedia/z-dash/pull/69) | merge | Building-mode notes. Land after #66, because it edits `NEON-WORLD-STYLE.md`. Docs only. |
| [#70](https://github.com/rbeaglemedia/z-dash/pull/70) | conflicting | Home preview adds `world/room-preview.js` and edits `jr.html` and `crew.js`. 69 files, stacked on the home stack. |
| [#71](https://github.com/rbeaglemedia/z-dash/pull/71) | conflicting | Paint door edits `world.html`, `house.js`, `input.js`, and `neon-paint.js`. Same hotspot as the enter fight. |
| [#72](https://github.com/rbeaglemedia/z-dash/pull/72) | close | Dashboard tile is on `test/jr.html` only, not live `jr.html`. |
| [#73](https://github.com/rbeaglemedia/z-dash/pull/73) | superseded | Traffic plan. #78 and #111 continued the work. The "do not clone the 3D car" idea is not implemented. |
| [#74](https://github.com/rbeaglemedia/z-dash/pull/74) | conflicting | Adds `world/interiors-review.js` (501) beside `interior-try.js`, plus a review page. |
| [#75](https://github.com/rbeaglemedia/z-dash/pull/75) | merge | Torso depth is `world/crew.js` +122/−21. Rebase onto current crew. Do not also merge #58. |
| [#76](https://github.com/rbeaglemedia/z-dash/pull/76) | superseded | `world/nos-station.js` is on `f05d3d0`. Branch is 62 behind and also touches `index.html`. |
| [#77](https://github.com/rbeaglemedia/z-dash/pull/77) | conflicting | Garage and dance doors, stacked on #71. Edits both Neon pages, `house.js`, and `input.js`. |
| [#78](https://github.com/rbeaglemedia/z-dash/pull/78) | conflicting | `traffic.js` +873/−254 and both HTML files. Not contained in #111. Treat as a competing rewrite. |
| [#79](https://github.com/rbeaglemedia/z-dash/pull/79) | superseded | `world/resume-safe.js` is on `f05d3d0`. The file comment still names this open PR. Branch is 56 behind. |
| [#80](https://github.com/rbeaglemedia/z-dash/pull/80) | close | Idle Spotify/OBD on `/test/` only. A second `/test/` publisher. |
| [#81](https://github.com/rbeaglemedia/z-dash/pull/81) | conflicting | Adds `world/style-sampler.js` (697) and `world/planner-props.js` (267) and edits `world.html` and `house.js`. |
| [#82](https://github.com/rbeaglemedia/z-dash/pull/82) | conflicting | Second planner app under `test/planner-port/`, beside `test/planner/`. |
| [#83](https://github.com/rbeaglemedia/z-dash/pull/83) | close | Kid settings only under `test/`, with a copied `test/driver/` tree. Live gear is still the adult page. Phone UI polish already failed overlap (LOCKS over DONE). |
| [#84](https://github.com/rbeaglemedia/z-dash/pull/84) | merge | 370Z design checker under `tools/` and `docs/`. 162 of 166 files are test-results. Merge the checker. The screenshots are not a second car. |
| [#87](https://github.com/rbeaglemedia/z-dash/pull/87) | conflicting | Room-hook docs stacked on #81. Docs only, and they cannot merge alone. |
| [#88](https://github.com/rbeaglemedia/z-dash/pull/88) | merge | Integration map and checker. Docs and tools. This audit branch is based on it. |
| [#89](https://github.com/rbeaglemedia/z-dash/pull/89) | conflicting | Adds `world/weather.js` and edits the `world.html` script list. Known clash with the boulevard `?v=` list. 56 behind. |
| [#90](https://github.com/rbeaglemedia/z-dash/pull/90) | merge | Next-world plan, docs and figures only. |
| [#91](https://github.com/rbeaglemedia/z-dash/pull/91) | conflicting | `gl-city.js` +272/−118, a second building look, stacked on the boulevard branch. |
| [#92](https://github.com/rbeaglemedia/z-dash/pull/92) | conflicting | Adds `ellie-builder.js`, a second `planner-tools.js` (671), and `room-place.js` (874). Rewrites both Neon pages. |
| [#93](https://github.com/rbeaglemedia/z-dash/pull/93) | conflicting | New `shared/next-traffic-lod.js` (697) beside `world/traffic.js`. |
| [#94](https://github.com/rbeaglemedia/z-dash/pull/94) | conflicting | `/test/` walk-in. Test files only, but `8135fd9` already published a combined `/test/` preview, and #94 is not that commit. jscpd traffic mirror grew by 348 lines. One `/test/` publisher. |
| [#95](https://github.com/rbeaglemedia/z-dash/pull/95) | conflicting | Adventure bundle diverged from the copy already on `f05d3d0` (`adventure/app.js` 30720). 56 behind. |
| [#96](https://github.com/rbeaglemedia/z-dash/pull/96) | close | Five road experiments edit live `city-draw.js` and `boot.js`. Pick one on the City owner. Do not merge the experiment branch. |
| [#97](https://github.com/rbeaglemedia/z-dash/pull/97) | conflicting | Traffic rules, `traffic.js` +240/−43, both HTML files, 46 behind. Not contained in #111. |
| [#98](https://github.com/rbeaglemedia/z-dash/pull/98) | merge | Kid/adult split plan, one doc. |
| [#105](https://github.com/rbeaglemedia/z-dash/pull/105) | superseded | Dev Test Tools hub. `f05d3d0` is that hub. Branch is 23 behind and 10 ahead. |
| [#109](https://github.com/rbeaglemedia/z-dash/pull/109) | superseded | `adventure.html` on `f05d3d0` already loads `shared/fps-counter.js` (line 68). |
| [#110](https://github.com/rbeaglemedia/z-dash/pull/110) | conflicting | Car-sprite stall edits `shared/car-draw.js` and both HTML files. Fold into the drive owner. Do not merge beside #111. |
| [#111](https://github.com/rbeaglemedia/z-dash/pull/111) | merge | Traffic head to keep. Ahead 1, behind 0 of `f05d3d0`. `traffic.js` +75/−17, plus car-draw, boot, and `world.html`. jscpd traffic mirror shrank 863 to 828. Rebase onto the live tip only for the `/test/` commit, and do not take #78 with it. |
| [#112](https://github.com/rbeaglemedia/z-dash/pull/112) | merge | Exterior-builder plan, one doc. It must call the builder API and must not copy it. |

Counts: merge 11 (#61, #62, #66, #69, #75, #84, #88, #90, #98, #111, #112). Superseded 16 (#17, #35, #36, #37, #38, #39, #51, #52, #59, #63, #68, #73, #76, #79, #105, #109). Conflicting 22 (#56, #57, #58, #60, #64, #65, #70, #71, #74, #77, #78, #81, #82, #87, #89, #91, #92, #93, #94, #95, #97, #110). Close 13 (#34, #44, #45, #49, #50, #53, #54, #55, #67, #72, #80, #83, #96). 11 + 16 + 22 + 13 = 62.

#94's own headless FPS note, not re-run here: phone 844×390 20/15, Galaxy 780×360 25/25, iPad 1024×768 23/23 (buffer 662×497), PC 1366×768 19/19 (buffer 765×430). Rollback named on that PR is `f05d3d0`.

## What this PR does not do

No file under `world/`, `shared/`, `test/`, `adventure/`, or any HTML page was changed. No PR was merged or closed. `/test/` was not published. Raw jscpd JSON (about 3.6MB each) was not committed. Game suites were not run. The jscpd scan is the only check, and it ran on `f05d3d0`, `5d82965`, and `54199cb`.
