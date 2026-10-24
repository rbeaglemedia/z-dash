# Neon World traffic rules

Options for Bob to pick. Nothing in this file is built yet.

The car these numbers are sized to is the player's 370Z (`assets/370z.glb`, loaded by `shared/assets/370z-glb.js`):

| | metres |
| --- | --- |
| length | 4.25 |
| width | 1.85 |
| height | 1.32 |
| wheelbase | 2.55 |
| track | 1.60 |
| tyre radius | 0.33 |

Boulevard lanes come from `CITY.ROADS`. Lane width is **3.4 m** on the current page and on PR #85. A Z in the middle of a lane has about **0.78 m** of paint-to-line on each side. A road at least 30 m wide (the highway) has three lanes each way. `street`, `lane`, and the bridge have two. `water` is not a lane.

Sources for any future build, and only these: `CITY.ROADS` for lanes and crossings, this plan for pace and gaps, `world/towdrive.js` for the tow trucks. No pursuit, no police, no ramming, and no copied roll from another game.

What is in the tree today is a placeholder, not a yes from the list below: city pace 10–15 m/s, +3 m/s on highway / bridge / tunnel, an 11 m centre-to-centre gap, and a bumper slowdown when the player Z overlaps a car. Bob marks the rows. Nothing in that list is built until he does.

These rows are for one page: the 30-car Neon World (`world.html` and `world-split.html`, 12 simulated cars plus 18 light dots) on the Boulevards graph from PR #85. That graph is `CITY.ROADS` once the boulevard layout is the map: `street` and `lane` in town, `highway` and `bridge` as the fast roads, `water` is not a lane. NOS aprons on that map include Car Row and the kit pads. The same 30 cars follow those streets. They do not spawn on the runway. The next world's two-car page is section 9, not this list.

One car length is 4.25 m, bumper to bumper. 10 m/s is about 22 mph. 15 m/s is about 34 mph. 20 m/s is about 45 mph.

Frame cost, named so each row can be judged on its own:

- **None.** No new picture, no `shadowBlur`, no per-frame GL read. The 12 near cars already step. This row only changes a speed or a gap.
- **Spread.** Cars sit farther apart, so fewer of those 12 fall inside the 150 m photo.
- **Bunch.** Cars stack at a stop. The cap is still 12 photos. On `ab94aaf`, twelve close photos added 5.1 ms inside a 27.7 ms spread on software GL. That probe is the ceiling for this list. It is not a phone time. The 18 dots stay lights.

Say yes or no. No on a row leaves today's placeholder for that rule.

| | Choice | Yes means | FPS |
| --- | --- | --- | --- |
| 1 | Lane centre | Hold within 0.3 m of the middle of a 3.4 m lane. The 1.85 m body keeps about 0.78 m of paint each side. | None |
| 2 | Loose lane | Allow up to 0.6 m off centre, still inside the lane. No on this row keeps row 1. | None |
| 3 | Town gap, two lengths | 8.5 m bumper to bumper on `street` and `lane`. Same direction only. An oncoming car is the other lane, not a lead. | Spread |
| 4 | Fast-road gap, three lengths | 12.75 m bumper to bumper on `highway` and `bridge` (and `tunnel` if that edge is still in the graph). No on this row uses two lengths there too. | Spread |
| 5 | Stop at crossings | From about 18 m out (about four lengths), brake to a full stop with the bumper short of the box. Wait until the box is empty. A car already in it finishes. | Bunch |
| 6 | Stop at NOS aprons | The same stop at Car Row NOS and the kit NOS pads. Traffic does not use the pumps. It only leaves the apron clear. | Bunch |
| 7 | Roll when the box is empty | Through a clear crossing at about 4 m/s. Stop only when another car or the player Z is in the box. No on this row keeps the full stop from row 5. | None |
| 8 | Corner crawl | Wheelbase is 2.55 m. Do not cut a radius tighter than about 7 m. If the graph's corner is tighter, slow to a crawl instead of leaving the lane. | None |
| 9 | Merge only at crossings | No mid-block lane change. A turn uses the lane graph. The next lane must be clear for the whole 1.85 m body. No gap, no move. | None |
| 10 | Town speed 10–15 m/s | Cruise band on `street` and `lane`. Each car picks one speed in the band and holds it. | None |
| 11 | Fast-road speed 16–20 m/s | Cruise band on `highway` and `bridge`. No on this row keeps 10–15 m/s there too. No boost. | None |
| 12 | Yield to his Z | If the player Z is ahead in this lane inside the gap, match down to his speed, and stop if he stops. If he enters the lane, brake as for any other car. Beside him, hold the lane. Do not chase, ram, spin him, or leave the lane to meet him. | None |
| 13 | Extra length behind his Z | Add one car length when he is the lead. No on this row keeps row 12's normal gap. | Spread |
| 14 | Freeze when he is close | Inside one length, that car stops until he is two lengths away. No on this row keeps row 12 only. | Bunch |
| 15 | Keep 30 cars | 12 simulated plus 18 dots, on the boulevard lanes, none on the runway. This is the count already on the page. | Standing twelve-photo cost above |

Tow trucks stay on `world/towdrive.js`, slower than a Z on the same road, same lanes, no shove. They are not a row in this list.

A near car leaves only past about 240 m, or once it is behind the camera and beyond 150 m, and it comes back outside the camera frame. Dots past the box range can come and go. That respawn rule is not a separate yes: it keeps row 15 from popping a body in front of him.

Weather is a later check. Do not wire the weather API in the first build. The reads to use then are in section 8. They come from Weather PR #89. Nothing in `world/traffic.js` calls them.

## 8. Weather, later

After Bob picks the options above and the behavior is in, a separate pass can thin out or slow cars inside a weather zone. Do not wire this while the dry-road rules are still a placeholder. Weather does not change Ellie's speed. Traffic would be the side that eases off.

The surface is on the Weather agent's PR #89 (`world/weather.js`, branch `cursor/weather-overlay-c773`). Read it. Do not copy the zone rectangles into traffic.

| Read | Meaning |
| --- | --- |
| `weather.inZone(x, z)` | The zone rectangle under that point, or `null` outside. Fields include `id`, `kind`, `name`, `x0`, `x1`, `z0`, `z1`. |
| `weather.density` | `0` outside. About `0.30` in light weather, up to about `0.78` when thick. |
| `weather.kind` | `'sand'`, `'fog'`, `'rain'`, or `null`. |
| `weather.thick` | True when the far draw is shortened. |
| `weather.viewDist` | Current far draw, in metres. |
| `weather.onHeadroom(fn)` | Called when the frame has room. |

A car with `inZone(x, z)` set can drop its target speed as `density` rises, and a spawn roll can skip slots so the zone holds fewer cars. `kind` picks the flavour: rain lengthens the following gap and uses the low end of the speed band; fog keeps the despawn distance where it is so a car does not appear out of the fog in front of her; sand uses the same density throttle. `thick` and `viewDist` say when the far draw has already closed in, so respawns stay inside that distance. `onHeadroom` is the hook for a spawn catch-up, not a per-frame scan.

Clear air (`inZone` null, `density` 0) keeps the dry-road options Bob picked. No weather branch until those dry-road rules are the ones he chose.

## 9. Detail tiers

One source for every tier: `assets/370z.glb`, loaded by `shared/assets/370z-glb.js`. The guard counts 369 meshes and 26,549 triangles. A second file, a Kenney body, or a hand-built stand-in is not a tier. Neon World stays on the cheap ceiling. The next world, with slower and rarer cars, raises that ceiling. It does not get its own model.

Distance still steps down inside the ceiling. A world only chooses how high the close car is allowed to go.

| Tier | Draw | When |
| --- | --- | --- |
| D | Headlight and taillight dots | Past the box range. Neon World: past 400 m, gone past 800 m. |
| B | Flat body in the car's paint, plus lights | Neon World: 150–400 m. No wheel cards. No `shadowBlur`. |
| P | One cached showroom photo of the full GLB. 480 px. Wheels are in the photo, on the axle, and the front axle yaws when that view was steered. `liveCap` stays 0, so a frame does not read the GL canvas back. | Neon World's close car, inside 150 m. This is the ceiling on `world.html` and `world-split.html`. It is also the next world's fallback if a live pair misses its frame budget. |
| L | A live mesh cut from that same GLB. Wheels stay whole. The body is the lighter cut, not a second download. Both cars share one body. Wheel spin and steer are matrices on that shared wheel geometry. | Next world only, and only while the page is rare. Not copied back onto Neon World. |

Neon World's numbers stay in `shared/traffic-tune.js` (`spritePx` 480, `liveCap` 0, `fullDist` 150, `boxDist` 400, `dotDist` 800). The next world must not write that file. A shared edit would thin the live city. The next page brings its own car count and its own ceiling.

The next world's own plan (PR #90) asks for two cars, slower than Ellie, and a live pair inside about 2.5 ms. Their probe on PR #93 (`next-traffic-lod.html`, commit `feb4211`) cut the body at 1 cm, left the wheels whole, and landed at 8,912 triangles a car. That cut is the candidate for tier L. The earlier 2 cm weld missed the 0.55 silhouette bar, so it is not the cut. Tier L still has to pass the 370Z Design Check before it replaces tier P on a page that checker scores. The official tool opens `world.html`. A pass on the test page is a lab signal, not that exit code.

Raising detail means moving the close car from P to L. It does not mean a new GLB, a denser Neon World, or a per-frame photo of all twelve simulated cars. Twelve live meshes do not fit the live city's frame. Two can, on the next page only. If those two miss the budget, the near one stays on L and the other drops to D, or both drop to P. Dots and the box tier stay available underneath either ceiling.
