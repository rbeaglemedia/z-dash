# Adventure world plan

Planning only. This file does not change the game, and it does not deploy. Nothing here is built until Bob writes "plan approved, build it."

This is a new tile and its own page, `vale.html`. The live Neon World stays on `world.html` and `world-split.html`. NEXT stays on `next.html` (pull request 90). This plan does not edit `index.html`, the current city, the Boulevards copy, the speed caps, the 400 ft sky, or traffic.

Ellie is 10 and plays at about a 13-year-old level. The words stay plain and specific: Lamp Square, glow, Yard Gate. No baby talk.

The shape is borrowed from two games she might already know the feel of. A town, jobs, choices, a partner at her side, then a blade, a spark, and a bow: that is the Fable idea. A pet with a few elemental tricks that grow because of stories: that is the Pokémon idea. The names, the clothes, the creatures, the type list, and the models are ours. Nothing is copied from those games, from Brookhaven, or from a pack.

## How this sits next to NEXT

Read with `docs/NEXT-WORLD-PLAN.md` on `cursor/next-world-plan-039c`, commit `50d12c5`, pull request 90. That agent (`bc-6b230a1a-3e68-589e-a9dd-88602abb039c`) was still running a traffic-car test when this was written. The test is not part of this world. If pull request 90 changes the plan, this section follows the new wording for anything NEXT owns. It does not start owning those things.

| | NEXT (pull request 90) | VALE (this plan) |
| --- | --- | --- |
| Page | `next.html` | `vale.html` |
| Map | A copy of Option 1, The Boulevards. World id `next`. | Glasswick. Its own file. Not a copy of `world/city-layout.js`. |
| How she moves | She drives the Z. She cannot launch the sky on foot. | She walks. The Z is not in this world until the last chapter, and then only as a door. |
| Speed | 25 / 35 / 45 mph on the street. Sky 65 / 90 / 120 after NEXT's own unlock. | Walk 3.1 mph, rim-run 6.7, a short burst 9.4. Same on every device. No sky speed. |
| Altitude | The 400 ft line, the ramp, the bounce, the portal. Save key `zdash.next.v1`. | None. A fall sits her back at the last lamp. That is not the sky portal. |
| Traffic | Rare: two cars, under her cap, live LOD or the photo fallback. | No traffic. No write to `shared/traffic-tune.js`. |
| Car art | The real Z, and a lighter traffic cut of `assets/370z.glb`. | Her paint color on the Yard Gate door. Not a second mesh of the Z. |

Shared, on purpose, the same way NEXT already shares them:

- `zdash.kid.v1` (her car, coins, Garage stars, name)
- `zdash.char.v1` and `zdash.pet.v1` (the closet and the pet she already picked)
- `zdash.house.v1`, `zdash.crew.v1`, the paint and dance keys

VALE progress is a new key, `zdash.vale.v1`. It stores tales, Warm and Bold, weapons, bond, vale-only guests, and her adventure coat. It does not write `zdash.next.v1`. It does not spend Garage stars. Coins she earns here land in the shared wallet, so a reward here is a reward in the garage. The recommended path never charges a price.

When she finally drives, DRIVE opens `next.html`. The sky inside NEXT is still locked until she does NEXT's 6 of 8 errands. VALE does not skip them, and it does not set the caps. If `next.html` is not in the game yet, the button says the road is still being paved and she stays on foot. We do not build a stand-in city to cover that gap.

![On foot first. The car is the last door.](adventure-world/unlock.svg)

## 1. She starts on foot

She appears in the middle of Lamp Square, in the square coat, with her pet already at her heel. There is no car in the square, no wings button, and no street/arcade switch. Neon World keeps flying. NEXT keeps driving.

Speeds, all devices:

| | m/s | mph | What it is for |
| --- | --- | --- | --- |
| Walk | 1.4 | 3.1 | Looking at a house |
| Rim-run | 3.0 | 6.7 | Crossing the square, about half a minute |
| Burst | 4.2 | 9.4 | 1.5 seconds, then it rests for 4 seconds |

A long frame drops picture. It does not change these speeds mid-step. They stay far under NEXT's slowest cap (25 mph on her iPad) so the two worlds do not feel like the same drive.

### The unlock path

Trust is the price. Not coins.

1. **Square.** Walk, talk, follow. Tales 1–4. No weapon.
2. **Lamp blade.** The yard trusts her with a short glass blade. It bonks. Tale 5. Motes only.
3. **Coat, spark, then the bow.** Tale 6 is the coat. Tale 7 is the lamp bolt. The glass ward is the hold on that same button, learned with it. Tale 8 is the short bow of light pins.
4. **Trails and the pet.** The first pet move turns on at the meadow (tale 9). Then the ridge, a gap only the pet can fit, and the ruins door. Tales 9–12.
5. **Fountain.** The Dim sits down and becomes the fountain. Tale 13. This is the end of the on-foot story.
6. **Yard Gate, much later.** Tale 14. It is not in the first build, and it is not in the same phase as the fountain. Perrin opens the gate. Her Z is the one in the garage save, shown as her paint on the door. Two buttons: **STAY** (keep walking) and **DRIVE** (open NEXT).

For testing, `?vale=1&chapter=5` can skip ahead. That switch is not shown to her.

**Other ways to do the car, if you would rather:**

- **Parade lap.** A driveway inside VALE, cap 12 mph, no other cars, no sky, still not the Boulevards. She sits in a cheap stand-in, not the 26,549-triangle Z. Use this only if DRIVE-to-NEXT feels like leaving the story.
- **No car in this world.** Tale 14 marks the NEXT tile and tells her the road is open. She never sees a door. Use this if any car in VALE is already too many cars.

Recommended is the gate with STAY and DRIVE.

## 2. The town, the tales, the choices

Glasswick is one hub and three trails. Lamp Square is about 90 by 70 metres, fourteen buildings, a low glass wall, three trail gates, and the Yard Gate. The trails are Meadow (about 80 by 80), Ridge (about 70 by 120), and the glass ruins (about 60 by 60). Each one is a chunk. On her iPad only one trail is resident, and the square drops its detail while she is out there.

![Glasswick. One small town, three trails.](adventure-world/map.svg)

Houses use the Brookhaven feel NEXT already named, and none of its files: clean lots, bright walls, a big glass bay, a cyan edge, a front path, a door. The kit is ours (the Lamp kit). Rooms draw only after a door opens. Furniture is never drawn from the street. The Homestead sport house stays NEXT's art pass. Do not copy Brookhaven models, names, or screens.

The known interior bug stays out. `walkPaintCrew` stretches a portrait and the anatomy check still fails those rooms. Bob paused that check. VALE rooms draw the 3D body at about 1.5 m. They do not use that portrait.

People, four at most: **Nia** at the Lamp House (the tales), **Otto** at the bun stall, **Perrin** at the yard, and the tailor. They share Ellie's rig and walk. A fifth person waits off-screen rather than stacking draw calls.

### Tales

A tale is 3 to 6 minutes. The fountain is a little longer. The on-foot set is an afternoon and a second sitting. The car is a later sitting on purpose.

| # | Where | What she does | Choice |
| --- | --- | --- | --- |
| 1 | Square | Light four lamps | In order (Warm), or the far lamp first (Bold) |
| 2 | Square | The pet's charm is under a bench | — |
| 3 | Square | Carry buns to the tailor | Walk them over, or rim-run and Otto laughs. Nothing breaks. |
| 4 | Alley | A glass panel shows a shortcut | Optional. Looking is the reward. |
| 5 | Yard | Three motes, the new blade | — |
| 6 | Tailor | Pick a coat | Square coat or trail kit. Both stay available. |
| 7 | Porch | A glim. The spark. | — |
| 8 | Low roof | A kite. The bow pins it and it floats down. | She does not aim at a person. |
| 9 | Meadow | She picks the pet's first move, then uses it on the snags. | One of two moves |
| 10 | Ridge | Pin a bell so it rings | — |
| 11 | Meadow wall | A gap she cannot fit. The pet goes through and opens the latch. Second move after. | One of two moves |
| 12 | Ruins door | Reach the door | — |
| 13 | Ruins | The Dim yawns, sits, and becomes the fountain | — |
| 14 | Yard Gate | STAY or DRIVE | Much later |

The tale book in the Lamp House replays any of them. A choice does not lock another tale away.

### Warm and Bold

Both are kind. Warm is wait, share, help. Bold is race ahead, tease, take the shiny shortcut. There is no cruel option, no stealing, and no dark makeover. The word Warm or Bold is written on the button, so she can see it before she picks. The tale book shows the count from the first choice. Three Warm makes the fountain glass a soft cyan once the fountain exists. Three Bold makes the neon edge brighter. Neither one closes a door.

**Other tones, if you would rather:** a hidden score she never sees (closer to those older games, easier to feel unfair), or no score at all and the choice is only the line Nia says next. Recommended is the labeled pair.

## 3. Ellie, redrawn

She is still Ellie: the ponytail, the cyan streak added, the adventure coat. Not a new girl, and not the live closet. Neon World keeps today's drawer. The adventure look lives in `zdash.vale.v1` unless she taps USE THIS LOOK, which is the only write back to `zdash.char.v1`.

The style is stylized and expressive, in the spirit of those adventure games: a readable face, big hands, a coat, boots, a satchel. The proportions are a kid, not a realistic adult and not a chibi that fails the checker. The painted height matches the figure that already passes, about 1.5 m. The 1.75 m number in `world/crew-data.js` is the bone source. This world uses the painted height. Hip about 0.78 m. Head in the 18–40% band (the hard gate is 16–45% of the figure).

Four face textures: rest, smile, determined, surprised. Blink is a PC extra and stays off on the iPad. Eyes and mouth stay on the head mesh. A floating head fails the neck check.

Coats:

| Coat | When | Anatomy note |
| --- | --- | --- |
| Square coat | From the start | Open at the chest so the side view still has a torso |
| Trail kit | Tale 6 | Lighter jacket, scarf. The scarf is not a second neck. |
| Glass cape | Phase 8, after the fountain exists | A back panel on the chest, shorter than the coat. It does not replace the body. |
| Night scarf | Phase 8, a Bold or Warm cosmetic | Same rule |

### Anatomy Check

She does not ship until the checker exits 0. That checker is `tools/anatomy-check.mjs` on pull request 61, agent `bc-bfc8fc93-c2b4-5dbd-a098-1d29cd573de5`, branch `cursor/anatomy-check-3de5`.

```
node tools/anatomy-check.mjs --root <tree> --out test-results/anatomy
```

Exit 0 is a pass. Exit 1 is an anatomy fail. Exit 2 means the checker itself is wrong, and the character result does not count. The review goes on the feature PR tagged `ANATOMY-CHECK`, with the contact sheets. The last full humanoid pass that agent cites is character commit `a509260` with checker `bce9aba`. The interior half of the check is paused. Do not block this world on it. Do not copy the bug it caught.

What the new body has to do, in the checker's words: humanoid at least. Head, then limbs, then the walk. Clothes are secondary unless they pull the body apart.

- Head on the neck, centered, in that size band. Arms from the shoulders, hands at the end of the arms, legs from the hips, feet on the ground, left and right on the correct sides.
- The torso stays visible, with real depth, at every yaw, including the walk, from the front, three-quarter, side, and back. Side, three-quarter, and back chest each stay at least 36% of the front chest.
- The walk is a cycle: opposite arm and leg, a planted foot, a small bob, nothing clipping. Eight frames at those four yaws.
- On-screen height about 1.5 m, inside 1.15–2.05 m. Feet do not float.

Phase 1 is the unarmed body. The blade, the bow, and the cape are a second mesh. If a prop glues itself to an arm in the pixel test, the walk shots hide the prop and combat shows it. Both states get a picture in the review. A bow on her back must not read as a third arm.

Townspeople use her rig, so a pass covers their walk too. We do not need a second walk cycle per person.

## 4. Blade, spark, and bow

Combat is in the world, in the stroll camera (behind her, about 4.5 m back, looking at her chest). It is not a separate battle screen, and it is not a shooter camera. The mouse aims only while the bow is up. Aim assist is on until she turns it off in the tale book. The cone is about 35 degrees and 12 metres. There are no crits and no headshots. A phone does not ask her to be precise.

| Trick | What it does | Control |
| --- | --- | --- |
| Lamp blade | A wide bonk, 1.4 m, about 0.45 s. Three taps, and the third pushes. | Tap |
| Lamp spark | One bolt, 8 m, one pip, a short daze. Cooldown 6 s. | Tap, once she has it |
| Glass ward | A 3 s bubble that bumps the next hit away. Cooldown 12 s. | Hold spark, once she has it |
| Bow | A light pin. It sticks as a glow and fades. One pip. Cooldown 0.9 s. No ammo. | Hold, aim, release |
| Hop | A short step out of a telegraph ring. Cooldown 0.8 s. Free. | Its own button |

No ammo is the recommendation. A quiver of 6 that refills at a lamp is the other choice, if you want a resource. It is easy to turn into a chore.

![Same three tricks on every device.](adventure-world/controls.svg)

Phone and iPad stay in landscape, the way the rest of the kid app is played. The stick is the left thumb. Push to the rim to run. Hop sits above the stick. Blade, spark, and bow are an arc for the right thumb, at least 56 pt on the phone and 64 pt on the iPad, with a gap a thumb can feel. The pet paw sits just above that arc. Talk is a big button at the bottom center when she is next to Nia, not a fourth combat button. The iPad does not get extra attacks. If a keyboard is attached it may use the PC keys, and touch still works.

PC: WASD, Shift for rim-run, Space hop, E talk, 1 blade, 2 spark, hold 2 for the ward, hold 3 and click for the bow, Q for the pet. Esc opens the tale book. The camera snap-backs when she walks. A drag on empty screen (or the middle mouse) looks around, then returns.

**Other combat shapes:** a locked side view during a fight (easier to read, worse for exploring), or a pause card where she picks the pet move and the world waits (easier on a phone, less like walking). Recommended is real-time, the stroll camera, and one pet button.

### What a hit is

Her glow is three cyan lamps, top left. Not a red bar. A foe has 1, 2, or 3 lamps. Empty lamps are a faint and then a poof. The foe sits for about 0.4 s, then breaks into 8–12 motes that fade. Nothing is left on the ground. No blood, no bones, no red X, no "dead", no screaming, no damage numbers. The screen does not print the word. The picture does it.

If her glow hits 0 she sits, the pet noses her, and she is back at the last lamp with full glow and the tale intact. The line is "Catch your breath." There is no game-over screen.

## 5. Foes

They are mischief made of sticks, toys, and light. They are not animals, so bonking one does not feel like hurting a pet. They never chase her into Lamp Square. They never spawn during a conversation. They never appear on top of her.

| Foe | Pips | Behavior | When |
| --- | --- | --- | --- |
| Mote | 1 | Drifts and bumps | Yard, the tutorial |
| Snag | 2 | A vine knot with stick legs. Blocks the path. Slow. | Meadow |
| Glim | 1 | Darts and hides. The bow finds it. | Porch, then trails |
| Clank | 2 | A tipped toy sentry. A spin, telegraphed. | Ridge |
| Murk | 1 | A grumpy cloud near an unlit lamp. Not horror. Leaves a lamp seed. | Optional, one pocket |
| The Dim | 3 | Once. Yawns, sits, becomes the fountain. Not a kill. | Ruins |

### How one foe thinks

Idle at its home spot. If she is inside 8 m, a lamp on its head lights for about 0.4 s (notice). It walks, it does not run, and it stops at about 1.6 m. The bump is telegraphed: a ring on the ground, 0.7 s in the story setting, then the bump only counts if she is still in the ring. She loses one glow. The shove is one step, not a ragdoll. It rests about 1.2 s, and that is when a bonk lands cleanly. If she pulls it more than 12 m from home, it gives up and walks back. It will not cross a gate.

The pet is not a target. If a bump would overlap the pet, the pet hops aside and stays on the floor. The pet has no glow pips. If a move would "hurt" the pet, it ducks into the satchel for 5 s and comes back.

### How many, and where

Hand-placed pockets. A pocket holds 1–3 and refills only after she leaves the chunk and comes back, and not within 10 m of her. No random horde. No spawner that can stack.

Story is the default.

| | Her iPad | Galaxy phone | PC |
| --- | --- | --- | --- |
| Active foes, story | 2 | 3 | 4 |
| Brisk (adds one) | 3 | 4 | 5 |
| Telegraph | 0.7 s, or 0.45 s on brisk | same | same |

Anyone past that cap is not simulated. Past about 25 m a foe is an idle bob or it is unloaded with the chunk. Brisk is a switch in the tale book. There is no harder tier.

Two at once is the most that can stand in front of her. The rest wait at their spot. That is true on every device. The cap above is how many are awake, not how many can surround her.

## 6. The pet on the floor

The pet she already chose follows her: fox, cat, dragon pup, or robo-dog, from `zdash.pet.v1`. It is a real-pet size. Knee of the 1.5 m figure is about 0.40 m. Hip is about 0.78 m. The top of the pet, ears included, stays between 0.42 m and 0.74 m. The outdoor fox that already passes is about 0.74 m, which is the top of the band. New pets do not go above it.

Paws stay on the floor. The checker's idle band is about −0.04 m to 0.055 m. This world does not mark a pet tall, so ears do not tower over her shoulder, and nothing rides on her shoulder. Stairs are walked. If a step is too tall, the pet puffs to the landing and is on the floor again. It does not hover.

Follow slot: about 1.5 m back and a little to the side, so the camera still sees both. It walks when she walks, trots when she rim-runs, and bounds during the burst. A puff to her heel happens only if the gap is over 8 m. She can walk through it. It slides aside rather than blocking the stick. In a fight it stands at her side, not in front of the stick.

In the Z, later, the existing ride clip still applies, and only after DRIVE. A combat move does not fire while she is driving. NEXT's "a pet can ride" stays true.

## 7. Pet moves

Real-time, in the world. One paw button fires the ready move. A long-press on the phone, or the tale book, picks among the moves she has. Cooldowns, not a points pool. The ring on the paw button is the timer.

Bond is 1 to 10. It goes up when a tale says so, not when she farms foes.

| Bond | What she gets |
| --- | --- |
| 1 | Follow only |
| 2 | Tale 9, at the meadow. First move, pick one of two. |
| 5 | After tale 11, the pet gap. Second move, pick one of two. |
| 8 | After the fountain. Third move. |
| 10 | A cosmetic charm. Not a harder hit. |

A pick is replayable from the tale book, so it is not a trap. Moves empty lamps the same way the blade does, or they push, daze, or light a lamp. They do not add a second, bloodier combat.

Elements are four, and they are this world's, not a copied type chart: **Lamp** (spark), **Glass** (a deflect or a daze), **Tide** (a push along the ground), **Ember** (a short warm cone). No weaknesses table in the first build. A snag sits faster if it is wet. That is the only matchup, and it is written on the move.

| Pet | Moves (cooldown) |
| --- | --- |
| Fox | Brushflare, ember cone, 8 s. Quickfoot, rim-run rests less for 4 s, 12 s. Lantern Nip, one pip, 5 s. |
| Cat | Glasspounce, a slide along the ground to the foe's side, daze, 8 s. Purrward, her ward comes back 4 s sooner, 14 s. Nightstep, they lose her for 2 s, 12 s. |
| Dragon pup | Puff, push back toward home, 8 s. Winglamp, lights a lamp she is next to, 6 s. Warmroar, they sit for 1 s, 10 s. |
| Robo-dog | Clankpulse, a 3 m ring, one pip, 10 s. Boltfetch, brings a quest item inside 8 m, 6 s. Scanbeep, outlines a hidden glim, 8 s. |

Phase 5 ships the first move for whichever pet is active. The other rows are data for later phases. A guest species (below) uses the same cooldown rules and does not get a stronger hit than the fox.

## 8. More pets, and where models come from

Intricate means the face, the coat, the satchel, a collar, a scarf, a glass charm, and a town with real doors. It does not mean a 50,000-triangle hero. Fur cards, shadow maps, and 2k textures do not fit the iPad.

| | Triangles | Bones | Texture |
| --- | --- | --- | --- |
| Ellie, iPad and phone | about 6,000 | 28 | 256 atlas. 128 if 256 misses the frame. |
| Ellie, PC | about 8,000 | 28 | 256, face can be 512 |
| Pet | 1,500–2,500 | 16 | 128, plus a 50-triangle charm |
| One house shell | 300–800 | — | Shared kit: wall, glass, cyan, trim |
| One interior | about 2,000 | — | Loaded on the door, unloaded when it shuts |
| Foe | Two bodies, palette swaps | 12 | Same atlas family |

Eight shared materials for the whole square. Windows instance. On the iPad, at most eight real glass bays in view. The rest are a bright opaque cyan card that still reads as a window. That is the fill-rate limit on the 2018 iPad's GPU, not a style change.

### New animals

They are guests in `zdash.vale.v1`. They do not go into `zdash.pet.v1` until a later closet pass that teaches every reader to keep an unknown type. If a guest were written into the shared key today, an old page could fail the load and fall through badly. Recommended: the shared pet is the one who follows, guests can be tried in VALE, and "this is my pet everywhere" is a separate tap after that closet pass.

| Guest | Size | Two moves |
| --- | --- | --- |
| Hare | Ears stop at her hip | Meadowkick (push), Burrowpeek (shows a pet gap) |
| Otter | Knee height, on the floor | Tidesplash (push), Wetnose (a snag sits) |
| Pocket hound | Knee height | Heel (back to the follow slot), Bay (daze) |

A pigeon, a shoulder owl, or anything that flies stays out. The rule is on the floor.

### Sources

Prices checked 24 Oct 2026. They move. Recheck before anyone asks to spend. This plan buys nothing. A purchase, a Patreon charge, a paid itch tier, or an Adobe login on Bob's account needs a later "yes, do it."

Hero, foes, and pets are modeled for this game. A pack mesh is not dropped in and called Ellie. CC0 props (a rock, a crate, a planter) are allowed only when the license file in that download says CC0, and only if the silhouette is background. Download from the author's own page. A re-upload on another site has shipped the same file under a different license.

| Source | License | Cost | Use here |
| --- | --- | --- | --- |
| Quaternius public packs (Ultimate Animated Animals, Ultimate RPG, Ultimate Animated Character Pack, Fantasy RTS, Ultimate Modular Men) | CC0 on quaternius.com | $0 | Reference, or a background prop after the license file is read. Not Ellie, not a pet, not a foe. Modular Men is an adult kit, so it is the wrong silhouette for her even as reference. Their Patreon lists $3, $10, $20, and $50 tiers. Those are support. Exclusive tier files are not part of this plan. |
| Kenney, one pack at a time | CC0 | $0. Donation is optional. | A UI icon or a click, if it fits. Not the hero. |
| Kenney Game Assets All-in-1 | CC0, paid only because it is one zip | $19.95 or more on itch | Do not buy. The same packs are free one at a time. |
| KayKit Adventurers (Kay Lousberg) | CC0 on the free tier | $0. EXTRA is $7.95 or more. SOURCE is $11.95 or more. | Do not pay. Do not use those characters as Ellie. They are a dungeon look, and they are someone else's cast. |
| Sketchfab | Per model. CC0, CC-BY, CC-BY-NC, Editorial, or a paid Standard license. | CC0 is $0. A store row on 24 Oct 2026 showed paid character models from about $11 to $65 (one android violinist at $65). | CC-BY-NC and Editorial are out. Paid Standard is a purchase. Do not buy. CC-BY only for a non-hero prop, with credit on a parent page. Not the recommended path. |
| Poly Pizza | Per model, often CC0 or CC-BY. Not a site-wide license. | $0 | Easy to grab the wrong file. Prefer the author's page. Not a hero source. |
| Mixamo | Adobe's terms. Royalty-free inside a game. Do not redistribute the raw files. | $0, and it needs an Adobe ID. Not a purchase. | Skip it until Bob says yes to the login. A walk we author ourselves is easier to fit to the checker. Do not ship a stock Mixamo body as Ellie. |
| Synty POLYGON Fantasy Kingdom | Unity Asset Store EULA, restricted, not CC0 | The Unity sale page showed $174.99, marked down from $349.99. The Synty store listed $349.99. A library plan was advertised from $30 a month. | Do not buy. Medieval kits fight the glass town, and their characters would be copied art. |
| An artist, or us | Ours | $0 if we model it. A commission is a purchase. | Recommended. Do not hire anyone from this plan. |

Every download keeps its `license.txt` next to the notes for that phase. The game repo does not gain a pack zip in this plan.

## 9. Frames, and the ten-second load

Her iPad is the 6th generation (2018): A10, 2 GB, 60 Hz, landscape 1024×768 in the lab, the same strict column NEXT uses. Any tablet uses that column until it has been measured. A Galaxy phone is the middle column. A PC is the loose column. She does not pick the column. The game already tells an iPad from a phone from a PC.

60 fps means 16.7 ms. The iPad may sit on a flat 30 (33 ms) when 60 will not hold. A flat 30 is the floor. Drops down to 5 are not. Lab sizes, when this is built: phone 844×390, iPad 1024×768, PC 1366×768. Five on/off pairs, one browser at a time, on that phase's commit. A lab number alone is not "done".

On-foot split we will aim at:

| Piece | Time |
| --- | --- |
| Ellie | 3.0 ms |
| The pet | 1.5 ms |
| The square, or one trail | 6.0 ms |
| Awake foes, at the cap | 1.5 ms |
| Blade, spark, bow, the mote burst | 1.5 ms |
| HUD | 1.5 ms |
| Spare | 1.7 ms |

No `shadowBlur` anywhere on `vale.html`, HUD included. Glow is in the texture. A blob under her feet is a dark circle decal, and it is the first thing the iPad turns off if a frame runs long. No shadow maps. No copy of the character back onto a 2D canvas.

If a frame runs long, drop in this order: the burst motes, extra glass (already capped), townspeople's face swaps, neon edge strips, then awake foes down to one. Ellie, the pet, and her jog stay. Particles cap at 24 on the iPad, 48 on the phone, 80 on the PC. A foe's exit is a short burst of 8–12, once, not a long system.

Resident memory, decoded, about 40 MB on the iPad, 55 on the phone, 80 on the PC. One chunk. The 2 GB iPad does not keep two towns.

### Load

From the moment she taps the tile to the moment she can take a step:

| | Cold | Warm cache |
| --- | --- | --- |
| Her iPad | 10 s | under 10 s |
| Galaxy phone | 7 s | under 7 s |
| PC | 5 s | under 5 s |

That 10 s is the budget, not a hope. Roughly: page and script 2 s, Ellie and the active pet 3 s, the square 3 s, the first lamp and one music loop 2 s. The loop stays under about 1 MB in phase 1. A trail loads behind a mist card of about 1.5 s. That mist is this world's. It is not NEXT's 400 ft card, and it is not an excuse for a 30 s load. If the cold iPad misses 10 s, the fix is fewer bytes, not a longer card.

Audio later adds one trail loop. It does not add an orchestra.

## 10. Build order

Each phase is measured before the next one starts. The fountain does not start ahead of a held frame. The car does not start ahead of the fountain.

| Phase | What she can do | Done when |
| --- | --- | --- |
| 0 | Read this. Pick a row or say "recommended". | You write "plan approved, build it". |
| 1 | The tile, the page, box houses, unarmed Ellie, the pet at her heel. | Anatomy exit 0 on the unarmed body. Cold load inside the table. Five frame pairs. |
| 2 | One real Lamp-kit house, one room at 1.5 m, Nia, tale 1, the tale book. | The choice shows Warm or Bold before she taps. The room does not use the stretched portrait. |
| 3 | The blade, motes, glow, "Catch your breath." | Props do not fail the walk. Foes stay out of the square. Frame still holds. |
| 4 | Spark, ward, bow, snag, glim. Phone, iPad, and PC controls. | A thumb can hit the three buttons. Aim assist works with the cone. |
| 5 | Tale 9. First pet move, one meadow pocket. | The pet stays knee-to-waist, on the floor, in the room and on the trail. |
| 6 | Ridge, the pet gap, the ruins, The Dim, guest animals in the vale save only. | One chunk resident. The Dim becomes the fountain. |
| 7 | The Yard Gate. STAY and DRIVE. | DRIVE opens NEXT and does not write `zdash.next.v1`. No Z mesh in the square. No traffic file. |
| 8 | Brisk, the glass cape, PC blink. | Only if the iPad still holds a flat 30 after phase 6. |

Phase 1 does not add combat "while we are in there". Phase 7 does not invent a boulevard if NEXT is not merged.

## Risks

- Pull request 90 is still open, and that agent was still testing a traffic car. If NEXT's handoff sentence changes, follow it. Do not answer by taking the map, the caps, the sky, or the traffic.
- Two maps must not share a file. The live builder keeps `world/city-layout.js`. NEXT writes its copy. VALE writes a third file, with its own world id.
- Shared coins are really shared. A price here spends garage money. The recommended path does not charge.
- A new pet type in `zdash.pet.v1` can break an old reader. Guests stay in `zdash.vale.v1` until a closet pass.
- The anatomy checker scores pixels. A cape, a bow, or a big satchel can look like a broken arm. Phase 1 is unarmed for that reason.
- The interior check is paused because of a stretched portrait. Copying that portrait into a VALE room fails the same way the moment the pause lifts.
- Real transparency is expensive on the 2018 iPad. Eight glass bays is the cap. More glass means opaque cards, not a lower jog speed.
- The full Z is about 687 meshes and 26,549 triangles. Parked in the square, it blows the 3 ms character line and the 6 ms town line. The door uses her paint. The mesh stays where it already loads.
- Lab frames are not her iPad. NEXT's note still applies: the iPad is the strict column, and a lab number is not done.
- A pack character is the fastest way to fail "original" and the fastest way to fail the anatomy walk we did not author. Model Ellie.

## Picks

Reply with a letter, or "recommended" to take the marked row.

| # | Question | Recommended |
| --- | --- | --- |
| 1 | Tile and page | A. VALE, `vale.html`. B. TRAIL. C. LAMP. |
| 2 | Town name | A. Glasswick, hub Lamp Square. B. The Lantern Mile. C. Starwick. |
| 3 | First minute | On foot in the square, pet at her heel, no car. |
| 4 | The car | A. Yard Gate, much later. STAY or DRIVE. DRIVE opens NEXT and does not set speed, sky, or traffic. B. A 12 mph parade lap inside VALE, no other cars. C. No car in this world. Tale 14 only points at the NEXT tile. |
| 5 | Choices | A. Warm and Bold, both kind, labeled on the button, replayable. B. A hidden score. C. No score, only the next line of dialogue. |
| 6 | Combat | Real-time, stroll camera, glow lamps, foes sit and burst into motes. Town is safe. "Catch your breath" at the last lamp. |
| 7 | Tricks, in order | Blade, then spark and ward, then bow. All three before any car. No ammo. |
| 8 | Controls | Phone and iPad: stick, hop, three buttons, pet paw. PC: WASD and the keys in the picture. Aim assist on. |
| 9 | Pet size | Knee to hip, on the floor, ears included, under 0.74 m. No shoulder perch. |
| 10 | Pet moves | Three slots, cooldowns, bond from tales. Real-time paw button. The pause-card is the fallback if the phone fight is too fiddly. |
| 11 | New animals | Guests in `zdash.vale.v1` until a closet pass. The shared pet is the one who follows. |
| 12 | Models | Original meshes. CC0 packs are reference and background clutter only. Do not buy the paid rows. |
| 13 | Load and frames | 10 s to a step on the cold iPad. 60 fps aim, flat 30 floor. No `shadowBlur`. Detail drops first. |
| 14 | First build | Phase 1 only: walk, pet, boxes, measure, anatomy on the unarmed body. |

Open, and fine to leave until you approve a phase:

- Should DRIVE land her in NEXT's Homestead driveway, or on the first street NEXT already spawns? Recommended: whatever spawn NEXT already uses. VALE does not add a spawn point on their map.
- Is Murk one pocket, or cut until the other foes are fun?
- Does the glass cape wait until phase 8, even if the fountain is done? Recommended yes. The cape is the prop most likely to hide her torso.
