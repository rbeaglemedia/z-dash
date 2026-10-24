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

The design tool is one planner editor core (walls, grid, place), with two permission levels. DEV Builder is Bob's, and it can reach the city. Ellie's Builder stays inside her own area. The HQ room itself stays the interiors studio (desk, boards, glass). The toast can still point outside. Neither level is a new app on the drive HUD. The City Editor section below is that shared core.

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

1. **Builder HQ mode.** Walls, shapes, and roofs. DEV Builder uses this on the city.
2. **House object placement.** The drop-objects tool. Ellie tests it first in the current Neon World interiors. The same tool runs on the new world. The builders themselves stay on the new world.

The venue section stays out. A following section will study the planner objects as whole sets and one by one, then propose better objects and building designs, as ideas for Bob to pick from. Those designs land on the new world page, not on the frozen Neon World. That study needs the real objects. The City Editor below does not.

## City Editor

Plan only. No editor code in this phase. Two builders sit on one editor core. The core is the Event Space Planner's own editing tools, from the export. A permission level decides which of those tools are on, where a drag is allowed to land, and which save key it writes. New DEV tools are built on those, not beside a second editor.

| | DEV Builder | Ellie's Builder |
| --- | --- | --- |
| Who | Bob | Ellie, from her own house |
| Reach | The new world page: buildings, roads, NOS stations, spawns, props, interiors | Her build area. The drop-objects tool also runs in the current interiors. The rest of her builder stays on the new world |
| City and roads | Yes, on the Option 1 map | No. Those tools are off |
| Save | Test first, then the new world on Bob's explicit go, with a rollback. The current Neon World is not the target | Her device only, the same way her home choices already save |
| Menu | Hidden. A Bob-only unlock. New world only | Place, inside a room. First on the current Neon World house. The fuller builder opens on the new world |

The map seed is Option 1, The Boulevards (`cursor/city-layout-plan-ef23`, agent `bc-3ff1a27b`). It does not seed from today's 24 shops, and it does not seed from Option 2.

North is up. +x is east, +z is north. Spawn stays (0, 0) unless DEV moves that spawn record. DEV's city view is a top-down canvas on a test page. It redraws on pointer-up. Flat fills and strokes. No `shadowBlur`. It does not draw the 3D city while he drags, so the edit frame is not the game frame. Ellie's view is her room, same rule: flat color, brighter boxes for glow, one redraw when she lets go.

### Shared core

```text
editor
  planner tools: select, move, rotate, scale, snap, align,
                 duplicate, group, undo, measure, layers,
                 wall drawing, camera views, save and load
  permission: role, boundary, tools allowed, save target
  DEV tools on top: roads, stamp, bulk move, scatter,
                    NOS and spawns, traffic preview,
                    minimap sync, FPS meter, color
```

A gesture pushes one undo snapshot at pointer-down. Undo and Redo are labeled buttons. DEV also has Ctrl+Z and Ctrl+Shift+Z. Ellie gets the buttons. She does not need the keys.

Snap is one setting for the core. DEV uses it on the city. Ellie uses a finer step inside her room, from the same picker.

| Choice | DEV snap | Ellie snap | What it feels like |
| --- | --- | --- | --- |
| S1 | 2 m | 0.5 m | City edges land clean. A TV sits on a wall. Recommended |
| S2 | 10 m | 0.5 m | Big boulevard moves. Her room stays on the half-metre |
| S3 | 1 m | 0.25 m | Fine nudge. More dragging to cross a district |

Ellie turns a prop in quarter turns. DEV can turn a road endpoint freely, and a prop in 15° steps.

### DEV Builder

Hidden from Ellie's normal menus. No row on the drive HUD, the kid garage, the pause sheet, or her Build screen. The unlock is a latch against a curious tap. It is not account security. Anyone who reads the script can find it.

| Choice | How Bob opens it | Where |
| --- | --- | --- |
| U1 | Hold two opposite corners of the screen for 2 seconds, then a 4-digit PIN Bob chooses. A wrong code closes the pad and returns to the drive. Recommended for the live page | Live game, after this plan is approved and built |
| U2 | `?bob=1` on the test page, then the same PIN | `/test/` only. The live page ignores the query |
| U3 | The corner hold, with no PIN | Fastest. Easier for a random hold to open |

This plan recommends **U1 plus U2**. The test page uses the query so Bob can work without the hold. The live page has the hold and the PIN, and no query door. The PIN lives in his head. The game stores only a "DEV is open this session" flag, and that flag clears when the page closes.

Once open, DEV can eventually edit any of these: city buildings, roads, NOS stations, spawn points, props, and interiors. The first test still has a skeleton lock so one drag cannot delete the runway. That lock is a pick, not a missing tool. The tools exist. M3 turns the lock off.

| Choice | Editable | Locked until he picks a wider level |
| --- | --- | --- |
| M1 | Buildings, kit, and boulevard streets | Highway at x −450, both bridges, river, tunnel, runway, airport ramps, half-pipe, loop, player spawn, Sky Drop start |
| M2 | M1, plus new streets on the grass | Same skeleton. He can add a boulevard. He cannot delete the highway |
| M3 | The skeleton too. This is the full DEV reach he described | Nothing. A bad drag can cover the tunnel mouth or the river jump |

This plan recommends **M2 for the first test**, then **M3** when he wants the full reach. Unique purposes stay one each while M1 or M2 is on: one home, one main garage, one pet lounge, one paint, one showroom, one big NOS, one dance, one cafe, one arcade, one Builder HQ, one soccer shop, one field, one tower. Kit pieces may repeat, with the Option 1 exceptions: The Stage has the cafe and no snack stall, and Car Row has the big NOS and no second NOS. An arch keeps an opening at least one lane wide (3.4 m) plus the shoulders. The posts are the solids. The opening is clear.

DEV save, test, publish, rollback:

| Step | Where it lands | Who allows it |
| --- | --- | --- |
| 1. Save | This browser only, `localStorage` key `zdash.city.editor.v1` | Bob, any time, in DEV |
| 2. Drive this | The new world's test page reads that key when present, else its committed layout copy | Bob. `world.html` stays the frozen Neon World |
| 3. Publish | A reviewed commit that copies the tested JSON into the new world's layout file | Bob's explicit go, same bar as "yes, do it" |
| 4. Rollback | "Restore published" copies the previous new-world JSON back over the test key, and that commit reverts. `world.html` is not in the revert | Bob |

| Choice | How far one go goes |
| --- | --- |
| P1 | One explicit go writes the new world's layout file. The previous file is kept beside it for rollback. `world.html` stays frozen |
| P2 | The first go updates the new world's `/test/` page only. A second explicit go updates that world's live page. `world.html` stays frozen |

This plan recommends **P2**.

DEV never writes `zdash.house.v1` or `zdash.kid.v1`. Her wall, sign, sofa, arcade, pet bed, and dance floor stay the garage checkboxes. Garage Z still reads `zdash.kid.v1` → `eq` and still changes nothing else.

A DEV save is refused, and the gesture undoes, when any of these are true:

- A building footprint, grown by 3 m, covers the player spawn or the Sky Drop start (180, 520).
- A traffic lane sample (each `ROADS.spawns` point, and a point every 4 m along each lane) probes as a solid wall. Ramps, outlines, and billboards stay legal. Arch posts count. The arch opening stays clear.
- The player spawn or the Sky Drop start sits inside a building or off the paved surface.
- A second copy of a unique purpose, a snack on The Stage, or a second NOS on Car Row, while M1 or M2 is the level.

`redesign-maps.mjs` already rejects a building that covers spawn. The loader keeps that check. Traffic's `solidAt` and `blockedBy` stay as the runtime backstop after a good file loads.

### Ellie's Builder

She builds inside one boundary. A prop that would cross it stops on the inset line. The city, the roads, NOS, spawns, and other buildings are not in her tool list. She cannot select them.

Where that boundary sits, and how big it is:

| Choice | Boundary | Size | What she can place |
| --- | --- | --- | --- |
| L1 | Inside her house. Recommended | The interiors room, 24 × 18 m (style A). The old 8.4 × 6.3 m shell is the fallback until that room exists | Furniture and tech on the floor, inset 0.4 m from each wall |
| L2 | A grass rectangle on the homestead, between the house and the garage, clear of pets, the garage, the south road, and the hitch pad | x −260..−180, z −720..−670 (80 × 50 m) | Yard props. The house, pets, and garage stay city buildings |
| L3 | One empty Builder Bay lot | Whichever dashed lot City Layout marks, once they publish the boxes | A fenced lot in the city. Option 1 currently keeps those lots empty |

This plan recommends **L1**. Her props are stored in room coordinates, so a later DEV move of the homestead carries the furniture with the room. L2 can be added later as a second area with its own list. L3 waits, because those lots are the build-your-own ground for a future game.

How she opens it:

| Choice | Entry |
| --- | --- |
| H1 | A Build control on the house interior, after she is already inside. Recommended. UI Polish places it. It stays off the driver HUD |
| H2 | A control at the homestead door, before she walks in |

The words are Place, Turn, Done, and Undo. Palette groups are Screens, Sound, Seats, and Tables, with the tech first. A full room stops at the interior budget (under 48 instances, one video) and says "This room is full." The hero pieces the garage already saves (sofa, arcade, pet bed, dance floor) stay those checkboxes. They are not a second copy in this palette, so her builder cannot clear them.

Her save is a new key, `zdash.ellie.builder.v1`. One list per room purpose, so a TV in the house does not appear in the arcade:

```text
{ v: 1, rooms: { HOME: [{ prop, x, z, yaw, params }], ARCADE: [], CAFE: [], PETS: [], SOCCER: [], BUILDER: [] } }
```

`x` and `z` are metres on that room's floor, not city coordinates. `params` is the catalog size, color, glow, and proportions. The write path is this key only. It does not call `saveHouse` or `walkHouseSave`. It does not patch `house` inside `zdash.kid.v1`. Clearing the site data clears this list the same way it clears her other device saves. There is no account in the cloud. DEV publish does not read or write this key. Both worlds read this key. The current world draws it only while a walk-in room is open. The new world draws the same list in the matching room.

### Planner tools as the DEV base

The export from agent `bc-04ef9a95` will include these editor tools. This map uses the names Bob listed. When the zip arrives, match the real functions and keep this job for each one. The object meshes still wait on that zip. The tool jobs below do not.

DEV uses each tool on the Option 1 city and on interiors. Ellie gets the simple form only, and only inside her boundary. A tool marked off is absent from her screen.

| Planner tool | DEV Builder use | Ellie, simple form |
| --- | --- | --- |
| Select | Click one footprint, marquee a block, shift-click to add. The locked skeleton is visible and not selectable until M3 | Tap one prop in her room. Tap the floor to clear. No marquee |
| Move | Drag a building, a road endpoint, a prop, or a spawn pin. Spawn guards run when he lets go | Drag a prop. It stops on the 0.4 m inset |
| Rotate | Buildings and props in 15° steps. A road endpoint stays free so a bend can meet the next node | Quarter turns. One Turn button |
| Scale | Kit pieces and props use catalog proportions. A unique building scales only if the door still faces a street and the spawn guards pass. Road width is a number (street 20 m, highway 30 m), not a corner handle | Bigger and Smaller. Three catalog sizes. The prop must still sit inside the inset |
| Snap | City grid from S1, S2, or S3. A road end within 4 m of another end snaps to that node so `ROADS.rebuild` makes one chain | 0.5 m on S1 and S2, 0.25 m on S3. Same picker, her step |
| Align | Match edges or centers to the grid, to a road, or to another building. "Face the nearest street" writes `face` | Two buttons: Against the wall, and Line up with the last prop |
| Duplicate | One copy of a prop, or the building stamp below. Unique purposes still refuse a second copy while M1 or M2 is on | One more of the selected prop, if it fits and the room is under 48 |
| Group | Buildings on one station, or the props in one lot. Bulk move uses the group | Off in the recommended set. Pack C sticks up to 4 props and moves them together |
| Undo | 50 steps. Buttons, plus Ctrl+Z and Ctrl+Shift+Z. One snapshot at pointer-down | Undo and Redo buttons. 20 steps. The labels are Undo and Redo |
| Measure | Length and footprint in metres while a wall or a road is drawn. Lane width reads 3.4 m | A short readout on the selected prop, such as "2 m wide" |
| Layers | Roads, buildings, kit, props, spawns, and the locked skeleton. Hide one to edit under it. The skeleton stays unselectable until M3 | Off. Her props are one list. No panel named Layers |
| Wall drawing | Builder HQ walls, roofs, openings, and trim, baked to the NOS-style boxes. A door or window splits the wall | Off. The house shell stays the interiors room. She places objects in it |
| Camera views | Top-down city, a read-only street preview on the chase camera (`FLYCAM` behind the car), and a walk inside the selected building. The street preview does not replace the driver HUD | Two views: Floor (top-down of her room) and Walk (the room she is already in) |
| Save and load | Save writes `zdash.city.editor.v1`. Load reads it back. A file that fails the spawn guards is refused and the previous test key stays. Publish is the separate explicit go, not this button | Done writes `zdash.ellie.builder.v1`. No file picker. Start over clears that key only, after she confirms, and leaves the house checkboxes alone |

Ellie packs, for Bob to pick:

| Pack | Tools she gets | Left off |
| --- | --- | --- |
| A | Select, move, quarter-turn, snap, undo, Done | Align, scale, duplicate, measure, color, cameras beyond Walk |
| B | A, plus duplicate, Against the wall, Line up, Bigger and Smaller, the width readout, Floor and Walk, and a short neon row | Group, wall drawing, layers, every city tool |
| C | B, plus stick-together of up to 4 props | Wall drawing, layers, every city tool |

This plan recommends **B**. The words stay Place, Turn, Done, and Undo. Bigger, Smaller, Line up, and Against the wall use those plain names. Pack C is there if he wants a group. Wall drawing and layers stay DEV either way.

### DEV tools built on the planner tools

Each one calls the planner tool under it, then writes the city document. They stay off Ellie's screen. The editor still redraws on pointer-up, with flat fills and strokes, and no `shadowBlur`.

| Tool | Built on | What it writes | Guard |
| --- | --- | --- | --- |
| Road and lane drawing | Wall drawing | A road segment `{x0,z0,x1,z1,kind,w}`. Lanes, chains, and traffic spawns come from `ROADS.rebuild` on the test reload. A street is two lanes. Width 30 m or more is the highway case, three lanes per direction, matching today's chain rule | The new centerline is sampled every 4 m. A sample inside a building refuses the segment. The arch opening stays a gap. Ellie does not get this tool |
| Building stamp | Duplicate | A copy of a kit piece (bay, small NOS, pad, snack, arch) or of a prop set on a lot. One click places the next copy on the snap grid | A second unique purpose is refused while M1 or M2 is on. The copy must clear spawn and lanes. Empty Builder Bay lots stay empty unless he stamps onto one on purpose |
| Bulk move | Group, then move | Every building in the marquee, and the road segments he included, shift by the same dx, dz. One undo step | Spawn guards run on the whole block. A block that would cover spawn or a lane snaps back |
| Prop scatter | Duplicate | A count of one catalog prop along a sidewalk or inside a lot. Spacing is at least 4 m. Cap 12 per scatter | The FPS meter shows the add before it commits. A scatter that pushes a street view over 4 detailed buildings inside 170 m, or a room over 48 instances, is refused |
| NOS and spawn placement | Move on a pin | Big NOS and small NOS are buildings with purpose NOS. Player spawn and Sky Drop start are pins. Traffic spawns stay derived from lanes. He can see them. He does not hand-place each car | A pin inside a building, or off the paved surface, is refused. Car Row keeps one big NOS. Other cities keep the small canopy |
| Traffic-path preview | Measure, plus the lane list | On the top-down canvas, lane centerlines in one flat color and `blockedBy` stretches in another. It is a picture of the graph. It is not a running traffic sim, and it does not edit `physics.js` | Preview updates when the pointer goes up, after `ROADS.rebuild` in the editor's copy of the graph. The test page still reloads to rebuild `world/traffic.js` |
| Minimap auto-sync | Save | A road or building save marks the minimap bake dirty. Drive this reloads `/test/`, and `miniBake` redraws from `CITY.ROADS` and `CITY.BL` inside the layout bounds. The editor's corner map uses that same bake | Flat fills and strokes. No `shadowBlur` added to the bake. The live driver HUD stays as it is until the publish go. Her props are not on the minimap |
| FPS cost meter | Measure | After each edit, a line: instances added, triangles, videos, and whether this street view is still at or under 4 detailed buildings inside 170 m. A room edit also shows the 48-instance cap and the one-video cap | The meter estimates from those counts and the ceilings already measured. It does not run the 40-draw stress on every drag. An edit that would add `shadowBlur`, a second video element, or a new shader is refused |
| Lighting and neon color | Scale's params, the catalog `color` and `glow` | One flat body color and one brighter glow color per part. Glow is an unlit box, the same rule as the NOS prefab | The picker stores two hexes. It has no blur radius. Street screens stay baked colors. The one video element is unchanged |

Packs of the new tools:

| Pack | Included | Left for later |
| --- | --- | --- |
| N1 | Road and lane drawing, building stamp, NOS and spawn pins, minimap sync, FPS meter | Bulk move, traffic preview, color picker, scatter |
| N2 | N1, plus bulk move, traffic-path preview, and the neon color picker | Prop scatter |
| N3 | N2, plus prop scatter with the cap of 12 | Nothing from this list |

This plan recommends **N2**. Scatter is the one most likely to fill a street view, so it waits for an explicit yes. Ellie does not get N1, N2, or N3. Her simple color row, if pack B is the pick, is four swatches on a screen or a strip: cyan `#3ee6ff`, magenta `#ff4fd8`, amber `#ffb020`, and white. That row writes the same `color` and `glow` fields. It is not the DEV picker.

### Layout file

DEV's city document, version 1, option `boulevard`. Suggested path when the build is approved: `docs/city-layout/layout.json`. City Layout's `docs/city-layout/coords.json` is the building list for the pictures. Roads today live only in `roadsFor('boulevard')` inside `docs/city-layout/redesign-maps.mjs`. The game file is still the hardcoded `shop()` calls and the 100 m / 200 m grid in `world/city.js`. `CITY.toJSON` and `ROADS.fromJSON` already exist and nothing loads them as the map.

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

Buildings use the Option 1 boxes. Kit kinds: `arch`, `bay`, `nos`, `pad`, `snack`, plus the unique places (home, pets, garage, tower, paint, showroom, cafe, dance, arcade, builder, soccer, field, track, jump roof). `face` is the door side (`n`, `e`, `s`, `w`). `h` is metres. `coords.json` has neither field yet. Roads use the boulevard segments: highway, two bridges, river, the shoulder out of spawn, and the city streets. `kind` matches what the minimap already strokes: `street`, `highway`, `bridge`, `tunnel`, `track`. A boulevard lane is a street. Water stays a river band.

Empty Builder Bay lots stay `lots` with `empty: true`. They are build-your-own ground. The seed does not put a shop on them. Ellie's list is not a lot in this file.

### Drag

Top-down for DEV. Select a footprint or a road. Her room uses the same drag on a prop.

- A building drag moves the whole footprint. The door face stays on the side Bob last set, and a "face the nearest street" button writes `face` from the closest road.
- A road drag moves one endpoint, or the whole segment if he grabs the middle. Add-road is two clicks. This tool is DEV-only.
- An endpoint within 4 m of another endpoint snaps to that node, so `ROADS.rebuild` makes one chain. The live graph already rounds nodes to 0.1 m.
- Her prop drag clamps to the boundary inset. Turn is a quarter turn per tap.

### Roads, lanes, and the minimap

A DEV road save writes the segment, then the test page reloads. On load the test city calls the existing `ROADS.addRoad` for each segment and `ROADS.rebuild`. That rebuild fills `lanes`, `chains`, and `spawns`, and `updateBlocked` marks stretches where a probe hits a building. Traffic reads those lanes once per page load (`world/traffic.js` sets `built` and returns). A reload is the v1 update. A hot rebuild without a reload can come later from Traffic Physics (`bc-2af9e871`); this plan does not edit `physics.js`.

The minimap already bakes `CITY.ROADS` and building footprints once (`miniBake` in `world/hud.js`). A reload rebuilds that image from the new graph. The test copy reads `bounds` from the layout so the west track street is on the image. The bake stays flat fills and strokes. This plan does not add `shadowBlur` to it, and it does not change the live driver HUD. Her prop save does not touch the minimap. Yard and room props are too small for that bake.

### Frame cost

Both levels share the cheap path.

- DEV's map is one 2D canvas. Redraw when the pointer goes up. No `shadowBlur`. No 3D city during the drag.
- Ellie's room stays on the walk canvas, or a top-down of that floor only. Glow is a brighter flat color.
- Her placed props share the one box mesh already in the FPS section. Cap 48 instances in the room, one 256×144 video. The FPS meter reads that cap. It does not launch a stress frame.
- The planner's three.js view stays in the editor. The game loads baked boxes. That view is not the drive frame.

### What City Layout changes so the map is data

Agent `bc-3ff1a27b` keeps ownership of Option 1. DEV consumes their file. Their branch still has buildings in `coords.json` and roads only inside the picture generator. For DEV to drive the test map, their build needs these:

1. Put the boulevard roads, the two spawns, and the bounds in the same layout file as the buildings. Keep Option 2 out of the file the game loads.
2. Add `h` and `face` on every building. Unique places keep today's heights. Kit sizes stay the ones in their plan (bay about 20×14×8, NOS kiosk about 16×12×6, pad about 28×28×6, snack about 12×10×5, arch about 8 m deep and 12 m tall).
3. Mark the locked skeleton: highway, bridges, river, tunnel, runway, ramps, half-pipe, loop, player spawn, Sky Drop start. M3 is allowed to edit those marks. The file still ships with them locked.
4. Option 1 may land once on `world/city.js`. That landing is the freeze. After it, `world/city.js` takes bug fixes and FPS fixes only. The data-driven loader, `ROADS.addRoad`, and `ROADS.rebuild` from the layout file belong to the new world page, not to a second edit of the frozen city.
5. Map kinds to purposes: bay → GARAGE, small and big NOS → NOS, pad → SKY_DROP, snack → the stall, arch → posts with an open lane. One BUILDER. Empty lots stay empty.
6. Export `bounds` for the test minimap. The test copy of `miniBake` uses them. The live HUD stays as it is.
7. Do not cache the old road grid. Traffic builds lanes from `CITY.ROADS` at page load, so a test reload is enough.
8. Leave the homestead buildings where they are. Ellie's boundary is inside the house (L1) or on the grass between the house and the garage (L2). Her props are not city records.

### Picks for Bob

1. Unlock: **U1** on the live page and **U2** on `/test/`, or U3 (gesture, no PIN).
2. Snap: **S1** (2 m city, 0.5 m in her room), S2, or S3.
3. DEV reach for the first test: M1, **M2**, or M3. M3 is the full reach, when he wants it.
4. Publish: P1 (one go writes the live map) or **P2** (test go, then a second go).
5. Her area: **L1** (inside the 24 × 18 m house), L2 (80 × 50 m of yard), or L3 (a Builder Bay lot).
6. Her entry: **H1** (Build inside the house) or H2 (at the door).
7. Her tools: pack A (move and turn only), **pack B** (plus duplicate, align, three sizes, measure, Floor view, four neon swatches), or pack C (B plus stick-together).
8. New DEV tools: pack N1 (roads, stamp, NOS and spawns, minimap, FPS meter), **pack N2** (N1 plus bulk move, traffic preview, color picker), or pack N3 (N2 plus prop scatter).
9. New world name: **Neon Bay**, The Boulevards, Z City, or Neon World 2. The section below is the full choice.
10. Drop-objects first test: **R1** (current house, tech only), R2 (house, tech plus seats and tables), or R3 (all six current rooms at once). Same save on the new world.

Bold items are the recommendation. Nothing here is built. The object swap and the review shots still wait on the planner zip. The tool names above are the ones Bob listed. The zip confirms the real functions.

## The new world

Bob's decision: after the Option 1 layout lands, the current Neon World freezes. Later changes there are bug fixes and FPS fixes. Major redesigns go to a new world on its own page. That includes the DEV Builder, Ellie's Builder, the planner editor tools, and the new building designs from the object study. The exception is the drop-objects tool: Ellie tests it in the current interiors first, and the same tool runs on the new world. This phase still does not build the page or the tool. The object swap still waits on the zip.

The current game stays the one she already plays.

- `world.html` and `world-split.html` stay the frozen city. Adult `index.html` is not a home for the new tile.
- Option 1, The Boulevards, is allowed to land once, as City Layout's build. That is the freeze line.
- After the freeze, a planner wall, a road drag, or a new building does not get patched into `world/city.js`. A dropped prop is drawn by the room painter, in room coordinates, and does not change the city file.
- Soccer, Sky Drop, the runway, and today's drive keep working on that page.

### Its own page and tile

One HTML page, the same kind of split page as `world.html`: its own document, its own city script, the shared car, house, and crew readers. It is not a mode flag on `world.html`.

The JR menu gains one tile, in `KTILES` in `jr.html`, directly after the existing NEON WORLD tile (`k: 'world'`, which already goes to `world.html`). The click path is the same `navMap` assign that tile uses. The new tile uses the same unlock as Neon World, `zd_world_unlocked`, so a locked world stays a locked pair. UI Polish reviews the label before the tile is visible. The adult page does not get a copy of the tile.

Until Bob's explicit go, the page is reachable on `/test/` by URL only. The JR tile is the go that puts it on her menu. `sw.js` learns the new filename in `pageKey` and `isSplitPath` at that go, so a refresh caches the new page on its own and does not treat it as `index.html` or replace the `world.html` cache entry.

| Name | Tile | File | Why it is on the list |
| --- | --- | --- | --- |
| Neon Bay | NEON BAY, sub "build the next city" | `neon-bay.html` | Recommended. Sits beside Neon World. Builder Bay is already the district where the new tools live |
| The Boulevards | THE BOULEVARDS, sub "the next map" | `boulevards.html` | Says it starts from Option 1. Long for a tile |
| Z City | Z CITY, sub "her next city" | `z-city.html` | Short. Matches the Z she already drives |
| Neon World 2 | NEON WORLD 2, sub "the new map" | `world-2.html` | Makes the freeze obvious. The number is the plain one |

This plan recommends **Neon Bay**.

### Starts from a copy of Option 1

The moment Option 1 is the frozen map, copy that layout into the new world's own file (`neon-bay/layout.json`, or the matching folder for the name he picks). If the freeze has not happened yet, the seed is the boulevard list already in this plan: the boxes from City Layout and the roads from `roadsFor('boulevard')`.

After the copy, the two files diverge.

- DEV save, test, and publish write the new world's layout only.
- Rollback restores the previous copy of that file.
- `world/city.js` is not on either side of that write.
- City edits stay in the new world's layout file. Dropped props are the exception below: the same `zdash.ellie.builder.v1` list draws in the current walk-in rooms and in the new world's rooms.

### Shared saves, car, pet, and home

One device, one Ellie. The new page reads the keys the current world already reads. It does not invent a second profile.

| Already hers | Key | What the new page does |
| --- | --- | --- |
| Car, paint, parts | `zdash.kid.v1` → `eq` | Same 370Z mesh. Garage Z still changes nothing except `eq`. A paint she sets in either place shows in both |
| Pet | `zdash.kid.v1` → `pet`, and the crew data the current world already loads | Same pet, same height 0.74 m. No second pet key |
| Home choices | `zdash.house.v1`, and the `house` object inside `zdash.kid.v1` | Wall, sign, sofa, arcade, pet bed, and dance floor stay those checkboxes. Both pages read them. The builder does not write them |
| Her placed props | `zdash.ellie.builder.v1` | New key, one list per room purpose. The current walk-in and the new world both draw it. It is not a field on the house save |
| DEV test layout | `zdash.city.editor.v1` | This browser, the new page only |

The new page may include the existing garage and house controls, and those controls keep their current write path. A new field inside `zdash.kid.v1` or `zdash.house.v1` is not how the builder stores props. Old readers keep working because the keys they already understand are unchanged.

### What stays playable

She can open NEON WORLD and the new tile from the same menu. NEON WORLD loads `world.html` and the frozen city. The new tile loads the new page and the copied layout. Drive, fly, Garage Z, the pet, and the house checkboxes work on both. A bad DEV drag rolls back the new layout and leaves the frozen city as it was.

## Drop objects

Plan only. This is the house object-placement mode: Ellie drops planner objects into a room, tech first. It is the one piece that runs in both worlds. The first test is the current Neon World, inside her house, for her. DEV Builder, the rest of Ellie's Builder, and the new building designs stay on the new world page.

The tool is the simple form of select, move, quarter-turn, snap, undo, and Done. Pack B's extra buttons can come later. Wall drawing, layers, roads, stamps, and the color picker stay off this tool. The words are Place, Turn, Done, and Undo. Palette order is Screens, Sound, then Seats and Tables. The saved hero piece (sofa, arcade, dj, or trophy), the pet bed, the sign, and the wall theme stay the garage checkboxes. This palette does not offer a second copy of those.

Both pages call one function. A prop she drops in the current house is in the new world's house, because the save is room-local and keyed by purpose.

```text
PLANNER_DROPS.list(purpose)                 → the props in zdash.ellie.builder.v1 for that purpose
PLANNER_DROPS.parts(purpose)                → boxes in room space, facing +z, y up, metres
PLANNER_DROPS.clamp(purpose, floor)         → pull a prop back inside that floor
```

`floor` is `{ w, d, h }` in metres, the kit she is standing in, inset 0.4 m. The tool does not store a city x or z. Enter already opens the kit for the door's purpose and remembers that door. This tool reads that purpose. Step outside still returns her to that door. The drop list does not change the door.

While the room is open the city loop stays held, the way Interiors already planned. The room painter draws the shell, then the saved hero piece, then `PLANNER_DROPS.parts`. Flat fills. Glow is a brighter box. No `shadowBlur`. One video element, 256×144, and only in the room she is in. A second screen in the same room is a baked color.

The cap is the shell plus the drops, together at or under 48 boxes, and one video. Interiors keeps each shell at or under 32 boxes (PR #74). A house shell of about 24 to 28 boxes leaves room for about 20 drops. Past the cap, Place says "This room is full." The meter counts boxes. It does not run a stress frame.

### Where she tests it

| Choice | First test | Later, same tool |
| --- | --- | --- |
| R1 | Current Neon World, HOME only, tech only: TV, wall screen, speaker. Recommended | The other five walk-in rooms, then the same lists on the new world |
| R2 | Current HOME, tech plus seats and tables | Same, still skipping the saved hero pieces |
| R3 | All six walk-in rooms on the current world at once | The new world reads the lists that already exist |

This plan recommends **R1**. HOME is the room she already knows. Tech is the piece Bob asked to see. Arcade is the second room when he wants it, because that room can hold the one video on the jackpot screen. Cafe, pets, soccer shop, and Builder HQ stay empty until he says the house test is good. Paint, the garage, and the dance hall stay apps. NOS, the showroom, and the sky pad stay drive-up. Those doors do not get a Place button.

The Place control sits on the house interior, after she is inside (H1). UI Polish places it. It stays off the driver HUD. The current world gets this button and the room-painter call. It does not get the DEV tools, a road edit, or a new building. That is the whole exception to the freeze.

### What Interiors needs to hook

Interiors agent `bc-80a1fc6f`, PR #74, branch `cursor/interiors-plan-52fc`, owns the six rooms. This plan does not edit that PR. Bob carries the notes below. The rooms are not built yet. The hook lands when Bob writes "plan approved, build it" for both plans.

What their plan already gives this tool:

- A kit per purpose: HOME, ARCADE, CAFE, PETS, SOCCER, BUILDER. No city id and no world coordinate in the kit. Both worlds can share it.
- House A is 24 × 18 × 4.8 m. House B is 22 × 16 × 4.6 m. The floor size comes from the concept Bob picks. This tool reads that size. It does not bake 24 × 18 into the save.
- The city loop is held while the room is open. Drops draw in that same painter, so they do not put the outdoor city back on the frame.
- Saved home keys stay `zdash.house.v1` and the house object inside `zdash.kid.v1`. Theme, furniture, pet bed, and sign stay theirs. If the prop sheet from PR #60 has landed, that sheet keeps its own cap. Drops sit on the new floor beside it. They do not replace it.

What to ask them for, through Bob:

1. At the end of the room painter, call `PLANNER_DROPS.parts(purpose)` and draw those boxes with the same flat fills as the shell. Purpose is the door she entered.
2. Pass the floor `{ w, d, h }` for the concept that was picked, A or B. One letter per room is their pick list. This tool follows that letter.
3. Leave a spot for a Place control on the interior, for UI Polish. Their plaque, hero piece, and pet bed stay their draw.
4. Keep the shell at or under 32 boxes so the shared cap of 48 still has room for her drops.
5. Do not write `zdash.ellie.builder.v1`. This plan owns that key. Do not read it from inside the house save.

What this plan will not ask them to do: move a shop, add a door, change a saved home key, or draw the new world's city. The new building designs stay on the new world, for Bob to pick from after the object study.

## What this phase does not do

It does not copy the planner. It does not edit the live world, the adult page, the driver screens, Ellie's saved home, or the Garage Z link. It does not place the trailer pad in `city.js`. It does not build the City Editor, the drop-objects tool, or the new world page. It does not add the JR tile. It does not post on the Interiors PR. It does not deploy.
