# Planner port plan

Phase 1 only. Nothing here is in the live game. `world.html`, `world-split.html`, and adult `index.html` are untouched. Nothing deploys. The full port waits for Bob to write "plan approved, build it".

## Access

The private repo `rbeaglemedia/event-space-planner` (branch `master`, v3.39) was **not readable** from this agent. `gh repo view` and `git ls-remote` both returned "repository not found". `rbeaglemedia/z-dash-tools` was not readable either. OneDrive has no copy.

So this branch does **not** copy planner files, license text, or venue data. The proof meshes are original boxes that use Bob's names (`addScreen`, LED trailer, truss, TV stand, speaker, table). When the repo is readable, replace the bakers and keep the ids. Keep the MIT/BSD/Apache/CC0 notices from `LICENSES.xlsx`. Strip venue names before anything lands in the game. Do not add a submodule.

## What to copy, once the repo is readable

Vite + three.js modules. Copy into `world/planner/` and do not add a script tag to a live page until the build is approved. The city frame does not grow a second three.js runtime. The editor can keep three.js. The game loads the baked boxes.

| Planner path | Role | Game use |
| --- | --- | --- |
| `src/app/place.js`, `input.js`, `state.js`, `scene.js`, `view.js` | Place and edit | Builder HQ design tool only |
| `src/walls.js`, `src/venue.js` | Walls and rooms | Baked into the prefab below. Drop venue-name presets |
| `src/grid.js` | 1 ft grid | Editor only. Export is metres (1 ft = 0.3048 m) |
| `src/products/*.js` via `src/register.js` | Product library | Parametric catalog ids |
| `src/products/screenface.js` (`addBox`, `addScreen`, `installShape`) | Screen and box shapes | One screen mesh, many sizes |
| `src/meshes.js` | Procedural shapes | Baked to boxes. Not drawn live |
| `src/icons.js` | Icons | Editor only, through UI Polish if a player ever sees them |
| `LICENSES.xlsx` | MIT/BSD/Apache/CC0 | `world/planner/THIRD-PARTY.md` |

## Prop catalog API

Machine-readable list: [`docs/planner/PROP-CATALOG.json`](planner/PROP-CATALOG.json).

Interiors agent `bc-80a1fc6f` (walk-in rooms and the southwest style sampler) should place from this list. Do not invent a second sofa size. The proof bakers live in `test/planner-port/catalog.js` until the real modules replace them.

```text
PLANNER_PROPS.list()              → every entry in the JSON
PLANNER_PROPS.get(id)             → one entry, or null
PLANNER_PROPS.parts(id, params)   → local boxes, facing +z, y up, metres
PLANNER_PROPS.remix(id)           → local boxes for a remix id
```

`params` is size, color, glow, and proportions. One base mesh, many variants. `saveKey` is null on every entry. Do not write `zdash.house.v1` or the `house` object inside `zdash.kid.v1`.

Style samples already in `docs/INTERIORS-PLAN.md` on `cursor/interiors-plan-52fc`:

- **A** daylight: white or cream, tan floor, glass, no glow strip.
- **B** the same shell plus one `#3ee6ff` strip.

Bob's house note is A plus that one strip. Each catalog row has `styleA` and `styleB` colors. A southwest pass uses the same ids. It does not fork the mesh.

Rooms that take props: HOME, ARCADE, CAFE, BUILDER, SHOWROOM, DANCE. The saved hero piece stays `sofa`, `arcade`, `dj`, or `trophy`. A planner TV is the screen face of that hero, not a new checkbox.

### Scale for Characters and Anatomy Check

Ellie is 1.7 m to the top of the head. The pet is 0.74 m, on the floor. The proof house draws a pink figure and a small pet at those heights so a reviewer can see the furniture against them. This plan does not change `world/crew.js` or the pet rig.

| Prop | Own size (m) | Against the body |
| --- | --- | --- |
| Sofa | 2.1 × 0.78 × 0.85 | Seat 0.4 m. Back below her shoulder |
| Table | 1.2 × 0.78 × 0.7 | Top 0.75 m, just over the pet's head |
| TV stand | 1.15 × 1.1 × 0.48 | Screen top about 1.1 m, between pet and her eyes |
| Wall screen | 1.6 × 0.9 × 0.08 | Bottom at or above 1.05 m so the pet is not inside it |
| Speaker | 0.55 × 0.9 × 0.45 | Taller than the pet, shorter than Ellie |
| LED trailer | 4.2 × 2.6 × 2.05 | She stands beside it. She does not ride in it |

Anatomy Check reviews these before a build. If a real planner mesh is taller, scale the params, not the person.

## Ellie's house and the other rooms

The walk-in today is one 8.4 × 6.3 × 3.1 m shell in `world/house.js` (`walkPaintRoom`), drawn as canvas quads. Interiors retires that size. The house they sampled is 24 × 18 × 4.8 m (A) or 22 × 16 × 4.6 m (B).

The proof room is the blend: white walls, tan floor, a glass wall, one cyan ceiling strip, a sofa, a low table, a pet bed, a planter, a TV, a side LED panel, and a speaker. The TV plays one local loop (a 256×144 canvas, stand-in for the planner's Run mode).

Screens in other rooms use the same mesh:

- Arcade: flat panels on the cabinets. One jackpot screen may be the video. The rest are a baked color.
- Cafe and Builder HQ: one small counter screen, baked, unless that room is the one she is in.
- Dance: the stage remix, not a second building.

Only one video element exists. It follows the room she is in, or the trailer when it is hitched. It pauses off-screen, and it pauses when a frame's own cost stays over 14 ms.

## Builder HQ, southeast

Today's map has two BUILDER shops on the north bank (`BUILDER_NORTH`, z 1860–2100) in `world/city.js`. City Layout agent `bc-3ff1a27b` picked Option 1, The Boulevards. Builder HQ moves to the southeast Builder Bay. One HQ, not two: **x 878..922, z 444..476**, with its pad at 966..994, 446..474. The dashed lots in Builder Bay stay empty until a new game exists. They are the build-your-own ground. Do not fill them with a second arcade.

The design tool is the planner editor (walls, grid, place), opened from the HQ. The HQ room itself stays the interiors studio (desk, boards, glass). The toast can still point outside. The editor is not a new app on the drive HUD. Dragging the city itself is the City Editor section below, a separate top-down tool.

The tool adds what the planner rooms do not: roofs, floors, openings, trim.

| Piece | Export |
| --- | --- |
| Walls | Boxes along the footprint. A door or window splits the wall into sill, header, and side boxes |
| Flat roof | One slab plus the overhang |
| Pitched roof | Four stacked slabs up to the ridge. No rotated mesh in v1 |
| Dome | Four rings of shrinking boxes |
| Canopy | A thin slab and two posts |
| Upper floor | A slab plus another wall ring. The proof shell is two floors |
| Trim | A thin glow box. Brighter color, not a blur |
| Facade screens | The screen prop, sized to the face. Baked color on the street |

## Building export, same prefab as the NOS station

Building/WebGL agent `bc-2a4360f4` owns rendering. PR #76 (`world/nos-station.js` on `cursor/nos-driveup-58d4`) is the pattern: flat boxes, a door face, no world coordinate stored in the prefab. Glow is a brighter box.

`test/planner-port/bake.js` speaks that shape.

```text
bakeBuilding(doc) → parts[]
  each part is { part, x0, x1, y0, y1, z0, z1, color, glow }
  x is along the door face, z is inward, y is up
  part names: slab, wall, header, sill, door, glass, roof-flat,
              roof-pitch, roof-dome, canopy, post, trim

placeOnBox(parts, cityBox, face) → the same fields in city metres
  frameOf matches NOS_STATION.frameOf
```

`color` and `glow` are optional. The NOS fitter can ignore them. A later `fit(building, pushBox)` would push every part except `lane`, the way `NOS_STATION.fit` does. This phase does not call it, and it does not edit `world/city.js`.

A check on the proof shell: 45 parts, placed on the Option 1 HQ box (878..922, 444..476, door facing −z), all landed on that footprint. Kinds: slab, wall, header, door, sill, glass, roof-flat, roof-pitch, roof-dome, canopy, post, trim.

Street screens and remixes that are not axis-aligned stay instanced props (one box mesh, a yaw). They are not pushed as rotated AABBs. The WebGL agent already instances boxes. These are more instances of that draw, not a new shader.

## Remix catalog

Same bases. Change size, color, glow, or proportions. One mesh.

| Remix | Source | Transform | Where | Instances | Draw |
| --- | --- | --- | --- | --- | --- |
| Food truck | LED trailer | Cab on the front, side screen 2.4×1.15, awning, cream body, amber glow. No video while parked | The Stage curb. A parked copy may sit on a Builder Bay lot | 13 | shared |
| Stage | Screen | Screen 8×4.2, deck, four truss posts. Wheels dropped | In front of the dance mural. Not a second building | 23 | shared |
| Mobile billboard | LED trailer | Screen 6.2×3.2 raised on a spine. Wheels kept | Highway shoulders that already have billboards. Cap 6 inside 170 m | 9 | shared |
| Welcome gate | Truss segment | Two uprights, one beam, a 6.4×1.35 screen | City-kit arches. No interior | 17 | shared |
| Bridge | Truss segment | Eight segments and a deck | Idea only. Does not replace the river bridges | 41 | shared |
| Ticket booth | TV stand | Wider stand, a counter, a back panel | Soccer shop, arcade counter, Builder HQ desk | 6 | shared |
| Speaker tower | Speaker | Four cabinets, 1.15 m each, alternating cyan and magenta glow | The Stage, beside the mural. Not the sky tower | 12 | shared |
| Snack counter | Table | Top 3.2×0.9 at 1.05 m, a front panel, a 0.42 m baked screen | City-kit snack stall. The Stage uses the cafe instead | 8 | shared |

Facade LED, rooftop signs, and storefronts are the screen prop on the building face. At most two screens on a building, and at most four buildings in a street shot, so at most eight screen instances inside 170 m. Street screens are baked colors. They do not each own a video.

## LED trailer behind the 370Z

Ellie's car can tow the LED trailer. The real 370Z mesh stays the one Garage Z already draws. `world/garagez.js` still reads `zdash.kid.v1` → `eq` and still changes nothing else. The proof car is a block stand-in so the hitch can be seen. It is not a new car.

**Pad.** City Layout owns the coordinate. Option 1 main garage is x −302..−138, z −792..−728. A hitch pad that does not move the house, the pets, or the garage: **x −200..−184, z −822..−806** (south of the garage, 14 m of grass between the garage's south wall and the pad). Home and pets sit near z −664..−616, so they do not meet the pad. The yard is not rearranged. Layout can slide the pad. Attach also works at a purpose-GARAGE bay, same rule as entering Garage Z: the bay she used is the one she returns to.

**Hitch.** Pivot at the rear bumper, about 2.2 m behind the car center. Tongue to the axle is 3.4 m. Trailer yaw rate is `(speed / 3.4) * sin(hitch angle)`. Detach if the angle passes about 66 degrees, if she reverses hard, or if the car leaves the ground. The proof pins a mild turn so the hitch is visible. The live page button "Detach for flight" lifts the car and leaves the trailer.

**Air, Sky Drop, wings.** Auto-detach before flight. Open wings, `driveMode` leaving the ground, or height over 0.4 m drops the hitch. The trailer stays where it was. It does not fly and it does not ride a Sky Drop. Closed-wing jumps that stay a stunt under 0.4 m can keep it; anything higher detaches first.

**Video.** One element. She picks a built-in loop (cyan, dance bars, magenta), a dance clip already on the device, or a file from the photo library. No URL, no web view. The texture is 256×144, uploaded every other frame, paused when the screen is off-camera or the frame stays over 14 ms. Parked remixes do not use that element.

**Buttons.** In-Game Buttons agent `bc-900d1d70` (`split-buttons`) places HITCH / UNHITCH. It is a parked or on-foot action at the pad, the same family as ENTER, not a gauge. Do not move WINGS, THROTTLE, NOS, or the MPH stack. Do not edit adult `index.html` or Bob's driver screens. Opening wings detaches; the WINGS button itself stays put. The video list is a kid sheet. UI Polish audits it before it ships. The proof page's buttons are a harness, not that sheet.

**Traffic.** Traffic Physics agent `bc-2af9e871` (`cursor/traffic-plan-2bdb`): the trailer is not a `TOWDRIVE` lane truck and it does not edit `physics.js`. Give it a moving box so traffic does not drive through it. When it is detached it sits still.

## FPS

Rules for the build:

- One instanced box mesh for props, remixes, and the baked shell. The proof is 1 draw, 17 to 136 instances, 204 to 1632 triangles.
- No new `shadowBlur`. Glow is an unlit color.
- Interior budget: under 48 instances, one 256×144 video.
- Street budget: under 8 baked screens inside 170 m. They share the mesh.
- On the 6th gen, draw the room at CSS pixels (the walk canvas already does) or dpr 1. A dpr-2 buffer of 2048×1536 was the expensive lab case.
- The editor's three.js view is not the game frame. Only the baked prefab is.

Lab ceilings from `test-results/planner-port/fps.md` (40 draws + finish, then ÷ 40). Software GL, throttled CPU:

| View | Phone ceiling | iPad ceiling | PC ceiling |
| --- | --- | --- | --- |
| House, 35 boxes, video on | 8.3 ms | 16.6 ms | 5.4 ms |
| Shell, 45 boxes | 2.8 ms | 7.1 ms | 2.0 ms |
| Five remixes | 1.3 ms | 1.9 ms | 0.9 ms |
| Trailer, video on | 6.5 ms | 14.2 ms | 4.5 ms |
| House + shell + five remixes, 136 boxes | 2.8 ms | 3.9 ms | 2.1 ms |

The house and trailer numbers include a texture upload and a view that fills the buffer. The far budget view is cheaper even with more boxes. Read these as ceilings, not as a Galaxy fps. A phone ceiling of 8.3 ms is inside the 9.1 ms line only as a lab upper bound. The iPad house ceiling of 16.6 ms sits on the 60 fps line in this software test, which is why the 6th gen room should stay at dpr 1.

## Proof page

`test/planner-port.html`. Not linked from the game.

- Props, the house, the exported shell, five remixes, and the hitch.
- Shots in `test-results/planner-port/`.
- Harness buttons are not player UI. A later picker goes through UI Polish.

## Still waiting on the export

The object swap stays paused until the zip from agent `bc-04ef9a95` arrives. When it does, this plan is rewritten around two slightly modified copies of the planner app:

1. **Builder HQ mode.** Walls, shapes, and roofs.
2. **House object placement.** Starts with Ellie's house. Reuses the planner objects, especially the tech.

The venue section stays out. A following section will study the planner objects as whole sets and one by one, then propose better objects and building designs for Neon World, as ideas for Bob to pick from. That study needs the real objects. The City Editor below does not.

## City Editor

Plan only. No editor code in this phase. Bob can drag buildings and add or move roads himself. It seeds from Option 1, The Boulevards (`cursor/city-layout-plan-ef23`, agent `bc-3ff1a27b`). It does not seed from today's 24 shops, and it does not seed from Option 2.

North is up. +x is east, +z is north. Spawn stays (0, 0) unless Bob moves that spawn record. The editor is a top-down canvas on a test page. It redraws on pointer-up. Flat fills and strokes. No `shadowBlur`. It does not draw the 3D city while he drags, so the edit frame is not the game frame.

### Layout file

One document, version 1, option `boulevard`. Suggested path when the build is approved: `docs/city-layout/layout.json`. City Layout's `docs/city-layout/coords.json` is the building list for the pictures. Roads today live only in `roadsFor('boulevard')` inside `docs/city-layout/redesign-maps.mjs`. The game file is still the hardcoded `shop()` calls and the 100 m / 200 m grid in `world/city.js`. `CITY.toJSON` and `ROADS.fromJSON` already exist and nothing loads them as the map.

```text
{
  v, option: "boulevard",
  bounds: { x0, x1, z0, z1 },
  snapM,
  spawns:  [{ id, x, z, locked }],
  buildings: [{ id, name, kind, purpose, station, x0, x1, z0, z1, h, face, locked }],
  roads: [{ id, x0, z0, x1, z1, kind, w, locked }],
  lots: [{ id, x0, x1, z0, z1, empty: true }]
}
```

`bounds` for Option 1 need to cover the west track street at x −1560 and the north streets near z 2500. Today's minimap is x −1500..1900, z −900..2900, so the west edge clips. Proposed bounds: x −1700..1500, z −1000..3100.

Spawns in the file: player (0, 0) and Sky Drop start (180, 520). Both locked in the seed. Hot Drop picks a point at runtime. It is not a stored pin.

Buildings use the Option 1 boxes. Kit kinds: `arch`, `bay`, `nos`, `pad`, `snack`, plus the unique places (home, pets, garage, tower, paint, showroom, cafe, dance, arcade, builder, soccer, field, track, jump roof). `face` is the door side (`n`, `e`, `s`, `w`). `h` is metres. `coords.json` has neither field yet. Roads use the boulevard segments: highway, two bridges, river, the shoulder out of spawn, and the city streets. `kind` matches what the minimap already strokes: `street`, `highway`, `bridge`, `tunnel`, `track`. A boulevard `lane` is a street. Water stays a river band, not a drivable edge.

Empty Builder Bay lots stay `lots` with `empty: true`. They are build-your-own ground. The seed does not put a shop on them.

### Drag, snap, undo

Top-down. Select a footprint or a road. Drag. One undo snapshot at pointer-down, so a gesture is one step. Stack of 50. Undo and redo buttons, plus Ctrl+Z and Ctrl+Shift+Z.

- A building drag moves the whole footprint. The door face stays on the side Bob last set, and a "face the nearest street" button writes `face` from the closest road.
- A road drag moves one endpoint, or the whole segment if he grabs the middle. Add-road is two clicks.
- An endpoint within 4 m of another endpoint snaps to that node, so `ROADS.rebuild` makes one chain. The live graph already rounds nodes to 0.1 m.

Snap size is a pick for Bob:

| Choice | Snap | What it feels like |
| --- | --- | --- |
| S1 | 2 m | Edges land clean. Close to a metre grid. Default in this plan |
| S2 | 10 m | Big moves along a boulevard. Coarse for a bay or a snack |
| S3 | 1 m | Fine nudge. More clicks to cross a district |

### What he can move

| Choice | Editable | Locked in the seed |
| --- | --- | --- |
| M1 | Buildings, kit, and boulevard streets | Highway at x −450, both bridges, river, tunnel, runway, airport ramps, half-pipe, loop, player spawn, Sky Drop start |
| M2 | M1, plus new streets anywhere on the grass | Same locked skeleton. He can add a boulevard. He cannot delete the highway |
| M3 | The skeleton too | Nothing. A bad drag can cover the tunnel mouth or the river jump |

This plan recommends **M2**. Unique purposes stay one each: one home, one main garage, one pet lounge, one paint, one showroom, one big NOS, one dance, one cafe, one arcade, one Builder HQ, one soccer shop, one field, one tower. Kit pieces may repeat, with the two exceptions already in Option 1: The Stage has the cafe and no snack stall, and Car Row has the big NOS and no second NOS. An arch keeps an opening at least one lane wide (3.4 m) plus the shoulders. The posts are the solids. The opening is not a wall.

### Roads, lanes, and the minimap

Saving a road writes the segment, then the test page reloads. On load the test city calls the existing `ROADS.addRoad` for each segment and `ROADS.rebuild`. That rebuild fills `lanes`, `chains`, and `spawns`, and `updateBlocked` marks stretches where a probe hits a building. Traffic reads those lanes once per page load (`world/traffic.js` sets `built` and returns). A reload is the v1 update. A hot rebuild without a reload can come later from Traffic Physics (`bc-2af9e871`); this plan does not edit `physics.js`.

The minimap already bakes `CITY.ROADS` and building footprints once (`miniBake` in `world/hud.js`). A reload rebuilds that image from the new graph. The test copy reads `bounds` from the layout so the west track street is on the image. The bake stays flat fills and strokes. This plan does not add `shadowBlur` to it, and it does not change the live driver HUD.

### Save, test, publish, rollback

The editor never writes `zdash.house.v1` or `zdash.kid.v1`.

| Step | Where it lands | Who allows it |
| --- | --- | --- |
| 1. Save | This browser only, `localStorage` key `zdash.city.editor.v1` | Bob, any time, in the editor |
| 2. Drive this | `/test/world.html` reads that key when present, else the committed layout file | Bob, from the editor. Live `world.html` keeps today's map |
| 3. Publish | A reviewed commit that copies the tested JSON into the file the live city loads | Bob's explicit go, same bar as "yes, do it". No deploy from this plan |
| 4. Rollback | Restore the previous published JSON over the local key, and revert the publish commit | Bob, from "Restore published" or a revert |

| Choice | How far one go goes |
| --- | --- |
| P1 | One explicit go writes the live map file. The previous file is kept beside it for rollback |
| P2 | The first go updates `/test/` only. A second explicit go updates the live map. Live pages stay on today's map until that second go |

This plan recommends **P2**. It matches City Layout's rule that the first playable copy is `/test/` and the live pages stay put.

### Spawn guards

A save is refused when any of these are true. The gesture undoes. The bad file never becomes the test key.

- A building footprint, grown by 3 m, covers the player spawn or the Sky Drop start.
- A traffic lane sample (each `ROADS.spawns` point, and a point every 4 m along each lane) probes as a solid wall. Ramps, outlines, and billboards do not count. Arch posts count. The arch opening does not.
- The player spawn or the Sky Drop start sits inside a building or off the paved surface.
- A second copy of a unique purpose, a snack on The Stage, or a second NOS on Car Row.

`redesign-maps.mjs` already rejects a building that covers spawn. The loader keeps that check. Traffic's `solidAt` and `blockedBy` stay as the runtime backstop after a good file loads. The editor's refusal is the gate so a car does not have to dodge a bad save.

### What City Layout changes so the map is data

Agent `bc-3ff1a27b` keeps ownership of Option 1. This editor consumes their file. Their branch still has buildings in `coords.json` and roads only inside the picture generator. For the editor to drive the test map, their build needs these:

1. Put the boulevard roads, the two spawns, and the bounds in the same layout file as the buildings. Keep Option 2 out of the file the game loads.
2. Add `h` and `face` on every building. Unique places keep today's heights. Kit sizes stay the ones in their plan (bay about 20×14×8, NOS kiosk about 16×12×6, pad about 28×28×6, snack about 12×10×5, arch about 8 m deep and 12 m tall).
3. Mark the locked skeleton: highway, bridges, river, tunnel, runway, ramps, half-pipe, loop, player spawn, Sky Drop start.
4. On `test/world/city.js` only, after their build is approved: load the file instead of the 24 `shop()` calls and instead of the generated grid. Call `ROADS.addRoad` and `ROADS.rebuild`. Leave live `world/city.js` on today's map until publish step 3.
5. Map kinds to purposes: bay → GARAGE, small and big NOS → NOS, pad → SKY_DROP, snack → the stall, arch → posts with an open lane. One BUILDER. Empty lots stay empty.
6. Export `bounds` for the test minimap. The test copy of `miniBake` uses them. The live HUD stays as it is.
7. Do not cache the old road grid. Traffic builds lanes from `CITY.ROADS` at page load, so a test reload is enough.

### Picks for Bob

1. Snap: **S1** (2 m), S2 (10 m), or S3 (1 m).
2. What moves: M1 (no new streets), **M2** (new streets, skeleton locked), or M3 (everything moves).
3. Publish: P1 (one go writes the live map) or **P2** (test go, then a second go for the live map).

Bold items are the recommendation. Nothing here is built. The object swap and the review shots still wait on the planner zip.

## What this phase does not do

It does not copy the planner. It does not edit the live world, the adult page, the driver screens, Ellie's saved home, or the Garage Z link. It does not place the trailer pad in `city.js`. It does not build the City Editor. It does not deploy.
