# Z-DASH pass prompts

DRAFT, same status as the root `AGENTS.md`. Paste one prompt per pass. Real paths only. Do not move files into `src/`. Do not deploy, and do not publish `/test/`, unless Bob writes the go for that exact action.

Read `AGENTS.md` and `docs/REDUNDANCY-AUDIT.md` before editing. Search for the existing module. Delete the replaced code in the same change. One system at a time. No new features during cleanup. Keep public APIs stable unless Bob approved the change.

Worlds: Neon World is `world.html` (keep `world-split.html` in parity). Adventure World is `adventure.html`. Kid app is `jr.html`. Adult app is `index.html` (kid work never edits it).

---

## 1. Cleanup

```
Z-DASH cleanup, one system only. Plan first. Write no code until Bob writes "plan approved, build it".

System this pass: <NAME ONE: enter-building | traffic | builder | city picture | vehicle | kid shell>.

Search the repo before writing. Edit the module that already owns the job, then delete the old path in the same change. No parallel file. No copy-paste into world.html, world-split.html, adventure.html, jr.html, or test/world/.

Real locations:
- Input: world/input.js, shared/steering.js, shared/tune.js
- 370Z: world/phys-ground.js, world/phys-air.js, world/flight.js, world/state.js, shared/car-draw.js, shared/car-model.js
- On-foot and pet: world/house.js (WALK_MODE), world/camera.js, world/crew.js, world/crew-data.js, shared/crew-state.js
- Builder API: world/planner-tools.js (PLANNER_TOOLS), world/interior-builder.js (INTERIOR_BUILDER), world/dev-builder.js (DEV_BUILDER). Worlds call these. Builder logic stays in these files.
- Traffic: world/traffic.js, shared/traffic-tune.js, world/towdrive.js, world/towtruck.js
- City picture: world/city-draw.js is the live 2D picture. world/gl-city.js stays behind ?gl=1.
- Loading: world/boot.js, shared/version.js, sw.js. One script list on world.html and world-split.html.

Known fights to close only if this pass owns them:
- Two enter paths set WALK_MODE.insideBuilding: walkEnterDoor in world/house.js and safeEnterDoor in world/input.js. Keep the house.js path. Delete the input.js enterDoor replacement and the second ENTER button in the same change.
- shared/physics.js is loaded by no page. Stop loading it. Do not revive it beside phys-air.js and phys-ground.js.
- Do not add walk-items.js, style-sampler.js, planner-props.js, ellie-builder.js, room-place.js, interiors-review.js, or next-traffic-lod.js beside modules that already exist.

No new features. No new shadowBlur. Kid edits do not touch index.html.
Stop after this system and wait for Bob's phone test on a Galaxy and an iPad.
Overlap check at 844×390, 780×360, 1024×768, 1366×768.
Screenshots labeled with the viewport, FPS counter top-right, same camera spots before and after.
One browser. Five FPS pairs. Name the commit sha the tests ran on.
```

---

## 2. Mobile controls

```
Z-DASH mobile controls. PROPOSED, needs Bob's yes before any control rewrite. If Bob has not written yes, stop after a written note of how the buttons work today.

Today (leave this in place until that yes):
- world.html DOM round buttons: wings (#wng), brake (#brk), e-brake (#ebpad), throttle (#tup), NOS (#nos), pause (#kMenuB), start (#ready).
- world/input.js also creates #exitCarBtn, #enterBldBtn (44px tall, 52px in pc-mode), and #emoteBtn.
- world/house.js creates a second ENTER / EXIT button. walkEnterDoor and safeEnterDoor both set insideBuilding.
- world/hud.js drawHud paints minimap, tilt, MPH, altitude, throttle, and status on the canvas. Phone FPS is canvas text in that cluster. iPad FPS is in the telemetry bubble. Desktop FPS is DOM #pcFps.
- Listeners are mixed pointerdown/move/up and touchstart/move/end, with a short guard so a touch does not fire twice.
- touch-action: none is on html, body, the canvas, and .kround. Some .kround rules also set touch-action: manipulation.

After Bob's yes, one system (the controls), in one change:
- One DOM overlay for virtual controls. Pointer Events only. Remove the paired touch listeners in the same change.
- Minimum target 48px. Virtual controls only on touch.
- touch-action: none on the page and the controls.
- Do not change the device caps in world/camera.js. iPad DPR 1 and area cap 1440×1080. Phone DPR min(devicePixelRatio, 2). Desktop DPR 1 and area cap 1280×720. Do not introduce a world DPR of 1.5.
- Do not flip shared/car-model.js antialias in this pass. That gap belongs to the FPS pass.
- Keep drawHud's instruments unless Bob asked to move them. The overlay is the buttons.

No new features. Kid edits do not touch index.html. No new shadowBlur.
Stop for Bob's Galaxy and iPad test.
Overlap at 844×390, 780×360, 1024×768, 1366×768, including empty and driving and on-foot states.
Labeled screenshots, FPS counter top-right, same spots before and after.
One browser. Five FPS pairs. Name the sha.
```

---

## 3. FPS

```
Z-DASH FPS pass, one system only. No new features. No new shadowBlur. Existing shadowBlur is debt; remove it only in the file this pass owns, in the same change as the other deletions.

Match the existing per-device caps. Do not invent a new cap.
- Neon World buffer: world/camera.js. iPad DPR 1, area cap 1440×1080, CSS-scaled. Phone DPR min(devicePixelRatio, 2). Desktop DPR 1, area cap 1280×720.
- world/neon-paint.js is min(1.5, dpr) off iPad. world/dance-stage.js is min(2, dpr) off iPad. Bring a page onto the camera.js table only when this pass owns that page.
- shared/fps-counter.js skips Neon World when #pcFps, world/hud.js, or world/boot.js is on the page. Do not stack a second pill on world.html. Phone FPS stays visible top-right. Today the phone number is canvas text inside world/hud.js drawHud, and the iPad number is inside the telemetry bubble.

Antialias, gaps only until Bob says yes on this system:
- world/gl-city.js already uses antialias: false, and it is ?gl=1 only. Live play stays on world/city-draw.js.
- shared/car-model.js constructs the 370Z renderer with antialias: true.
- world/towtruck.js opens a second renderer with antialias: true.
- world/traffic.js photoR copies the car context's antialias into another renderer.
If this pass owns traffic or the car renderer, turn mobile antialias off and delete the extra context in the same change. Otherwise leave them.

Per-frame allocations to close only in the file this pass owns:
- world/boot.js allocates a new items array every frame. The sky gradient is cached on gkey.
- world/hud.js creates a linear gradient for the MPH panel on every drawHud.
- world/house.js walkPaintCrew calls getImageData on every interior paint.
- world/detail.js Float32Arrays are built on bake, not every frame. Leave them unless this pass owns detail.

No new features. Do not copy test/world/ into world/. Kid edits do not touch index.html.
Stop for Bob's Galaxy and iPad test.
Viewports: 844×390, 780×360, 1024×768, 1366×768.
Labeled screenshots, FPS counter top-right, same camera spots before and after.
One browser. Five FPS pairs. Name the sha the samples ran on.
```
