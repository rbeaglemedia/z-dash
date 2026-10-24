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

The design tool is the planner editor (walls, grid, place), opened from the HQ. The HQ room itself stays the interiors studio (desk, boards, glass). The toast can still point outside. The editor is not a new app on the drive HUD.

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

## What this phase does not do

It does not copy the planner. It does not edit the live world, the adult page, the driver screens, Ellie's saved home, or the Garage Z link. It does not place the trailer pad in `city.js`. It does not deploy.
