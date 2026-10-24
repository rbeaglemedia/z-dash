# Object catalog

Study the Rentacomputer.com planner objects one by one, and as the sets they form. There is no venue list in this zip.

Sizes are in feet. 1 unit = 1 foot. The origin of an object is the centre of its footprint on the floor. +y is up. The front faces +z. A part's x, y, z is the centre of that part.

Meshes are code-built from boxes, cylinders, and a few turned or extruded solids. Materials are flat colors. `color` is the hex. There are no photos and no textures.

## One by one

`catalog.json` has every registered object.

- `envelope` is the footprint the planner uses: width, depth, and height, in feet and inches. `topFt` is the surface a laptop can sit on. `panelFt` is the glass height of a TV. `sideWallFt` is a booth's side-wall height.
- `parts` is each visible piece of the floor-standing mesh: shape, material, and size. A TV also has `wallMountParts`, the panel and mount without the floor stand.
- `placement.snapsTo` says how the object attaches: `top` (on a surface), `edge` (a chair against a table), `wall` (hung on a wall), `wallfloor` or `backwall` or `nearwall` (standing against a wall).
- `tech` and `screen` match `TECH.json`. `screen` is a TV, display, or touchscreen.
- LED posters (`ledposter`) and stage decks (`stage`, 4 × 8 ft) join into a rigid run. Linked posters leave off the shared-side bezel so the glass meets.
- `place: "end"` objects (barricade, feeder cable, cable ramp) pull flush end to end. `place: "outside"` is the generator, which sits outside the room.
- Two files in `src/products/` do not register an object: `uplight.js` and `stagelight.js`. They are listed as `notRegistered`.

## Whole sets

`sets.json` is how those objects combine.

The five presets are Booth, Classroom, Banquet, Theater, and Registration. Each one is built three times, at Essentials, Standard, and Showcase. Showcase is the preselected level and the full technology set.

The room is the **30 × 40** size chip: a closed 30 ft by 40 ft rectangle, before a door is added. `items` is every object in that set, with `x` and `z` on the floor and `a` as the facing angle in radians. `host` is the index of the object it sits on (a chair's host is its table, a laptop's host is the lectern or table). `links` are indexes of objects joined into a run. `members` is the same set counted by object.

`gapsFt` is the clearance the presets keep: row spacing, the centre aisle, the wall gap, chair-back gap, booth aisle, registration queue, and the gap at a door.
