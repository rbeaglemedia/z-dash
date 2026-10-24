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

## Buildings

Placements and the city map may change. Moving a building is not a fail. The count of solid buildings stays at the approved count, which is main today. Bob raises the number when he approves an addition. The checker does not raise it from a plan.

Approved count: 24

A heading `Ideas for Bob` may pitch new buildings. Those lines are not approval, and they are not in the game. Only a solid building that actually loads, past this count, fails.

A moved city still has to read as a city. Every building sits in a district, or in a district that touches its tag. The builder HQ stays in the north sandbox, and that sandbox does not take other purposes. Soccer stays on the east side. Nothing sits in the river. Nothing covers a street, the highway, the runway, the taxiway, or spawn. Every building has a door on a road, and that door opens onto ground a person can walk.

## Interiors

Standing rule from Bob. Interiors vary in size by use case. None will ever be as small as the current tiny rooms. The shared room today is about 8.4 m wide, 6.3 m deep, and 3.1 m tall. A new interior is larger than that.

An interior can be huge. That room does not cost much of the frame, so the size follows the use, within reason for that use.

Walk-in places are large rooms: the house, the arcade, the cafe, the pet lounge, the stadium shop, and the builder HQ. A place that launches an app, or a drive-up pad, is not one of those rooms.

The large size is the space behind the door. It does not grow the shop's footprint on the map. The checker does not measure room size yet. The rule still stands for every plan.

## Purpose

Each solid building has to read as its purpose at street level and from the air. The words after the bar are the ones a player can read. Bob can edit this list. A sky drop may show a helipad from the air instead of the word. A dance building may show the mural. Every other purpose needs its word readable in that view. Use straight boxes and a glow strip. Generic is a building with no named purpose: any readable word is enough.

- HOME | home
- NEON_PAINT | neon, paint
- GARAGE | garage
- DANCE | dance, arts, z company
- PETS | pet
- ARCADE | arcade
- NOS | nos, fuel
- SKY_DROP | sky, jump, helipad
- BUILDER | build, architect
- SOCCER | soccer, pitch, goal, stadium, arena
- CAFE | pizza, cafe, boba
- SHOWROOM | z-dash, showroom, z dash
- GENERIC |

## Ramps

A new city layout keeps at least as many ramps as the original city on main. That count is 70, not counting tow-truck beds, and it includes the river-edge launches. More than 70 is fine. There is no upper limit. Dropping below 70 fails, including a layout that removes a river-edge launch and does not replace it.

Every ramp needs a clear run-up and a clear landing. The run-up is 16 m behind the low end. The landing is 16 m past the lip. A relocated building or a ground prop in either box fails. Another ramp in that box does not. The ramp's own hill does not. A sign board that you can drive under does not.

The river-edge ramp stays as it is now. It is a small ramp at the river bank. At about 80 mph it clears the river. Keep its position, its size, and its launch the same relative to the water. The checker locks the small river jumps in the city today (`nm` `river`, 1.6 m high, 10 m long, lip 8 m from the water):

| Bank | Place |
| --- | --- |
| South | x = −40, z = 1767 |
| North | x = 60, z = 1853 |
| South | x = −250, z = 1767 |

Each one stays within 8 m of that spot, within 0.2 m of that height, within 1 m of that length, on the same heading, and within 2 m of that lip-to-water gap. Adding another ramp beside them does not fail. Moving or shrinking one of those jumps does.

Tow-truck beds are their own jumps. They are not part of this count, and they are not the river-edge ramp. Hidden banks, crests, and curb kickers are ramps. They count, and they need the same clear approaches.

## Tunnel

The existing tunnel stays essentially the same size, shape, and length. On main that is 200 m long, 160 m wide, a 30 m bore, a 10 m ceiling, and a 34 m hill, open along z. A missing tunnel fails. A shorter bore, a lower ceiling, a filled bore, or a turn onto the other axis fails. An extra tunnel beside it does not.

Both mouths stay clear for 40 m at the bore width, and the bore itself stays clear. The tunnel's own walls and ceiling are not blockers. A building or a ground prop in a mouth or in the bore fails.

## What else the review still scores

The approved building count. A logical map after a move: districts, roads, purpose, spawn, and walkable doors. Each building readable as its purpose from the street and from the air. Doors at street level, sized for a person. Garages sized for the 370Z. Windows on one grid. No floating, intersecting, or z-fighting boxes. Roofs closed, and detailed when seen from the air. The same shape, doors, and garages at Arcade, Street, and on-foot. Signs attached and readable. The Z dance mural on a flat wall at least as big as today's. The neon palette. No `shadowBlur` on the building pass. The building pass inside the FPS budget shared with PERF-GUARD.

Those checks are in `tools/ARCH-CHECK.md`.
