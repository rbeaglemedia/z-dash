# Building sense audit

Plan only. No game code in this change. Bob reviews this list before anyone builds it. A build waits for "plan approved, build it".

This is a place check. It asks whether each Neon World building makes sense as a place. The approved count stays 24. These notes reuse the buildings that are already there.

## Bob decides the mode

For each building, this audit does not decide whether the door launches an app, or opens a place you walk into, or a place you drive into. Where that choice is still open, it is written as a question. The recommendation sits under the question. Bob picks.

Two calls are already on the page:

- **Decided.** Ellie's Neon Paint Studio launches the paint app directly. The Paint agent is doing that now. Status: **in progress**.
- **Leaning, please confirm.** The NOS & Fuel Depot is leaning toward a drive-up gas station. Bob still confirms it.

A few places have no app behind them, and the way you use them is plain. Those are marked **obvious** so they are not fake questions. Bob can still override them.

## The empty room, and apps with no way back

Every indoor purpose except the house uses one room in `world/house.js`. The shell is a dark box, a floor grid, and two bars on the ceiling. The props are one to three boxes. The buttons are **one action** and **STEP BACK OUTSIDE**. That is the room Bob saw at the paint studio: the only choices are "go do the thing" or leave.

Who has that room today: paint, garage, dance, pets, showroom, cafe, arcade, NOS, soccer, and builder. Home has its own tools (wall, furniture, pet bed, sign) plus step-out, so it is not this pattern. Sky drop never opens the room. The door pops Ellie onto the roof.

Three of those doors then leave the world for another page:

- **Paint** goes to `neon-paint.html`. That page has no way back to the world. **In progress:** walking in launches the app, and a back button returns to the world with the paint applied.
- **Garage** (OPEN GARAGE Z) goes to `jr.html#garage`. The kid menu can open Neon World again, which loads the city fresh. It does not return you to the garage door with the tune-up kept.
- **Pets** (OPEN CREW & PETS) goes to `crew.html`. The pause menu links to Neon World, which loads the city fresh. It does not return you to the lounge.

Dance is the near miss. The stage is an overlay on the world, and its BACK button closes the stage. You are still in the empty room. STEP BACK OUTSIDE is what reaches the street. The stage does not trap you on another page. The room in front of it is still pointless.

Showroom, cafe, arcade, NOS, and builder stay on the world page. Their button raises a toast. You can step outside. The room is still the empty lobby. Soccer does that toast on the button, and entering also teleports the car to the far stadium oval before the room opens.

## How a fix is allowed to look

Where Bob picks a place, build it from a few straight boxes and a glow strip, in cyan, magenta, lime, or gold, on the night city. Use the same kit on both copies of a purpose. Homes get a lighter glass face and a cyan strip. Words stay short. Ellie is 10 and advanced, so the places stay smart. Nothing here adds a building.

Where Bob picks an app, skip the empty room. Walking in opens the app. A back button returns to the world, at that door, with whatever the app changed.

Drive-up means the car stays in the place. Walk-in means Ellie is on foot.

## Questions for Bob

| Building | Ids | Question | Recommendation |
| --- | --- | --- | --- |
| NOS & Fuel Depot | 3, 7 | Confirm the lean: drive-up gas station? | Yes. Canopy, two pump islands, claim NOS at the pump. |
| Speed & Tuning Garage | 0, 8 | Launch Garage Z directly, or a drive-in bay? | Launch Garage Z directly, with a back button to the bay. Same shape as the paint fix. |
| Z Company Arts | 11, 17 | Launch the dance stage directly, or a walk-in studio? | Launch the stage directly. BACK returns to the street, not to the empty room. |
| Pet rescue | 14, 15 | Launch the crew app directly, or a walk-in lounge? | Walk-in lounge. If the crew page stays, its back button returns to the lounge door. |
| Z-DASH showroom | 2, 6 | Drive-up spotlight, or walk around a parked car? | Drive-up. The car stays on a cyan pad under a box frame. |
| Sky-drop helipad and sky tower | 1, 4 | Drive-up pad, or a walk-in elevator? | Drive-up pad and a straight shaft. The car lands and launches there. |
| Stadium pro shop | 20, 21 | Walk-in shop, or send the car to the far oval? | Walk-in shop. Sign says SOCCER. Kick off starts at a goal in the room. No teleport. |
| Builder HQ | 22, 23 | Walk-in desk, or open a blueprint tool directly? | Walk-in desk of flat boards. Sign says BUILD. There is no blueprint app today. |

Obvious, unless Bob says otherwise: the **player house** (5, 13) is a walk-in home. The **arcade** (12, 19) is a walk-in row of cabinets. The **pizza and boba cafe** (16, 18) is a walk-in counter. None of those three has an app page.

## The buildings

### Ellie's neon paint studio — in progress

Arts, id 9, sign NEON. Parkside, id 10, sign NEON.

**Decided.** Walking in launches the paint app. A back button returns to the world with the paint applied. The Paint agent owns this fix.

What's wrong today: the empty room. The choices are OPEN NEON PAINT STUDIO or leave. The app page has no way back. The street sign says NEON, so the purpose is weak from the curb.

### NOS & Fuel Depot — confirm with Bob

Parkside, id 3, sign NOS, with a roof pad. Spawn, id 7, sign NOS. Id 3 is the room in Bob's screenshot.

**Question.** Confirm the lean toward a drive-up gas station.

What's wrong: the empty room, two pillars, and nowhere that is a path. CLAIM THE NOS is the button in the middle of the floor, or you leave. The claim is a toast. The car never pulls up. This one does not leave the world for another page.

Recommendation: a canopy of flat boxes, two pump islands the car drives up to, and the claim-NOS action on the pump.

### Speed & Tuning Garage — question

Spawn south, id 0, sign GARAGE, with a roof pad. Sports east, id 8, sign GARAGE.

**Question.** Launch Garage Z directly, or make a drive-in bay?

What's wrong: the empty room, a gold slab, and a cabinet. OPEN GARAGE Z sends the browser to `jr.html#garage`. Coming back through the kid menu loads Neon World fresh. It does not return you to this door. The tune-up on the way in also fills the NOS tank and flashes an underglow.

Recommendation: same pattern as paint. Skip the room, open Garage Z, and a back button returns to the bay with the tune kept. A drive-in lift is the other option, if Bob would rather skip the app.

### Z Company Arts dance studio — question

Arts, id 11, sign Z COMPANY ARTS, mural on the east face. Downtown, id 17, sign Z COMPANY ARTS, mural on the west face.

**Question.** Launch the dance stage directly, or a walk-in studio?

What's wrong: the empty room, a pink floor square, and a dark board. The mural that makes this a dance place is only outside. OPEN CAMERA DANCE STAGE opens the stage on top of the world. BACK closes the stage and leaves you in the room. The street is another tap after that.

Recommendation: skip the room. Walking in opens the stage, and BACK returns to the street in front of the mural.

### Pet rescue and critter lounge — question

Parkside, id 14, sign PETS. Parkside, id 15, sign PETS.

**Question.** Launch the crew app directly, or a walk-in lounge?

What's wrong: the empty room, a low green bed, and a gold counter. OPEN CREW & PETS goes to `crew.html`. The pause menu can open Neon World, which loads the city fresh. It does not return you to the lounge. The fox in this interior draw is about twice Ellie's height. See the pet note below.

Recommendation: a walk-in lounge, two low pens made of boxes, greet at a pen, pet shorter than Ellie. If Bob wants the crew page instead, walking in opens it and back returns to the lounge door.

### Z-DASH glass showroom — question

Downtown, id 2, sign Z-DASH, with a roof pad. Spawn, id 6, sign Z-DASH.

**Question.** Drive-up spotlight, or walk around a parked car?

What's wrong: the empty room and a dark platform. SPOTLIGHT THE 370Z is a toast. You can step outside. The car is not in the room. The outside name says glass, and the block is a dark fill with a neon edge. This one does not leave for another page.

Recommendation: drive-up. The car stays on a cyan pad under a box frame and a glow strip.

### Sky-drop helipad — question

Arts district, id 1, sign JUMP, 62 m, with a roof pad.

**Question.** Drive-up pad, or a walk-in elevator?

What's wrong: there is no room and no shaft. The door pops Ellie onto the roof. The pad is a landing circle, not a place with a way up. This is not the empty-room pattern.

Recommendation: a flat pad of boxes with a cyan strip and a straight elevator shaft. The car lands and launches from that pad.

### Sky tower — question

Id 4, sign JUMP, 239 m, with a roof pad.

**Question.** Same as the helipad: drive-up pad, or a walk-in elevator?

What's wrong: the same teleport, no shaft. The word JUMP is too small to read from the street (about 6 px at the sign camera, about 5 px on the front shot).

Recommendation: the same pad and shaft, with the word SKY in boxes big enough to read from the street and from the air.

### Stadium pro shop and arena — question

Sports, id 20, sign TURBO. Sports, id 21, sign TURBO.

**Question.** A walk-in shop, or send the car to the far oval?

What's wrong: the empty room, a green rug, and a goal. The street sign says TURBO, so it does not read as soccer. KICK OFF on the button is a toast. Entering the door also teleports the car to the far stadium oval, then opens the room. You can step outside, and you are no longer at the shop.

Recommendation: a walk-in shop. The sign says SOCCER. Kick off starts at the goal in the room. No teleport.

### City builder architect HQ — question

North of the river, id 22, sign PIXEL. Id 23, sign PIXEL.

**Question.** A walk-in desk, or open a blueprint tool directly?

What's wrong: the empty room and one crate. The street sign says PIXEL, so it does not read as a builder. OPEN THE BLUEPRINTS is a toast about the sandbox. You can step outside. There is no blueprint app today.

Recommendation: a walk-in desk of flat blueprint boards, and a sign that says BUILD. The sandbox stays outside.

### Player house — obvious walk-in

Spawn, id 5, sign HOME. Parkside, id 13, sign HOME.

This one is not the empty-room pattern. The room has a wall color, a furniture block, a pet bed, and a sign, and you can step outside. There is no house app.

What's wrong: it is still a dark room with three lumps. It does not read as a bright modern glass home, inside or outside.

Recommendation: a living room of flat glass panels and a cyan strip, keeping the sofa, the pet bed, and the sign. Bob can override the walk-in call.

### Retro pixel arcade — obvious walk-in

Arts, id 12, sign ARCADE. Sports, id 19, sign ARCADE.

What's wrong: the empty room and two cabinets. HIT THE ARCADE is a toast from the middle of the floor. You can step outside. There is no arcade app page.

Recommendation: a row of box cabinets with flat glow screens, and the jackpot action on a cabinet. Bob can override the walk-in call.

### Neon pizza and boba cafe — obvious walk-in

Parkside, id 16, sign PIZZA. Downtown, id 18, sign PIZZA.

What's wrong: the empty room and one counter. ORDER BOBA & PIZZA is a toast that adds points and NOS. You can step outside. There is no cafe app page.

Recommendation: a counter and two box tables, with the order action at the counter. Bob can override the walk-in call.

## Pet scale, for Anatomy Check

Flag this so Anatomy Check catches pet scale inside buildings, not only on the street.

In Bob's NOS screenshot the fox stands behind Ellie and is about twice her height. The interior draws that pair through the crew preview (`walkPaintCrew` calls `crew.preview`, which uses `drawStage`). Ellie is drawn at one size. The fox is drawn with its own close camera (`petCam`: focal length about 1.85 times the cell height, sitting 0.82 m away, in a cell about 70% of the card tall). That framing makes the fox a giant in every interior, because every interior uses the same preview.

On the street the follower uses the fox rig (body about 0.26 m) at a 1.25 scale, next to a 1.7 m person. That street pet is a different draw. The interior card is the one that fails.

Anatomy Check should measure the pet against the person in an interior shot. The pet stays shorter than the person. The standing target is about 0.74 m for the pet and 1.7 m for Ellie. A pet about twice the character's height fails. This audit does not change Anatomy Check. It only flags the miss.

## What this plan does not do

It does not edit `world/`, it does not add a building, and it does not deploy. The count stays 24. Paint is already in progress with the Paint agent. Every other mode waits for Bob's answer, then for "plan approved, build it".
