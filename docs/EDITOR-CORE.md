# Shared planner tools

Ellie pack B and the DEV Builder share `world/planner-tools.js`. The one object is `PLANNER_TOOLS`. Planner Port (`bc-40642464`) owns snap, rotate, history, roof, measure, align, and group. Ellie calls `roomSnap`, `rotate`, `moveHosts`, `copySpot`, `createHistory`, and `create()` for pack B. There is no second core.

The file has no DOM and no city. `call('road')`, `call('building')`, `call('nos')`, and `call('spawn')` return `{ ok: false, reason: 'off' }`. Ellie also leaves align, measure, group, and 15° rotate for the DEV Builder.

## Ellie

```text
const session = PLANNER_TOOLS.create({
  role: 'ellie',
  roomId: 'house',
  saveKey: 'zdash.ellie.builder.v1'
});
session.call('place', 'tv85');
session.call('turn');
session.call('swatch', '#ff4fd8');
session.call('floor');
session.call('done');
```

Pack B is select, move, quarter-turn, copy, size, Floor, Walk, and four swatches (cyan `#3ee6ff`, magenta `#ff4fd8`, amber `#ffb020`, white `#ffffff`), plus undo, redo, delete, and Done. Words on the buttons stay Place, Turn, Done, Undo.

`roomId: 'house'` is the L1 room. Another room id returns `{ ok: false, reason: 'house' }`.

The save key is `zdash.ellie.builder.v1`. Done and Start over write that key. The writer leaves `zdash.house.v1`, `zdash.kid.v1`, and `zdash.sampler.likes.v1` as they were.

With no save yet, the house shows four starter pieces and waits for Done:

| Prop | Slot | Bottom |
| --- | --- | --- |
| tv85 | wall-far-left | 1.15 m |
| ledposter | wall-far-right | 1.15 m |
| speaker | floor-left | floor, 1.83 m tall |
| kiosk | floor-right | floor, 1.22 m tall |

Laptops wait for a table. Place uses the first free slot of the same kind. Hero slots stay with the saved home controls. A drag that misses a free slot leaves the piece where it was. Copy needs a free slot and a count under 48. Past that, the note says "This room is full."

`PLANNER_TOOLS.live` is the open session. The walk painter reads `live.props` while Build is open, and `ROOM_PLACE.read` after Done. Grid snap stays `PLANNER_TOOLS.snap`. The house uses `PLANNER_TOOLS.roomSnap`, which reads `ROOM_PLACE.snap`.
