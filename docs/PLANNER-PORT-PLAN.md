# Planner port plan

Phase 1 only. Nothing here is in the live game. `world.html`, `world-split.html`, and adult `index.html` are untouched. Nothing deploys. The full port waits for Bob to write "plan approved, build it". The picks below stay open except the map-publish rule. No build and no deploy until he picks the rest.

Bob confirmed on Oct 24: DEV Builder map edits use **P2**. A map edit goes to a `/test/` link first. A second explicit go publishes that tested map to the live Neon World, and the previous live map is kept for rollback. This two-step path is only for those map edits. Ellie's Builder, the drop-objects tool, new tools, the new world page, and every other feature still deploy straight to live on his go.

## Access

The private repo `rbeaglemedia/event-space-planner` was not readable from this agent. The export zip from agent `bc-04ef9a95` is the source this plan now follows. It has 123 files: the object catalog, the five presets, and `TOOLS.md`. The venue list is not in the zip. It stays out.

This branch still does not copy those files into the game. The proof meshes stay the stand-in boxes until a later build. `LICENSES.xlsx` is in the zip (MIT, BSD, Apache, CC0). `three` is MIT, `^0.169.0`, and it is not bundled. Do not add a submodule.

The zip's own `index.html` is the planner shell. It does not replace Z-DASH `index.html`, and it is not copied onto any live page. `public/brand/rentacomputer-*.png` and the share-PNG strip stay out of the game. `src/main.js`, `src/autodoor.js`, and `src/tech-tags.js` were written for the zip. They are not original planner files.

## What to copy, when the build is approved

The zip is the source. Vite + three.js modules. Copy into `world/planner/` and do not add a script tag to a live page until the build is approved. Do not copy the planner `index.html` or the brand images. The city frame does not grow a second three.js runtime. The editor can keep three.js. The game loads the baked boxes.

| Planner path | Role | Game use |
| --- | --- | --- |
| `src/app/place.js`, `input.js`, `state.js`, `scene.js`, `view.js` | Place and edit | Builder HQ design tool only |
| `src/walls.js` | Walls, doors, size chips | Baked into the prefab below. There is no `src/venue.js` in this zip |
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
PLANNER_PROPS.place(id, params, pose) → those boxes moved to a room pose
PLANNER_PROPS.remix(id)           → local boxes for a remix id
```

`pose` is `{ x, y, z, yaw }` in the room frame from Interiors' `docs/ROOM-PLACE-HOOK.md` on PR #87. Yaw 0 faces +z. Yaw pi turns a screen toward the door. `place` is the call that hook already names. The zip has the real modules. This phase does not copy them. The proof bakers stay stand-ins until the build.

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

Anatomy Check reviews these before a build. These rows are the proof sizes. The catalog speaker is 6 ft (1.83 m), taller than Ellie, and the catalog LED trailer is 18 ft tall (5.49 m). The object study asks which of those real sizes to keep. Change the prop, not the person.

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

## What the export actually contains

`TOOLS.md` is the map. `MODES.md` is the two planner modes. `objects/README.md`, `objects/catalog.json` (61 objects), `objects/sets.json`, and `TECH.json` are the study. The venue section is absent.

The planner has two modes on one screen:

1. **Builder** draws walls and shapes. Box, walls, a 3 ft door, push a wall, size chips, floors from −3 to 20. There is no roof tool. A closed wall polygon is the outline. Z-DASH adds the roof on that outline, the same stacked boxes already in the building-export section.
2. **Place objects** drops catalog items. Select, drag, quarter-turn, copy, delete. Technology is tagged: 34 tech items, 18 of them screens.

DEV Builder, Ellie's Builder, and the drop-objects tool are the Z-DASH uses of those two modes. They are planned for the current Neon World. A new building look from the object study is the piece that goes to the new world page. The object study is below. The City Editor is the DEV reach on today's city.

## City Editor

Plan only. No editor code in this phase. Two builders sit on one editor core. The core is the tools `TOOLS.md` actually lists. A permission level decides which of those tools are on, where a drag is allowed to land, and which save key it writes. Tools the planner does not have are new work, listed after the map. They are not described as if the zip already contained them.

DEV writes the city through one new call, `CITY.editorDoc()`. It does not exist in `world/city.js` today. `CITY.toJSON` already serializes objects and roads, and nothing loads that string as the live map. `CITY.editorDoc()` is the document DEV mutates instead.

| | DEV Builder | Ellie's Builder |
| --- | --- | --- |
| Who | Bob | Ellie, from her own house |
| Reach | The current Neon World: buildings, roads, NOS stations, spawns, props, interiors. A new art style is the piece that stays on the new world | Her build area on the current Neon World, and the same tools if that room exists on the new world |
| City and roads | Yes, on the Option 1 map | No. Those tools are off |
| Save | Map edits: `/test/` first, then the live map on a second explicit go, previous map kept. Confirmed Oct 24 | Her device only, the same way her home choices already save. One go when he says to ship it |
| Menu | Hidden. A Bob-only unlock on the current game | Place, inside a room on the current Neon World. Her fuller builder is on that same house |

The map seed is Option 1, The Boulevards (`cursor/city-layout-plan-ef23`, agent `bc-3ff1a27b`). It does not seed from today's 24 shops, and it does not seed from Option 2.

North is up. +x is east, +z is north. Spawn stays (0, 0) unless DEV moves that spawn record. DEV's city view is a top-down canvas on a test page. It redraws on pointer-up. Flat fills and strokes. No `shadowBlur`. It does not draw the 3D city while he drags, so the edit frame is not the game frame. Ellie's view is her room, same rule: flat color, brighter boxes for glow, one redraw when she lets go.

### Shared core

```text
editor
  tools that exist: select, move, quarter-turn, snap,
                    copy / same again / keep placing,
                    wall guides, poster and stage links, hosting,
                    100-step undo, size readouts, floors −3..20,
                    box / walls / doors, top and 3D, save and load
  permission: role, boundary, tools allowed, save target
  CITY.editorDoc(): the city document DEV writes
  new tools: scale, align, array, general group, measure,
             named layers, free rotate, roofs,
             plus roads, stamp, bulk move, scatter,
             NOS and spawns, traffic preview,
             minimap sync, FPS meter, color
```

A gesture pushes one undo snapshot at pointer-down. The planner keeps 100 whole-layout snapshots. Undo and Redo are labeled buttons. DEV also has Ctrl+Z, Ctrl+Y, and Ctrl+Shift+Z. Ellie gets the buttons. She does not need the keys.

Snap is one setting for the core. The planner itself snaps items to 0.5 ft (0.15 m) and snaps walls by camera distance (0.5 ft up close, 25 ft from far away). DEV's city view is metres, so his city snap is the table below. Her room snap follows the same picker, and the drop tool uses the room hook's slot snap instead of this grid.

| Choice | DEV snap | Ellie snap | What it feels like |
| --- | --- | --- | --- |
| S1 | 2 m | 0.5 m | City edges land clean. A TV sits on a wall. Recommended |
| S2 | 10 m | 0.5 m | Big boulevard moves. Her room stays on the half-metre |
| S3 | 1 m | 0.25 m | Fine nudge. More dragging to cross a district |

Ellie turns a prop in quarter turns. That is the only rotate the planner has. DEV turns a prop the same way unless he picks the new 15° tool below. A road endpoint is not a rotate. He drags it, and the bend is whatever the two nodes make.

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
| 2. Drive this | `/test/world.html` reads that key when present, else the committed layout | Bob. The live page keeps the last published map until the next go |
| 3. Publish | A reviewed commit that copies the tested JSON into the layout the live Neon World loads | Bob's second explicit go, same bar as "yes, do it". The first go only updates the `/test/` link. A new art style is not this commit |
| 4. Rollback | The previous live map file is kept beside the new one. "Restore published" copies that previous file back, and that commit reverts | Bob |

| Choice | How far one go goes |
| --- | --- |
| P1 | One explicit go writes the live Neon World layout. The previous file is kept beside it for rollback. Closed for map edits on Oct 24 |
| P2 | The first go updates `/test/` only. A second explicit go updates the live Neon World. The previous live map is kept for rollback. A new art style still goes to the new world, on its own go |

**P2 is confirmed** for DEV Builder map edits (Oct 24). A map edit is a change to buildings, roads, NOS stations, spawns, or the layout `CITY.editorDoc()` writes. The first go puts that layout on a `/test/` link. The live page keeps the last published map until the second go. That second go is a separate explicit yes. The file it replaces stays in the repo so the live map can be rolled back.

This exception is only the map. It does not cover Ellie's Builder, the drop-objects tool, a new tool, the trailer, or the new world page. Those still deploy straight to live when Bob says go. They do not wait for a second publish step.

### CITY.editorDoc()

This is how DEV changes the current Neon World. One function, two uses. A read returns the document he is editing. A write replaces it after the guards pass. Buildings, roads, NOS stations, and spawns are fields on that document. Dragging a building writes its new footprint. Adding a road appends a segment. The test reload is what turns the document into the city: it calls the existing `ROADS.addRoad` for each segment, then `ROADS.rebuild`, and it places each building from the list. The live page does not call this until the publish go.

```text
CITY.editorDoc() → {
  v: 1, option: "boulevard",
  bounds, snapM,
  spawns: [{ id, x, z, locked }],
  buildings: [{ id, name, kind, purpose, station, x0, x1, z0, z1, h, face, locked }],
  roads: [{ id, x0, z0, x1, z1, kind, w, locked }],
  lots: [{ id, x0, x1, z0, z1, empty: true }]
}

CITY.editorDoc(next) → the same document, or the previous one if a guard fails
```

M1 and M2 refuse a write that touches a locked row. M3 accepts a write to any row, which is the full reach: any building, any road, the highway, the bridges, the spawns. A new art style is not a field on this document. That publish goes to the new world's file, on its own go.

The browser copy of a test edit is still `zdash.city.editor.v1`. `/test/world.html` loads that key when it is present, then calls `CITY.editorDoc` with it. Clearing the key returns the test page to the committed layout.

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

Her save is the key Interiors already reads, `zdash.ellie.builder.v1`. This tool is the writer. `ROOM_PLACE.read` is the reader. A flat value `{ v: 1, area: "house", props: [...] }` still means the house only. A rooms map covers the house, the eight sampler rooms, and the five later rooms:

```text
{
  v: 1,
  rooms: {
    house: { props: [{ prop, x, y, z, yaw, wall, slot, params }] },
    glass: { props: [] }
  }
}
```

Room ids are `house`, `glass`, `wood`, `pop`, `pastel`, `loft`, `plants`, `future`, `neon`, `arcade`, `cafe`, `pets`, `soccer`, and `builder`. `prop` is a catalog id. `params` is size, color, glow, and proportions. `wall` is `far`, `left`, `right`, or null on a floor piece. `y` is 0 on the floor, or the bottom of a wall piece. `slot` is the slot id from the hook. The write path is this key only. It does not call `saveHouse` or `walkHouseSave`. It does not patch `zdash.house.v1`, the `house` object inside `zdash.kid.v1`, or `zdash.sampler.likes.v1`. Clearing the site data clears this list the same way it clears her other device saves. There is no account in the cloud. DEV publish does not read or write this key. The current walk-in draws a room's list while that room is open. The new world draws the same list when it has that room.

### Planner tools as the DEV base

These are the tools in the zip, named the way `TOOLS.md` names them. DEV uses each one on the city or inside a building, then `CITY.editorDoc(next)` stores the result. Ellie gets the simple form only, and only inside her boundary. A tool marked off is absent from her screen.

| Planner tool | Where it lives | DEV Builder use | Ellie, simple form |
| --- | --- | --- | --- |
| Select | `ESP.select`, `#selBar` | One footprint. Shift-click adds. The locked skeleton is visible and not selectable until M3 | Tap one prop. Tap the floor to clear |
| Move | `snapPose`, `applyPose` | Drag a building, a road endpoint, or a spawn pin. Hosted pieces ride along. A bad spot snaps back. The write is `CITY.editorDoc` | Drag a prop. It stops on the 0.4 m inset. A bad spot snaps back |
| Wall push | `pushWall` | Slide a building wall. A square stays square. A wall under 1 ft (0.3 m) is rejected | Off. She does not edit the house shell |
| Rotate | `#btnRot`, R key | Quarter turn only. That is the whole tool. A road endpoint is dragged, not rotated | Quarter turns. One Turn button |
| Snap | Walls by distance. Items always 0.5 ft | City grid from S1, S2, or S3. A road end within 4 m of another end snaps to that node | 0.5 m on S1 and S2, 0.25 m on S3. The drop tool uses the 0.75 m slot snap instead |
| Wall guides | `drawPoint` axis lock | New walls stay on x or z. A guide shows when a free end lines up with a corner. This is not object align | Off |
| Duplicate | Copy, Same again, Keep placing | One copy, or tap-to-stamp. No counted array. Unique purposes still refuse a second copy while M1 or M2 is on | Copy makes one more, if it fits and the room is under 48. Same again stays off |
| Linked run and hosting | `ledposter` and `stage` links. `top` and `edge` hosts | A poster wall or a stage deck moves as one run. A laptop on a table rides the table. There is no group command for a mixed selection | Off in the recommended set. Hosting still works if she later places a laptop on a table |
| Undo | `history.js`, 100 snapshots | 100 steps. Buttons, plus Ctrl+Z, Ctrl+Y, and Ctrl+Shift+Z | Undo and Redo buttons. The same 100-step stack. The labels are Undo and Redo |
| Size readouts | `#sizeLbl`, segment lengths, catalog `sizeText` | Footprint in metres while a wall or a road is drawn. Lane width reads 3.4 m. This is a label, not a measure tool | The selected prop's size, such as "1.2 m wide" |
| Floors | `#lvlBar`, level −3..20 | One building can keep a shell per floor. Not a layer panel | Off. Her room is one floor. The loft upper slot is a placement height, not a second editor floor |
| Box, walls, door | `#drawTools`. Door is 3 ft, minimum 3 ft | Builder HQ shells, baked to the NOS-style boxes. A door splits the wall. People doors stay about 0.9 m. A car arch stays at least 3.4 m and is not this door | Off. The house shell stays the interiors room |
| Top and 3D | `#btnTop`, T, Reset | Top-down city, and a read-only street check on the chase camera. That check does not replace the driver HUD | Floor (top-down of her room) and Walk (the room she is already in) |
| Save and load | `esp.layout.v3` in the planner | Save writes `zdash.city.editor.v1` and `CITY.editorDoc`. Load reads it back. A file that fails the guards is refused. Publish is the separate explicit go | Done writes `zdash.ellie.builder.v1`. No file picker. Start over clears that key only, after she confirms |

The planner save schema still has `venue` and `fill` fields. This export never fills them. Z-DASH does not add those fields.

Ellie packs, for Bob to pick. Every tool in A and B exists in the zip, except the four color swatches, which are new and tiny:

| Pack | Tools she gets | Left off |
| --- | --- | --- |
| A | Select, move, quarter-turn, snap, undo, delete, Done | Copy, size readout, Floor view, color, every city tool |
| B | A, plus Copy, the size readout, Floor and Walk, and four neon swatches (cyan `#3ee6ff`, magenta `#ff4fd8`, amber `#ffb020`, white) | Same again, wall drawing, floors, every city tool, and every missing tool below |
| C | B, plus a new stick-together of up to 4 props. The planner cannot do this. It is the small form of the new group tool | Wall drawing, floors, every city tool |

This plan recommends **B**. The words stay Place, Turn, Done, and Undo. Pack C is there if he wants a group. She does not get scale, align, array, measure, or layers in any of these packs. Those are new tools, and they stay on the DEV list unless he asks for one of them on her screen.

### Tools the planner does not have

`TOOLS.md` lists these as not implemented. Each row is new work. The closest planner behavior is what the new tool extends. None of this is in the zip to port.

| New tool | Closest thing in the planner | What DEV would gain | Ellie |
| --- | --- | --- | --- |
| Object scale | Door width only. Object envelopes stay the catalog size | A corner handle on a kit piece or a prop. Road width stays a number (street 20 m, highway 30 m) | Off, unless he later asks for three sizes. A scaled prop must still sit inside her inset |
| Align and distribute | Axis lock and corner guides while drawing walls | Match edges or centers of a selection. Even gaps. "Face the nearest street" writes `face` | Off. Against a wall is the existing wall snap, not this tool |
| Array | Copy, or Same again, with no count | A count, a spacing, and a grid of copies. Cap 12 | Off |
| General group | Linked posters and stage decks, plus hosted items | Group and ungroup a mixed selection. Bulk move uses the group. One undo step | Only if he picks pack C, and then only up to 4 props |
| Measure | Room size label, wall lengths, catalog size text | Tap two points. The readout is metres | Off. She keeps the size label |
| Named layers | Floors −3..20, one active floor | Show or hide roads, buildings, props, spawns, and the locked skeleton. Floors stay as they are | Off |
| Free rotate | Quarter turn only | 15° steps on a prop. Roads stay endpoint drags | Off. She stays on quarter turns |
| Roof | No roof tool. The closed polygon is the outline | Flat, pitched, and dome roofs as stacked boxes on that outline. Already specified in the building export | Off |

| Pack | New tools included | Left out |
| --- | --- | --- |
| Q1 | Roof, and the measure tap | Scale, align, array, group, layers, 15° rotate |
| Q2 | Q1, plus align, general group, and 15° rotate | Scale, array, named layers |
| Q3 | All eight | Nothing from this list |

This plan recommends **Q2**. The roof is required for Builder HQ. Align, group, and a finer rotate are the ones that make a city drag feel finished. Scale, array, and named layers can wait. They are the ones most likely to break a footprint, a 48-prop room, or the spawn guards. Ellie does not get Q1, Q2, or Q3.

### DEV tools built on the planner tools

Each one calls a planner tool or one of the new tools, then writes `CITY.editorDoc`. They stay off Ellie's screen. The editor still redraws on pointer-up, with flat fills and strokes, and no `shadowBlur`.

| Tool | Built on | What it writes | Guard |
| --- | --- | --- | --- |
| Road and lane drawing | Wall drawing | A road segment on the document. Lanes come from `ROADS.rebuild` on the test reload. A street is two lanes. Width 30 m or more is the highway case, three lanes per direction | The new centerline is sampled every 4 m. A sample inside a building refuses the segment. The arch opening stays a gap |
| Building stamp | Copy | A copy of a kit piece (bay, small NOS, pad, snack, arch). One click places the next copy on the snap grid | A second unique purpose is refused while M1 or M2 is on. The copy must clear spawn and lanes. Empty Builder Bay lots stay empty unless he stamps onto one on purpose |
| Bulk move | General group, then move | Every building in the selection, and the road segments he included, shift by the same dx, dz. One undo step | Spawn guards run on the whole block. A block that would cover spawn or a lane snaps back. Without Q2, bulk move waits |
| Prop scatter | Array | A count of one catalog prop along a sidewalk or inside a lot. Spacing is at least 4 m. Cap 12 | The FPS meter shows the add before it commits. A scatter that pushes a street view over 4 detailed buildings inside 170 m, or a room over 48 props, is refused. Without Q3, scatter waits |
| NOS and spawn pins | Move | Big NOS and small NOS are buildings with purpose NOS. Player spawn and Sky Drop start are pins. Traffic spawns stay derived from lanes | A pin inside a building, or off the paved surface, is refused. Car Row keeps one big NOS |
| Traffic-path preview | The lane list, drawn flat | Lane centerlines in one color and blocked stretches in another. It is a picture of the graph. It is not a running sim, and it does not edit `physics.js` | Updates when the pointer goes up. The test page still reloads to rebuild `world/traffic.js` |
| Minimap sync | Save | A road or building save marks the minimap bake dirty. Drive this reloads `/test/`, and `miniBake` redraws from `CITY.ROADS` and `CITY.BL` inside the layout bounds | Flat fills and strokes. No `shadowBlur`. Her props are not on the minimap |
| FPS cost meter | The size readout, plus the counts | Instances added, triangles, videos, and whether this street view is still at or under 4 detailed buildings inside 170 m | It estimates. It does not run the 40-draw stress on every drag. An edit that would add `shadowBlur`, a second video, or a new shader is refused |
| Neon color | Two hex fields on the prop | One flat body color and one brighter glow color. Glow is an unlit box | The picker has no blur radius. Street screens stay baked colors |

Packs of the new tools:

| Pack | Included | Left for later |
| --- | --- | --- |
| N1 | Road and lane drawing, building stamp, NOS and spawn pins, minimap sync, FPS meter | Bulk move, traffic preview, color picker, scatter |
| N2 | N1, plus bulk move, traffic-path preview, and the neon color picker | Prop scatter |
| N3 | N2, plus prop scatter with the cap of 12 | Nothing from this list |

This plan recommends **N2** together with **Q2**. Bulk move needs the new group tool, so N2 without Q2 ships the roads, the stamp, the pins, the preview, and the color picker, and holds bulk move until the group exists. Scatter waits for an explicit yes, and it also waits on the array tool (Q3). Ellie does not get N1, N2, or N3. Her four swatches, if pack B is the pick, write the same two hex fields. They are not the DEV picker.

### Layout file

DEV's city document, version 1, option `boulevard`. This is the value `CITY.editorDoc()` returns. Suggested path when the build is approved: `docs/city-layout/layout.json`. City Layout's `docs/city-layout/coords.json` is the building list for the pictures. Roads today live only in `roadsFor('boulevard')` inside `docs/city-layout/redesign-maps.mjs`. The game file is still the hardcoded `shop()` calls and the 100 m / 200 m grid in `world/city.js`. `CITY.toJSON` and `ROADS.fromJSON` already exist and nothing loads them as the map.

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

- A building drag moves the whole footprint and writes it through `CITY.editorDoc`. The door face stays on the side Bob last set. "Face the nearest street" is the new align tool (Q2). It writes `face` from the closest road.
- A road drag moves one endpoint, or the whole segment if he grabs the middle. Add-road is two clicks, then `CITY.editorDoc` appends the segment. This tool is DEV-only.
- An endpoint within 4 m of another endpoint snaps to that node, so `ROADS.rebuild` makes one chain. The live graph already rounds nodes to 0.1 m.
- Her prop drag clamps to the boundary inset. Turn is a quarter turn per tap.

### Roads, lanes, and the minimap

A DEV road save writes the segment through `CITY.editorDoc`, then the test page reloads. On load the test city calls the existing `ROADS.addRoad` for each segment and `ROADS.rebuild`. That rebuild fills `lanes`, `chains`, and `spawns`, and `updateBlocked` marks stretches where a probe hits a building. Traffic reads those lanes once per page load (`world/traffic.js` sets `built` and returns). A reload is the v1 update. A hot rebuild without a reload can come later from Traffic Physics (`bc-2af9e871`); this plan does not edit `physics.js`.

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
4. Option 1 may land on `world/city.js`. After that, the test page loads this layout by calling `CITY.editorDoc`, then `ROADS.addRoad` and `ROADS.rebuild`. A new building look or a new city art style does not land in that file. It lands on the new world page.
5. Map kinds to purposes: bay → GARAGE, small and big NOS → NOS, pad → SKY_DROP, snack → the stall, arch → posts with an open lane. One BUILDER. Empty lots stay empty.
6. Export `bounds` for the test minimap. The test copy of `miniBake` uses them. The live HUD stays as it is.
7. Do not cache the old road grid. Traffic builds lanes from `CITY.ROADS` at page load, so a test reload is enough.
8. Leave the homestead buildings where they are. Ellie's boundary is inside the house (L1) or on the grass between the house and the garage (L2). Her props are not city records.

### Picks for Bob

1. Unlock: **U1** on the live page and **U2** on `/test/`, or U3 (gesture, no PIN).
2. Snap: **S1** (2 m city, 0.5 m in her room), S2, or S3.
3. DEV reach for the first test: M1, **M2**, or M3. M3 is the full reach, when he wants it.
4. Publish: **P2 confirmed Oct 24** for DEV Builder map edits only. `/test/` first, second go publishes live, previous map kept. P1 is closed for the map. Other features still go live in one step on his go.
5. Her area: **L1** (inside the 24 × 18 m house), L2 (80 × 50 m of yard), or L3 (a Builder Bay lot).
6. Her entry: **H1** (Build inside the house) or H2 (at the door).
7. Her tools: pack A (move and turn only), **pack B** (plus Copy, the size readout, Floor and Walk, four neon swatches), or pack C (B plus a new stick-together of 4).
8. Missing planner tools to build: Q1 (roof and measure), **Q2** (Q1 plus align, general group, 15° rotate), or Q3 (Q2 plus scale, array, named layers).
9. New DEV city tools: pack N1 (roads, stamp, NOS and spawns, minimap, FPS meter), **pack N2** (N1 plus bulk move, traffic preview, color picker), or pack N3 (N2 plus prop scatter). N2's bulk move needs Q2.
10. New world name: **Neon Bay**, The Boulevards, Z City, or Neon World 2.
11. Drop-objects first test: **R1** (current house, tech only, snap to drop slots), R2 (house, tech plus seats and tables, still on drop slots), or R3 (house plus the eight sampler rooms). The five later rooms stay stubbed.
12. Objects and buildings, from the study below: **O1** (catalog tech on today's house) with **O3** (short hitch trailer, tall trailer parked on the new world), **D1** (move today's boxes), or D2, D3, D4.

Bold items are the recommendation, except item 4, which Bob confirmed. The other picks are still open. Nothing here is built, and nothing deploys, until he picks them and writes "plan approved, build it". The zip has been read. The stand-in meshes stay until that build. Review shots of the real shapes wait with it.

## The new world

Bob's rule, which replaces the earlier split: everything except a huge aesthetic redesign can still go into the current Neon World. The DEV Builder, Ellie's Builder, and the drop-objects tool are planned for that world. The new world page is for the big new looks only: new building designs and new city art styles from the planner object study. A road move, a kit stamp, a wall in today's box style, a prop, and a room drop stay on `world.html`. A new facade language or a new city look does not. This phase still does not build the page or the tools. The stand-in meshes stay until that build.

The current game stays the one she already plays.

- `world.html` and `world-split.html` keep taking builder edits after Option 1, through the test-then-go path above. Adult `index.html` is not a home for the new tile.
- Option 1, The Boulevards, can land as City Layout's build. Later builder edits load the layout file on top of that.
- A new building look or a new city art style is the piece that does not get patched into `world/city.js`.
- Soccer, Sky Drop, the runway, and today's drive keep working on that page. A published builder edit keeps those guards.

### Its own page and tile

One HTML page, the same kind of split page as `world.html`: its own document, its own city script, the shared car, house, and crew readers. It is not a mode flag on `world.html`.

The JR menu gains one tile, in `KTILES` in `jr.html`, directly after the existing NEON WORLD tile (`k: 'world'`, which already goes to `world.html`). The click path is the same `navMap` assign that tile uses. The new tile uses the same unlock as Neon World, `zd_world_unlocked`, so a locked world stays a locked pair. UI Polish reviews the label before the tile is visible. The adult page does not get a copy of the tile.

Until Bob's explicit go, the page is reachable on `/test/` by URL only. The JR tile is the go that puts it on her menu. That is one go, straight to live. It is not the two-step map path. `sw.js` learns the new filename in `pageKey` and `isSplitPath` at that go, so a refresh caches the new page on its own and does not treat it as `index.html` or replace the `world.html` cache entry.

| Name | Tile | File | Why it is on the list |
| --- | --- | --- | --- |
| Neon Bay | NEON BAY, sub "the new look" | `neon-bay.html` | Recommended. Sits beside Neon World. The tile is the new art, not a second set of tools |
| The Boulevards | THE BOULEVARDS, sub "the new look" | `boulevards.html` | Says the new look starts from Option 1. Long for a tile |
| Z City | Z CITY, sub "the new look" | `z-city.html` | Short. Matches the Z she already drives |
| Neon World 2 | NEON WORLD 2, sub "the new look" | `world-2.html` | Makes it plain this page is the new art, and the current city stays |

This plan recommends **Neon Bay**.

### Starts from a copy of Option 1

When Option 1 is on the current map, copy that layout into the new world's own file (`neon-bay/layout.json`, or the matching folder for the name he picks). If Option 1 has not landed yet, the seed is the boulevard list already in this plan: the boxes from City Layout and the roads from `roadsFor('boulevard')`.

After the copy, the two files diverge on purpose.

- DEV save, test, and publish for ordinary edits write the current Neon World's layout. Rollback restores that file.
- A new art style is saved and published only into the new world's layout. Rollback of that file leaves `world.html` as it was.
- Dropped props stay in `zdash.ellie.builder.v1`. The current walk-in draws them. The new world draws the same list when its rooms use the same purpose.

### Shared saves, car, pet, and home

One device, one Ellie. The new page reads the keys the current world already reads. It does not invent a second profile.

| Already hers | Key | What the new page does |
| --- | --- | --- |
| Car, paint, parts | `zdash.kid.v1` → `eq` | Same 370Z mesh. Garage Z still changes nothing except `eq`. A paint she sets in either place shows in both |
| Pet | `zdash.kid.v1` → `pet`, and the crew data the current world already loads | Same pet, same height 0.74 m. No second pet key |
| Home choices | `zdash.house.v1`, and the `house` object inside `zdash.kid.v1` | Wall, sign, sofa, arcade, pet bed, and dance floor stay those checkboxes. Both pages read them. The builder does not write them |
| Her placed props | `zdash.ellie.builder.v1` | The drop tool writes it. A flat value is the house. A `rooms` map covers the sampler and the later ids. It is not a field on the house save or the sampler likes |
| DEV test layout | `zdash.city.editor.v1` | This browser. `/test/world.html` reads it for ordinary edits. The new world reads it only while a new look is on that page |

The new page may include the existing garage and house controls, and those controls keep their current write path. A new field inside `zdash.kid.v1` or `zdash.house.v1` is not how the builder stores props. Old readers keep working because the keys they already understand are unchanged.

### What stays playable

She can open NEON WORLD and the new tile from the same menu. NEON WORLD loads `world.html`, including builder edits that have been published. The new tile loads the new page and the new look. Drive, fly, Garage Z, the pet, and the house checkboxes work on both. A bad DEV drag on the current city rolls back that city's layout. A bad drag on a new look rolls back the new world's file and leaves the current city as it was.

## Drop objects

Plan only. This is the house object-placement mode: Ellie drops planner objects into a room, tech first. It is planned for the current Neon World, and the same tool runs on the new world when that page has the room. The first test is the current house. The DEV Builder and the rest of Ellie's Builder are planned for the current Neon World too. A new building look still waits on the new world.

The tool is the simple form of select, move, quarter-turn, snap, undo, and Done. Pack B's extra buttons can come later. Wall drawing, floors, roads, stamps, and the DEV color picker stay off this tool. Named layers are not in the planner, and this tool does not add them. The words are Place, Turn, Done, and Undo. Palette order is Screens, Sound, then Seats and Tables. The saved hero piece (sofa, arcade, dj, or trophy), the pet bed, the sign, and the wall theme stay the garage checkboxes. This palette does not offer a second copy of those, and it does not fill a slot marked `hero`.

### The room contract

Interiors shipped the room side on PR #87, branch `cursor/room-place-hook-52fc`, commit `5a7f5a7`. The write-up is `docs/ROOM-PLACE-HOOK.md`. The machine copy is `docs/room-place/HOOK.json`. This plan matches that contract. It does not edit that PR.

The origin is the floor at the center of the door wall. x points right, y points up, z points into the room. A prop at yaw 0 faces +z, so a seat looks at the far wall. A prop at yaw pi faces the door, so a screen's lit face points back into the room. Catalog boxes come from `PLANNER_PROPS.parts` and `PLANNER_PROPS.place`.

Their three calls read. They do not write.

```text
ROOM_PLACE.describe(id) → bounds, blocked boxes, floor slots, wall slots
ROOM_PLACE.read(id)     → the props saved for that room, or []
ROOM_PLACE.snap(id, hit) → the nearest free slot within 0.75 m, or null
```

`hit` is `{ x, y, z, kind }` with `kind` of `floor` or `wall`. A null snap means this tool does not place. `snap` skips a `hero` slot, a blocked box, and the door gap. The door gap is x from −1.2 to 1.2 and z from 0 to 2.2. Objects sit at least 0.4 m inside the walls. A new wall screen's bottom stays at or above 1.05 m, so the 0.74 m pet is not inside it. The neon room's standing screens are already in that shell, with bottoms at 0.55 m. Those are samples, not a new screen this tool drops.

A slot's `holds` value:

| holds | What the drop tool does |
| --- | --- |
| hero | Leaves it. The four saved home controls fill the house sofa, table, pet bed, and far screen |
| sample | Leaves it until she saves a prop in that sampler room. Then the samples hide and her props draw. The shell stays. `zdash.sampler.likes.v1` stays |
| drop | Places here. This is the empty slot |

The walk painter draws the shell, then the hero or sample pieces, then `ROOM_PLACE.read`, then `PLANNER_PROPS.place` for each saved prop. Flat fills. Glow is a brighter box. No `shadowBlur`. One video element, 256×144, and only in the room she is in. A second screen in the same room is a baked color. The cap is 48 catalog parts in that room, plus the one video. The shell's blocked boxes do not count toward the 48. Past the cap, Place says "This room is full."

The writer stores the slot it snapped to, that slot's yaw, and `wall` when the slot is on a wall. A wall snap keeps yaw pi so the lit face stays toward the door. Turn, after a floor snap, still steps by a quarter turn. A floor piece keeps `y` at 0, except the loft's upper slot, which is already at y 3.64.

### Where she tests it

Slots that exist today are the house and the eight sampler rooms: glass, wood, pop, pastel, loft, plants, future, and neon. Arcade, cafe, pets, soccer, and Builder HQ are stubbed. Each has bounds and one floor slot plus one far-wall slot, and `shell` is `later`. This tool does not open Place in a stub.

| Choice | First test | Later, same tool |
| --- | --- | --- |
| R1 | Current house, tech only, on drop slots. Recommended. `tv85` and `ledposter` use the far-wall slots (y 1.15, yaw pi). `speaker` and `kiosk` use free floor slots. Laptops wait for a table in R2 | The eight sampler rooms, then the stub rooms when their shells exist |
| R2 | Current house, tech plus seats and tables, still only on `drop` slots | Same. Hero slots stay the saved controls |
| R3 | House and the eight sampler rooms in one pass | The stub rooms when their shells exist |

This plan recommends **R1**, and it adopts their snap: a tap snaps to a free slot within 0.75 m. A free drop on the open floor, inside the same bounds and outside the door gap, can come later. They already named that as a later step. The walk view already turns a tap into a floor point.

House drop slots for the first test: `floor-free` at (0, 0, 10), `floor-left` at (−5, 0, 8), `floor-right` at (5, 0, 9), `wall-far-left` at (−5.5, 1.15, 17.4), and `wall-far-right` at (5.5, 1.15, 17.4). The house is 24 × 18 × 4.8 m. Paint, the garage, and the dance hall stay apps. NOS, the showroom, and the sky pad stay drive-up. Those doors do not get a Place button.

The Place control sits on the house interior, after she is inside (H1). UI Polish places it. It stays off the driver HUD. The sampler rooms expose the same hook, so the same control can show there when Bob wants R3. The current world gets this button, the room-painter read, and, on Bob's unlock, the DEV Builder. A new building look or a new city art style is the piece the current world does not get.

## Object study

The zip's `objects/catalog.json` has 61 objects. `objects/sets.json` builds five presets three times each. `TECH.json` marks 34 as tech and 18 of those as screens. `uplight.js` and `stagelight.js` are in the folder and are not registered. There is no venue list. Sizes below are the catalog envelopes. 1 ft = 0.3048 m. The origin is the center of the footprint. The front faces +z. Meshes are code-built boxes and cylinders, flat colors, no textures. A game label says "tablet" where the catalog says iPad. Rentacomputer names and brand images stay out.

Each object is many parts (a banquet chair is 15, a stage deck is 30, a power box is 20). The room cap is 48 catalog items, not 48 raw parts. Before a prop enters the game it is baked down to a handful of boxes, about six. Unmerged, 16 chairs would be 240 boxes.

### Sets

Every preset is laid out in the 30 × 40 ft chip (9.1 × 12.2 m), before a door is added. That chip is a corner of the 24 × 18 m house, not the whole house. Showcase is the preselected level. Clearances the presets keep: row 3.25 ft, center aisle 4.5 ft, wall 3 ft, chair backs 5 ft, booth aisle 10 ft, registration queue 9 ft, behind the counter 5.1 ft, door 3 ft.

| Preset | Essentials | Standard | Showcase |
| --- | --- | --- | --- |
| Booth | 8. Four 10×10 booths, four 6 ft tables | 16. Adds two 55 in TVs, four laptops, a charging tower, one LED wall | 24. A TV in each booth, tablets, four LED posters |
| Classroom | 26. Eight tables, 16 chairs, a lectern, a laptop | 33. Adds a projector screen and two speakers | 50. Adds a second row of laptops and tablets, two TVs, posters |
| Banquet | 36. Four round tables, 32 chairs | 44. Adds an LED wall, two 75 in TVs, speakers | 50. More speakers, posters, a charging tower |
| Theater | 110. 108 chairs, a lectern, a laptop | 114. Adds an LED wall and speakers | 120. More speakers, posters, a kiosk |
| Registration | 12. Three tables, six chairs, three laptops | 18. Adds a 75 in TV and two kiosks | 24. Adds an LED wall, monitors, four kiosks |

None of these drop into the house as a whole. Theater is 108 chairs. Banquet Showcase is 50 items, over the cap. Registration Essentials is the only preset that fits a room without a fight, and it is a counter idea for the cafe at R2, not the first house test.

### One by one, the ones that matter first

R1 is tech that can stand on a floor slot or hang on a wall slot. It does not need a table under it.

| Id | Envelope | Metres, about | Where it can go |
| --- | --- | --- | --- |
| tv85 | 6.2 × 1.1 × 3.6 ft | 1.90 × 0.33 × 1.08 | Far wall. Bottom at 1.15 m, top near 2.2 m. Best first screen |
| tv55 | 4.0 × 2.0 × 5.5 ft | 1.22 × 0.61 × 1.68 | Wall, using the mount parts. The 5.5 ft envelope includes the floor stand |
| led | 9.8 × 1.5 × 7.7 ft | 3.00 × 0.46 × 2.34 | One far wall, not both slots. A statement screen |
| ledposter | 2.1 × 1.6 × 6.7 ft | 0.64 × 0.47 × 2.03 | Far wall. Posters link flush into a run |
| speaker | 1.25 × 1.25 × 6 ft | 0.38 × 0.38 × 1.83 | Floor. Taller than Ellie |
| kiosk | 1.5 × 1.5 × 4 ft | 0.46 × 0.46 × 1.22 | Floor. Shorter than Ellie, taller than the pet |
| touchkiosk | 2.8 × 1.6 × 6.3 ft | 0.86 × 0.48 × 1.91 | Floor. A little taller than Ellie |
| tower | 1.3 × 1.3 × 6 ft | 0.41 × 0.41 × 1.83 | Floor. Tech, not a screen |
| digisign | 4.1 × 2.1 × 2.3 ft | 1.24 × 0.64 × 0.71 | Floor, against a wall. Short |
| streamkit | 0.6 × 1.4 × 5.7 ft | 0.19 × 0.42 × 1.75 | Floor. About her height |

Leave these out of the house. They do not fit the room, or they are not furniture she lives with:

| Id | Why it stays out |
| --- | --- |
| ledtrailer | 20 × 8 × 18 ft (6.1 × 2.4 × 5.5 m). Taller than the house ceiling. It is a billboard, not a living-room TV |
| tent | 20 × 20 × 16.8 ft. A pavilion, not a prop |
| projscreen | 10 ft wide and 18 ft deep. The throw fills a room |
| booth10, booth20, drape | Trade-show shells. The house already has walls |
| generator | The preset puts it outside the room |
| qbar, wtmeter, ibooth | Queue, security, and a translation booth |
| stage | 30 parts until it is baked, and it is a deck for The Stage, not a house slot |
| laptop, ipad, monitor, mixer, and the other `top` items | They sit on a table. That is R2 |

`table6` is 6 × 2.5 × 2.5 ft (1.83 × 0.76 × 0.76 m). One of those is a fair R2 table. The catalog has no sofa. The saved house sofa stays the garage checkbox.

### Better objects

| Choice | Proposal | Where it lands |
| --- | --- | --- |
| O1 | Use the catalog as it is for R1: `tv85`, `ledposter`, `speaker`, and `kiosk` on the five house slots. Bake each one down. Recommended | Current house |
| O2 | Add a short speaker, about 0.9 m, taller than the pet and shorter than Ellie. The 6 ft speaker stays available for The Stage | Current house. It is one prop, not a new city look |
| O3 | Tow the proof trailer, about 2 m tall, behind the 370Z. Park the catalog 18 ft trailer as a lot screen | The hitch trailer stays on the current world. The 18 ft trailer is a new look, so it parks on the new world |
| O4 | A neon room set: `glowbar` and a run of `ledposter` instead of pipe-and-drape, one `lounge` instead of a field of banquet chairs, one `table6` instead of four rounds | New world. This is a new interior look |

This plan recommends **O1** for the first house test and **O3** for the trailer. O2 is there if the 6 ft speaker feels wrong next to her. O4 waits for the new world.

### Better buildings

The planner does not design the boulevard. Its size chips are indoor rooms. A 20 × 20 ft chip is 6.1 m. A kit bay is about 20 × 14 m. DEV draws city walls in metres, or he drags the Option 1 boxes. He does not stamp a 20 ft chip down as a shop.

| Choice | Proposal | Where it lands |
| --- | --- | --- |
| D1 | Drag the Option 1 boxes and add roads. No new facade. Recommended for the first city test | Current Neon World, through `CITY.editorDoc()` |
| D2 | Keep today's box and put one catalog `led` (about 3.0 × 2.3 m of glass) on the door face, baked flat | Current Neon World. It still counts toward the four detailed buildings inside 170 m |
| D3 | A neon bay: the real footprint as a closed wall polygon, the Z-DASH flat roof, a people door about 0.9 m, glass from the booth side walls, glow trim. The car arch stays the kit arch, at least 3.4 m | New world. This is a new building look |
| D4 | A low club from linked stage decks, and the catalog tent as a 6 m pavilion. It does not replace a bridge or the sky tower | New world |

This plan recommends **D1** first. **D3** is the new-world look to draw when he wants a picture. D2 can land on the current city without a new art style. D4 stays a sketch until he asks for it.

`uplight.js` and `stagelight.js` stay unregistered. If he wants stage lighting later, it is a flat brighter box on the new world's stage, with no `shadowBlur`.

## What this phase does not do

It does not copy the planner into the repo. It does not copy the planner's `index.html` onto Z-DASH `index.html`. It does not edit the live world, the adult page, the driver screens, Ellie's saved home, or the Garage Z link. It does not place the trailer pad in `city.js`. It does not build `CITY.editorDoc`, either builder, the drop-objects tool, or the new world page. It does not add the JR tile. It does not post on the Interiors PRs. It does not deploy. P2 is noted and not built. The other picks are still open.
