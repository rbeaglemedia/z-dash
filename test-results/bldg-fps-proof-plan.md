# Building FPS proof — v28 baseline measured, proof not built

Status: rebased onto main `a4425e1` (v28: interiors load only on entry, near-plane clip, off-screen glow clip, car-sprite skip, traffic cache eviction). The v28 baseline below is the number to beat. No facade code, no deploy, no building-look screenshots. Waiting on Bob's screenshots and opinions.

Nothing in this branch changes the game. No `world/bldg-fps-proof.js`, no script tag. Game files match `a4425e1`.

## v28 baseline (2026-10-24)

Headless Chrome 156, one browser. Viewport 844×390, emulated DPR 3, touch, mobile UA. The page capped the canvas at DPR 2: backing store 1688×780, `pc-mode` off. CPU throttle 4×. Physics paused so the scripted path does not fight the car. Traffic still updates (about 30 alive; sprite cache sits at its 140 cap). No baked building textures, so texture-upload cost is zero.

Frame times are raw wall-clock milliseconds. The in-game HUD clamps each frame at 50 ms, so it read 20 on every route and cannot show a slower result. An earlier capture that stored that clamped step was discarded.

| Route | Avg FPS | 1% low | Worst FPS | Median frame | p90 frame | Frames | JS heap |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Street, 60 mph (26.8 m/s), x=-140, z 340→780 | 7.9 | 3.4 | 3.2 | 138 ms | 210 ms | 320 | 49 MB |
| Arcade, 90 m/s, same path | 7.9 | 4.0 | 4.0 | 136 ms | 208 ms | 92 | 42 MB |
| Flying, y=70, x=-200, z 280→920, 45 m/s | 8.2 | 3.9 | 3.7 | 137 ms | 193 ms | 276 | 43 MB |
| On foot, 3.6 m/s, past Z Company Arts | 2.6 | 1.5 | 1.5 | 389 ms | 554 ms | 434 | 66 MB |

Heap at load was 46 MB and 68 MB after the walk. No walk frame was over 1 s (worst 681 ms). 86 of 434 walk frames were over 500 ms.

The walk is the expensive route because it is the only one that turns on the existing storefront lines (speed under 12 m/s) and the on-foot detail pass (38 m). Street, arcade, and flying at these speeds leave those passes off, and they match each other. This harness (this VM plus 4× throttle) is the yardstick for a later facade test. It is not a reading of the HUD on a phone.

Full stats: `test-results/bldg-fps-baseline-v28.json`. Measured game tree: `a4425e1`.

## Do not touch

Adult `index.html`, physics, traffic, menus, and interior loading. Interiors stay with split-pc-fps. This proof, when it is built, is exterior-only on the Arts & Garage district.

## What the proof is

Cheapest version of the baked-facade plan, Arts & Garage only (`b.district === 'ARTS_GARAGE'`):

- Spawn-south edge is not included. The four district buildings are:
  - Sky-drop helipad deck, about x -232..-168, z 518..682, 62 m, roof pad, purpose SKY_DROP
  - Ellie Neon Paint, about x -336..-292, z 360..408, 14 m, purpose NEON_PAINT
  - Z Company Arts (Arts district), about x -224..-164, z 360..424, 18 m, antenna, purpose DANCE, sign face east
  - Retro Pixel Arcade, about x 264..320, z 560..624, 18 m, purpose ARCADE
- Baked facade canvases, a half-res arcade mip, and roof canvases.
- Shapes, footprints, heights, roof pads, antennas, and doors stay the meshes that already exist. Tiers only swap a pasted image.
- Z Company Arts mural wall (the sign face `neon-paint.js` already projects onto) stays a plain field with the real door hole. No window grid on that face.
- No animated signs, no pulsing glow, no per-frame blur, no shadowBlur.
- Street / arcade / flying / on-foot pick which cached image is drawn. On-foot still uses the existing `b._footSegs` pass in `world/detail.js` (38 m, on foot only). Do not double-pay storefront lines and a full texture on the same building.
- Doors stay on `b.doors` and the parking door from `placeParking`. `WALK_MODE.enterDoor` is unchanged.

## Phone setup

Headless Chrome, one browser at a time.

- Viewport 844×390 landscape (same phone box as `test-results/phone-844.json`)
- `deviceScaleFactor` 3 so the page sees a phone DPR. `world/camera.js` caps non-desktop canvases at DPR 2, so record both the emulated DPR and the real canvas backing store. Do not change that cap for the test.
- Mobile UA, touch on, so the page does not take the desktop canvas path.
- CPU throttle 4× via `Emulation.setCPUThrottlingRate`.
- `--enable-precise-memory-info` for `performance.memory`.
- Launch flags need `--no-sandbox` in this environment. Puppeteer is not installed in the repo; use puppeteer-core from a temp dir against system Google Chrome. Do not add it as a dependency.

## Routes (identical on the new main and on this branch)

Inject the route into the page by wrapping `render`. Keep `flying` false or `paused` true so `step()` does not fight the script. Advance the path on simulated time (`min(dt, 0.05)`), not wall-clock frames.

1. Street drive-by at 60 mph (26.8 m/s). `driveMode = 'street'`, ground, wings closed. Along x = -140 from z 340 toward z 780 so the pass sees Z Company Arts and the sky-drop deck.
2. Arcade drive at full speed. Same path, `driveMode = 'arcade'`, `TUNE.maxSpeed` is 90 m/s.
3. Flying pass. Wings out, off the ground, about y = 70, x = -200, z 280 toward 920.
4. On-foot walk past Z Company Arts. `WALK_MODE.onFoot`, walk speed 3.6 m/s, player east of the east face (about x = -152) looking west (yaw -π/2) so the chase camera sits behind them and sees the mural wall. Move in z across the building (about z 350..430).

Warm up off the district (runway spawn). Unlock / first bake happens on entry so the hitch is a real frame, not hidden at load.

## Numbers to report

Per route, main vs branch: average FPS, 1% low (average of the slowest 1% of frame times, then to FPS), worst-frame FPS.

Also: JS heap before and after the first district unlock, baked-canvas byte size (width × height × 4), bake CPU time, and the frame time of the unlock frame (the hitch).

Tier switches: a short cycle street → arcade → flying → on foot with a 300 ms alpha fade, then the same cycle with a hard swap. If the fade frames cost frames, drop the fade and keep the hard swap behind the speed gate (on below 25 m/s, off above 31 m/s; 62 mph sits inside).

If any route loses more than about 5 FPS versus the new main, measure a cheaper fallback on that route before recommending it. In order: 128 px canvases, one shared atlas per category instead of one canvas per building, fewer faces (cap 2), no roof canvas except while flying, bake during the loading screen instead of on unlock.

## Screenshots

Same camera spots on both builds, menu overlay hidden the same way, HUD left as the game draws it:

- Street, eye level, east face of Z Company Arts
- Street, mid-district, more than one building
- Flying, roofs of the district
- On foot, at the Arts door

## Recommendation rule

Do not ship from this branch. After the rebase and the runs, recommend the cheapest version that stays within about 5 FPS of the new main on all four routes, and say whether the unlock hitch needs to move to the loading screen.
