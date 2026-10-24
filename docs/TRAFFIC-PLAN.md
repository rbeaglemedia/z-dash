# Neon World traffic plan

Plan only. No game code in this change. Nothing is built until Bob picks an option and writes "plan approved, build it".

The live pages are `world.html` and `world-split.html`. They share `world/traffic.js`. Adult `index.html` stays untouched.

## Recommendation

Keep the 30 cars on the road graph. Make the 12 near cars move like the player's car on the sprite they already use: the same suspension spring, a visible nose dive and body roll, spinning wheels, and front wheels that steer. Leave the 18 far cars as light dots.

Do not put live 3D copies of the player's model into the world. The model is 687 meshes. One extra photo of it costs about as much as the player's own sprite render, and the world can only show a 3D car by taking that photo. Thirty of those photos, or even four every frame, does not fit a steady 110 fps.

110 fps is a 9.1 ms frame. On the phone-style CPU throttle below, today's traffic math plus the flat drawing is about 2 ms. The wheel decals for the 12 near cars add about 0.5 ms. That fits. A live mesh does not, on the numbers this machine can measure.

## What traffic does now

`world/traffic.js` builds the roads once in `build()` from `CITY.ROADS`. On today's map that is 810 lanes, 718 straight connections, and 2016 turns. `shared/traffic-tune.js` caps the cars at 12 simulated plus 18 far dots (30).

Each frame `boot.js` calls `TRAFFIC.update()` and later `TRAFFIC.collect()`, then draws each car in painter order with the buildings.

The 12 near cars (`advance`, `pace`, `place`):

- Slide along a lane at 13–19 m/s (highway adds 4). They are not driving the player's physics.
- Slow down for a car ahead or a corner (`pace`, `crowd`). Same-lane spacing is a gap, not a crash.
- Take a crossing on a short curve (`beginArc`, `stepArc`) or blend into the next lane (`switchTo`).
- Steer toward a street ramp sometimes, then hop (`rampSeek`, `vertSim`). The hop is a small ballistic pop, not the player's ramp launch.
- Bounce on one spring (`susp`). The spring is k = 42, damp = 7.5, clamped to a tiny range. The player's spring, at the bottom of `step()` in `world/phys-air.js`, is k = 140, damp = 8, and it is what `drawZ` lifts the car by (`P.sus`).
- Roll and pitch a little (`body`, `vertSim`). Roll is capped around 9 degrees. Pitch is then drawn as a 10% squash per radian in `blit`, so a normal brake dive is invisible.
- Hit the player and wreck (`bump`, `knocked`). One car at a time, pushed off the lane, then respawned. They do not bump each other.

The 18 far cars move on the same lanes with almost none of that, and they are drawn as headlights only past 400 m. Nothing is drawn past 800 m.

Drawing (`drawOne`, `viewKey`, `bake`, `blit`):

- Inside 150 m the car is a 160 px photo of the player's 370Z. `ensureClone()` copies that model once, shares the geometry, flattens it, and throws away the wing hinges. The measured clone has 427 meshes and `wingHinges: 0`.
- The photo is cached by paint, 15° of yaw, and a coarse pitch bucket. Cache cap is 140. Two new photos per frame.
- The on-screen car is that photo, rotated by the small roll and squashed by the small pitch. The mesh itself never turns a wheel, never steers, and never opens a wing.
- 150–400 m is a colored box plus lights. Past 400 m, lights only.
- The shadow is a flat ellipse. There is no `shadowBlur` in `world/traffic.js`. Keep it that way.

While driving for several seconds the cache sat around 25 photos. A car in view is flipping among a handful of frozen angles. That is the canned look.

## What the player's car does

The player is one car, simulated in `step()` (`world/phys-air.js`) and `groundStep()` (`world/phys-ground.js`).

- Speed, brake, steer, e-brake drift, surface grip, NOS.
- Suspension `P.sus` with k = 140 and damp = 8. Grass adds a rumble into that spring (`world/phys-ground.js`).
- Ramp jumps when the floor drops more than 0.45 m, with pitch set from the slope, then butter / bump / rough / hard landings in `touchDown()`.
- Body roll from bank and e-brake, applied in `drawZ` (`shared/car-draw.js`) as a canvas rotate. Pitch is real: `drawZ` re-renders the mesh from the camera every frame, or every other frame while fps is under 115.
- Wheel spin is `wheelA` in `step()`. `drawZ` does not pass `wheelAng`, so Ellie's own world sprite also has frozen wheels. The spin, the brake glow, and the nose dive live in `renderChase` on the showroom / chase model (`shared/car-model.js`), which Neon World does not use for traffic.
- Wings are the door hinges (`shared/car-hinge.js`, `ZGL.set` from `drawZ`). Traffic's clone has already deleted those hinges.

So the player looks alive because the world takes a new photo of a 687-mesh car from the real camera angle, then tips that photo by her bank and lifts it by her spring. Traffic looks canned because it reuses an old photo and barely tips it.

The old Kenney cars (`shared/assets/traffic/*.js`, about 2.3 MB, still loaded by `world.html`) are a different, earlier path. `X.renderTraffic` draws them as rigid bodies with yaw and pitch only. Neon World never calls it. Those models do not have the player's suspension, wheels, or wings. This plan does not bring them back.

## Options

Costs are from a headless Chrome run of `world.html` on main `e279c9a`, 24 Oct 2026. Phone shape: viewport 844×390, device scale 3, touch, game canvas 1688×780, DPR capped at 2. CPU throttle 4×, the same throttle `test-results/builder-fps.md` uses as the phone stand-in. GPU is SwiftShader (`--disable-gpu --enable-unsafe-swiftshader`). Raw log: `docs/traffic-profile.json`.

110 fps means the whole frame, city included, has to stay inside 9.1 ms on the Galaxy. This VM cannot show that fps. Headless frames here were about 190 ms with traffic off and 200–260 ms with traffic on, which is the throttled city draw, not a phone. Read the small rows. The GL rows are software-render upper bounds. A Galaxy GPU shades faster than SwiftShader and still has to read each 3D car back onto the 2D canvas, because `boot.js` paints the city in 2D and sorts cars between buildings.

| Option | What Ellie would see | Added CPU, 4× throttle | Software GL | Fits 110? |
|---|---|---|---|---|
| Today, steady | 30 cars. Near ones are tipped photos. Far ones are dots. | update 1.1–1.3 ms, draw 0.7–1.6 ms | a new photo only on a cache miss | yes, except the miss |
| Today, while a new angle bakes | the same, with a hitch | collect 16 ms (0.2 new photos/frame) and 31 ms (0.4/frame) | one full-car render per bake, median 8.4–11 ms | the hitch is the risk |
| A. Visible pose on the current photo | same rails. Near cars squat, dive, and lean hard enough to see. Far dots can tick every other frame. | spring for 30 cars 0.01 ms. Ground probe for 30 cars 0.11 ms. Skipping far dots saves a fraction of the 1.3 ms update. | none | yes |
| B. A plus wheels (recommended) | the 12 near cars also spin their wheels and point the front wheels. A second cached photo can crossfade so the 15° flip goes away. | wheel decals, 12 cars: 0.5 ms. 4 cars: 0.2 ms. 30 cars: 3.6 ms, so not on the dots. Second photo blit, 12 cars: 0.06 ms. | none, if the wheel is drawn on top and not baked into the photo | yes |
| C. Live mesh on the nearest 2, every other frame | those two use the real model (spin, steer, squat). The other 28 stay on B. | posing 4 flattened clones (427 meshes) is 0.8 ms, so two cars are about 0.4 ms | one extra full-car render on the frames it runs: median 8.4 ms at 96 px, 8.9 ms at 160 px, 8.7 ms at 256 px. Size barely matters. The car is 687 meshes / 42k triangles. | only if a Galaxy trace shows spare time. This run does not. Hold. |
| D. Full player physics on the nearest 4, live mesh every frame, rails for the rest | four cars jump and land like Ellie. The rest stay on rails. | the physics is cheap (30 probes 0.11 ms). A direct `step()` call was under the timer grain. | four separate renders at 160 px: 34 ms. Four cars in one 160 px pass: 13.3 ms, and that pass is one photo, so buildings cannot slide between those cars. | no |
| E. 30 live copies, shared or instanced | every car is a small Ellie | pose scales from the 0.8 ms measured for 4 clones, about 6 ms for 30 before the GPU | 30 photos, or one full-screen pass that ignores building occlusion | no |

Cloning the live car with `clone(true)` throws. The wing hinges stash circular object refs on `userData`. Traffic already parks those refs for the one bake clone. A second live copy has to do the same park, and it still will not have wings, because the flattened clone deleted the hinges.

Sharing geometry is already how the one bake clone works. Instancing does not remove the per-car photo. The city is not a WebGL scene.

## The better idea

The expensive part of "a smaller Ellie" is the photo, not the physics. Take the motion the model already knows how to show and draw it on the photo traffic already has.

For the 12 simulated cars, in `body`, `susp`, `vertSim`, and `blit`:

- Use the player's spring (k = 140, damp = 8) and let the car rise and squat. The current clamp hides the bounce.
- Drive pitch from brake and throttle the way `renderChase` does (nose dive under braking, a little squat), and from the ramp slope the way `vertSim` already samples. Draw that pitch as a real rotate or a strong squash, not a 10% squash that nobody can see.
- Keep roll, and let a hard corner lean more than 9 degrees. Still a canvas rotate. No new mesh.
- Spin four wheel decals from speed, and yaw the front pair from the lane's turn rate. Draw them for the 12 near cars only. No `shadowBlur`, no glow blur. A 16 px wheel image, rotated, was 0.5 ms for 12 cars.
- Crossfade the two nearest yaw photos so the car does not pop every 15°. One extra blit of a cached photo was 0.06 ms for 12 cars. The crossfade is that extra blit on top of the one the car already draws.

Do not add the wheel angle to the bake key. That would multiply the cache misses, and a miss is an 8–11 ms software render (16–31 ms in the live frame while the city is also drawing).

Jumps stay on the rail. `vertSim` already leaves the ground at a ramp lip. Tune that hop so the landing kicks the same spring the player uses. Do not call `step()` or `touchDown()` on traffic. Those own the one global player, the toasts, and the wings.

Wings stay closed. Opening them means the hinge graph traffic deleted, plus flight physics, plus cars leaving the roads. The open ground between the new districts is for Ellie, not for 30 gliders.

Far cars stay dots. Ticking them every other frame is safe and small. It is not where the look comes from.

The hidden `test/world/traffic.js` already has a sprite warm-up the live file does not. Prebaking the yaw grid before the drive would move the 16–31 ms hitch off the play frame. That is worth doing with B, and it is still photos, not a second model.

## City redesign

[PR #68](https://github.com/rbeaglemedia/z-dash/pull/68) is open and is still a plan. As written, it keeps today's road centerlines, keeps 30 cars, and says new roads would be a separate plan. The neighborhoods move around the airport. The lanes under the cars stay.

Bob's direction for that redesign is separate district mini-cities joined by open terrain, so the routes will change after 68, or as part of a later pass. Traffic has to be ready for that without a rewrite:

- Cars keep reading `CITY.ROADS`. `build()` runs again when the graph changes. Nothing in the car behavior hardcodes the 100 m / 200 m grid. That grid lives only in `world/city.js`.
- Open ground is not a road. There is no path across it. A connector between districts is an edge, the way the highway edge already is. If a district is not linked, no car crosses.
- The 12 simulated cars stay inside `simRadius` (185 m) and recycle past 240 m. A second city on the far side of a field is empty until Ellie gets there. The map can grow without simulating every district.
- The runway check, the building check, and the "u-turn instead of driving through a block" check stay. They are what keep cars off the grass and out of the shops when the blocks move.
- Count stays 30. A bigger map does not get more cars.

Option B survives that map change because the cars are still "follow the lane, and fake the chassis on the sprite." Option D does not, because free physics will cut across the open field the moment the lane ends.

## If the plan is approved

Build B only, on a branch, in `world/traffic.js` and `shared/traffic-tune.js`. Same 30 cars. No `shadowBlur`. No wings. No second live model. No change to `index.html`. Rebuild lanes from `CITY.ROADS` when the road graph changes, so the district map can land later without another traffic rewrite.

C stays a follow-up, and only after a Galaxy capture of B shows the frame still has room under 9.1 ms.
