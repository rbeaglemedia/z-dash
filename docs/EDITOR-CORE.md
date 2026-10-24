# Editor core

Ellie pack B and the later DEV Builder share `world/editor-core.js`. Planner Port (`bc-40642464`) adds the DEV role and the Q2 tools in this file. One core, no second copy.

The file has no DOM and no city. `call('road')`, `call('building')`, `call('nos')`, and `call('spawn')` return `{ ok: false, reason: 'off' }`.

## Ellie

```text
const session = EDITOR_CORE.create({
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

`EDITOR_CORE.live` is the open session. The walk painter reads `live.props` while Build is open, and `ROOM_PLACE.read` after Done.
