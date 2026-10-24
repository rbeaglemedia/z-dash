# Neon World style

Kid App only (`world.html`, `world-split.html`, and the `world/` scripts). Adult `index.html` is out of this guide.

Bob can edit this file. The architecture check reads the latest copy on every run and judges plans, proposals, and finished buildings against it. Shots, doors, and the FPS numbers live in `tools/ARCH-CHECK.md`.

Warnings do not fail a review. A capability flag fails, because the stack cannot build it well. A hard brand break fails. Drift is a warning with a suggestion.

## Stack

What this stack builds well.

- Canvas 2D and WebGL, in Safari and Chrome
- A base iPad on iPadOS 17.7.8, and Bob's Samsung Galaxy
- Galaxy steady at 110 fps or better, and iPad steady at 60 or 30
- No shadowBlur
- Procedural instanced geometry, or one light CC0 low-poly model used many times
- Straight boxes, flat walls, glow strips, and flat murals

## Capability

Flag a plan or a building that needs something this stack does badly. The past miss was a complex curvy 370Z Stillen bumper: it did not come out well. Each bullet is `triggers | simpler build`. A sentence that only forbids the trigger is not a flag.

- curve, curves, curvy, spline, organic, sculpted, bumper shell, stillen | Build it from a few straight boxes and a glow strip. That is the lesson from the Stillen bumper.
- photoreal, pbr, 4k texture, subsurface | Use flat neon colors on boxes. No photo texture.
- shadowblur, live blur, gaussian | Draw a second brighter stroke, or a thin lit box. No blur.
- high-poly, unique mesh, sculpted mesh | Instance one kit of boxes, or repeat one light CC0 low-poly model.
- heavy shader, custom shader per building | Use the shared neon stroke.

Finished buildings that are still boxes pass this list. shadowBlur on a building pass fails it. A custom draw path, instead of the shared boxes, fails it.

## Brand

Edit this section when the look changes.

Mood: neon synthwave, a dark-sky night city, glow strips. Accents are cyan #3ee6ff, magenta #ff4fd8, lime #7dff6b, and gold #ffb020.

Homes: Brookhaven is the feeling to aim at, not a model to copy. Clean, bright, modern. Glass walls. Cyan neon strip lighting. Built from flat boxes.

Ellie: 10, and advanced for her age. Smart, not babyish.

Direction: move away from all-black buildings. A black fill with only a neon edge is drift while the block is still a night-city building. That is a warning, not a hard fail.

Own art: draw our own. Do not copy Roblox assets, Brookhaven meshes, or any other game's files.

### Drift

Warnings. They do not fail the review. Each bullet is `triggers | suggestion`.

- all-black, all black, black box, black slab | Keep the night sky. Add a glass band and a cyan, magenta, lime, or gold strip, made of boxes, so the block is not a black slab.
- babyish, toddler, preschool, cute overload | Keep it smart. Ellie is 10 and advanced. A short word on the sign is enough.
- home without glass, black home | A home wants a lighter glass face and a cyan strip, still made of boxes.

### Hard breaks

These fail the brand check. Each bullet is `triggers | what to do instead`.

- copy roblox, roblox asset, roblox mesh, roblox, copied from brookhaven, download the brookhaven | Use our own boxes, strips, and flat murals. Brookhaven is a feeling, not a file to copy.
- photoreal daylight, realistic concrete city, no neon at all | Stay a neon night city. Without that, it is no longer Neon World.

## Ramps

Bob simplified this rule. The old strict ramp-count check is dropped.

A layout needs a lot of ramps. That is the whole count rule. Twenty-four ramps, not counting tow-truck beds, is enough to call it a lot. More than that is fine. A layout is not rejected for going over a ramp number, and the maps do not have to mark every ramp.

The river-edge ramp stays as it is now. It is a small ramp at the river bank. At about 80 mph it clears the river. Keep its position, its size, and its launch the same relative to the water. The checker locks the small river jumps in the city today (`nm` `river`, 1.6 m high, 10 m long, lip 8 m from the water):

| Bank | Place |
| --- | --- |
| South | x = −40, z = 1767 |
| North | x = 60, z = 1853 |
| South | x = −250, z = 1767 |

Each one stays within 8 m of that spot, within 0.2 m of that height, within 1 m of that length, on the same heading, and within 2 m of that lip-to-water gap. Adding another ramp beside them does not fail. Moving or shrinking one of those jumps does.

Tow-truck beds are their own jumps. They are not part of this count, and they are not the river-edge ramp.

## What else the review still scores

Doors at street level, sized for a person. Garages sized for the 370Z. Windows on one grid. No floating, intersecting, or z-fighting boxes. Roofs closed, and detailed when seen from the air. The same shape, doors, and garages at Arcade, Street, and on-foot. Signs attached and readable. The Z dance mural on a flat wall at least as big as today's. The neon palette. No `shadowBlur` on the building pass. The building pass inside the FPS budget shared with PERF-GUARD.

Those checks are in `tools/ARCH-CHECK.md`.
