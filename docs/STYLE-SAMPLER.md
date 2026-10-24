# Style sampler

Eight walk-in rooms in a temporary southwest row. Ellie walks through them and taps the ones she likes. The six real rooms stay on the list below for a later pass.

## Where the row sits

`SAMPLER_ROW` in `world/style-sampler.js` is the only map position. The shells are 14 by 12 meters, centered at x = -268, with z centers from -56 to 56. East doors face the x = -250 street. The row is inside the spawn-south block, clear of the street curbs, the ramps, and the future south dance hall. Move that one constant when the dance district lands. Room art is in local meters and does not store a world coordinate. Stepping back outside returns to that door's stand point.

Each shell uses purpose `SAMPLER`. That purpose is a door of its own. It is not added to the id-modulo purpose list, so untagged buildings keep their current purposes. The garage page link and the saved home keys stay as they are.

The row adds 8 solid shops. The count goes from 24 to 32. The architecture checker is not on main. When it lands, its approved count and a `SAMPLER` purpose line need to include this row.

## The eight rooms

Every room is larger than the shared room in use today (8.4 by 6.3 by 3.1 meters). Sizes are width, depth, and ceiling, in meters.

| Style | Meters | Plan | Light | Clutter | Scale |
| --- | --- | --- | --- | --- | --- |
| Glass | 26 x 18 x 4.8 | Open, glass wall | Daylight | A few pieces | Everyday furniture |
| Wood | 22 x 16 x 3.6 | Two rooms, low ceiling | Warm lamps | A lived-in set | Chunky sofa |
| Pop | 32 x 22 x 6.8 | One tall room | Bold color | Busy | Oversized chairs |
| Pastel | 20 x 18 x 4.2 | A low wall with a gap | Soft daylight | Sparse | Small chairs |
| Loft | 28 x 24 x 7.4 | Stairs and an upper floor | High windows, one lamp | A few crates | Mixed |
| Plants | 36 x 26 x 5.6 | One long garden room | Daylight through glass | Many pots | Big and small pots |
| Future | 30 x 16 x 8 | Open and very tall | A thin cyan line | Almost empty | Low seats |
| Neon | 24 x 18 x 5.2 | Open night room | Thin glow strips | A row of screens | Everyday screens |

Paint time for one frame at 1280 by 720, averaged over 40 paints in headless Chrome on this machine:

| Style | ms |
| --- | --- |
| Glass | 0.42 |
| Wood | 0.21 |
| Pop | 0.23 |
| Pastel | 0.18 |
| Loft | 0.42 |
| Plants | 0.39 |
| Future | 0.19 |
| Neon | 0.20 |
| House | 0.27 |

110 frames a second is a 9.1 ms budget. Every room above is under that. The room painter does not set shadowBlur. While any walk-in room is open, the outdoor city loop stays held, so the cost is the room itself. The corner chip shows the live rate from the walk frame. These times are from this machine, not from a Galaxy handset.

## Furniture and tech

Sofas, tables, screens, TV stands, and speakers come from `PLANNER_PROPS` in `world/planner-props.js`. That file is the kid-page door for the catalog in Planner Port [PR #82](https://github.com/rbeaglemedia/z-dash/pull/82). The call is `list`, `get`, `parts(id, params)`, `remix(id)`, and `place(list, parts, x, y, z, yaw)`. Published ids are `screen`, `sofa`, `table`, `tv-stand`, `speaker`, `truss-seg`, and `led-trailer`. `parts` also accepts the baker names `tvStand`, `trussSeg`, and `ledTrailer`. The meshes are that proof's stand-in boxes. A screen faces +z, so a wall screen is placed with yaw of pi and the lit face points into the room. Glow is optional. The room shell is drawn before the furniture, so a short sofa stays in front of the floor.

Ellie's house uses the same painter at 24 by 18 by 4.8 meters. The saved furniture choice picks a catalog set: a sofa, a TV stand, speakers on a table, or a screen on a table. The saved color tints that screen. The pet bed is a low catalog table. The four saved controls and their keys stay as they are.

## The heart

Each room has an "I like this one" button. It is saved on the device under `zdash.sampler.likes.v1`. Picks opens the list of eight styles and which ones are marked. Leaving the room hides the button. The likes stay on the device.

## People in the room

Ellie is drawn about 1.7 m tall with a filled torso. The pet stands on the floor, ears at 0.74 m, beside her. On the catalog frames the pet is about 0.42 of her height. This painter draws that pair itself. It does not change the crew rig. Rig work stays with Anatomy Check.

## Six rooms for later

These are the walk-ins to build after a look is chosen. Sizes are the two options already written up. This change does not build them.

| Room | Daylight meters | One glow strip | What you do there |
| --- | --- | --- | --- |
| House | 24 x 18 x 4.8 | 22 x 16 x 4.6 | The four saved home controls |
| Arcade | 36 x 18 x 5.2 | 32 x 16 x 5.0 | Jackpot on the far cabinet |
| Cafe | 28 x 18 x 4.6 | 26 x 16 x 4.5 | Order at the counter |
| Pet lounge | 32 x 22 x 5.0 | 30 x 20 x 4.8 | Greet at a pen |
| Soccer shop | 48 x 30 x 6.8 | 42 x 28 x 6.5 | Kick off at a goal in the room |
| Builder HQ | 28 x 18 x 5.5 | 26 x 18 x 5.2 | A board of flat plans. The sandbox stays outside |

Left alone: the adult page, Neon Paint, Garage Z, Dance, and the saved home keys `zdash.house.v1` and `zdash.kid.v1`.
