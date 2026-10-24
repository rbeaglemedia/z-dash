# Building sense audit

Plan only. No game code in this change. Bob reviews this list before anyone builds it. A build waits for "plan approved, build it".

This is a place check, not the proportion check. It asks whether each Neon World building makes sense as a place you can be in: a room you can walk with a purpose, or a pad you can drive the car onto. The approved count stays 24. These fixes reuse the buildings that are already there.

## What was reviewed

The 24 solid buildings placed in `world/city.js`, and the interior drawn by `walkPaintRoom` in `world/house.js`. Bob's screenshot of the NOS & Fuel Depot interior is the example: a dark room, two pillars, an empty floor, and a fox about twice Ellie's height.

Every indoor purpose uses that same room. The shell is one dark box, a floor grid, and two bars on the ceiling. The props are one to three boxes. Home has four spots you can tap (wall color, furniture, pet bed, sign). Every other indoor purpose has one button in the middle of the floor. Several of those buttons only raise a toast, or they leave the room for another page.

Sky drop is the exception on entry. It is not in the indoor list, so the door does not open a room. It teleports Ellie to the roof, then launches.

## How a fix is allowed to look

Each idea below is a few straight boxes and a glow strip, in cyan, magenta, lime, or gold, on the night city. The same kit is reused on both copies of a purpose. Homes get a lighter glass face and a cyan strip. Words stay short. Ellie is 10 and advanced, so the places stay smart. Nothing here adds a building, and nothing here asks for a heavy one-off model.

Drive-up means the car stays in the place. Walk-in means Ellie gets out and the place is for her on foot.

## The list

None of the 24 read as a finished place. Twins share one interior, so one fix covers both copies.

### Speed & Tuning Garage — drive-up

Spawn south, id 0, sign GARAGE, with a roof pad. Sports east, id 8, sign GARAGE.

What's wrong: Ellie walks into a dark room with a gold slab and a cabinet. The car stays outside. The tune-up fills the NOS tank, flashes an underglow, and opens a separate garage screen.

Fix: Drive the car onto a box lift under a gold strip, with a tool chest by the bay, and do the tune-up beside the car.

### Sky-drop helipad — drive-up

Arts district, id 1, sign JUMP, 62 m, with a roof pad.

What's wrong: There is no room and no shaft. The door pops Ellie onto the roof. The pad is a landing circle, not a place with a way up.

Fix: A flat pad of boxes with a cyan strip and a straight elevator shaft, and the car lands and launches from that pad.

### Sky tower — drive-up

Id 4, sign JUMP, 239 m, with a roof pad.

What's wrong: Same teleport, no shaft. The word JUMP is too small to read from the street (about 6 px at the sign camera, about 5 px on the front shot).

Fix: The same pad and shaft, with the word SKY in boxes big enough to read from the street and from the air.

### Z-DASH glass showroom — drive-up

Downtown, id 2, sign Z-DASH, with a roof pad. Spawn, id 6, sign Z-DASH.

What's wrong: The room is a dark platform. The 370Z is not in it. The spotlight is a toast. The outside name says glass, and the block is a dark fill with a neon edge.

Fix: Drive the car onto a cyan pad under a box frame and a glow strip, and leave it there for the spotlight.

### NOS & Fuel Depot — drive-up

Parkside, id 3, sign NOS, with a roof pad. Spawn, id 7, sign NOS. Id 3 is the room in Bob's screenshot.

What's wrong: A mostly empty room with two pillars and nowhere that is a path. Claiming NOS is a button in the middle of the floor, plus a toast that grants 30 seconds of NOS. The car never pulls up. A fuel depot should be a gas station.

Fix: A canopy of flat boxes, two pump islands the car drives up to, and the claim-NOS action on the pump.

### Player house — walk-in

Spawn, id 5, sign HOME. Parkside, id 13, sign HOME.

What's wrong: You can walk, and you can change the wall color, the furniture block, the pet bed, and the sign. It is still a dark room with three lumps. It does not read as a bright modern glass home, inside or outside.

Fix: A living room of flat glass panels and a cyan strip, keeping the sofa, the pet bed, and the sign.

### Ellie's neon paint studio — walk-in

Arts, id 9, sign NEON. Parkside, id 10, sign NEON.

What's wrong: Three thin color posts in an empty room, and no wall to paint. The studio that actually paints is another page. The street sign says NEON, so the purpose is weak from the curb.

Fix: A studio with a flat wall you paint and a counter of cyan, magenta, and lime strips, with the paint tool on that wall and the word PAINT on the street sign.

### Z Company Arts dance studio — walk-in

Arts, id 11, sign Z COMPANY ARTS, mural on the east face. Downtown, id 17, sign Z COMPANY ARTS, mural on the west face.

What's wrong: Inside is a pink floor square and a dark back board. The mural that makes this a dance place is only outside. The dance opens another page, so the room is a lobby with nowhere to dance.

Fix: The flat mural on the long inside wall, a low box stage, and the dance action on the stage.

### Retro pixel arcade — walk-in

Arts, id 12, sign ARCADE. Sports, id 19, sign ARCADE.

What's wrong: Two cabinets in an empty room. The jackpot is a toast from the middle of the floor, not from a machine.

Fix: A row of box cabinets with flat glow screens, and the jackpot action on a cabinet.

### Pet rescue and critter lounge — walk-in

Parkside, id 14, sign PETS. Parkside, id 15, sign PETS.

What's wrong: A low green bed and a gold counter, and no pen to walk up to. "Critters say hi" is a toast. In Bob's NOS shot, and in this same interior draw, the fox is about twice Ellie's height, so the lounge cannot read as a place for a pet.

Fix: Two low pens made of boxes and a counter, with the greet action at a pen, and the pet kept shorter than Ellie.

### Neon pizza and boba cafe — walk-in

Parkside, id 16, sign PIZZA. Downtown, id 18, sign PIZZA.

What's wrong: One counter in an empty room. There is no table and no spot to stand and order. The order is a toast that adds points and NOS.

Fix: A counter and two box tables, with the order action at the counter.

### Stadium pro shop and arena — walk-in

Sports, id 20, sign TURBO. Sports, id 21, sign TURBO.

What's wrong: The street sign says TURBO, so the shop does not read as soccer. Inside is a green rug and a goal in a small room. Kick off teleports the car to the far stadium oval instead of playing at this building.

Fix: The word SOCCER on the face, a counter, and a goal in the room, with kick off starting at that goal.

### City builder architect HQ — walk-in

North of the river, id 22, sign PIXEL. Id 23, sign PIXEL.

What's wrong: The street sign says PIXEL, so it does not read as a builder. The interior is the fallback room: one crate. The blueprint action is a toast about the sandbox.

Fix: A desk of flat blueprint boards and a sign that says BUILD. The sandbox stays outside.

## Pet scale, for Anatomy Check

Flag this so Anatomy Check catches pet scale inside buildings, not only on the street.

In Bob's NOS screenshot the fox stands behind Ellie and is about twice her height. The interior draws that pair through the crew preview (`walkPaintCrew` calls `crew.preview`, which uses `drawStage`). Ellie is drawn at one size. The fox is drawn with its own close camera (`petCam`: focal length about 1.85 times the cell height, sitting 0.82 m away, in a cell about 70% of the card tall). That framing makes the fox a giant in every interior, because every interior uses the same preview.

On the street the follower uses the fox rig (body about 0.26 m) at a 1.25 scale, next to a 1.7 m person. That street pet is a different draw. The interior card is the one that fails.

Anatomy Check should measure the pet against the person in an interior shot. The pet stays shorter than the person. The standing target is about 0.74 m for the pet and 1.7 m for Ellie. A pet about twice the character's height fails. This audit does not change Anatomy Check. It only flags the miss.

## What this plan does not do

It does not edit `world/`, it does not add a building, and it does not deploy. The count stays 24. A later build uses the kits above, after Bob writes "plan approved, build it".
