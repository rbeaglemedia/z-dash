# Architecture check

Target `cursor/boulevards-batch-ef23` `6541c3e8faa1`

Result: **FAIL**

Reviewed 31 solid buildings. Shots: 0. Style guide: `docs/NEON-WORLD-STYLE.md`.

## Count

- **Unapproved new building**
  The city has 31 solid buildings. Bob approved 24. A moved building is not a new one. An extra block that loads in the game is. A pitch under Ideas for Bob is not.

## Layout

- **Building blocks a road**
  The footprint covers a street, the highway, the runway, or the taxiway. Keep the pavement clear so a car can pass.
  Buildings: SKY_DROP `3` — street.
- **Door is not walkable**
  The ground just outside a person door has to be walkable: not inside a building, not in the river, and not a wall.
  Buildings: NOS `9` — opens into NOS; NOS `9` — a wall is 2.2 m outside the door; NOS `9` — a wall is 2.2 m outside the door; NOS `19` — opens into NOS; NOS `19` — a wall is 2.2 m outside the door; NOS `19` — a wall is 2.2 m outside the door; NOS `30` — opens into NOS; NOS `30` — a wall is 2.2 m outside the door; NOS `30` — a wall is 2.2 m outside the door; NOS `36` — opens into NOS; NOS `36` — a wall is 2.2 m outside the door; NOS `36` — a wall is 2.2 m outside the door; NOS `45` — opens into NOS; NOS `45` — a wall is 2.2 m outside the door; NOS `45` — a wall is 2.2 m outside the door.

## Scale

- **Building is short next to a person**
  The roof is under three person-heights (1.7 m).
  Buildings: SNACK `8` — 5 m tall; SNACK `27` — 5 m tall; SNACK `34` — 5 m tall; SNACK `43` — 5 m tall.

## Doors

Pass.

## Garages

- **Garage door is not car-sized**
  The mouth graphic sits on the center of the bay. It has to clear the 370Z (1.85 m wide, 1.32 m tall) with room to spare.
  Buildings: HOME `0` — 1.44×2.45 m door on a 10×9×4.4 m bay. narrower than the 370Z (1.44 m door, car is 1.85 m wide).; GARAGE `2` — 1.44×2.45 m door on a 10×9×4.4 m bay. narrower than the 370Z (1.44 m door, car is 1.85 m wide).; SKY_DROP `3` — 1.44×2.45 m door on a 10×9×4.4 m bay. narrower than the 370Z (1.44 m door, car is 1.85 m wide).; SKY_DROP `4` — 1.44×2.45 m door on a 10×9×4.4 m bay. narrower than the 370Z (1.44 m door, car is 1.85 m wide).; SHOWROOM `5` — 1.44×2.45 m door on a 10×9×4.4 m bay. narrower than the 370Z (1.44 m door, car is 1.85 m wide).; GARAGE `6` — 1.44×2.45 m door on a 10×9×4.4 m bay. narrower than the 370Z (1.44 m door, car is 1.85 m wide).; NEON_PAINT `7` — 1.44×2.45 m door on a 10×9×4.4 m bay. narrower than the 370Z (1.44 m door, car is 1.85 m wide).; SKY_DROP `10` — 1.44×2.45 m door on a 10×9×4.4 m bay. narrower than the 370Z (1.44 m door, car is 1.85 m wide).; GARAGE `17` — 1.44×2.45 m door on a 10×9×4.4 m bay. narrower than the 370Z (1.44 m door, car is 1.85 m wide).; DANCE `20` — 1.44×2.45 m door on a 10×9×4.4 m bay. narrower than the 370Z (1.44 m door, car is 1.85 m wide).; SKY_DROP `21` — 1.44×2.45 m door on a 10×9×4.4 m bay. narrower than the 370Z (1.44 m door, car is 1.85 m wide).; GARAGE `25` — 1.44×2.45 m door on a 10×9×4.4 m bay. narrower than the 370Z (1.44 m door, car is 1.85 m wide).; ARCADE `26` — 1.44×2.45 m door on a 10×9×4.4 m bay. narrower than the 370Z (1.44 m door, car is 1.85 m wide).; BUILDER `28` — 1.44×2.45 m door on a 10×9×4.4 m bay. narrower than the 370Z (1.44 m door, car is 1.85 m wide).; SKY_DROP `29` — 1.44×2.45 m door on a 10×9×4.4 m bay. narrower than the 370Z (1.44 m door, car is 1.85 m wide).; GARAGE `35` — 1.44×2.45 m door on a 10×9×4.4 m bay. narrower than the 370Z (1.44 m door, car is 1.85 m wide).; SKY_DROP `37` — 1.44×2.45 m door on a 10×9×4.4 m bay. narrower than the 370Z (1.44 m door, car is 1.85 m wide).; SOCCER `38` — 1.44×2.45 m door on a 10×9×4.4 m bay. narrower than the 370Z (1.44 m door, car is 1.85 m wide).; SKY_DROP `39` — 1.44×2.45 m door on a 10×9×4.4 m bay. narrower than the 370Z (1.44 m door, car is 1.85 m wide).; GARAGE `44` — 1.44×2.45 m door on a 10×9×4.4 m bay. narrower than the 370Z (1.44 m door, car is 1.85 m wide)..

## Windows

- **Two window systems share the wall**
  The close view draws dashed floor lines every 5.5 m and 1.65×1.2 m panes on a different pitch. A floor line cuts through a pane.
  Buildings: HOME `0`; PETS `1`; GARAGE `2`; SKY_DROP `3`; SKY_DROP `4`; SHOWROOM `5`; GARAGE `6`; NEON_PAINT `7`; NOS `9`; GARAGE `17`; CAFE `18`; NOS `19`; DANCE `20`; SKY_DROP `21`; GARAGE `25`; ARCADE `26`; BUILDER `28`; SKY_DROP `29`; NOS `30`; GARAGE `35`; SKY_DROP `37`; SOCCER `38`; SKY_DROP `39`; GARAGE `44`; NOS `45`.

## Geometry

- **Box is floating**
  A volume starts at 3.18 m with nothing under it.
  Buildings: NOS `9`; NOS `9`; NOS `19`; NOS `19`; NOS `30`; NOS `30`; NOS `36`; NOS `36`; NOS `45`; NOS `45`.
- **Volumes intersect inside one building**
  7.26 m³ overlap.
  Buildings: NOS `9`; NOS `9`; NOS `19`; NOS `19`; NOS `30`; NOS `30`; NOS `36`; NOS `36`; NOS `45`; NOS `45`.

## Roofs

- **Roof is a blank slab from the air**
  The cap is closed and the neon edge draws. Nothing else is on the roof: no pad, tank, or antenna. A flying view cannot tell this roof from a lid.
  Buildings: HOME `0`; PETS `1`; GARAGE `6`; NEON_PAINT `7`; SNACK `8`; GARAGE `17`; CAFE `18`; NOS `19`; GARAGE `25`; ARCADE `26`; SNACK `27`; BUILDER `28`; NOS `30`; SNACK `34`; GARAGE `35`; NOS `36`; SOCCER `38`; SNACK `43`; GARAGE `44`; NOS `45`.

## Detail tiers

Pass.

## Signs

- **Sign is not readable from the street**
  At the front camera the word "JUMP" is 6.35 px.
  Buildings: SKY_DROP `3`.

## Purpose

- **Purpose is not readable from the air**
  A flying view has to show the purpose. A sky drop can use its helipad. A dance building can show the mural. Anything else needs its purpose word at least 10 px from the roof camera. Put that word on the roof in straight boxes and a glow strip.
  Buildings: GARAGE `2` — sign "GARAGE" 9.7 px, roof is a helipad; SHOWROOM `5` — sign "Z-DASH" 7.97 px, roof is a helipad; NOS `9` — sign "NOS" 7.55 px, roof is a helipad; BUILDER `28` — sign "PIXEL" 32.89 px, roof is a blank slab; SOCCER `38` — sign "TURBO" 15.83 px, roof is a blank slab.
- **Purpose is not readable at street level**
  The street sign has to use a word from that purpose in docs/NEON-WORLD-STYLE.md and measure at least 10 px at the front camera.
  Buildings: SKY_DROP `3` — sign "JUMP" 4.59 px; wants sky, jump, helipad; BUILDER `28` — sign "PIXEL" 45.88 px; wants build, architect; SOCCER `38` — sign "TURBO" 25.67 px; wants soccer, pitch, goal, stadium, arena.
- **Purpose is not in the style guide**
  Add SNACK to the Purpose list in docs/NEON-WORLD-STYLE.md, with the words a player should read, or mark the building generic.
  Buildings: SNACK `8`; SNACK `27`; SNACK `34`; SNACK `43`.

## Z dance mural

Pass.

## Style

- **Color is outside the neon set**
  Stroke #ff9a2e is not in the night palette.
  Buildings: SNACK `8`; SNACK `27`; SNACK `34`; SNACK `43`.

## Ramps

- **Not enough ramps**
  This layout has 39 ramps besides tow-truck beds. The original city has 70, including the river-edge launches. More than that is fine. Fewer is not.

## Tunnel

Pass.

## shadowBlur

- **Building pass set shadowBlur**
  A review draw assigned a non-zero shadowBlur 193 times. The probe forced the value back to 0 so the shot still shows the building. Glow belongs off this path. Source: world/neon-paint.js:2708 (10); world/neon-paint.js:2719 (8); world/neon-paint.js:2740 (8); world/neon-paint.js:2770 (lw * (s.brush === 'spray' ? 2.2 : 1.4)); world/neon-paint.js:2775 (Math.max(2, lw * 0.3)).

## FPS

Pass.

## Capability

- **Beyond the stack: blur**
  Finished building draw uses a live blur. Draw a second brighter stroke, or a thin lit box. No blur.

## On brand

- Warning: **Buildings are still all-black**
  The shared drawer fills every solid building with #0a0612 and a neon edge. Keep the night sky. Add a glass band and a cyan, magenta, lime, or gold strip, made of boxes, so the block is not a black slab.
  Buildings: HOME `0`; PETS `1`; GARAGE `2`; SKY_DROP `3`; SKY_DROP `4`; SHOWROOM `5`; GARAGE `6`; NEON_PAINT `7`; SNACK `8`; NOS `9`; SKY_DROP `10`; GARAGE `17`; CAFE `18`; NOS `19`; DANCE `20`; SKY_DROP `21`; GARAGE `25`; ARCADE `26`; SNACK `27`; BUILDER `28`; SKY_DROP `29`; NOS `30`; SNACK `34`; GARAGE `35`; NOS `36`; SKY_DROP `37`; SOCCER `38`; SKY_DROP `39`; SNACK `43`; GARAGE `44`; NOS `45`.
- Warning: **Home is not a glass house yet**
  A home wants a lighter glass face and a cyan strip, still made of boxes.
  Buildings: HOME `0`.

## River-edge ramps

39 ramps besides tow trucks. Floor 70 (the original count, including the river-edge launches). No upper limit. Run-up 16 m, landing 16 m.

- south bank 1.6 m × 10 m, lip 8 m from the water, at -40, 1767
- north bank 1.6 m × 10 m, lip 8 m from the water, at 60, 1853
- south bank 1.6 m × 10 m, lip 8 m from the water, at -250, 1767

## Mural floor

- Z Company Arts `20` 58.88×9.9 m (582.91 m²), flat true, intact true

## FPS samples

Software GL. Milliseconds are this host, same idea as PERF-GUARD. Source for the building-face share: pr62-published.

| View | One building ms | Pass ms | Buildings | Cap one | Cap pass | Buffer |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| phone | 0.2 | 0.4 | 20 | 8 | 40 | 1688x780 |
| ipad | 0.5 | 1.5 | 20 | 16 | 90 | 1024x768 |
| pc | 0.1 | 0.3 | 20 | 8 | 40 | 1280x720 |

## What held

- Shape, doors, and garages match on Arcade, Street, and on foot.
- Dance mural walls are flat, on the face, and at least as big as the recorded floor.
- The tunnel keeps its length, bore, ceiling, and height, and both mouths stay clear.
- Finished buildings are straight boxes on the shared drawer. Curves, organic shells, and photoreal skins are not in this city.
- Person doors sit on the street, wide enough and tall enough for a 1.7 m person.
- One near building and the in-view building pass stay inside the FPS caps on phone, iPad, and PC.
