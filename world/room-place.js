/* Room place hook. Reads docs/room-place/HOOK.json.
   describe, read, and snap. This file does not write a save.
   The writer is the editor core, key zdash.ellie.builder.v1. */
'use strict';

const ROOM_PLACE_DOC = {
  "rules": {
    "inset": 0.4,
    "doorKeepOut": {
      "x": 1.2,
      "z": 2.2
    },
    "wallScreenBottom": 1.05,
    "snapM": 0.75,
    "budget": {
      "instances": 48,
      "videos": 1
    },
    "people": {
      "ellieM": 1.7,
      "petM": 0.74
    }
  },
  "saveKey": "zdash.ellie.builder.v1",
  "rooms": [
    {
      "id": "house",
      "purpose": "HOME",
      "shell": "walk",
      "bounds": {
        "w": 24,
        "d": 18,
        "h": 4.8
      },
      "blocked": [],
      "floor": [
        {
          "id": "floor-sofa",
          "x": -2.6,
          "y": 0,
          "z": 6.6,
          "yaw": 0,
          "holds": "hero"
        },
        {
          "id": "floor-table",
          "x": 1.4,
          "y": 0,
          "z": 6.4,
          "yaw": 0,
          "holds": "hero"
        },
        {
          "id": "floor-pet-bed",
          "x": 3.1,
          "y": 0,
          "z": 5.2,
          "yaw": 0,
          "holds": "hero"
        },
        {
          "id": "floor-free",
          "x": 0,
          "y": 0,
          "z": 10,
          "yaw": 0,
          "holds": "drop"
        },
        {
          "id": "floor-left",
          "x": -5,
          "y": 0,
          "z": 8,
          "yaw": 0,
          "holds": "drop"
        },
        {
          "id": "floor-right",
          "x": 5,
          "y": 0,
          "z": 9,
          "yaw": 0,
          "holds": "drop"
        }
      ],
      "wall": [
        {
          "id": "wall-far",
          "wall": "far",
          "x": 0,
          "y": 1.15,
          "z": 17.4,
          "yaw": 3.1416,
          "holds": "hero"
        },
        {
          "id": "wall-far-left",
          "wall": "far",
          "x": -5.5,
          "y": 1.15,
          "z": 17.4,
          "yaw": 3.1416,
          "holds": "drop"
        },
        {
          "id": "wall-far-right",
          "wall": "far",
          "x": 5.5,
          "y": 1.15,
          "z": 17.4,
          "yaw": 3.1416,
          "holds": "drop"
        }
      ]
    },
    {
      "id": "glass",
      "purpose": "SAMPLER",
      "shell": "walk",
      "bounds": {
        "w": 26,
        "d": 18,
        "h": 4.8
      },
      "blocked": [
        {
          "id": "plant",
          "x0": 7.4,
          "x1": 9,
          "z0": 13.2,
          "z1": 14.8,
          "y0": 0,
          "y1": 1.6
        }
      ],
      "floor": [
        {
          "id": "floor-sofa",
          "x": -2.4,
          "y": 0,
          "z": 6.6,
          "yaw": 0,
          "holds": "sample"
        },
        {
          "id": "floor-table",
          "x": 1.6,
          "y": 0,
          "z": 6.2,
          "yaw": 0,
          "holds": "sample"
        },
        {
          "id": "floor-right",
          "x": 4.4,
          "y": 0,
          "z": 8.2,
          "yaw": 0,
          "holds": "drop"
        }
      ],
      "wall": [
        {
          "id": "wall-far",
          "wall": "far",
          "x": 0,
          "y": 1.15,
          "z": 17.4,
          "yaw": 3.1416,
          "holds": "sample"
        },
        {
          "id": "wall-far-left",
          "wall": "far",
          "x": -6,
          "y": 1.15,
          "z": 17.4,
          "yaw": 3.1416,
          "holds": "drop"
        },
        {
          "id": "wall-far-right",
          "wall": "far",
          "x": 6,
          "y": 1.15,
          "z": 17.4,
          "yaw": 3.1416,
          "holds": "drop"
        }
      ]
    },
    {
      "id": "wood",
      "purpose": "SAMPLER",
      "shell": "walk",
      "bounds": {
        "w": 22,
        "d": 16,
        "h": 3.6
      },
      "blocked": [
        {
          "id": "partition-left",
          "x0": -10,
          "x1": -1,
          "z0": 7.89,
          "z1": 8.11,
          "y0": 0,
          "y1": 3.35
        },
        {
          "id": "partition-right",
          "x0": 1,
          "x1": 10,
          "z0": 7.89,
          "z1": 8.11,
          "y0": 0,
          "y1": 3.35
        }
      ],
      "floor": [
        {
          "id": "floor-sofa",
          "x": -2.4,
          "y": 0,
          "z": 6.2,
          "yaw": 3.1416,
          "holds": "sample"
        },
        {
          "id": "floor-table",
          "x": 2.2,
          "y": 0,
          "z": 6.4,
          "yaw": 0,
          "holds": "sample"
        },
        {
          "id": "floor-back",
          "x": 0,
          "y": 0,
          "z": 12,
          "yaw": 0,
          "holds": "drop"
        }
      ],
      "wall": [
        {
          "id": "wall-far",
          "wall": "far",
          "x": 0,
          "y": 1.15,
          "z": 15.4,
          "yaw": 3.1416,
          "holds": "drop"
        }
      ]
    },
    {
      "id": "pop",
      "purpose": "SAMPLER",
      "shell": "walk",
      "bounds": {
        "w": 32,
        "d": 22,
        "h": 6.8
      },
      "blocked": [
        {
          "id": "pillar",
          "x0": 10.1,
          "x1": 11.9,
          "z0": 15.1,
          "z1": 16.9,
          "y0": 0,
          "y1": 4.6
        },
        {
          "id": "block",
          "x0": -13.1,
          "x1": -10.9,
          "z0": 15.4,
          "z1": 17.6,
          "y0": 0,
          "y1": 3.3
        }
      ],
      "floor": [
        {
          "id": "floor-sofa",
          "x": -1.6,
          "y": 0,
          "z": 6.8,
          "yaw": 0.15,
          "holds": "sample"
        },
        {
          "id": "floor-table",
          "x": 3.2,
          "y": 0,
          "z": 7.2,
          "yaw": 0,
          "holds": "sample"
        },
        {
          "id": "floor-left",
          "x": -6,
          "y": 0,
          "z": 8,
          "yaw": 0,
          "holds": "drop"
        }
      ],
      "wall": [
        {
          "id": "wall-far",
          "wall": "far",
          "x": 0,
          "y": 1.6,
          "z": 21.4,
          "yaw": 3.1416,
          "holds": "sample"
        }
      ]
    },
    {
      "id": "pastel",
      "purpose": "SAMPLER",
      "shell": "walk",
      "bounds": {
        "w": 20,
        "d": 18,
        "h": 4.2
      },
      "blocked": [
        {
          "id": "low-wall-left",
          "x0": -8.2,
          "x1": -1,
          "z0": 8.92,
          "z1": 9.08,
          "y0": 0,
          "y1": 2.05
        },
        {
          "id": "low-wall-right",
          "x0": 1,
          "x1": 8.2,
          "z0": 8.92,
          "z1": 9.08,
          "y0": 0,
          "y1": 2.05
        }
      ],
      "floor": [
        {
          "id": "floor-sofa",
          "x": -1.8,
          "y": 0,
          "z": 5.6,
          "yaw": 0.2,
          "holds": "sample"
        },
        {
          "id": "floor-table",
          "x": 2,
          "y": 0,
          "z": 7.4,
          "yaw": 0,
          "holds": "sample"
        },
        {
          "id": "floor-back",
          "x": 0,
          "y": 0,
          "z": 13,
          "yaw": 0,
          "holds": "drop"
        }
      ],
      "wall": [
        {
          "id": "wall-far",
          "wall": "far",
          "x": 0,
          "y": 1.15,
          "z": 17.4,
          "yaw": 3.1416,
          "holds": "drop"
        }
      ]
    },
    {
      "id": "loft",
      "purpose": "SAMPLER",
      "shell": "walk",
      "bounds": {
        "w": 28,
        "d": 24,
        "h": 7.4
      },
      "blocked": [
        {
          "id": "stairs",
          "x0": 3.55,
          "x1": 4.85,
          "z0": 9,
          "z1": 14.8,
          "y0": 0,
          "y1": 3.4
        },
        {
          "id": "mezzanine",
          "x0": -13,
          "x1": -1,
          "z0": 14.2,
          "z1": 22.2,
          "y0": 3.2,
          "y1": 3.55
        }
      ],
      "floor": [
        {
          "id": "floor-sofa",
          "x": -2.2,
          "y": 0,
          "z": 6.4,
          "yaw": 0,
          "holds": "sample"
        },
        {
          "id": "floor-table",
          "x": 2.2,
          "y": 0,
          "z": 7.6,
          "yaw": 0,
          "holds": "sample"
        },
        {
          "id": "floor-speaker",
          "x": -4.2,
          "y": 0,
          "z": 6.8,
          "yaw": 3.1416,
          "holds": "sample"
        },
        {
          "id": "floor-upper",
          "x": -6,
          "y": 3.64,
          "z": 18,
          "yaw": 0,
          "holds": "drop"
        }
      ],
      "wall": [
        {
          "id": "wall-far",
          "wall": "far",
          "x": 0,
          "y": 1.2,
          "z": 23.4,
          "yaw": 3.1416,
          "holds": "drop"
        }
      ]
    },
    {
      "id": "plants",
      "purpose": "SAMPLER",
      "shell": "walk",
      "bounds": {
        "w": 36,
        "d": 26,
        "h": 5.6
      },
      "blocked": [
        {
          "id": "pots-left",
          "x0": -15.2,
          "x1": -12.8,
          "z0": 3,
          "z1": 22.5,
          "y0": 0,
          "y1": 2.2
        },
        {
          "id": "pots-right",
          "x0": 12.8,
          "x1": 15.2,
          "z0": 3.2,
          "z1": 23,
          "y0": 0,
          "y1": 2.2
        },
        {
          "id": "pots-center",
          "x0": -1.2,
          "x1": 1.2,
          "z0": 13,
          "z1": 22,
          "y0": 0,
          "y1": 2.2
        }
      ],
      "floor": [
        {
          "id": "floor-sofa",
          "x": -1.4,
          "y": 0,
          "z": 7.2,
          "yaw": 0,
          "holds": "sample"
        },
        {
          "id": "floor-table",
          "x": 1.8,
          "y": 0,
          "z": 6.6,
          "yaw": 0,
          "holds": "sample"
        },
        {
          "id": "floor-aisle",
          "x": -4,
          "y": 0,
          "z": 11,
          "yaw": 0,
          "holds": "drop"
        }
      ],
      "wall": [
        {
          "id": "wall-far",
          "wall": "far",
          "x": 0,
          "y": 1.2,
          "z": 25.4,
          "yaw": 3.1416,
          "holds": "drop"
        }
      ]
    },
    {
      "id": "future",
      "purpose": "SAMPLER",
      "shell": "walk",
      "bounds": {
        "w": 30,
        "d": 16,
        "h": 8
      },
      "blocked": [],
      "floor": [
        {
          "id": "floor-sofa",
          "x": 0,
          "y": 0,
          "z": 6.4,
          "yaw": 0,
          "holds": "sample"
        },
        {
          "id": "floor-left",
          "x": -4,
          "y": 0,
          "z": 8,
          "yaw": 0,
          "holds": "drop"
        }
      ],
      "wall": [
        {
          "id": "wall-far",
          "wall": "far",
          "x": 0,
          "y": 2.4,
          "z": 15.4,
          "yaw": 3.1416,
          "holds": "sample"
        }
      ]
    },
    {
      "id": "neon",
      "purpose": "SAMPLER",
      "shell": "walk",
      "bounds": {
        "w": 24,
        "d": 18,
        "h": 5.2
      },
      "blocked": [],
      "floor": [
        {
          "id": "floor-speaker",
          "x": 3.6,
          "y": 0,
          "z": 6.6,
          "yaw": 3.1416,
          "holds": "sample"
        },
        {
          "id": "floor-free",
          "x": -2,
          "y": 0,
          "z": 7,
          "yaw": 0,
          "holds": "drop"
        }
      ],
      "wall": [
        {
          "id": "wall-a",
          "wall": "far",
          "x": -3.9,
          "y": 0.55,
          "z": 12.4,
          "yaw": 3.1416,
          "holds": "sample",
          "standing": true
        },
        {
          "id": "wall-b",
          "wall": "far",
          "x": -1.3,
          "y": 0.55,
          "z": 12.4,
          "yaw": 3.1416,
          "holds": "sample",
          "standing": true
        },
        {
          "id": "wall-c",
          "wall": "far",
          "x": 1.3,
          "y": 0.55,
          "z": 12.4,
          "yaw": 3.1416,
          "holds": "sample",
          "standing": true
        },
        {
          "id": "wall-d",
          "wall": "far",
          "x": 3.9,
          "y": 0.55,
          "z": 12.4,
          "yaw": 3.1416,
          "holds": "sample",
          "standing": true
        }
      ]
    },
    {
      "id": "arcade",
      "purpose": "ARCADE",
      "shell": "later",
      "bounds": {
        "w": 36,
        "d": 18,
        "h": 5.2
      },
      "blocked": [],
      "floor": [
        {
          "id": "floor-center",
          "x": 0,
          "y": 0,
          "z": 7.2,
          "yaw": 0,
          "holds": "drop"
        }
      ],
      "wall": [
        {
          "id": "wall-far",
          "wall": "far",
          "x": 0,
          "y": 1.15,
          "z": 17.4,
          "yaw": 3.1416,
          "holds": "drop"
        }
      ]
    },
    {
      "id": "cafe",
      "purpose": "CAFE",
      "shell": "later",
      "bounds": {
        "w": 28,
        "d": 18,
        "h": 4.6
      },
      "blocked": [],
      "floor": [
        {
          "id": "floor-center",
          "x": 0,
          "y": 0,
          "z": 7.2,
          "yaw": 0,
          "holds": "drop"
        }
      ],
      "wall": [
        {
          "id": "wall-far",
          "wall": "far",
          "x": 0,
          "y": 1.15,
          "z": 17.4,
          "yaw": 3.1416,
          "holds": "drop"
        }
      ]
    },
    {
      "id": "pets",
      "purpose": "PETS",
      "shell": "later",
      "bounds": {
        "w": 32,
        "d": 22,
        "h": 5
      },
      "blocked": [],
      "floor": [
        {
          "id": "floor-center",
          "x": 0,
          "y": 0,
          "z": 8.8,
          "yaw": 0,
          "holds": "drop"
        }
      ],
      "wall": [
        {
          "id": "wall-far",
          "wall": "far",
          "x": 0,
          "y": 1.15,
          "z": 21.4,
          "yaw": 3.1416,
          "holds": "drop"
        }
      ]
    },
    {
      "id": "soccer",
      "purpose": "SOCCER",
      "shell": "later",
      "bounds": {
        "w": 48,
        "d": 30,
        "h": 6.8
      },
      "blocked": [],
      "floor": [
        {
          "id": "floor-center",
          "x": 0,
          "y": 0,
          "z": 12,
          "yaw": 0,
          "holds": "drop"
        }
      ],
      "wall": [
        {
          "id": "wall-far",
          "wall": "far",
          "x": 0,
          "y": 1.15,
          "z": 29.4,
          "yaw": 3.1416,
          "holds": "drop"
        }
      ]
    },
    {
      "id": "builder",
      "purpose": "BUILDER",
      "shell": "later",
      "bounds": {
        "w": 28,
        "d": 18,
        "h": 5.5
      },
      "blocked": [],
      "floor": [
        {
          "id": "floor-center",
          "x": 0,
          "y": 0,
          "z": 7.2,
          "yaw": 0,
          "holds": "drop"
        }
      ],
      "wall": [
        {
          "id": "wall-far",
          "wall": "far",
          "x": 0,
          "y": 1.15,
          "z": 17.4,
          "yaw": 3.1416,
          "holds": "drop"
        }
      ]
    }
  ]
};

function roomPlaceParse() {
  try {
    const raw = JSON.parse(localStorage.getItem(ROOM_PLACE_DOC.saveKey) || 'null');
    return raw && typeof raw === 'object' ? raw : null;
  } catch (e) { return null; }
}

const ROOM_PLACE = {
  key: ROOM_PLACE_DOC.saveKey,
  rules: ROOM_PLACE_DOC.rules,
  rooms: ROOM_PLACE_DOC.rooms,
  describe(id) {
    for (let i = 0; i < ROOM_PLACE_DOC.rooms.length; i++) {
      if (ROOM_PLACE_DOC.rooms[i].id === id) return ROOM_PLACE_DOC.rooms[i];
    }
    return null;
  },
  hasSave() {
    try { return localStorage.getItem(ROOM_PLACE_DOC.saveKey) != null; } catch (e) { return false; }
  },
  read(id) {
    const raw = roomPlaceParse();
    if (!raw) return [];
    if (raw.rooms && raw.rooms[id] && Array.isArray(raw.rooms[id].props)) return raw.rooms[id].props.slice();
    if (id === 'house' && raw.area === 'house' && Array.isArray(raw.props)) return raw.props.slice();
    return [];
  },
  snap(id, hit, taken) {
    const room = ROOM_PLACE.describe(id);
    if (!room || !hit) return null;
    const kind = hit.kind === 'wall' ? 'wall' : 'floor';
    const slots = kind === 'wall' ? room.wall : room.floor;
    const skip = {};
    if (taken) for (let i = 0; i < taken.length; i++) skip[taken[i]] = 1;
    const door = ROOM_PLACE_DOC.rules.doorKeepOut;
    let best = null;
    let bestD = ROOM_PLACE_DOC.rules.snapM;
    for (let i = 0; i < slots.length; i++) {
      const s = slots[i];
      if (s.holds === 'hero' || skip[s.id]) continue;
      if (Math.abs(s.x) < door.x && s.z < door.z) continue;
      let blocked = false;
      for (let b = 0; b < room.blocked.length; b++) {
        const box = room.blocked[b];
        if (s.x > box.x0 && s.x < box.x1 && s.z > box.z0 && s.z < box.z1 && s.y >= box.y0 && s.y <= box.y1) blocked = true;
      }
      if (blocked) continue;
      const dx = s.x - hit.x, dy = (s.y || 0) - (hit.y || 0), dz = s.z - hit.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist <= bestD) { bestD = dist; best = s; }
    }
    return best;
  }
};

if (typeof globalThis !== 'undefined') globalThis.ROOM_PLACE = ROOM_PLACE;
if (typeof window !== 'undefined') window.ROOM_PLACE = ROOM_PLACE;
