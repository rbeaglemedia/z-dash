# Two modes for Z-DASH, plus the object catalog

This bundle is the Rentacomputer.com Event Space Planner builder and object catalog. The venue list is not included. The planner repository was not changed.

Both modes boot from `index.html` and `src/main.js`. The mode switch is the two buttons on the build screen. The object study files in `objects/` are for reading. `src/main.js` does not load them.

## Builder

Button: **Builder** (`data-phase="build"`).

Use this to draw the house shell.

- **Box** (`src/app/input.js`, `boxRect` in `src/walls.js`) drags out a closed rectangle.
- **Walls** draws a square-locked polyline and can close it.
- **Door** cuts a 3 ft opening in a wall.
- **Move** orbits the view and pushes a wall by its arrow.
- Size chips (No walls, 20 × 20, 30 × 40, 50 × 100, 100 × 150) are plain rectangles.
- Floor up and floor down (`src/app/levels.js`) keep a shell per level.

There is no roof tool in the planner. Closed wall polygons from `src/walls.js` are the outline a roof would cover. Z-DASH adds roofs on top of those polygons. Do not look for a roof mesh in this zip.

## Place objects

Button: **Place objects** (`data-phase="place"`).

Use this inside a shell to drop catalog objects.

- **Add item** opens the full catalog (`src/catalog.js`, `src/products/`).
- Drag, rotate, copy, and delete are in `src/app/place.js` and `src/app/input.js`.
- Each object is a code-built mesh (`src/meshes.js` or the product's own `draw`).
- Technology is tagged, not guessed from the name. Read `TECH.json` or `src/tech-tags.js`.
  - `tech: true` — 34 technology items (screens, computers, kiosks, audio, power).
  - `screen: true` — 18 TVs, displays, LED walls, and touchscreens. Start here for house screens.
  - `tech: false` — tables, seating, counters, booths, and the lectern.

`isTech(id)` and `screenItems()` are exported from `src/tech-tags.js`.

## Editor tools

Read `TOOLS.md`. The controls and the logic are already in this zip. `TOOLS.md` is a short map of each one: select, move, rotate, snap and grid, wall alignment, duplicate, linked groups, undo and redo, size readouts, floors, wall and shape drawing, top and 3D camera, save and load, and the smaller tools around them.

These editor actions are not in the planner, so there is no code to port for them: object scale, align and distribute of objects, array, a general group command, a measure tool, and named layers. `TOOLS.md` says what exists in their place.

## Object study

Read `objects/README.md`, then `objects/catalog.json` and `objects/sets.json`.

- One by one: every catalog object, with its envelope size and each mesh part (shape, size, position, flat color).
- Whole sets: the five event presets (Booth, Classroom, Banquet, Theater, Registration) at Essentials, Standard, and Showcase, laid out in the 30 × 40 size chip. Showcase is the preselected tech level.

## Left out on purpose

- Venue list, venue names, and venue floor plans.
- Run event (people simulation).
- Quote form.
- Roofs. The wall outline is here; the roof is new work for Z-DASH.

`src/main.js`, `src/autodoor.js`, and `src/tech-tags.js` were written for this zip so the two modes start without the simulation code. They are not files from the planner repo.
