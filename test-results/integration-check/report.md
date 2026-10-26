# Integration check

Base: `origin/main`.

| PR | Title | Gaps | Owner |
| --- | --- | --- | --- |
| #88 | Add the kid-app integration map and checker | none | — |
| #87 | Room hook for placed furniture and screens | Script ?v= does not match ZD_WORLD 30; Cache version was not bumped | Neon World Interiors (`cursor/room-place-hook-52fc`, PR #87) |
| #86 | Minimap follows the boulevard city layout | Hidden /test preview does not load world/city-layout.js; Script ?v= does not match ZD_WORLD 31; Minimap zoom span was not updated for the new city size; Weather bands are stored and nothing draws them | Neon World minimap (split-map) (`cursor/minimap-boulevards-f039`, PR #86); Neon World minimap (split-map) (`split-map`, PR #37); No weather agent yet |
| #85 | Option 1 boulevards, NOS stations, and a fresh minimap | Hidden /test preview does not load world/city-layout.js, world/gl-city.js, world/nos-station.js, world/resume-safe.js; Adult index.html was edited; Minimap zoom span was not updated for the new city size; Weather bands are stored and nothing draws them | Neon world city layout plan (`cursor/city-boulevards-ef23`, PR #85); Neon World minimap (split-map) (`split-map`, PR #37); No weather agent yet |
| #84 | Add the 370Z design check | none | — |
| #83 | Keep adult driver code off the Kid App menu and settings | none | — |
| #82 | Planner port plan and stand-in proof | Builders, building redesigns, or a city redesign belong on a new world page; Interiors and props do not use the shared catalog | Planner Port: Builder Mode + Props (`cursor/planner-port-plan-cbd5`, PR #82); Neon World Interiors (`cursor/interiors-plan-52fc`, PR #81) |
| #81 | Style sampler: eight rooms, furnished from the planner catalog | Script ?v= does not match ZD_WORLD 30; Cache version was not bumped; Interiors do not use the shared prop catalog | Neon World Interiors (`cursor/style-sampler-52fc`, PR #81); Neon World Interiors (`cursor/interiors-plan-52fc`, PR #81) |
| #80 | Idle Kid App Spotify, OBD, and cross-app links on /test/ | none | — |
| #79 | Save Ellie's Neon World spot so she can resume a challenge | Hidden /test preview does not load world/resume.js; Cache version was not bumped | Neon World Save & Resume (`cursor/world-save-resume-b8a9`, PR #79) |
| #78 | Pose near traffic on the current photo | Script ?v= does not match ZD_WORLD 30; Cache version was not bumped | Neon World Traffic Physics (`cursor/traffic-option-b-2bdb`, PR #78) |
| #77 | Open Garage Z and the dance stage from their buildings | Script ?v= does not match ZD_WORLD 30; Cache version was not bumped | Ellie's Neon Drawing agent (`cursor/garage-dance-doors-0eec`, PR #77) |
| #76 | NOS drive-up station — canopy, two pumps, claim at the pump | JR page and world-split load different scripts; Hidden /test preview does not load world/gl-city.js, world/nos-station.js; Adult index.html was edited; Builders, building redesigns, or a city redesign belong on a new world page; Resume spots were not rechecked against the NOS pads | Neon World buildings glow WebGL (`cursor/nos-driveup-58d4`, PR #76); Neon World Save & Resume (`cursor/world-save-resume-b8a9`, PR #79) |
| #75 | Give walking characters chest and back depth | Cache version was not bumped | Neon World character + pet (`cursor/torso-depth-b5e7`, PR #75) |
| #74 | Interiors plan: a daylight room and a glow-strip room for each walk-in | before build: interiors | Neon World Interiors (`cursor/interiors-plan-52fc`, PR #81) |
| #73 | Traffic plan: pose the sprite, do not clone the 3D car | none | Neon World Traffic Physics |
| #72 | Kid App dashboard is its own menu tile | none | — |
| #71 | Open Neon Paint from its building and come back to the same world | Script ?v= does not match ZD_WORLD 30; Cache version was not bumped | Ellie's Neon Drawing agent (`cursor/neon-paint-studio-door-0eec`, PR #71) |
| #70 | Show Ellie's House on the Home menu preview | Hidden /test preview does not load world/walk-items.js; Cache version was not bumped; Interiors do not use the shared prop catalog | Show Ellie's House on the Home menu preview (`cursor/home-room-preview-aa6e`, PR #70); Neon World Interiors (`cursor/interiors-plan-52fc`, PR #81) |
| #69 | Record decided building modes and who builds each one | none | — |
| #68 | Option 1 (Boulevards) is Bob's pick | Minimap zoom span was not updated for the new city size; Boulevard roads are on PR #85; mid-session lane rebuild is still PR #78; Hidden /test preview does not load world/city-layout.js, world/gl-city.js, world/nos-station.js, world/resume-safe.js; Adult index.html was edited / before build: interiors, planner, dance, paint, crew, air, weather | Neon World Interiors (`cursor/interiors-plan-52fc`, PR #81); Planner Port: Builder Mode + Props (`cursor/planner-port-plan-cbd5`, PR #82); Ellie's Dance Stage & Camera (`split-dance`, PR #39); Ellie's Neon Drawing agent (`cursor/neon-paint-studio-door-0eec`, PR #71); Neon World character + pet (`cursor/torso-depth-b5e7`, PR #75); Neon World Air & Flight Physics (`split-phys-air`, PR #45); No weather agent yet; Neon World minimap (split-map) (`split-map`, PR #37); Neon World Traffic Physics (`cursor/traffic-option-b-2bdb`, PR #78); Neon world city layout plan (`cursor/city-boulevards-ef23`, PR #85) |
| #67 | Neon World idea list for Ellie | none | — |
| #66 | Add an architecture check for Neon World buildings | none | — |
| #65 | Show the companion pet beside Ellie's Z on the garage turntable | Hidden /test preview does not load world/walk-items.js; Cache version was not bumped; Interiors do not use the shared prop catalog | Show the companion pet beside Ellie's Z on the garage turntable (`cursor/companion-pet-turntable-aa6e`, PR #65); Neon World Interiors (`cursor/interiors-plan-52fc`, PR #81) |
| #64 | Clamp the Neon World car buffer to the city budget | Cache version was not bumped | Clamp the Neon World car buffer to the city budget (`cursor/neon-res-audit-2e8c`, PR #64) |
| #63 | Neon World speed plan and Z-DASH / JR separation plan | none | — |
| #62 | Add an advisory PERF-GUARD bench for Neon World | none | — |
| #61 | Add a headless anatomy check for torso depth, walk, and scale | none | — |
| #60 | Room prop sheet for Ellie's home | Hidden /test preview does not load world/walk-items.js; Cache version was not bumped; Interiors do not use the shared prop catalog | Room prop sheet for Ellie's home (`cursor/prop-place-menu-aa6e`, PR #60); Neon World Interiors (`cursor/interiors-plan-52fc`, PR #81) |
| #59 | WebGL buildings — purpose designs, map still separate | JR page and world-split load different scripts; Hidden /test preview does not load world/gl-city.js; Cache version was not bumped; Builders, building redesigns, or a city redesign belong on a new world page | Neon World buildings glow WebGL (`cursor/split-webgl-58d4`, PR #59) |
| #58 | Draw a jointed humanoid in a short closet | Cache version was not bumped | Draw a jointed humanoid in a short closet (`cursor/avatar-closet-b5e7`, PR #58) |
| #57 | Bright day rooms and a small walking item menu | Hidden /test preview does not load world/walk-items.js; Cache version was not bumped; Interiors do not use the shared prop catalog | Bright day rooms and a small walking item menu (`cursor/home-day-rooms-aa6e`, PR #57); Neon World Interiors (`cursor/interiors-plan-52fc`, PR #81) |
| #56 | City warm-up, sprite pacing, and a Galaxy flicker detector | Cache version was not bumped | City warm-up, sprite pacing, and a Galaxy flicker detector (`cursor/ipad-fps-9e5c`, PR #56) |
| #55 | Pet recorder opens the back camera, with a flip button | Cache version was not bumped | Pet recorder opens the back camera, with a flip button (`cursor/pet-back-camera-b5e7`, PR #55) |
| #54 | Record the improve-app compare as video with the live camera | Cache version was not bumped | Record the improve-app compare as video with the live camera (`cursor/improve-clip-video-9767`, PR #54) |
| #53 | Stop a tow truck from pinning the Z | Cache version was not bumped | Stop a tow truck from pinning the Z (`split-traffic-collide`, PR #53) |
| #52 | Load interiors on entry, clip off-screen glow, and recover the phone FPS gap | Cache version was not bumped | Load interiors on entry, clip off-screen glow, and recover the phone FPS gap (`split-pc-fps`, PR #52) |
| #51 | Notes: v28 building FPS baseline, proof not built | none | — |
| #50 | Finish the JR main menu and center kid menu tiles | Cache version was not bumped; Adult index.html was edited | Finish the JR main menu and center kid menu tiles (`split-menus`, PR #50) |
| #49 | Keep the installed app full screen across kid pages | Cache version was not bumped; Adult index.html was edited | Keep the installed app full screen across kid pages (`split-polish`, PR #49) |
| #45 | Remove the NOS exhaust sparks | Cache version was not bumped | Neon World Air & Flight Physics (`split-phys-air`, PR #45) |
| #44 | Wings color follows drive mode (held, not deployed) | Cache version was not bumped | Neon World In-Game Buttons & Controls (`split-buttons`, PR #44) |
| #43 | Stop brake marks the instant BRAKE is released | Cache version was not bumped | Stop brake marks the instant BRAKE is released (`split-ebrake`, PR #43) |
| #39 | Z Company Arts neon dance stage and camera mo-cap | Cache version was not bumped | Ellie's Dance Stage & Camera (`split-dance`, PR #39) |
| #38 | Enter and exit buildings from the top bar | Cache version was not bumped; New claim or door has no button or pause-menu update | Enter and exit buildings from the top bar (`split-walk-cam`, PR #38); Neon World In-Game Buttons & Controls (`split-buttons`, PR #44) |
| #37 | Minimap: builder zone, walker, and giant dome stadium | Cache version was not bumped | Neon World minimap (split-map) (`split-map`, PR #37) |
| #36 | Speed-gate neon detail and keep pad streets clear | Cache version was not bumped | Speed-gate neon detail and keep pad streets clear (`split-detail`, PR #36) |
| #35 | Traffic physics: toned-down Z cornering and ramp launches | Cache version was not bumped | Traffic physics: toned-down Z cornering and ramp launches (`split-traffic`, PR #35) |
| #34 | Mount facade signs and add side and rear parking | Cache version was not bumped; City blocks moved and the minimap was not updated; Moved city can restore a Resume save inside a wall | Mount facade signs and add side and rear parking (`split-stunts`, PR #34); Neon World minimap (split-map) (`split-map`, PR #37); Neon World Save & Resume (`cursor/world-save-resume-b8a9`, PR #79) |
| #17 | Build a dome stadium and west tunnel around the bigger pitch | Cache version was not bumped; Soccer field moved and the minimap fallback did not | Neon World car soccer field (`split-soccer`, PR #17); Neon World minimap (split-map) (`split-map`, PR #37) |


## PR #88 Add the kid-app integration map and checker

## Integration check

Kid App cross-system pass for PR #88 — Add the kid-app integration map and checker.

Systems touched: none.

No missing dependents. Both pages, cache, and the saved-key check did not flag this diff.
Map: `docs/INTEGRATION-MAP.md`. Tool: `node tools/integration-check.js --pr 88`.


## PR #87 Room hook for placed furniture and screens

## Integration check

Kid App cross-system pass for PR #87 — Room hook for placed furniture and screens.

Systems touched: Planner props, Interiors.

### Fix on this branch

- **Script ?v= does not match ZD_WORLD 30.** Owner: Neon World Interiors (`cursor/room-place-hook-52fc`, PR #87). world.html / world-split.html advertise ?v=30, 33 while shared/version.js ZD_WORLD is 30. One token has to win, and it has to be the cache build.
- **Cache version was not bumped.** Owner: Neon World Interiors (`cursor/room-place-hook-52fc`, PR #87). Kid runtime changed (world-split.html, world.html, world/house.js, world/planner-props.js, world/style-sampler.js) and ZD_WORLD (30), ZD_BUILD_STAMP, and the sw.js VERSION line match main. Bump shared/version.js so world-split-v and the zdash- cache names move.

Map: `docs/INTEGRATION-MAP.md`. Tool: `node tools/integration-check.js --pr 87`.


## PR #86 Minimap follows the boulevard city layout

## Integration check

Kid App cross-system pass for PR #86 — Minimap follows the boulevard city layout.

Systems touched: sw.js cache, Layout, Minimap / HUD.

### Fix on this branch

- **Hidden /test preview does not load world/city-layout.js.** Owner: Neon World minimap (split-map) (`cursor/minimap-boulevards-f039`, PR #86). test/world.html and test/world-split.html do not reference world/city-layout.js. The JR preview and the live JR page would disagree.
- **Script ?v= does not match ZD_WORLD 31.** Owner: Neon World minimap (split-map) (`cursor/minimap-boulevards-f039`, PR #86). world.html / world-split.html advertise ?v=30, 31 while shared/version.js ZD_WORLD is 31. One token has to win, and it has to be the cache build.
- **Minimap zoom span was not updated for the new city size.** Owner: Neon World minimap (split-map) (`split-map`, PR #37). world/hud.js changed with the layout, and shared/minimap-tune.js did not. spanFar is still 3400 m. Option 1 runs past that (highway to z 3000, track to x -1620, homestead south of z -660), so the altitude map crops the city. Neon World minimap (split-map) (`split-map`, PR #37) owns that tune file.
- **Weather bands are stored and nothing draws them.** Owner: No weather agent yet. The layout data lists Sand, Fog, and Rain rectangles and marks them not built. There is no world/weather.js and no weather branch. Air physics, the minimap, and traffic have no weather hook yet. No agent owns this.

Map: `docs/INTEGRATION-MAP.md`. Tool: `node tools/integration-check.js --pr 86`.


## PR #85 Option 1 boulevards, NOS stations, and a fresh minimap

## Integration check

Kid App cross-system pass for PR #85 — Option 1 boulevards, NOS stations, and a fresh minimap.

Systems touched: Soccer, sw.js cache, Layout, Interiors, Minimap / HUD, Buttons, NOS stations, Resume save, Traffic.

### Fix on this branch

- **Hidden /test preview does not load world/city-layout.js, world/gl-city.js, world/nos-station.js, world/resume-safe.js.** Owner: Neon world city layout plan (`cursor/city-boulevards-ef23`, PR #85). test/world.html and test/world-split.html do not reference world/city-layout.js, world/gl-city.js, world/nos-station.js, world/resume-safe.js. The JR preview and the live JR page would disagree.
- **Adult index.html was edited.** Owner: Neon world city layout plan (`cursor/city-boulevards-ef23`, PR #85). Kid App work does not change adult index.html. The kid build stamp lives in shared/version.js. Revert the adult page unless Bob has already accepted that hunk.
- **Minimap zoom span was not updated for the new city size.** Owner: Neon World minimap (split-map) (`split-map`, PR #37). world/hud.js changed with the layout, and shared/minimap-tune.js did not. spanFar is still 3400 m. Option 1 runs past that (highway to z 3000, track to x -1620, homestead south of z -660), so the altitude map crops the city. Neon World minimap (split-map) (`split-map`, PR #37) owns that tune file.
- **Weather bands are stored and nothing draws them.** Owner: No weather agent yet. The layout data lists Sand, Fog, and Rain rectangles and marks them not built. There is no world/weather.js and no weather branch. Air physics, the minimap, and traffic have no weather hook yet. No agent owns this.

Checked and left as-is:

- Traffic lanes rebuild from CITY.ROADS on the next page load. They do not refresh mid-session (no roadsSig). That is enough for a full reload and not enough for builder-mode road edits.
- Hot Drop still uses CITY.ROADS, so the beacon follows the new streets without a second coordinate list.
- Both world pages must gain any new script together. Adult index.html stays untouched.

Map: `docs/INTEGRATION-MAP.md`. Tool: `node tools/integration-check.js --pr 85`.


## PR #84 Add the 370Z design check

## Integration check

Kid App cross-system pass for PR #84 — Add the 370Z design check.

Systems touched: none.

No missing dependents. Both pages, cache, and the saved-key check did not flag this diff.
Map: `docs/INTEGRATION-MAP.md`. Tool: `node tools/integration-check.js --pr 84`.


## PR #83 Keep adult driver code off the Kid App menu and settings

## Integration check

Kid App cross-system pass for PR #83 — Keep adult driver code off the Kid App menu and settings.

Systems touched: none.

No missing dependents. Both pages, cache, and the saved-key check did not flag this diff.
Map: `docs/INTEGRATION-MAP.md`. Tool: `node tools/integration-check.js --pr 83`.


## PR #82 Planner port plan and stand-in proof

## Integration check

Kid App cross-system pass for PR #82 — Planner port plan and stand-in proof.

Systems touched: Planner props.

### Fix on this branch

- **Builders, building redesigns, or a city redesign belong on a new world page.** Owner: Planner Port: Builder Mode + Props (`cursor/planner-port-plan-cbd5`, PR #82). After the Option 1 Boulevards bundle, world.html and world-split.html take bug fixes, FPS fixes, Ellie's interiors, and the planner drop-objects placement tool. This PR adds builders and building redesign. This branch does not add the new page yet, so that part still points at the frozen Neon World. Build that part on a new world page, and keep Ellie's shared save keys (zdash.kid.v1, zdash.house.v1, zdash.char.v1, zdash.pet.v1, zdash.crew.v1, zdash.neonpaint.v1, zdash_vinyls_v1, zdash_neon_paint_v1, zdash_garage_v1, zdash_paint3d_v1, zdash.customdance.v1, zdash.petdance.v1).
- **Interiors and props do not use the shared catalog.** Owner: Neon World Interiors (`cursor/interiors-plan-52fc`, PR #81). The prop list is on this branch and world/house.js, world/detail.js, world/walk-items.js, world/style-sampler.js do not reference PROP-CATALOG or PLANNER_PROPS. Neon World Interiors (`cursor/interiors-plan-52fc`, PR #81) must place from that catalog. Planner Port: Builder Mode + Props (`cursor/planner-port-plan-cbd5`, PR #82) keeps it the only list.

Map: `docs/INTEGRATION-MAP.md`. Tool: `node tools/integration-check.js --pr 82`.


## PR #81 Style sampler: eight rooms, furnished from the planner catalog

## Integration check

Kid App cross-system pass for PR #81 — Style sampler: eight rooms, furnished from the planner catalog.

Systems touched: Interiors.

### Fix on this branch

- **Script ?v= does not match ZD_WORLD 30.** Owner: Neon World Interiors (`cursor/style-sampler-52fc`, PR #81). world.html / world-split.html advertise ?v=30, 31 while shared/version.js ZD_WORLD is 30. One token has to win, and it has to be the cache build.
- **Cache version was not bumped.** Owner: Neon World Interiors (`cursor/style-sampler-52fc`, PR #81). Kid runtime changed (world-split.html, world.html, world/house.js, world/style-sampler.js) and ZD_WORLD (30), ZD_BUILD_STAMP, and the sw.js VERSION line match main. Bump shared/version.js so world-split-v and the zdash- cache names move.
- **Interiors do not use the shared prop catalog.** Owner: Neon World Interiors (`cursor/interiors-plan-52fc`, PR #81). This branch changes interiors or walk-in props and does not reference docs/planner/PROP-CATALOG.json. Planner Port: Builder Mode + Props (`cursor/planner-port-plan-cbd5`, PR #82) owns the catalog (PR #82). Neon World Interiors (`cursor/interiors-plan-52fc`, PR #81) has to place sofas, counters, and kit pieces from it instead of a second size list.

Map: `docs/INTEGRATION-MAP.md`. Tool: `node tools/integration-check.js --pr 81`.


## PR #80 Idle Kid App Spotify, OBD, and cross-app links on /test/

## Integration check

Kid App cross-system pass for PR #80 — Idle Kid App Spotify, OBD, and cross-app links on /test/.

Systems touched: none.

No missing dependents. Both pages, cache, and the saved-key check did not flag this diff.
Map: `docs/INTEGRATION-MAP.md`. Tool: `node tools/integration-check.js --pr 80`.


## PR #79 Save Ellie's Neon World spot so she can resume a challenge

## Integration check

Kid App cross-system pass for PR #79 — Save Ellie's Neon World spot so she can resume a challenge.

Systems touched: Resume save, Layout, Minimap / HUD, Paint and garage, Objectives / Hot Drop.

### Fix on this branch

- **Hidden /test preview does not load world/resume.js.** Owner: Neon World Save & Resume (`cursor/world-save-resume-b8a9`, PR #79). test/world.html and test/world-split.html do not reference world/resume.js. The JR preview and the live JR page would disagree.
- **Cache version was not bumped.** Owner: Neon World Save & Resume (`cursor/world-save-resume-b8a9`, PR #79). Kid runtime changed (world-split.html, world.html, world/boot.js, world/city.js, world/hud.js, world/icon-garage.js, world/objectives.js, world/resume.js, …) and ZD_WORLD (30), ZD_BUILD_STAMP, and the sw.js VERSION line match main. Bump shared/version.js so world-split-v and the zdash- cache names move.

Map: `docs/INTEGRATION-MAP.md`. Tool: `node tools/integration-check.js --pr 79`.


## PR #78 Pose near traffic on the current photo

## Integration check

Kid App cross-system pass for PR #78 — Pose near traffic on the current photo.

Systems touched: Traffic.

### Fix on this branch

- **Script ?v= does not match ZD_WORLD 30.** Owner: Neon World Traffic Physics (`cursor/traffic-option-b-2bdb`, PR #78). world.html / world-split.html advertise ?v=30, 31 while shared/version.js ZD_WORLD is 30. One token has to win, and it has to be the cache build.
- **Cache version was not bumped.** Owner: Neon World Traffic Physics (`cursor/traffic-option-b-2bdb`, PR #78). Kid runtime changed (shared/traffic-tune.js, world-split.html, world.html, world/traffic.js) and ZD_WORLD (30), ZD_BUILD_STAMP, and the sw.js VERSION line match main. Bump shared/version.js so world-split-v and the zdash- cache names move.

Map: `docs/INTEGRATION-MAP.md`. Tool: `node tools/integration-check.js --pr 78`.


## PR #77 Open Garage Z and the dance stage from their buildings

## Integration check

Kid App cross-system pass for PR #77 — Open Garage Z and the dance stage from their buildings.

Systems touched: Dance, Paint and garage, Interiors, Buttons.

### Fix on this branch

- **Script ?v= does not match ZD_WORLD 30.** Owner: Ellie's Neon Drawing agent (`cursor/garage-dance-doors-0eec`, PR #77). world.html / world-split.html advertise ?v=30, 32, 34, 31 while shared/version.js ZD_WORLD is 30. One token has to win, and it has to be the cache build.
- **Cache version was not bumped.** Owner: Ellie's Neon Drawing agent (`cursor/garage-dance-doors-0eec`, PR #77). Kid runtime changed (dance-stage.html, jr.html, neon-paint.html, world-split.html, world.html, world/dance-stage.js, world/house.js, world/input.js, …) and ZD_WORLD (30), ZD_BUILD_STAMP, and the sw.js VERSION line match main. Bump shared/version.js so world-split-v and the zdash- cache names move.

Map: `docs/INTEGRATION-MAP.md`. Tool: `node tools/integration-check.js --pr 77`.


## PR #76 NOS drive-up station — canopy, two pumps, claim at the pump

## Integration check

Kid App cross-system pass for PR #76 — NOS drive-up station — canopy, two pumps, claim at the pump.

Systems touched: sw.js cache, NOS stations, Layout, Interiors, Buttons, Traffic.

### Fix on this branch

- **JR page and world-split load different scripts.** Owner: Neon World buildings glow WebGL (`cursor/nos-driveup-58d4`, PR #76). world.html is the page the JR menu opens. only on world-split.html: world/gl-city.js. Both pages have to load the same kid scripts.
- **Hidden /test preview does not load world/gl-city.js, world/nos-station.js.** Owner: Neon World buildings glow WebGL (`cursor/nos-driveup-58d4`, PR #76). test/world.html and test/world-split.html do not reference world/gl-city.js, world/nos-station.js. The JR preview and the live JR page would disagree.
- **Adult index.html was edited.** Owner: Neon World buildings glow WebGL (`cursor/nos-driveup-58d4`, PR #76). Kid App work does not change adult index.html. The kid build stamp lives in shared/version.js. Revert the adult page unless Bob has already accepted that hunk.
- **Builders, building redesigns, or a city redesign belong on a new world page.** Owner: Neon World buildings glow WebGL (`cursor/nos-driveup-58d4`, PR #76). After the Option 1 Boulevards bundle, world.html and world-split.html take bug fixes, FPS fixes, Ellie's interiors, and the planner drop-objects placement tool. This PR adds building redesign. This branch wires it into world.html and world-split.html. Take that part off the frozen pages. Build that part on a new world page, and keep Ellie's shared save keys (zdash.kid.v1, zdash.house.v1, zdash.char.v1, zdash.pet.v1, zdash.crew.v1, zdash.neonpaint.v1, zdash_vinyls_v1, zdash_neon_paint_v1, zdash_garage_v1, zdash_paint3d_v1, zdash.customdance.v1, zdash.petdance.v1).

### Sibling branch

- **Resume spots were not rechecked against the NOS pads.** Owner: Neon World Save & Resume (`cursor/world-save-resume-b8a9`, PR #79). The station adds collision on NOS buildings. Resume is not on this branch. Neon World Save & Resume (`cursor/world-save-resume-b8a9`, PR #79) has to re-resolve saved spots (mapStamp / spotClear) so a car is not restored inside a pump.

Map: `docs/INTEGRATION-MAP.md`. Tool: `node tools/integration-check.js --pr 76`.


## PR #75 Give walking characters chest and back depth

## Integration check

Kid App cross-system pass for PR #75 — Give walking characters chest and back depth.

Systems touched: Characters and pets.

### Fix on this branch

- **Cache version was not bumped.** Owner: Neon World character + pet (`cursor/torso-depth-b5e7`, PR #75). Kid runtime changed (world/crew.js) and ZD_WORLD (30), ZD_BUILD_STAMP, and the sw.js VERSION line match main. Bump shared/version.js so world-split-v and the zdash- cache names move.

Map: `docs/INTEGRATION-MAP.md`. Tool: `node tools/integration-check.js --pr 75`.


## PR #74 Interiors plan: a daylight room and a glow-strip room for each walk-in

## Integration check

Kid App cross-system pass for PR #74 — Interiors plan: a daylight room and a glow-strip room for each walk-in.

Systems touched: Interiors.

### Before this plan is built

The plan itself does not ship game code. These owners still have no update for it:

- **Interiors do not use the shared prop catalog.** Owner: Neon World Interiors (`cursor/interiors-plan-52fc`, PR #81). This branch changes interiors or walk-in props and does not reference docs/planner/PROP-CATALOG.json. Planner Port: Builder Mode + Props (`cursor/planner-port-plan-cbd5`, PR #82) owns the catalog (PR #82). Neon World Interiors (`cursor/interiors-plan-52fc`, PR #81) has to place sofas, counters, and kit pieces from it instead of a second size list.

Map: `docs/INTEGRATION-MAP.md`. Tool: `node tools/integration-check.js --pr 74`.


## PR #73 Traffic plan: pose the sprite, do not clone the 3D car

## Integration check

Kid App cross-system pass for PR #73 — Traffic plan: pose the sprite, do not clone the 3D car.

Systems touched: Traffic.

No missing dependents. Both pages, cache, and the saved-key check did not flag this diff.
Map: `docs/INTEGRATION-MAP.md`. Tool: `node tools/integration-check.js --pr 73`.


## PR #72 Kid App dashboard is its own menu tile

## Integration check

Kid App cross-system pass for PR #72 — Kid App dashboard is its own menu tile.

Systems touched: none.

No missing dependents. Both pages, cache, and the saved-key check did not flag this diff.
Map: `docs/INTEGRATION-MAP.md`. Tool: `node tools/integration-check.js --pr 72`.


## PR #71 Open Neon Paint from its building and come back to the same world

## Integration check

Kid App cross-system pass for PR #71 — Open Neon Paint from its building and come back to the same world.

Systems touched: Paint and garage, Interiors, Buttons.

### Fix on this branch

- **Script ?v= does not match ZD_WORLD 30.** Owner: Ellie's Neon Drawing agent (`cursor/neon-paint-studio-door-0eec`, PR #71). world.html / world-split.html advertise ?v=30, 31 while shared/version.js ZD_WORLD is 30. One token has to win, and it has to be the cache build.
- **Cache version was not bumped.** Owner: Ellie's Neon Drawing agent (`cursor/neon-paint-studio-door-0eec`, PR #71). Kid runtime changed (jr.html, neon-paint.html, world-split.html, world.html, world/house.js, world/input.js, world/neon-paint.js) and ZD_WORLD (30), ZD_BUILD_STAMP, and the sw.js VERSION line match main. Bump shared/version.js so world-split-v and the zdash- cache names move.

Map: `docs/INTEGRATION-MAP.md`. Tool: `node tools/integration-check.js --pr 71`.


## PR #70 Show Ellie's House on the Home menu preview

## Integration check

Kid App cross-system pass for PR #70 — Show Ellie's House on the Home menu preview.

Systems touched: Characters and pets, Paint and garage, Interiors, Buttons.

### Fix on this branch

- **Hidden /test preview does not load world/walk-items.js.** Owner: Show Ellie's House on the Home menu preview (`cursor/home-room-preview-aa6e`, PR #70). test/world.html and test/world-split.html do not reference world/walk-items.js. The JR preview and the live JR page would disagree.
- **Cache version was not bumped.** Owner: Show Ellie's House on the Home menu preview (`cursor/home-room-preview-aa6e`, PR #70). Kid runtime changed (jr.html, world-split.html, world.html, world/crew.js, world/garage-pet.js, world/house.js, world/icon-garage.js, world/input.js, …) and ZD_WORLD (30), ZD_BUILD_STAMP, and the sw.js VERSION line match main. Bump shared/version.js so world-split-v and the zdash- cache names move.
- **Interiors do not use the shared prop catalog.** Owner: Neon World Interiors (`cursor/interiors-plan-52fc`, PR #81). This branch changes interiors or walk-in props and does not reference docs/planner/PROP-CATALOG.json. Planner Port: Builder Mode + Props (`cursor/planner-port-plan-cbd5`, PR #82) owns the catalog (PR #82). Neon World Interiors (`cursor/interiors-plan-52fc`, PR #81) has to place sofas, counters, and kit pieces from it instead of a second size list.

Checked and left as-is:

- world/garage-pet.js loads from jr.html. It is a menu module, so the world pages do not need it.
- world/room-preview.js loads from jr.html. It is a menu module, so the world pages do not need it.

Map: `docs/INTEGRATION-MAP.md`. Tool: `node tools/integration-check.js --pr 70`.


## PR #69 Record decided building modes and who builds each one

## Integration check

Kid App cross-system pass for PR #69 — Record decided building modes and who builds each one.

Systems touched: none.

No missing dependents. Both pages, cache, and the saved-key check did not flag this diff.
Map: `docs/INTEGRATION-MAP.md`. Tool: `node tools/integration-check.js --pr 69`.


## PR #68 Option 1 (Boulevards) is Bob's pick

## Integration check

Kid App cross-system pass for PR #68 — Option 1 (Boulevards) is Bob's pick.

Systems touched: Layout.

### Sibling branch

- **Minimap zoom span was not updated for the new city size.** Owner: Neon World minimap (split-map) (`split-map`, PR #37). world/hud.js changed with the layout, and shared/minimap-tune.js did not. spanFar is still 3400 m. Option 1 runs past that (highway to z 3000, track to x -1620, homestead south of z -660), so the altitude map crops the city. Neon World minimap (split-map) (`split-map`, PR #37) owns that tune file. The layout build is PR #85.
- **Boulevard roads are on PR #85; mid-session lane rebuild is still PR #78.** Owner: Neon World Traffic Physics (`cursor/traffic-option-b-2bdb`, PR #78). PR #85 reads CITY.ROADS, so a reload builds lanes. It has no roadsSig. Neon World Traffic Physics (`cursor/traffic-option-b-2bdb`, PR #78) owns that rebuild on PR #78.
- **Hidden /test preview does not load world/city-layout.js, world/gl-city.js, world/nos-station.js, world/resume-safe.js.** Owner: Neon world city layout plan (`cursor/city-boulevards-ef23`, PR #85). test/world.html and test/world-split.html do not reference world/city-layout.js, world/gl-city.js, world/nos-station.js, world/resume-safe.js. The JR preview and the live JR page would disagree. Fix it on PR #85.
- **Adult index.html was edited.** Owner: Neon world city layout plan (`cursor/city-boulevards-ef23`, PR #85). Kid App work does not change adult index.html. The kid build stamp lives in shared/version.js. Revert the adult page unless Bob has already accepted that hunk. That edit is on PR #85.

### Still open on the plan

The boulevard build covers the live map, minimap frame, soccer, NOS, resume, buttons, and the cache bump. These owners are still not done:

- **Walk-in rooms still follow today's duplicate shops.** Owner: Neon World Interiors (`cursor/interiors-plan-52fc`, PR #81). Option 1 keeps one of each. Neon World Interiors (`cursor/interiors-plan-52fc`, PR #81) has to retarget doors when the blocks move. PR #85 already moves city doors (house.js). Room interiors are still this agent.
- **City-kit pieces (welcome arch, garage bay, NOS canopy, sky pad, snack stand) are not in the shared prop catalog on this branch.** Owner: Planner Port: Builder Mode + Props (`cursor/planner-port-plan-cbd5`, PR #82). Planner Port: Builder Mode + Props (`cursor/planner-port-plan-cbd5`, PR #82) owns docs/planner/PROP-CATALOG.json. Interiors must use that list. PR #85 does not reference the catalog either.
- **Option 1 has one dance building whose door opens the stage.** Owner: Ellie's Dance Stage & Camera (`split-dance`, PR #39). Ellie's Dance Stage & Camera (`split-dance`, PR #39) and the door branch PR #77 have to follow that single building.
- **Paint studio and Garage Z bays move to one studio and the homestead / kit bays.** Owner: Ellie's Neon Drawing agent (`cursor/neon-paint-studio-door-0eec`, PR #71). Ellie's Neon Drawing agent (`cursor/neon-paint-studio-door-0eec`, PR #71) (PR #71 and #77) has to keep WALK_PAGE and the session return key on the new doors.
- **The pet lounge becomes one homestead building.** Owner: Neon World character + pet (`cursor/torso-depth-b5e7`, PR #75). Neon World character + pet (`cursor/torso-depth-b5e7`, PR #75) does not need a new pet, and the home preview has to show the moved house.
- **The runway stays.** Owner: Neon World Air & Flight Physics (`split-phys-air`, PR #45). Sky Drop pads in the city kit still need world/landings.js heights if those pads move. Neon World Air & Flight Physics (`split-phys-air`, PR #45) confirms pads only.
- **The boulevards map hatches sand, fog, and rain.** Owner: No weather agent yet. There is no world/weather.js and no weather branch. No agent owns it yet. When it appears it also touches air, the minimap, and traffic. PR #85 stores the rectangles and still does not draw them.

Checked and left as-is:

- PR #85 (cursor/city-boulevards-ef23) is the code build of this plan. Live pages, the minimap frame, the soccer center, NOS, the resume guard, and the cache bump are on that branch. What remains is listed below.
- Hot Drop on this branch still derives its spot from CITY.ROADS. It does not need a coordinate edit inside the plan. It does need the roads themselves.
- Both world pages must gain any new script together. Adult index.html stays untouched.

Map: `docs/INTEGRATION-MAP.md`. Tool: `node tools/integration-check.js --pr 68`.


## PR #67 Neon World idea list for Ellie

## Integration check

Kid App cross-system pass for PR #67 — Neon World idea list for Ellie.

Systems touched: none.

No missing dependents. Both pages, cache, and the saved-key check did not flag this diff.
Map: `docs/INTEGRATION-MAP.md`. Tool: `node tools/integration-check.js --pr 67`.


## PR #66 Add an architecture check for Neon World buildings

## Integration check

Kid App cross-system pass for PR #66 — Add an architecture check for Neon World buildings.

Systems touched: none.

No missing dependents. Both pages, cache, and the saved-key check did not flag this diff.
Map: `docs/INTEGRATION-MAP.md`. Tool: `node tools/integration-check.js --pr 66`.


## PR #65 Show the companion pet beside Ellie's Z on the garage turntable

## Integration check

Kid App cross-system pass for PR #65 — Show the companion pet beside Ellie's Z on the garage turntable.

Systems touched: Characters and pets, Paint and garage, Interiors, Buttons.

### Fix on this branch

- **Hidden /test preview does not load world/walk-items.js.** Owner: Show the companion pet beside Ellie's Z on the garage turntable (`cursor/companion-pet-turntable-aa6e`, PR #65). test/world.html and test/world-split.html do not reference world/walk-items.js. The JR preview and the live JR page would disagree.
- **Cache version was not bumped.** Owner: Show the companion pet beside Ellie's Z on the garage turntable (`cursor/companion-pet-turntable-aa6e`, PR #65). Kid runtime changed (jr.html, world-split.html, world.html, world/crew.js, world/garage-pet.js, world/house.js, world/icon-garage.js, world/input.js, …) and ZD_WORLD (30), ZD_BUILD_STAMP, and the sw.js VERSION line match main. Bump shared/version.js so world-split-v and the zdash- cache names move.
- **Interiors do not use the shared prop catalog.** Owner: Neon World Interiors (`cursor/interiors-plan-52fc`, PR #81). This branch changes interiors or walk-in props and does not reference docs/planner/PROP-CATALOG.json. Planner Port: Builder Mode + Props (`cursor/planner-port-plan-cbd5`, PR #82) owns the catalog (PR #82). Neon World Interiors (`cursor/interiors-plan-52fc`, PR #81) has to place sofas, counters, and kit pieces from it instead of a second size list.

Checked and left as-is:

- world/garage-pet.js loads from jr.html. It is a menu module, so the world pages do not need it.

Map: `docs/INTEGRATION-MAP.md`. Tool: `node tools/integration-check.js --pr 65`.


## PR #64 Clamp the Neon World car buffer to the city budget

## Integration check

Kid App cross-system pass for PR #64 — Clamp the Neon World car buffer to the city budget.

Systems touched: Dance, Interiors, Minimap / HUD, Paint and garage, Traffic.

### Fix on this branch

- **Cache version was not bumped.** Owner: Clamp the Neon World car buffer to the city budget (`cursor/neon-res-audit-2e8c`, PR #64). Kid runtime changed (shared/car-draw.js, shared/car-model.js, world-split.html, world.html, world/boot.js, world/camera.js, world/dance-stage.js, world/house.js, …) and ZD_WORLD (30), ZD_BUILD_STAMP, and the sw.js VERSION line match main. Bump shared/version.js so world-split-v and the zdash- cache names move.

Map: `docs/INTEGRATION-MAP.md`. Tool: `node tools/integration-check.js --pr 64`.


## PR #63 Neon World speed plan and Z-DASH / JR separation plan

## Integration check

Kid App cross-system pass for PR #63 — Neon World speed plan and Z-DASH / JR separation plan.

Systems touched: none.

No missing dependents. Both pages, cache, and the saved-key check did not flag this diff.
Map: `docs/INTEGRATION-MAP.md`. Tool: `node tools/integration-check.js --pr 63`.


## PR #62 Add an advisory PERF-GUARD bench for Neon World

## Integration check

Kid App cross-system pass for PR #62 — Add an advisory PERF-GUARD bench for Neon World.

Systems touched: none.

No missing dependents. Both pages, cache, and the saved-key check did not flag this diff.
Map: `docs/INTEGRATION-MAP.md`. Tool: `node tools/integration-check.js --pr 62`.


## PR #61 Add a headless anatomy check for torso depth, walk, and scale

## Integration check

Kid App cross-system pass for PR #61 — Add a headless anatomy check for torso depth, walk, and scale.

Systems touched: none.

No missing dependents. Both pages, cache, and the saved-key check did not flag this diff.
Map: `docs/INTEGRATION-MAP.md`. Tool: `node tools/integration-check.js --pr 61`.


## PR #60 Room prop sheet for Ellie's home

## Integration check

Kid App cross-system pass for PR #60 — Room prop sheet for Ellie's home.

Systems touched: Characters and pets, Interiors, Paint and garage, Buttons.

### Fix on this branch

- **Hidden /test preview does not load world/walk-items.js.** Owner: Room prop sheet for Ellie's home (`cursor/prop-place-menu-aa6e`, PR #60). test/world.html and test/world-split.html do not reference world/walk-items.js. The JR preview and the live JR page would disagree.
- **Cache version was not bumped.** Owner: Room prop sheet for Ellie's home (`cursor/prop-place-menu-aa6e`, PR #60). Kid runtime changed (world-split.html, world.html, world/crew.js, world/house.js, world/icon-garage.js, world/input.js, world/walk-items.js) and ZD_WORLD (30), ZD_BUILD_STAMP, and the sw.js VERSION line match main. Bump shared/version.js so world-split-v and the zdash- cache names move.
- **Interiors do not use the shared prop catalog.** Owner: Neon World Interiors (`cursor/interiors-plan-52fc`, PR #81). This branch changes interiors or walk-in props and does not reference docs/planner/PROP-CATALOG.json. Planner Port: Builder Mode + Props (`cursor/planner-port-plan-cbd5`, PR #82) owns the catalog (PR #82). Neon World Interiors (`cursor/interiors-plan-52fc`, PR #81) has to place sofas, counters, and kit pieces from it instead of a second size list.

Map: `docs/INTEGRATION-MAP.md`. Tool: `node tools/integration-check.js --pr 60`.


## PR #59 WebGL buildings — purpose designs, map still separate

## Integration check

Kid App cross-system pass for PR #59 — WebGL buildings — purpose designs, map still separate.

Systems touched: Layout, Traffic.

### Fix on this branch

- **JR page and world-split load different scripts.** Owner: Neon World buildings glow WebGL (`cursor/split-webgl-58d4`, PR #59). world.html is the page the JR menu opens. only on world-split.html: world/gl-city.js. Both pages have to load the same kid scripts.
- **Hidden /test preview does not load world/gl-city.js.** Owner: Neon World buildings glow WebGL (`cursor/split-webgl-58d4`, PR #59). test/world.html and test/world-split.html do not reference world/gl-city.js. The JR preview and the live JR page would disagree.
- **Cache version was not bumped.** Owner: Neon World buildings glow WebGL (`cursor/split-webgl-58d4`, PR #59). Kid runtime changed (world-split.html, world/boot.js, world/camera.js, world/city-draw.js, world/gl-city-manifest.json, world/gl-city.js, world/traffic.js) and ZD_WORLD (30), ZD_BUILD_STAMP, and the sw.js VERSION line match main. Bump shared/version.js so world-split-v and the zdash- cache names move.
- **Builders, building redesigns, or a city redesign belong on a new world page.** Owner: Neon World buildings glow WebGL (`cursor/split-webgl-58d4`, PR #59). After the Option 1 Boulevards bundle, world.html and world-split.html take bug fixes, FPS fixes, Ellie's interiors, and the planner drop-objects placement tool. This PR adds building redesign. This branch wires it into world.html and world-split.html. Take that part off the frozen pages. Build that part on a new world page, and keep Ellie's shared save keys (zdash.kid.v1, zdash.house.v1, zdash.char.v1, zdash.pet.v1, zdash.crew.v1, zdash.neonpaint.v1, zdash_vinyls_v1, zdash_neon_paint_v1, zdash_garage_v1, zdash_paint3d_v1, zdash.customdance.v1, zdash.petdance.v1).

Map: `docs/INTEGRATION-MAP.md`. Tool: `node tools/integration-check.js --pr 59`.


## PR #58 Draw a jointed humanoid in a short closet

## Integration check

Kid App cross-system pass for PR #58 — Draw a jointed humanoid in a short closet.

Systems touched: Characters and pets, Paint and garage.

### Fix on this branch

- **Cache version was not bumped.** Owner: Draw a jointed humanoid in a short closet (`cursor/avatar-closet-b5e7`, PR #58). Kid runtime changed (char.html, crew.html, shared/char-closet.js, world-split.html, world.html, world/crew-data.js, world/crew.js, world/icon-garage.js) and ZD_WORLD (30), ZD_BUILD_STAMP, and the sw.js VERSION line match main. Bump shared/version.js so world-split-v and the zdash- cache names move.

Map: `docs/INTEGRATION-MAP.md`. Tool: `node tools/integration-check.js --pr 58`.


## PR #57 Bright day rooms and a small walking item menu

## Integration check

Kid App cross-system pass for PR #57 — Bright day rooms and a small walking item menu.

Systems touched: Interiors, Paint and garage.

### Fix on this branch

- **Hidden /test preview does not load world/walk-items.js.** Owner: Bright day rooms and a small walking item menu (`cursor/home-day-rooms-aa6e`, PR #57). test/world.html and test/world-split.html do not reference world/walk-items.js. The JR preview and the live JR page would disagree.
- **Cache version was not bumped.** Owner: Bright day rooms and a small walking item menu (`cursor/home-day-rooms-aa6e`, PR #57). Kid runtime changed (world-split.html, world.html, world/house.js, world/icon-garage.js, world/walk-items.js) and ZD_WORLD (30), ZD_BUILD_STAMP, and the sw.js VERSION line match main. Bump shared/version.js so world-split-v and the zdash- cache names move.
- **Interiors do not use the shared prop catalog.** Owner: Neon World Interiors (`cursor/interiors-plan-52fc`, PR #81). This branch changes interiors or walk-in props and does not reference docs/planner/PROP-CATALOG.json. Planner Port: Builder Mode + Props (`cursor/planner-port-plan-cbd5`, PR #82) owns the catalog (PR #82). Neon World Interiors (`cursor/interiors-plan-52fc`, PR #81) has to place sofas, counters, and kit pieces from it instead of a second size list.

Map: `docs/INTEGRATION-MAP.md`. Tool: `node tools/integration-check.js --pr 57`.


## PR #56 City warm-up, sprite pacing, and a Galaxy flicker detector

## Integration check

Kid App cross-system pass for PR #56 — City warm-up, sprite pacing, and a Galaxy flicker detector.

Systems touched: Characters and pets, Layout, Dance, Interiors, Minimap / HUD, Buttons, Paint and garage, Air physics, Soccer, Traffic.

### Fix on this branch

- **Cache version was not bumped.** Owner: City warm-up, sprite pacing, and a Galaxy flicker detector (`cursor/ipad-fps-9e5c`, PR #56). Kid runtime changed (jr.html, shared/car-draw.js, shared/char-closet.js, shared/ipad.js, world-split.html, world.html, world/boot.js, world/camera.js, …) and ZD_WORLD (30), ZD_BUILD_STAMP, and the sw.js VERSION line match main. Bump shared/version.js so world-split-v and the zdash- cache names move.

Map: `docs/INTEGRATION-MAP.md`. Tool: `node tools/integration-check.js --pr 56`.


## PR #55 Pet recorder opens the back camera, with a flip button

## Integration check

Kid App cross-system pass for PR #55 — Pet recorder opens the back camera, with a flip button.

Systems touched: Dance.

### Fix on this branch

- **Cache version was not bumped.** Owner: Pet recorder opens the back camera, with a flip button (`cursor/pet-back-camera-b5e7`, PR #55). Kid runtime changed (world/dance-stage.js) and ZD_WORLD (30), ZD_BUILD_STAMP, and the sw.js VERSION line match main. Bump shared/version.js so world-split-v and the zdash- cache names move.

Map: `docs/INTEGRATION-MAP.md`. Tool: `node tools/integration-check.js --pr 55`.


## PR #54 Record the improve-app compare as video with the live camera

## Integration check

Kid App cross-system pass for PR #54 — Record the improve-app compare as video with the live camera.

Systems touched: Dance.

### Fix on this branch

- **Cache version was not bumped.** Owner: Record the improve-app compare as video with the live camera (`cursor/improve-clip-video-9767`, PR #54). Kid runtime changed (dance-stage.html, world/dance-stage.js) and ZD_WORLD (?), ZD_BUILD_STAMP, and the sw.js VERSION line match main. Bump shared/version.js so world-split-v and the zdash- cache names move.

Checked and left as-is:

- world/dance-stage.js is already on world.html and world-split.html on main. This branch does not remove that tag.

Map: `docs/INTEGRATION-MAP.md`. Tool: `node tools/integration-check.js --pr 54`.


## PR #53 Stop a tow truck from pinning the Z

## Integration check

Kid App cross-system pass for PR #53 — Stop a tow truck from pinning the Z.

Systems touched: sw.js cache, Layout, Traffic.

### Fix on this branch

- **Cache version was not bumped.** Owner: Stop a tow truck from pinning the Z (`split-traffic-collide`, PR #53). Kid runtime changed (sw.js, world/city.js, world/towdrive.js) and ZD_WORLD (?), ZD_BUILD_STAMP, and the sw.js VERSION line match main. Bump shared/version.js so world-split-v and the zdash- cache names move.

Map: `docs/INTEGRATION-MAP.md`. Tool: `node tools/integration-check.js --pr 53`.


## PR #52 Load interiors on entry, clip off-screen glow, and recover the phone FPS gap

## Integration check

Kid App cross-system pass for PR #52 — Load interiors on entry, clip off-screen glow, and recover the phone FPS gap.

Systems touched: Layout, Interiors, Traffic.

### Fix on this branch

- **Cache version was not bumped.** Owner: Load interiors on entry, clip off-screen glow, and recover the phone FPS gap (`split-pc-fps`, PR #52). Kid runtime changed (shared/car-draw.js, world/camera.js, world/city-draw.js, world/detail.js, world/house.js, world/traffic.js) and ZD_WORLD (?), ZD_BUILD_STAMP, and the sw.js VERSION line match main. Bump shared/version.js so world-split-v and the zdash- cache names move.

Map: `docs/INTEGRATION-MAP.md`. Tool: `node tools/integration-check.js --pr 52`.


## PR #51 Notes: v28 building FPS baseline, proof not built

## Integration check

Kid App cross-system pass for PR #51 — Notes: v28 building FPS baseline, proof not built.

Systems touched: none.

No missing dependents. Both pages, cache, and the saved-key check did not flag this diff.
Map: `docs/INTEGRATION-MAP.md`. Tool: `node tools/integration-check.js --pr 51`.


## PR #50 Finish the JR main menu and center kid menu tiles

## Integration check

Kid App cross-system pass for PR #50 — Finish the JR main menu and center kid menu tiles.

Systems touched: Characters and pets, Dance, Paint and garage.

### Fix on this branch

- **Cache version was not bumped.** Owner: Finish the JR main menu and center kid menu tiles (`split-menus`, PR #50). Kid runtime changed (crew.html, dance-stage.html, fly3.html, jr.html, neon-paint.html, shared/menu-tiles.css, world-split.html, world.html, …) and ZD_WORLD (?), ZD_BUILD_STAMP, and the sw.js VERSION line match main. Bump shared/version.js so world-split-v and the zdash- cache names move.
- **Adult index.html was edited.** Owner: Finish the JR main menu and center kid menu tiles (`split-menus`, PR #50). Kid App work does not change adult index.html. The kid build stamp lives in shared/version.js. Revert the adult page unless Bob has already accepted that hunk.

Map: `docs/INTEGRATION-MAP.md`. Tool: `node tools/integration-check.js --pr 50`.


## PR #49 Keep the installed app full screen across kid pages

## Integration check

Kid App cross-system pass for PR #49 — Keep the installed app full screen across kid pages.

Systems touched: Characters and pets, Dance, Paint and garage, sw.js cache, Interiors, Buttons.

### Fix on this branch

- **Cache version was not bumped.** Owner: Keep the installed app full screen across kid pages (`split-polish`, PR #49). Kid runtime changed (char.html, crew.html, dance-stage.html, fly3.html, garage-hub.html, jr.html, manifest-jr.webmanifest, neon-paint.html, …) and ZD_WORLD (?), ZD_BUILD_STAMP, and the sw.js VERSION line match main. Bump shared/version.js so world-split-v and the zdash- cache names move.
- **Adult index.html was edited.** Owner: Keep the installed app full screen across kid pages (`split-polish`, PR #49). Kid App work does not change adult index.html. The kid build stamp lives in shared/version.js. Revert the adult page unless Bob has already accepted that hunk.

Map: `docs/INTEGRATION-MAP.md`. Tool: `node tools/integration-check.js --pr 49`.


## PR #45 Remove the NOS exhaust sparks

## Integration check

Kid App cross-system pass for PR #45 — Remove the NOS exhaust sparks.

Systems touched: Air physics.

### Fix on this branch

- **Cache version was not bumped.** Owner: Neon World Air & Flight Physics (`split-phys-air`, PR #45). Kid runtime changed (world/phys-ground.js) and ZD_WORLD (?), ZD_BUILD_STAMP, and the sw.js VERSION line match main. Bump shared/version.js so world-split-v and the zdash- cache names move.

Map: `docs/INTEGRATION-MAP.md`. Tool: `node tools/integration-check.js --pr 45`.


## PR #44 Wings color follows drive mode (held, not deployed)

## Integration check

Kid App cross-system pass for PR #44 — Wings color follows drive mode (held, not deployed).

Systems touched: sw.js cache, Buttons.

### Fix on this branch

- **Cache version was not bumped.** Owner: Neon World In-Game Buttons & Controls (`split-buttons`, PR #44). Kid runtime changed (sw.js, world-split.html, world.html, world/input.js) and ZD_WORLD (?), ZD_BUILD_STAMP, and the sw.js VERSION line match main. Bump shared/version.js so world-split-v and the zdash- cache names move.

Map: `docs/INTEGRATION-MAP.md`. Tool: `node tools/integration-check.js --pr 44`.


## PR #43 Stop brake marks the instant BRAKE is released

## Integration check

Kid App cross-system pass for PR #43 — Stop brake marks the instant BRAKE is released.

Systems touched: Buttons.

### Fix on this branch

- **Cache version was not bumped.** Owner: Stop brake marks the instant BRAKE is released (`split-ebrake`, PR #43). Kid runtime changed (world/input.js) and ZD_WORLD (30), ZD_BUILD_STAMP, and the sw.js VERSION line match main. Bump shared/version.js so world-split-v and the zdash- cache names move.

Map: `docs/INTEGRATION-MAP.md`. Tool: `node tools/integration-check.js --pr 43`.


## PR #39 Z Company Arts neon dance stage and camera mo-cap

## Integration check

Kid App cross-system pass for PR #39 — Z Company Arts neon dance stage and camera mo-cap.

Systems touched: Dance.

### Fix on this branch

- **Cache version was not bumped.** Owner: Ellie's Dance Stage & Camera (`split-dance`, PR #39). Kid runtime changed (dance-stage.html, world/dance-stage.js) and ZD_WORLD (?), ZD_BUILD_STAMP, and the sw.js VERSION line match main. Bump shared/version.js so world-split-v and the zdash- cache names move.

Checked and left as-is:

- world/dance-stage.js is already on world.html and world-split.html on main. This branch does not remove that tag.

Map: `docs/INTEGRATION-MAP.md`. Tool: `node tools/integration-check.js --pr 39`.


## PR #38 Enter and exit buildings from the top bar

## Integration check

Kid App cross-system pass for PR #38 — Enter and exit buildings from the top bar.

Systems touched: Interiors.

### Fix on this branch

- **Cache version was not bumped.** Owner: Enter and exit buildings from the top bar (`split-walk-cam`, PR #38). Kid runtime changed (world/house.js) and ZD_WORLD (?), ZD_BUILD_STAMP, and the sw.js VERSION line match main. Bump shared/version.js so world-split-v and the zdash- cache names move.
- **New claim or door has no button or pause-menu update.** Owner: Neon World In-Game Buttons & Controls (`split-buttons`, PR #44). A NOS claim, resume entry, or building door was added without world/input.js, world/hud.js, or world/icon-garage.js. Neon World In-Game Buttons & Controls (`split-buttons`, PR #44) or this branch has to add the control.

Map: `docs/INTEGRATION-MAP.md`. Tool: `node tools/integration-check.js --pr 38`.


## PR #37 Minimap: builder zone, walker, and giant dome stadium

## Integration check

Kid App cross-system pass for PR #37 — Minimap: builder zone, walker, and giant dome stadium.

Systems touched: Minimap / HUD.

### Fix on this branch

- **Cache version was not bumped.** Owner: Neon World minimap (split-map) (`split-map`, PR #37). Kid runtime changed (world/hud.js) and ZD_WORLD (?), ZD_BUILD_STAMP, and the sw.js VERSION line match main. Bump shared/version.js so world-split-v and the zdash- cache names move.

Map: `docs/INTEGRATION-MAP.md`. Tool: `node tools/integration-check.js --pr 37`.


## PR #36 Speed-gate neon detail and keep pad streets clear

## Integration check

Kid App cross-system pass for PR #36 — Speed-gate neon detail and keep pad streets clear.

Systems touched: sw.js cache, Interiors.

### Fix on this branch

- **Cache version was not bumped.** Owner: Speed-gate neon detail and keep pad streets clear (`split-detail`, PR #36). Kid runtime changed (shared/detail-tune.js, sw.js, world/detail.js) and ZD_WORLD (?), ZD_BUILD_STAMP, and the sw.js VERSION line match main. Bump shared/version.js so world-split-v and the zdash- cache names move.

Map: `docs/INTEGRATION-MAP.md`. Tool: `node tools/integration-check.js --pr 36`.


## PR #35 Traffic physics: toned-down Z cornering and ramp launches

## Integration check

Kid App cross-system pass for PR #35 — Traffic physics: toned-down Z cornering and ramp launches.

Systems touched: Traffic.

### Fix on this branch

- **Cache version was not bumped.** Owner: Traffic physics: toned-down Z cornering and ramp launches (`split-traffic`, PR #35). Kid runtime changed (shared/traffic-tune.js, world/traffic.js) and ZD_WORLD (?), ZD_BUILD_STAMP, and the sw.js VERSION line match main. Bump shared/version.js so world-split-v and the zdash- cache names move.

Map: `docs/INTEGRATION-MAP.md`. Tool: `node tools/integration-check.js --pr 35`.


## PR #34 Mount facade signs and add side and rear parking

## Integration check

Kid App cross-system pass for PR #34 — Mount facade signs and add side and rear parking.

Systems touched: Layout.

### Fix on this branch

- **Cache version was not bumped.** Owner: Mount facade signs and add side and rear parking (`split-stunts`, PR #34). Kid runtime changed (world/city-draw.js, world/city.js, world/ramps.js) and ZD_WORLD (?), ZD_BUILD_STAMP, and the sw.js VERSION line match main. Bump shared/version.js so world-split-v and the zdash- cache names move.
- **City blocks moved and the minimap was not updated.** Owner: Neon World minimap (split-map) (`split-map`, PR #37). world/city.js geometry changed. The minimap reads CITY.ROADS for streets, and it also hardcodes MINI bounds, spanFar, the airport dot, and the soccer dome. Neon World minimap (split-map) (`split-map`, PR #37) has to confirm those against the new map.
- **Moved city can restore a Resume save inside a wall.** Owner: Neon World Save & Resume (`cursor/world-save-resume-b8a9`, PR #79). Building or road coordinates changed and this branch has no mapStamp + spotClear resume guard. Neon World Save & Resume (`cursor/world-save-resume-b8a9`, PR #79) has to reject a saved spot that fails CITY.probe and snap to the district or road anchor.

Checked and left as-is:

- Traffic lanes rebuild from CITY.ROADS on the next page load. They do not refresh mid-session (no roadsSig). That is enough for a full reload and not enough for builder-mode road edits.
- Hot Drop still uses CITY.ROADS, so the beacon follows the new streets without a second coordinate list.
- Both world pages must gain any new script together. Adult index.html stays untouched.

Map: `docs/INTEGRATION-MAP.md`. Tool: `node tools/integration-check.js --pr 34`.


## PR #17 Build a dome stadium and west tunnel around the bigger pitch

## Integration check

Kid App cross-system pass for PR #17 — Build a dome stadium and west tunnel around the bigger pitch.

Systems touched: Soccer.

### Fix on this branch

- **Cache version was not bumped.** Owner: Neon World car soccer field (`split-soccer`, PR #17). Kid runtime changed (shared/soccer-tune.js, world/soccer.js) and ZD_WORLD (?), ZD_BUILD_STAMP, and the sw.js VERSION line match main. Bump shared/version.js so world-split-v and the zdash- cache names move.
- **Soccer field moved and the minimap fallback did not.** Owner: Neon World minimap (split-map) (`split-map`, PR #37). shared/soccer-tune.js field center or size changed. world/hud.js still falls back to the dome at (830, 300) when SOCCER.field is missing. Neon World minimap (split-map) (`split-map`, PR #37) has to match the new pitch.

Map: `docs/INTEGRATION-MAP.md`. Tool: `node tools/integration-check.js --pr 17`.

