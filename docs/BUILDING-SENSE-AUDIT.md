# Building sense audit

Plan only. No game code in this change. Nothing here deploys.

Bob approved the mode for every building below, including all eight open recommendations. This file records those decisions and the build plan. Writing the kits still waits for "plan approved, build it".

This is a place check. It asks whether each Neon World building makes sense as a place. The approved count stays 24. These notes reuse the buildings that are already there. A canopy, a pump, a pad, a shaft, a pen, a table, a cabinet, or a desk is a prop on a building that already exists. It is not a new building.

City ids below are the ids in `world/city.js`. PR #68 numbers the same shops differently in its own table. A kit keys off the purpose, and which copy, and never off either number as a map coordinate.

## Decided

| Building | City ids | Mode | What gets built |
| --- | --- | --- | --- |
| NOS & Fuel Depot | 3, 7 | Drive-up | Gas station. A canopy of flat boxes, two pump islands, claim NOS at the pump. |
| Speed & Tuning Garage | 0, 8 | Launch the app | Garage Z opens directly. Back returns to that bay, with the tune kept. |
| Pet rescue | 14, 15 | Walk-in | A large lounge. Two low pens, greet at a pen. The pet stays shorter than Ellie. |
| Z Company Arts | 11, 17 | Launch the app | The dance stage opens directly. BACK returns to the street in front of that mural. |
| Z-DASH showroom | 2, 6 | Drive-up | The car stays on a cyan pad under a box frame and a glow strip. |
| Sky-drop pad and sky tower | 1, 4 | Drive-up | A pad and a straight shaft. A bigger JUMP sign, readable from the street and from the air. |
| Stadium pro shop | 20, 21 | Walk-in | A large shop. Sign says SOCCER. Kick off starts at a goal in the room. No teleport. |
| Builder HQ | 22, 23 | Walk-in | A large room and a desk of flat blueprint boards. Sign says BUILD. The sandbox stays outside. |
| Player house | 5, 13 | Walk-in | Stays a home. A large room: glass panels and a cyan strip, sofa, pet bed, and sign. |
| Retro pixel arcade | 12, 19 | Walk-in | Stays an arcade. A large room: a row of box cabinets with flat glow screens. |
| Pizza and boba cafe | 16, 18 | Walk-in | Stays a cafe. A large room: a counter and two box tables. |
| Neon paint studio | 9, 10 | Launch the app | Already decided. In progress with the Paint agent. |

Drive-up means the car stays in the place. Walk-in means Ellie is on foot. Launch the app means skip the empty room.

## The empty room, and apps with no way back

Every indoor purpose except the house uses one room in `world/house.js`. The shell is a dark box, a floor grid, and two bars on the ceiling. The props are one to three boxes. The buttons are one action and STEP BACK OUTSIDE. That is the room Bob saw at the paint studio: the only choices are "go do the thing" or leave.

Who has that room today: paint, garage, dance, pets, showroom, cafe, arcade, NOS, soccer, and builder. Home has its own tools (wall, furniture, pet bed, sign) plus step-out, so it is not this pattern. Sky drop never opens the room. The door pops Ellie onto the roof.

Three of those doors then leave the world for another page:

- **Paint** goes to `neon-paint.html`. That page has no way back. **In progress** with the Paint agent: walking in launches the app, and a back button returns to the world with the paint applied.
- **Garage** (OPEN GARAGE Z) goes to `jr.html#garage`. The kid menu can open Neon World again, which loads the city fresh. It does not return you to the bay with the tune kept. Entering also fills the NOS tank and flashes an underglow. **Decided:** skip the room, open Garage Z, and back returns to that bay with the tune kept.
- **Pets** (OPEN CREW & PETS) goes to `crew.html`. The pause menu links to Neon World, which loads the city fresh. It does not return you to the lounge. **Decided:** a walk-in lounge. The crew page is not required. If a link to it remains, its back button returns to the lounge door, not a fresh world load.

Dance is the near miss. The stage is an overlay on the world, and its BACK button closes the stage. You are still in the empty room. STEP BACK OUTSIDE is what reaches the street. **Decided:** walking in opens the stage, and BACK returns to the street.

Showroom, cafe, arcade, NOS, and builder stay on the world page. Their button raises a toast. You can step outside. The room is still the empty lobby. Soccer does that toast on the button, and entering also teleports the car to the far stadium oval before the room opens. Those modes are decided in the table above.

## How a fix is allowed to look

Build each place from a few straight boxes and a glow strip, in cyan, magenta, lime, or gold, on the night city. Use the same kit on both copies of a purpose. Homes get a lighter glass face and a cyan strip. Words stay short. Ellie is 10 and advanced, so the places stay smart. Nothing here adds a building.

Where the mode is an app, skip the empty room. Walking in opens the app. A back button returns to the world, at that door, with whatever the app changed.

Glow on these props is a second brighter stroke, or a thin lit box.

## Interior size

Standing rule from Bob. It applies to every interior in this plan, and to later ones.

Interiors vary in size by use case. None will ever be as small as the current tiny rooms. Today every indoor purpose shares one shell in `world/house.js`: about 8.4 m wide, 6.3 m deep, and 3.1 m tall, and the walk stays inside an even smaller patch. That size is retired. A new interior is larger than that room.

An interior can be huge. The room does not cost much of the frame, so size follows the use, within reason for that use. A house, a cafe, and a stadium shop do not have to match each other. Each one is large enough for what you do there.

These walk-in places are planned as large rooms:

- Player house (ids 5, 13)
- Arcade (ids 12, 19)
- Pizza and boba cafe (ids 16, 18)
- Pet lounge (ids 14, 15)
- Stadium shop (ids 20, 21)
- Builder HQ (ids 22, 23)

The large size is the space behind the door. It does not grow the shop on the map. PR #68 keeps today's footprints and heights. A bigger interior must not push a shop onto a road, a ramp, or a tunnel mouth.

Paint, the garage, and the dance hall launch an app and skip the room. NOS, the showroom, and the sky-drop pad are drive-up. They are not these walk-in rooms.

## The buildings

### Ellie's neon paint studio — in progress

Arts, id 9, sign NEON. Parkside, id 10, sign NEON.

**Decided.** Walking in launches the paint app. A back button returns to the world with the paint applied. The Paint agent owns this fix. This plan does not reassign it.

What's wrong today: the empty room. The choices are OPEN NEON PAINT STUDIO or leave. The app page has no way back.

### NOS & Fuel Depot — decided, drive-up

Parkside, id 3, sign NOS, with a roof pad. Spawn, id 7, sign NOS. Id 3 is the room in Bob's screenshot.

**Decided.** A drive-up gas station. A canopy of flat boxes, two pump islands the car drives up to, and the claim-NOS action on the pump.

What's wrong today: the empty room, two pillars, and nowhere that is a path. CLAIM THE NOS is the button in the middle of the floor, or you leave. The claim is a toast. The car never pulls up. This one does not leave the world for another page.

### Speed & Tuning Garage — decided, launch Garage Z

Spawn south, id 0, sign GARAGE, with a roof pad. Sports east, id 8, sign GARAGE.

**Decided.** Skip the room. Open Garage Z. A back button returns to the bay she entered, with the tune kept.

What's wrong today: the empty room, a gold slab, and a cabinet. OPEN GARAGE Z sends the browser to `jr.html#garage`. Coming back through the kid menu loads Neon World fresh. It does not return you to this door. The tune-up on the way in also fills the NOS tank and flashes an underglow.

### Z Company Arts dance studio — decided, launch the stage

Arts, id 11, sign Z COMPANY ARTS, mural on the east face. Downtown, id 17, sign Z COMPANY ARTS, mural on the west face.

**Decided.** Skip the room. Walking in opens the stage. BACK returns to the street in front of that hall's mural.

What's wrong today: the empty room, a pink floor square, and a dark board. The mural that makes this a dance place is only outside. OPEN CAMERA DANCE STAGE opens the stage on top of the world. BACK closes the stage and leaves you in the room. The street is another tap after that.

### Pet rescue and critter lounge — decided, walk-in

Parkside, id 14, sign PETS. Parkside, id 15, sign PETS.

**Decided.** A walk-in lounge, and a large one. Two low pens made of boxes. Greet at a pen. The pet in the room stays shorter than Ellie. If the crew page stays linked, its back button returns to the lounge door. The room is larger than today's shared shell.

What's wrong today: the empty room, a low green bed, and a gold counter. OPEN CREW & PETS goes to `crew.html`. The pause menu can open Neon World, which loads the city fresh. It does not return you to the lounge. The fox in this interior draw is about twice Ellie's height. See the pet note below.

### Z-DASH glass showroom — decided, drive-up

Downtown, id 2, sign Z-DASH, with a roof pad. Spawn, id 6, sign Z-DASH.

**Decided.** Drive-up. The car stays on a cyan pad under a box frame and a glow strip.

What's wrong today: the empty room and a dark platform. SPOTLIGHT THE 370Z is a toast. You can step outside. The car is not in the room. The outside name says glass, and the block is a dark fill with a neon edge. This one does not leave for another page.

### Sky-drop helipad — decided, drive-up

Arts district, id 1, sign JUMP, 62 m, with a roof pad.

**Decided.** A flat pad of boxes with a cyan strip, and a straight elevator shaft. The car lands and launches from that pad. The word on the sign stays JUMP, and it gets big enough to read from the street and from the air.

What's wrong today: there is no room and no shaft. The door pops Ellie onto the roof. The pad is a landing circle, not a place with a way up. This is not the empty-room pattern.

### Sky tower — decided, drive-up

Id 4, sign JUMP, 239 m, with a roof pad.

**Decided.** The same pad and the same straight shaft as the helipad. A bigger JUMP sign, readable from the street and from the air.

What's wrong today: the same teleport, no shaft. The word JUMP is too small to read from the street (about 6 px at the sign camera, about 5 px on the front shot). The architecture check already fails that size. This plan does not lower that bar. The bigger sign is what clears it.

### Stadium pro shop and arena — decided, walk-in

Sports, id 20, sign TURBO. Sports, id 21, sign TURBO.

**Decided.** A walk-in shop, and a large one. The sign says SOCCER. Kick off starts at the goal in the room. Entering does not teleport the car to the far oval. The room is larger than today's shared shell.

What's wrong today: the empty room, a green rug, and a goal. The street sign says TURBO, so it does not read as soccer. KICK OFF on the button is a toast. Entering the door also teleports the car to the far stadium oval, then opens the room. You can step outside, and you are no longer at the shop.

### City builder architect HQ — decided, walk-in

North of the river, id 22, sign PIXEL. Id 23, sign PIXEL.

**Decided.** A large walk-in room with a desk of flat blueprint boards. The sign says BUILD. The sandbox stays outside. The room is larger than today's shared shell.

What's wrong today: the empty room and one crate. The street sign says PIXEL, so it does not read as a builder. OPEN THE BLUEPRINTS is a toast about the sandbox. You can step outside. There is no blueprint app today.

### Player house — decided, walk-in

Spawn, id 5, sign HOME. Parkside, id 13, sign HOME.

**Decided.** It stays a walk-in home, and the room is large. It becomes a living room of flat glass panels and a cyan strip, keeping the sofa, the pet bed, and the sign. The room is larger than today's shared shell.

This one is not the empty-room pattern. The room already has a wall color, a furniture block, a pet bed, and a sign, and you can step outside. There is no house app. It is still a dark room with three lumps, and it does not yet read as a bright modern home with glass walls.

### Retro pixel arcade — decided, walk-in, needs a real room

Arts, id 12, sign ARCADE. Sports, id 19, sign ARCADE.

**Decided.** It stays a walk-in arcade, and the room is large. The room becomes a row of box cabinets with flat glow screens, and the jackpot action sits on a cabinet. The room is larger than today's shared shell.

What's wrong today: the empty room and two cabinets. HIT THE ARCADE is a toast from the middle of the floor. You can step outside. There is no arcade app page.

### Neon pizza and boba cafe — decided, walk-in, needs a real room

Parkside, id 16, sign PIZZA. Downtown, id 18, sign PIZZA.

**Decided.** It stays a walk-in cafe, and the room is large. The room becomes a counter and two box tables, and the order action sits at the counter. The room is larger than today's shared shell.

What's wrong today: the empty room and one counter. ORDER BOBA & PIZZA is a toast that adds points and NOS. You can step outside. There is no cafe app page.

## Build plan

No new agent. Each change goes to the agent that already owns that file. Architecture Check reviews the result. It does not build it.

Game code still waits for "plan approved, build it" on this plan. PR #68 has its own approval. Approving these modes does not approve the city move, and approving the city move does not build these kits.

### Who owns what

| Change | Owner | Files | Notes |
| --- | --- | --- | --- |
| Neon paint, both shops | Paint agent | The paint app and the NEON_PAINT door | In progress. Do not reassign. |
| Dance enter, and BACK to the street | Dance stage, PR #39 | `world/dance-stage.js`, and the DANCE branch of the door | Both halls. BACK lands on the street in front of that mural. |
| Garage Z enter, and back to the bay | Buildings agent | The GARAGE branch of the door, and the back control on `jr.html#garage` | PR #65 (pet on the turntable) is a different change. It is not this job. |
| NOS canopy and pumps | Buildings agent | Exterior props on the NOS shops | Both copies. Claim at the pump. |
| Showroom pad | Buildings agent | Exterior props on the showroom shops | Both copies. Car stays on the pad. |
| Sky pad, straight shaft, bigger JUMP sign | Buildings agent | Props on both sky-drop buildings | The 62 m pad and the 239 m tower. Word stays JUMP. |
| Stadium room, SOCCER sign, no teleport | Buildings agent | SOCCER room and the door | A large room. Remove the teleport to the far oval. |
| Builder desk, BUILD sign | Buildings agent | BUILDER room and the sign | A large room. Sandbox stays outside. Do not move the HQs. |
| Pet lounge | Buildings agent | PETS room | A large room. Pens and the greet. Not the pet-scale check. |
| Arcade room | Buildings agent | ARCADE room | A large room. Cabinets. Not a toast in an empty room. |
| Cafe room | Buildings agent | CAFE room | A large room. Counter and two tables. |
| House glass room | Buildings agent | HOME room in the world | A large room. See the overlap with PRs #70, #57, and #60. |
| Interior pet scale | Anatomy Check, PR #61 (`bc-bfc8fc93`) | The anatomy checker | Flag only. A pet taller than Ellie inside a building fails. |
| Where the shops sit | City Layout agent, PR #68 (`bc-3ff1a27b`) | Shop positions, district labels, two plaza slides | Only after Bob approves that plan. Does not build these kits. |
| Review after the build | Architecture Check, PR #66 (`bc-c7ace59c`) | The checker | Does not build. Does not loosen a check to pass a half-built place. |
| Frame cost | FPS Guard, PR #62 | The bench | Reviews. This plan does not add a bench. |

The buildings agent is `bc-2a4360f4`, PR #59. That PR's WebGL pass stays on hold, and the game Ellie plays is still the 2D world. The same agent owns these kits, and the kits land in that 2D world: rooms in `world/house.js`, and the canopy, pumps, pad, shaft, and signs as boxes on the existing shops. This is not a new WebGL-only build, and it is not a reason to start another agent.

One editor of `world/house.js`: the buildings agent. Two branches are excepted so agents do not overwrite each other. The Paint agent keeps the NEON_PAINT door. The dance stage keeps the DANCE door. Everyone else in the table above, including the GARAGE door, is the buildings agent.

### House overlap

The glass living room is the world interior. It overlaps three open PRs that already touch the house:

- PR #70 shows Ellie's house on the Home menu preview.
- PR #57 is the bright day rooms.
- PR #60 is the room prop sheet.

The buildings agent builds the glass room in the world. Those three PRs keep the menu preview, the day-room pass, and the prop sheet. This plan does not take those files over.

### Works with the city layout (PR #68)

PR #68 is still a plan. Bob has not written "plan approved, build it" for it. The two options are the same map except the 62 m sky-drop roof: Option A leaves that roof on the west shoulder, Option B moves it east beside the arcades. This sense plan does not pick A or B.

The layout agent owns where shops sit. This plan owns how a shop behaves. Either can land first.

- Every behavior looks up the building by purpose, and by which copy she entered. It does not store today's x or z. Paint returns to the NEON_PAINT door. Garage Z returns to the GARAGE bay. Dance BACK returns to the street in front of that hall's mural. A pet-page back, if one remains, returns to that PETS door. The sky shaft and pad belong to that sky-drop building, so they follow the box when the roof moves.
- PR #68 keeps both dance murals 64 m long, and both face east onto a street. Today the downtown hall (city id 17) faces west. BACK uses the mural face of the hall she entered. It does not keep today's west face.
- The sky tower stays downtown. Both builder HQs stay on today's pads. Moving those HQs would sit them on the north-bank river jumps. The runway, river, tunnel, spawn at (0, 0), dome, park, and track do not move. This plan does not move them either.
- The layout plan says a soccer shop still sends her to the dome, and that this needs no rewiring. That is the old behavior. Bob decided the shop is a walk-in with no teleport. The sense build removes that teleport on the SOCCER purpose. The layout build must not put it back.
- A canopy, a pump island, a showroom pad, or a sky shaft sits on that building's parcel, or on a short drive apron on the same parcel. It does not cover a road, spawn, the runway, the river, a ramp run-up, a ramp landing, or a tunnel mouth. The layout agent leaves that apron clear when it places the shops. The place kits do not edit shop positions.
- PR #68 already slides two plazas so ramps are not inside the new arcade and the new cafe (arcade lot one block north, pizza lot one block south). Those slides stay the layout agent's job. The arcade cabinets and the cafe tables do not change them.
- The close-up draw reaches 170 m, and a neighborhood can put several shops in one shot. Each purpose uses one repeated kit of a few boxes. The shot does not pay for a different interior on every copy. Interior size is a separate cost. Bob's rule is that those rooms can be huge, within reason for the use, because the interior does not cost much of the frame. That size stays behind the door. It does not enlarge the shop footprint on the map.
- The approved count stays 24. Placeholder buildings stay until a look is actually built. These kits replace the empty room and the missing pad. They do not add a shop, and they do not cover a street to do it.

### What Architecture Check will look for

After a build, the existing checks still apply. This plan does not weaken them.

- Count stays 24. A move is allowed. A shop on a road, on spawn, in the river, or with no walkable door fails.
- Ramp count stays at least the original 70, each with a clear 16 m run-up and a clear 16 m landing. The tunnel keeps its size, shape, and length, and both mouths stay clear.
- SOCCER, BUILD, and a JUMP sign big enough to read are what clear the purpose checks that TURBO, PIXEL, and the tiny JUMP fail today. The word JUMP stays. The check is not lowered.
- A dance mural stays a flat wall at least as big as today's.
- No live glow blur on the building pass.
- The building pass stays inside the FPS budget shared with PERF-GUARD.

## Pet scale, for Anatomy Check

Flag this so Anatomy Check catches pet scale inside buildings, not only on the street. The check belongs to Anatomy Check, PR #61. This audit does not change that checker. The lounge furniture is a separate change, owned by the buildings agent.

In Bob's NOS screenshot the fox stands behind Ellie and is about twice her height. The interior draws that pair through the crew preview (`walkPaintCrew` calls `crew.preview`, which uses `drawStage`). Ellie is drawn at one size. The fox is drawn with its own close camera (`petCam`: focal length about 1.85 times the cell height, sitting 0.82 m away, in a cell about 70% of the card tall). That framing makes the fox a giant in every interior, because every interior uses the same preview.

On the street the follower uses the fox rig (body about 0.26 m) at a 1.25 scale, next to a 1.7 m person. That street pet is a different draw. The interior card is the one that fails.

Anatomy Check should measure the pet against the person in an interior shot. The pet stays shorter than the person. The standing target is about 0.74 m for the pet and 1.7 m for Ellie. A pet about twice the character's height fails.

## What this plan does not do

It does not edit `world/`, it does not add a building, and it does not deploy. It does not edit `docs/CITY-LAYOUT-PLAN.md` or pick Option A or Option B. It does not move a shop. The count stays 24. Paint stays with the Paint agent. The other kits wait for "plan approved, build it".
