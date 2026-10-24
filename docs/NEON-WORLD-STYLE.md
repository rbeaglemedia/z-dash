# Neon World style

Kid App only (`world.html`, `world-split.html`, and the `world/` scripts). Adult `index.html` is out of this guide.

This file is the style rule the architecture check reads. Building measurements, shots, and the FPS caps live in `tools/ARCH-CHECK.md`. The checker does not change the city, and it does not deploy.

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

Those checks are in `tools/ARCH-CHECK.md`. They are unchanged by the lighter ramp rule.
