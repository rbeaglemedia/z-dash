# Room place hook

Neon World stays the test bed for Ellie's walk-in rooms. The pages are `world.html` and `world-split.html`, plus the copies under `test/`. The city stays as it is after the Option 1 layout. This note does not move a building, and it does not publish the site.

The object catalog belongs to Planner Port (`bc-40642464`, [PR #82](https://github.com/rbeaglemedia/z-dash/pull/82)). This hook is the room side: bounds, floor slots, wall slots, and the device save. `world/room-place.js` reads it. `world/planner-tools.js` writes Ellie's list. Planner Port adds the DEV Builder on that same file.

The machine copy is [`docs/room-place/HOOK.json`](room-place/HOOK.json).

## Frame

Every room is local metres. The origin is the floor at the center of the door wall. x points right, y points up, z points in toward the far wall. A prop at yaw 0 faces +z, so a seat looks at the far wall. A prop at yaw pi faces the door, so a screen's lit face points into the room. Catalog parts come from `PLANNER_PROPS.parts` and `PLANNER_PROPS.place`. One id, many sizes. Glow stays optional.

Objects sit at least 0.4 m inside the walls. The door gap stays clear: x from -1.2 to 1.2, z from 0 to 2.2. A new wall screen's bottom stays at or above 1.05 m, so the 0.74 m pet is not inside it. The neon row is the standing screens already in that room, with bottoms at 0.55 m. Ellie is 1.7 m. A room holds at most 48 catalog parts and one video.

## What each room exposes

`world/room-place.js` is on the kid pages. Three calls cover a room. They read. The editor core writes.

```text
ROOM_PLACE.describe(id) → bounds, blocked boxes, floor slots, wall slots
ROOM_PLACE.read(id)     → the props saved on this device for that room, or []
ROOM_PLACE.snap(id, hit) → the nearest free slot within 0.75 m, or null
```

`describe` is the contents of one entry in the JSON. `hit` is `{x, y, z, kind}` with `kind` of `floor` or `wall`. `snap` skips a slot marked `hero`, skips a blocked box, and skips the door gap. A null snap means the tool does not place.

`holds` on a slot:

| holds | Meaning |
| --- | --- |
| hero | Filled by the four saved home controls. The drop tool leaves it alone. |
| sample | Filled by the style sampler until this room has a saved prop list. Then the samples hide and the saved props draw. |
| drop | Empty. Waiting for a placed object. |

Shell pieces stay either way: glass panes, the wood partition, the loft stairs and upper floor, the plant pots, the pop pillars. Those are the `blocked` boxes. Furniture and tech are the slots.

## Rooms

Walk shells are in the game today. Later shells are the five rooms still on the list. Their bounds are the daylight sizes. They get one floor slot and one far-wall slot so the id exists before the shell does.

| id | Shell | Metres (w × d × h) | Floor slots | Wall slots |
| --- | --- | --- | --- | --- |
| house | walk | 24 × 18 × 4.8 | sofa, table, pet bed (hero), plus three free | far screen (hero), plus two free |
| glass | walk | 26 × 18 × 4.8 | sofa, table, one free | three on the glass wall |
| wood | walk | 22 × 16 × 3.6 | sofa, table, one in the back room | one on the far wall |
| pop | walk | 32 × 22 × 6.8 | sofa, table, one free | one wide far screen |
| pastel | walk | 20 × 18 × 4.2 | small sofa, small table, one behind the low wall | one far |
| loft | walk | 28 × 24 × 7.4 | sofa, table, speaker, one on the upper floor | one far |
| plants | walk | 36 × 26 × 5.6 | sofa, table, one in the aisle | one far |
| future | walk | 30 × 16 × 8 | low seat, one free | one thin far screen |
| neon | walk | 24 × 18 × 5.2 | speaker, one free | four standing screens in the row |
| arcade | later | 36 × 18 × 5.2 | one | one |
| cafe | later | 28 × 18 × 4.6 | one | one |
| pets | later | 32 × 22 × 5.0 | one | one |
| soccer | later | 48 × 30 × 6.8 | one | one |
| builder | later | 28 × 18 × 5.5 | one | one |

Wood keeps the gap in the partition (x from -1 to 1 at z = 8). The loft upper slot is at y = 3.64. The ground under that deck stays open.

## Save on her device

Planner Port already named the key `zdash.ellie.builder.v1`. This hook uses that key. It does not add a second one. Their flat file `{ v: 1, area: "house", props: [...] }` still means the house. A rooms map covers the sampler and the later ids:

```text
{
  v: 1,
  rooms: {
    house: { props: [{ prop, x, y, z, yaw, wall, slot, params }] },
    glass: { props: [] }
  }
}
```

`prop` is a catalog id. `params` is size, color, glow, and proportions. `wall` is `far`, `left`, `right`, or null for a floor piece. `y` is 0 on the floor, or the bottom of a wall piece. `PLANNER_TOOLS` is the writer. The walk painter is the reader. The writer stores `zdash.ellie.builder.v1` and leaves `zdash.house.v1`, the `house` object inside `zdash.kid.v1`, and `zdash.sampler.likes.v1` alone. Clearing the site data clears this list with her other device saves.

The house hero pieces stay on the existing four controls: sofa, arcade cabinet, DJ speakers, trophy screen, plus the pet bed and the sign. A placed object draws in addition to those. It does not replace them.

In a sampler room, the first saved prop hides that room's sample furniture. The shell stays. The heart button and `zdash.sampler.likes.v1` stay as they are.

## Picks

1. Snap to these slots. A free drop on the floor can come later. It would use the same bounds and the same door gap. The walk view already turns a tap into a floor point.
2. Keep `zdash.ellie.builder.v1`, and add the `rooms` map. The flat house file keeps working.
3. Slots now on the house and the eight sampler rooms. The five later rooms keep a name, bounds, and one floor slot plus one wall slot.
4. The Place control stays the one Planner Port described inside the house. The sampler rooms expose the same hook so the tool can target them when that control should appear there too.

Ellie L1 uses this hook inside the house. The DEV Builder and the Q2 tools stay with Planner Port, on `world/planner-tools.js`.
