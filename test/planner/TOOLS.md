# Editor tools

Map of the Rentacomputer.com Event Space Planner editor, for reuse in the Z-DASH DEV Builder. The controls and the logic are already in this zip. This file only points at them.

One unit is one foot. An object's origin is the centre of its footprint on the floor. +y is up. The front of an object faces +z.

The build screen (`#build` in `index.html`) holds every tool. **Builder** (`data-phase="build"`) draws walls and shapes. **Place objects** (`data-phase="place"`) selects and moves catalog items. `src/app/shell.js` `setPhase` switches the footers and the draw-tool row.

Pointer input is `src/app/input.js`. Placement math is `src/logic.js`. Wall math is `src/walls.js`. Camera math is `src/camera.js`.

## Select

Tap an item in Place objects, or while the Builder draw tool is **Move**. `ESP.select` in `src/app/place.js` stores `selUid` and opens `#selBar` (name, Rotate, Copy, Delete, Done). A linked LED poster wall renames the bar to the wall width. **Done** or Escape clears the selection. **Delete** or Backspace removes the item and anything hosted on it (`removeItem`).

Booths and pipe-and-drape (`canDragItem` in `src/camera.js`) move only after a tap has selected them.

## Move

Drag a selected item. `snapPose` (`src/logic.js`) picks the pose, then `applyPose` writes it and carries hosted children (laptops on tables, chairs on a table edge) by the same offset and turn. A spot that fails `isValid` snaps back and toasts "That spot does not fit".

In Builder, **Move** (`data-tool="view"`) does not draw. Dragging empty space turns or pans the camera. Dragging a wall arrow calls `pushWall` (`src/walls.js`): the wall slides on its normal, neighbours lengthen or shorten, and a square room stays square. A neighbour shorter than 1 ft, or a flip, is rejected. Items sitting on that wall ride with it (`carrySet` in `src/fun.js`).

Dragging a corner calls `dragCorner` / `dragCornerDoors`. A closed rectangle stays rectangular.

## Rotate

**Rotate** (`#btnRot`) or the R key. `src/app/place.js` adds a quarter turn (`Math.PI / 2`), then `snapPose`. Edge and wall poses fall back to the floor grid (`freePose`) so the object does not stay glued to the old face. Rotating an LED poster or a stage deck clears its links first.

There is no free-angle rotate handle.

## Snap and grid

Two snaps, both numeric:

- **Walls.** `snapStep(dist)` in `src/walls.js`. Camera distance picks the step: 25 ft at 600 ft and farther, 10 ft at 160, 5 ft at 80, 1 ft at 30, otherwise 0.5 ft. `snapPoint` also grabs an existing corner, and the first point of an open run when the pointer is close enough to close it. `#snapHint` shows `Snap: N ft` while Builder is active (`src/app/render.js`).
- **Items.** `itemStep` is always 0.5 ft. `freePose` parks a corner of the footprint on that grid. `#snapHint` shows `Move snap: 0.5 ft` in Place objects.

`snapPose` tries the item's `snapsTo` list in order, then the floor grid:

| Rule | What it does |
|---|---|
| `top` | On another object's top, within `SNAP_DIST` (2 ft). |
| `edge` | Against a host edge, within `EDGE_DIST` (2.5 ft). Chairs. |
| `wall` | On a wall face, raised to `mountY`. TVs. Outdoor walls are never mountable. |
| `wallfloor` | Against a wall, sitting on the floor. |
| `backwall` | Against a booth's back wall only. |
| `nearwall` | Against a room wall, on the floor. Indoor only. |

LED posters try a side join first (`sideSnap`, `POSTER_SNAP`: 0.5 ft gap, about 10°). Stage decks try `stageSnap` (flush on all four edges). Power gear tries `gearSnap` in `src/products/lineup.js` (`end` for a line of bars, feeders, and ramps; `outside` for the generator).

The floor grid is visible. `src/app/scene.js` builds three `GridHelper`s over the 2000 ft world (`MAX` in `src/grid.js`): a 1 ft grid, a 10 ft grid, and a 100 ft grid. `overlays` in `src/app/render.js` shows the 1 ft grid up close, the 10 ft grid from 160 ft, and the 100 ft grid from 600 ft. There is no grid on/off control.

## Align

Alignment exists for wall drawing only. `drawPoint` in `src/walls.js` locks the new segment to the x or z axis (square walls) and shows a guide when the free end lines up with an existing corner (`alignTol`). Guides are drawn in `overlays`. Closing a run uses `closePlan` so the last corner stays square.

There is no command that aligns or distributes selected objects.

## Duplicate

Three ways to add another of the same object. None of them builds a counted array.

- **Copy** (`#btnCopy` in `src/app/place.js`) makes one item and hunts a free spot one width plus 0.5 ft to the side (`findSpot`).
- **Same again** (`#btnSame`, `src/app/view.js`) copies the selection, or asks you to tap an item, then each floor tap drops another (`stampAt`, search radius 4 ft). **Done** or Escape stops it.
- **Keep placing** (`#keepPlacing` on the add sheet) starts Same again after the first add.

## Group

Two linked kinds, both in `src/logic.js` (`LINKED = ['ledposter', 'stage']`):

- Dragging an LED poster near another joins them flush (`linkPosters`). `posterGroup` walks `links` and `moveGroup` in `src/app/place.js` moves the run as one rigid set. **Separate** (`#btnSplit`, `separatePoster`) clears that poster's links. Rotate also unlinks.
- Stage decks join the same way (`stageSnap`, `stageLinkFlush` in `src/products/stage.js`). Separate is implemented for posters only. Rotate unlinks a deck.

Hosted items (mode `top` or `edge`, `host` set to a uid) are a second grouping. `applyPose` moves the host's descendants with it. Deleting the host deletes them.

There is no general group or ungroup for arbitrary objects.

## Undo and redo

`src/history.js` `createHistory` keeps up to 100 whole-layout JSON snapshots (walls, items, floor index, other floors, env, and the wall run still being drawn). `ESP.save` in `src/app/state.js` records a step only when the snapshot string changed, and writes `localStorage` 300 ms later.

**Undo** / **Redo** (`.hUndo`, `.hRedo`), Ctrl or Cmd+Z, Ctrl or Cmd+Y, and Ctrl or Cmd+Shift+Z. `restore` rebuilds the room from the snapshot. A pending wall edit cancels on undo and commits on redo.

**Clear** (`src/app/clear.js`) is one undo step on the active floor. **Clear items** drops objects and keeps walls and doors. **Clear build** drops walls, doors, and objects.

## Measure and dimension

Readouts only. There is no measure tool and no dimension line you draw.

- `#sizeLbl` uses `sizeLabel` (`src/walls.js`): width × depth in feet, plus the closed-polygon area in square feet, or "No walls · open floor".
- While drawing, each wall segment gets a length label (`fmtFt`), and a closed room being edited shows a live size (`overlays`).
- Each catalog row shows `sizeText` from `src/catalog.js` (inches from the product record).
- Door resize toasts the new width.

## Layers

Floors, not named layers. `#lvlBar` in `src/app/levels.js` moves between level −3 and level 20 (`MIN_LVL`, `MAX_LVL` in `src/grid.js`). The floor you leave is stored in `S.levels`. The floor below is drawn as a faint outline (`drawGhost`). The label is `Level N`.

## Wall and shape drawing

The draw row is `#drawTools`. Tapping the active tool again returns to Move.

- **Box** (`boxRect`). Drag corner to corner. Corners snap to the current wall step. The result is one closed rectangle. A drag that does not make area is discarded.
- **Walls.** Tap point to point. Segments stay axis-locked. **Close walls** (`closeWalls`) appears once the open run has 3 points; tapping near the start also closes it. **Done** (`#btnWallsDone`) leaves Builder and opens Place objects.
- **Door.** Tap a wall. `placeDoor` cuts a 3 ft opening (`DOOR_W`), snapped to 0.5 ft, kept off the corners. A second door that touches the first merges into a wider opening. Drag either end handle to resize (`resizeDoor`); width snaps to 0.5 ft, minimum 3 ft, and stops at the next door or the corner. Outdoor with no walls hides the Door tool.
- **Delete wall** / **Delete door** (`#btnDelWall`) removes the selected segment or door (`deleteSegment`, `removeDoor`).

Size chips under the canvas (`PRESETS` in `src/walls.js`): No walls, 20 × 20, 30 × 40, 50 × 100, 100 × 150. Indoor starts on 30 × 40. Picking a chip replaces the walls and adds one door (`src/autodoor.js` in this export).

A Box, a corner drag, or a wall push on a touch screen waits for **Keep** or **Cancel** (`#confirm`, `beginEdit` / `finishEdit` in `src/app/state.js`). A mouse keeps a valid edit at once. A shape that crosses itself or drops a wall under 1 ft is put back (`editOk`).

There is no roof tool. A closed wall polygon is the outline a roof would cover.

## Camera: top and 3D

`src/camera.js` and `src/app/view.js`, with placement in `src/app/render.js` `placeCam`.

- **3D** is the default. Yaw, pitch 0.95, distance 46 ft (`DEFAULT_VIEW`). One finger turns (`orbitBy`) unless **Drag: Pan** is on (`#btnPanMode`). Two fingers pan, pinch-zoom, and twist (`pinch`). The mouse wheel zooms. Right-drag pans. Pitch stays between 0.35 and 1.45. Distance stays between 6 and 2400 ft.
- **Top view** (`#btnTop` or T). Pitch becomes `TOP_PITCH` (1.5695, just short of straight down). Yaw snaps to the nearest quarter turn and the camera frames the wall bounds. The button then reads **3D view** and restores the old yaw. In top view, one-finger drag pans.
- **Reset view** (`#btnReset`, `resetView`) frames the walls at the default 3D pitch.
- **Walls: Low / Full / Hidden** (`#btnWallsView`). Low is the short working height (`WALL_H` 1.5 ft indoors, 0.35 ft outdoors). Full is 9 ft indoors and 3.5 ft outdoors. Hidden is a thin line. This changes the mesh height only.

## Save and load

`src/grid.js` and `src/app/state.js` / `src/app/presets.js`.

- Key `esp.layout.v3` (`SAVE_KEY`). Schema 3. A layout saved under the older key `rentourav.esp.v3` is read once.
- `serialize` stores env, walls, items, mute, the active floor, the other floors, the tech level (Essentials / Standard / Showcase, Showcase preselected), and a timestamp. `deserialize` drops unknown item types and clamps floors to −3..20.
- **New layout** (`#btnNew`) confirms, then opens Indoor / Outdoor (`#setup`). **Start building** applies the default size chip.
- **Open saved** (`#btnOpen`) loads the stored layout and lands in Place objects. The start screen shows the saved size and item count.
- `pagehide` and a render crash call `saveNow` immediately. **Reload view** (`#btnRecover`) reloads the page onto that save.
- Triple-tap the version label to open the hidden debug overlay.

The save record still has `venue` and `fill` fields because that is the schema. This export never fills them.

## Other tools

- **Add item** (`#btnAdd`, `src/app/place.js`). Category sheet, then a product row. The new item is placed at the view centre, or the nearest free spot within 30 ft.
- **Presets** (`#btnEvents`, `src/app/presets.js`, recipes in `src/fun.js`). Booth, Classroom, Banquet, Theater, Registration. Tech level Essentials / Standard / Showcase, Showcase preselected. Add or replace. See `objects/sets.json` for one worked room.
- **Share** (`#btnShare`, `layoutPng` in `src/app/view.js`). PNG of the current view plus a Rentacomputer.com strip and the room size. Uses the system share sheet, or downloads `my-event-layout.png`.
- **Sound** (`#btnMute`). Stored with the layout. Placement clicks live in `src/app/shell.js`.
- **Home** (`#btnHome`) saves and returns to the start screen.
- Hint line (`#hint`) restates the active tool. It fades on the first pointer down.

## Keyboard

| Key | Action |
|---|---|
| Ctrl or Cmd + Z | Undo. Cancels a pending wall edit first. |
| Ctrl or Cmd + Y, or Ctrl or Cmd + Shift + Z | Redo. Commits a pending wall edit first. |
| R | Rotate the selection. |
| Delete or Backspace | Delete the selection. |
| T | Toggle top view. |
| Escape | Cancel a pending edit, stop Same again, leave a draw tool, or clear the selection and close the sheet. |

## Where each tool lives

| Tool | UI | Logic |
|---|---|---|
| Select, rotate, copy, delete, add sheet | `#selBar`, `#sheet` | `src/app/place.js`, `src/logic.js` |
| Drag, draw, door resize, keys | canvas | `src/app/input.js` |
| Snap, hosts, poster and stage links | — | `src/logic.js`, `src/products/stage.js`, `src/products/lineup.js` |
| Box, walls, doors, push, size label | `#drawTools`, `#toolsBuild`, `#sizeLbl` | `src/walls.js` |
| Grid meshes, snap hint, segment lengths | `#snapHint` | `src/app/scene.js`, `src/app/render.js` |
| Undo, redo, save record | `.hUndo`, `.hRedo` | `src/history.js`, `src/app/state.js`, `src/grid.js` |
| Floors | `#lvlBar` | `src/app/levels.js` |
| Top, 3D, pan, wall height, Same again, share | `#rail`, `#stampBar` | `src/camera.js`, `src/app/view.js` |
| Mode switch, size chips, confirm | `#modes`, `#presets`, `#confirm` | `src/app/shell.js` |
| Clear | `#btnClear` | `src/app/clear.js` |
| Presets and tech level | `#btnEvents` | `src/app/presets.js`, `src/fun.js` |

## Not implemented

These were asked for by name. The planner does not have them. The closest behaviour is listed so a new tool can extend it.

| Asked for | What the planner does instead |
|---|---|
| Scale | Door width only (`resizeDoor`). Object envelopes stay at the catalog size. Mesh `scale` in code is the footprint display, not a user handle. |
| Align and distribute | Axis lock and corner guides while drawing walls (`drawPoint`). No object align, no even spacing of a selection. |
| Array | One copy offset by width + 0.5 ft, or tap-to-place Same again. No count, no spacing, no grid of copies. |
| Group | Linked LED posters and stage decks, plus objects hosted on another object. No group command for a mixed selection. |
| Measure and dimension | Room size label, per-wall length labels, and catalog size text. No tap-two-points measure. |
| Layers | Floors from −3 to 20, one active floor. No named layers, no visibility toggles per object type. |
