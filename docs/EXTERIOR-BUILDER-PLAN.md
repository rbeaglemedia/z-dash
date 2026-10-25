# Adventure World builder plan

Plan only. This file does not add a page, a baker, or a mesh. `adventure.html`, `adventure/`, `world.html`, `world/`, `/test/`, and the live walk-in stay as they are until Bob writes "plan approved, build it" for a phase.

The destination is **Adventure World** (`adventure.html`, engine in `adventure/src/main.js`). Neon World is not a carry target.

## Sandbox engine

The empty sandbox runs on the Adventure World engine.

`adventure.html` is its own page. `sw.js` keeps `adventure.html` and `/adventure/` in their own cache. The play frame is Three.js r170: `WebGLRenderer` with `setPixelRatio(1)`, `antialias: false`, `shadowMap.enabled = false`, and `MeshBasicMaterial`. Repeated parts are `InstancedMesh` (`buildCourtyard` in `adventure/src/main.js`). The glass house is a handful of `box()` calls plus one instanced window row. Ellie walks at 1.56 m/s and runs at 4.02 m/s. The play camera sits 5.5 m behind her, 2.05 m up, looking at 0.9 m, field of view 38°. There is no car and no traffic graph.

A sandbox on the Neon city canvas would prove the wrong draw path. Bake-on-save has to emit the same unlit boxes and instances the courtyard already draws, then the parity test in phase 6 measures that path. The Event Space Planner port under `test/planner` is the **tool source** (Box, Walls, Door, Place items, rail, saves). It is not the play renderer.

Sandbox page, when the build is approved: `/test/sandbox.html`. It boots the Adventure renderer, a flat ground plane, Ellie, and her pet. It does not load the courtyard (house, swing, crab, meadow, lamps), the Neon city, traffic, the 370Z, or the legacy interior. Play mode shows baked instances only. Edit mode may use the planner view; leaving edit bakes and drops those editor meshes.

## One builder

Interiors and exteriors are one builder from phase 1.

- Same tools at room scale and map scale: Box, Walls, Door, Place items, Add item, Same again, Presets, Top view, Drag (turn / pan), Walls (high / low / hidden), undo, redo, save.
- One document. A `scale` field is `room` or `map`. It changes camera distance and wall height. It does not fork the schema or the tools.
- One bake path. `bakeDoc(doc)` compiles either scale into Adventure instances. Phase 1 writes that function. Phase 6 measures it. Phase 7 is the first time a baked result is allowed into `adventure.html`.

Room scale opens a blank **60 × 80 ft** floor, the size already used for the Neon walk-in blank, so Ellie and the pet fit and the room can be resized with the existing wall tools. Map scale opens the flat ground. The grid is the planner grid: one unit is one foot, extent 2000 ft (`MAX` in `test/planner/src/grid.js`). Bake multiplies by **0.3048** to metres. Adventure play stays in metres.

A Room / Map control is one tap. The open document is kept. Switching scale does not start a second file.

## Data model

Editable source and baked play data are different files. The play page reads the bake. Re-edit loads the source. The bake is never parsed back into walls.

Suggested source shape (`v: 1`):

```text
{
  scale: "room" | "map",
  units: "ft",
  walls: [ { pts: [[x,z], ...], closed, doors } ],
  items: [ planner items, unchanged ],
  structures: [
    {
      id, name,                 // "house" | "cafe" | "shop" | "blank"
      footprint: { x0, z0, x1, z1 },
      door: { edge, t, widthFt: 3 },
      style: "neon-box",
      functions: []             // empty until phase 8
    }
  ],
  roads: [],
  water: []
}
```

`walls` and `items` are the planner document (`env`, wall points, doors, catalog ids). Phase 1 saves those. `structures` stays an empty list until phase 3. `roads` and `water` stay empty until phases 4 and 5. `functions` stays `[]`. Phase 8 is where Bob decides what a function is. This plan does not invent interior links, garage bays, pet doors, or mini-games.

Storage keys, sandbox only:

- `zdash.adventure.builder.v1` — editable source
- `zdash.adventure.baked.v1` — bake output

Do not write `zdash.city.editor.v1`. That key is the Neon DEV Builder (`world/dev-builder.js`, snap 2 m, `exportDoc()` buildings and roads). Do not write `zdash.interior.layout.v1`. The Neon walk-in keeps that key.

Bake output:

```text
{
  v: 1,
  kind: "adventure-native",
  draws: [
    { shape: "box", color, count, matrices }   // one InstancedMesh per color
  ]
}
```

Colors come from the courtyard, so a baked building matches the glass house:

| Part | Hex | Where it is today |
| --- | --- | --- |
| Wall | `#f4f8fb` / `#f7fbff` | house walls and posts |
| Trim | `#3ee6ff` | courtyard ring, house beam, UI outline |
| Glass | `#8ef6ff` | house panes |
| Floor | `#e7fff6` | courtyard disc |
| Ink | `#142033` | adventure.html button labels |

Glow is a brighter unlit box. No `shadowBlur`. No shadow map. No second material class.

Map-scale draws use Three's frustum culling and a distance hide. The courtyard sets `frustumCulled = false` because the whole set is a few metres across. A 2000 ft map does not copy that flag. Near band (under 40 m): walls, roof, trim, glass. Far band: walls and roof only. The play camera's far plane grows past today's 80 m when the ground is a map; anything past the far band is not in the instance list for that frame.

One site is in memory at a time. That is the Adventure stand-in for "one district." The editor scene is not in the play frame.

## Scale, snap, and the tools that stay

Planner rules, kept (`test/planner/src/walls.js`, `TOOLS.md`):

| Rule | Value |
| --- | --- |
| Unit | 1 foot |
| Wall snap | `snapStep(dist)`: 25 ft at 600 ft and farther, 10 at 160, 5 at 80, 1 at 30, else 0.5 |
| Close grab | `CLOSE_R` 1.5 ft, or the first point of an open run |
| Item snap | 0.5 ft |
| Wall thickness | `WALL_T` 0.33 ft |
| Door tool | 3 ft wide, tap a wall |
| Walls | Axis-locked. Close on the start point, or Close once the run has 3 points |
| Box | One drag, corner to corner. A closed rectangle stays rectangular when a wall is pushed |

Wall height follows scale, using the planner's own heights in phase 1:

- Room, full / low / hidden: 9 ft / 1.5 ft / 0.08 ft
- Map, full / low / hidden: 3.5 ft / 0.35 ft / 0.05 ft (the planner's outdoor fence)

Phase 3 is what turns a **closed rectangle** into a walk-in building. Until then, a map-scale loop is still the planner fence. The door tool stays 3 ft wide in both phases. Phase 3 cuts a walk-through opening 3 ft wide and 7 ft tall in the building wall so Ellie (Adventure `heroH` starts at 1.5 m) clears it. The 3 ft event door is still the door tool.

## How a save becomes the play frame

1. Edit in the sandbox (planner tools, either scale).
2. Save writes the source JSON.
3. `bakeDoc` builds instance matrices in metres: wall boxes along each segment, a door gap, item boxes from the catalog footprints, and (from phase 3) a floor slab, a flat roof, and a cyan trim strip.
4. Play mode disposes the editor meshes and adds one `InstancedMesh` per color, `MeshBasicMaterial`, shadows off, pixel ratio 1.
5. Open the source again to edit. The bake is replaced on the next save.

The same function bakes a room and a map. A room is walls around a floor. A map is walls on the ground plane. Phase 3 adds the roof and the trim to a closed rectangle. Phases 4 and 5 add road quads and water quads to the same draw list.

## Phases

Rough **sequencing effort** is a weight for order, not a bill and not an in-game currency. The repo has none. A later phase starts only after the one before it works on `/test/sandbox.html`.

| Phase | What lands | Effort |
| --- | --- | --- |
| 1 | Planner port in the empty sandbox, room and map, one model, bake function | 18–28 |
| 2 | Neon-style design upgrade (mockups below) | 10–16 |
| 3 | Rectangular wall-loop buildings | 8–12 |
| 4 | Roads | 10–16 |
| 5 | Water | 6–10 |
| 6 | FPS parity test | 8–14 |
| 7 | Carry the baked play path into Adventure World | 12–18 |
| 8 | New structure types | to discuss, no band |

### 1. Planner port in the empty sandbox

`/test/sandbox.html` on the Adventure engine, as described above. First content is the full planner tool set, working at room scale and at map scale, with save and `bakeDoc`. Phase 1 may look like the current planner. Phase 2 changes the look. Functions in phase 1 already match the list in "One builder."

Out of this phase: courtyard props, Neon city, traffic, car, legacy interior, the design polish, wall-loop buildings, roads, water, and any edit to `adventure.html`.

### 2. Neon-style design upgrade

The upgrade is the sandbox UI. It does not move the shipped Neon walk-in rail (that rail stays 72 px, order Add item, Same again, Presets, Top view, Drag, Walls).

Look: the courtyard and `adventure.html` controls. White tiles, ink `#142033`, **3 px cyan** outline `#3ee6ff`, 12 px corner radius. Active tile fills cyan. Icons are 24 px, stroke `currentColor`, one icon per action. Labels are 13 px on the phone row and a single caption on Galaxy. No quote, share, run-event, sq ft header, or setup wizard. The page opens already in Map, Draw, Box armed.

Fewer taps:

- Room / Map, Draw / Place, Top, Drag, and Walls-height are chips on the top bar. Each is one tap from either mode.
- Draw dock is Box, Walls, Door, Close. Place dock is Add, Same again, Presets. Draw / Place swaps that dock in one tap.
- A selected item grows one row: Rotate, Copy, Delete. No extra sheet for those three.
- Add opens a sheet of large tiles. A tap places and closes. "Keep placing" is the opt-in that arms Same again.
- Box is the default on Map, so a rectangle is one drag. Walls remains for point-to-point and for closing a loop by hand.
- Close appears only when the open run can close.

Touch targets, minimum **56 × 56** on Galaxy (the `#acts` buttons in `adventure.html` are already 56) and **64 × 52** with a label on the phone row. The move stick stays the Adventure stick: left 18 px, bottom 78 px, 108 × 108, cyan ring. The dock starts at x = 140 so it clears the stick. FPS stays top-right, the existing adventure chip.

Overlap set the build must check, both viewports: stick, top chips, FPS, dock, selection row, Add sheet, Presets sheet. Sheets sit above the dock and do not cover the top chips. The selection row is absent when nothing is selected.

#### Phone 844 × 390

Landscape. Dock tiles are 72 × 52 with the icon over a 13 px label. Six tiles fit to the right of the stick with room to spare (about 690 px free after x = 140).

```text
844 × 390
┌──────────────────────────────────────────────────────────────────────────┐
│ [Room|Map] [Draw|Place] [Top] [Drag:Turn] [Walls:Low] [Undo]    FPS    │ 36px
│                                                                          │
│                         ground or blank room                             │
│                                                                          │
│  ┌stick┐   ┌Rotate┐ ┌Copy┐ ┌Delete┐          (row only while selected)  │
│  │108² │   └──────┘ └────┘ └──────┘                                      │
│  └──┬──┘   ┌──────┐┌──────┐┌──────┐┌──────┐┌──────┐┌──────┐              │
│     │      │ Box  ││Walls ││ Door ││ Close││      ││      │  Draw dock   │
│   y174–282 │ icon ││ icon ││ icon ││ icon ││      ││      │  72×52       │
│            └──────┘└──────┘└──────┘└──────┘└──────┘└──────┘              │
│            Place dock swaps these for Add, Same again, Presets           │
└──────────────────────────────────────────────────────────────────────────┘
```

Add sheet (after tapping Add), same width, two columns, tiles 160 × 72, cyan outline, icon and name. One tap places and dismisses.

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ [Room|Map] [Draw|Place] ...                                     FPS    │
│ ┌──────────────── Add item ───────────────────────────────────────────┐ │
│ │ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐    │ │
│ │ │ icon        │ │ icon        │ │ icon        │ │ icon        │    │ │
│ │ │ Table       │ │ Chair       │ │ Screen      │ │ Speaker     │    │ │
│ │ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘    │ │
│ │                         [ Keep placing ]                            │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│            [Add] [Same again] [Presets]                                 │
└──────────────────────────────────────────────────────────────────────────┘
```

#### Galaxy 780 × 360

Shorter. Dock tiles are **56 × 56 icons**. The name of the armed tool is one caption centered over the dock, not a label inside every tile. Stick still ends at y = 282 (bottom edge 78 px up, height 108). Dock top sits at y = 296 (8 px margin, 56 px tall), so the gap under the stick is about 14 px.

```text
780 × 360
┌────────────────────────────────────────────────────────────────────┐
│ [Room|Map] [Draw|Place] [Top] [Turn] [Walls] [Undo]         FPS  │ 32px
│                                                                    │
│                      ground or blank room                          │
│                                                                    │
│ ┌stick┐              caption: "Box"                                │
│ │108² │   ┌────┐┌────┐┌────┐┌────┐┌────┐┌────┐                     │
│ └──┬──┘   │Box ││Wall││Door││Close│    │    │   56×56, icon only  │
│  y174–282  └────┘└────┘└────┘└────┘└────┘└────┘   dock y 296–352   │
└────────────────────────────────────────────────────────────────────┘
```

Add sheet on Galaxy: two columns, tiles 148 × 64, same one-tap place. The sheet stops above the dock. Presets uses that same sheet, not a second layout.

iPad and PC use the phone dock (icon plus label) and the extra width. They do not get a different tool map.

### 3. Rectangular wall-loop buildings

Mostly rectangles, neon style, made with the wall tool that already exists.

- Draw a four-corner loop and close it, or drag Box (a closed rectangle in one gesture).
- On close, one row of names: House, Cafe, Shop, Blank. One tap stamps the building. The mesh is the same for every name.
- The stamp is the courtyard house language at building size: white wall boxes, flat roof slab, cyan trim along the top, one walk-through door (3 ft wide, 7 ft tall), glass panes only on the near band.
- Footprint is the loop in feet. Height is 12 ft (3.66 m) so the door clears Ellie. A pushed wall updates the footprint and the bake on the next save.
- Non-rectangular loops still close as planner walls. They do not become a building in this phase.
- `functions` stays `[]`. Names are labels on the same box, not new behavior.

### 4. Roads

Roads are a ribbon on the sandbox ground, drawn with the same axis lock and foot snap as walls. A road is a new entry in `roads[]`: `{ id, x0, z0, x1, z1, widthFt }`. Default width 20 ft (about 6.1 m), so two lanes sit near the Neon street width without importing `CITY.ROADS`. Adventure World has no road graph, no `laneW`, and no traffic. This phase does not add cars or lane rules.

Bake merges each road into the same unlit instance list (a flat quad, courtyard ground color darkened one step). Joins snap to an existing road end within `CLOSE_R`. The ribbon does not use the planner's per-object shadow path.

### 5. Water

Water is a flat polygon on the same document: `{ id, kind: "river"|"lake"|"pool", pts, closed }`. Rivers are an open or closed ribbon with a width. Lakes and pools are closed loops. Bake is one unlit cyan-blue quad set (`#8ef6ff` at a lower value), no shader, no reflection pass, no shadow. Depth is a color, not a mesh stack. Ellie walks the bank; the water plane is the collision outline. Neon `RIV` (z 1780–1840) is not copied.

### 6. FPS parity test

One rectangular building is built twice: once through the sandbox (source → `bakeDoc`) and once by hand with the same `box()` / `InstancedMesh` / `MeshBasicMaterial` calls `buildCourtyard` uses for the glass house. Same footprint, same colors, same door gap.

Measure walk (1.56 m/s) and run (4.02 m/s) around both, at phone 844×390, Galaxy 780×360, iPad, and PC. Pass when the baked copy stays within **1–2 FPS** of the hand-built copy on each size. Adventure World has no drive mode, so the passes are walk and run. A vehicle added later gets the same band.

The editor view is off during the sample. Pixel ratio stays 1. Shadows stay off. Report the four sizes and both speeds. A software-GL number is a ceiling, not a claim of 60.

If roads and water have landed, add one short ribbon and one pool to a second pair. The required pair is the building.

### 7. Carry into Adventure World

Only after phase 6 passes. Copy the baker and the approved baked sites into the Adventure play scene. `adventure.html` still draws `MeshBasicMaterial` instances. It does not load the planner editor, the catalog three.js meshes, or the sandbox page.

The carry is a reviewed change to `adventure.html` and `/adventure/`. Those files publish when Bob says to publish. There is no automatic push to `main`. The sandbox remains on `/test/` for the next edit. Re-edit there, bake again, review again, then replace the baked site.

The Neon walk-in, DEV Builder, and city layout are unchanged by this carry.

### 8. New structure types

To discuss with Bob. No design in this plan, no mesh, no function list, no effort band.

Topics held for that conversation:

- Intricate and non-rectangular buildings
- Prebuilt structures that are not the phase 3 box
- What `functions` means: a linked interior, a garage, pet access, a mini-game, or something else
- Roofs other than the flat slab
- Anything that needs a new draw call, a shader, or a shadow

Until that talk, `style` is only `"neon-box"` and `functions` is only `[]`.

## What this plan leaves alone

- The live Neon world and the `/test/` walk-in already on `main` at `8135fd9`
- DEV mode and `zdash.city.editor.v1`
- Pet scale and the Adventure hero rig
- `adventure.html` itself, until phase 7 is approved and built
- Phase 8 structure types
