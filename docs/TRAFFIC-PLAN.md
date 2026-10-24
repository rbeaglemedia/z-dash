# Neon World traffic rules

Options for Bob to pick. Nothing in this file is built yet.

The car these numbers are sized to is the player's 370Z (`assets/370z.glb`, loaded by `shared/assets/370z-glb.js`):

| | metres |
| --- | --- |
| length | 4.25 |
| width | 1.85 |
| height | 1.32 |
| wheelbase | 2.55 |
| track | 1.60 |
| tyre radius | 0.33 |

Boulevard lanes come from `CITY.ROADS` in `world/city.js`. Lane width is **3.4 m**. A Z in the middle of a lane has about **0.78 m** of paint-to-line on each side. Highway, bridge, and tunnel edges are the wide roads (`kind` `highway`, `bridge`, `tunnel`, road width 30 m, three lanes each way). Everything else in the lane graph is a street.

Sources for any future build, and only these: `CITY.ROADS` for lanes and crossings, this plan for pace and gaps, `world/towdrive.js` for the tow trucks. No pursuit, no police, no ramming, and no copied roll from another game.

What is in the tree today is a placeholder, not a choice from this list: city pace 10–15 m/s, +3 m/s on highway / bridge / tunnel, an 11 m centre-to-centre gap, and a bumper slowdown when Ellie overlaps a car. Bob picks the options below before that behavior is replaced.

Weather is a later check. Do not wire the weather API in the first build.

## 1. Lane keeping

The car's job is to sit in the middle of one 3.4 m lane. Width 1.85 m leaves 0.775 m each side before the lane line.

- **A. Centre the body.** Steer back to the lane centre. Hold the line within about 0.3 m. Recommended. A 1.85 m car in a 3.4 m lane looks parked in the lane, not weaving.
- **B. Loose.** Allow up to 0.6 m off centre, still inside the lane. More motion, still no lane-line riding.
- **C. Rail.** Snap to the centre every frame. Stiff, and it fights the corner arc.

Do not use a path from any other game. The line is `CITY.ROADS`.

## 2. Following distance

Gaps are in car lengths. One length is 4.25 m. Measure bumper to bumper, not centre to centre. The old 11 m centre gap is about 1.6 lengths between bumpers. That is close at 15 m/s.

- **A. Two lengths in town, three on the highway.** Town gap 8.5 m bumper to bumper (about 12.8 m centre to centre). Highway / bridge / tunnel gap 12.75 m bumper to bumper. Recommended. Readable from the chase camera, and a Z can still stop inside it.
- **B. Three lengths everywhere.** 12.75 m bumper to bumper. Calmer, thinner traffic.
- **C. One and a half in town, two on the highway.** 6.4 m and 8.5 m bumper to bumper. Denser. Only if the stop rule below is the firm one, or cars nose into each other at the lights.

Same direction only. An oncoming car is a different lane, not a lead car.

## 3. Stopping and yielding

Crossings are where `CITY.ROADS` lanes meet. NOS stations are the two depots already on the map: `NOS & FUEL DEPOT` at Parkside West and at Spawn South. Traffic does not buy NOS. It only leaves the forecourt clear.

- **A. Ease, then a full stop.** Start braking about 18 m before a crossing or a depot apron (about four car lengths). Stop with the bumper short of the crossing box, or short of the depot drive. Wait until the crossing is empty, then go. A car already in the crossing finishes. Recommended.
- **B. Yield, no full stop when clear.** Same brake point. If nothing is in the crossing, roll through at a walking pace (about 4 m/s). Stop only when another car or Ellie is in the box.
- **C. Stop line only at depots.** Crossings use B. Both NOS depots use a full stop, then a slow roll past the pumps so the apron stays empty.

No car treats Ellie as a target. Stopping is the same rule it uses for another Z.

## 4. Merging

A merge is a lane change or a turn onto a new `CITY.ROADS` edge. The car is 1.85 m wide in a 3.4 m lane, so it needs the next lane empty for the whole body, not just the nose.

- **A. Gap of two lengths, then a smooth slide.** Look ahead and back one car length extra (call it 2 lengths bumper to bumper in the target lane). Slide over in about 0.7 s. If the gap is not there, stay in lane and wait. Recommended.
- **B. Longer merge.** Three lengths, about 1.1 s. Use this on highway / bridge / tunnel only. Town stays on A.
- **C. No mid-block lane changes.** Merge only at a crossing, using the turn already in the lane graph. Simplest. Traffic cannot dodge a slow car except by waiting.

Turns follow the lane graph. The corner is limited by the 2.55 m wheelbase: do not cut a radius tighter than about 7 m (a calm steer, not a lock). If the graph's corner is tighter than that, slow to a crawl rather than jumping the curb.

## 5. Ellie

Ellie is the player car. Traffic does not chase, ram, spin her, or leave its lane to hit her.

- **A. Yield like any other Z.** If she is ahead in this lane inside the following gap, match down to her speed, then stop if she stops. If she pulls into this lane, treat it as a merge into the car and brake. If she is beside the car, hold the lane and do not close the gap. Recommended.
- **B. Extra room.** Same as A, plus one more car length whenever she is the lead. Traffic hangs back. She can pull out without a nose-to-tail.
- **C. Freeze when she is close.** Inside one car length, the nearby Z stops and waits until she is two lengths away. Very safe, and it will bunch up behind her.

The bumper slowdown in `world/traffic.js` today is only the placeholder from removing the old ram. It is not option A. Replace it with the option Bob picks.

## 6. Speeds

Metres per second. 10 m/s is about 22 mph. 15 m/s is about 34 mph. 22 m/s is about 49 mph.

- **A. Town 10–15, fast roads 16–20.** Town is every street lane. Fast roads are `highway`, `bridge`, and `tunnel`. Each car picks a cruise in that band and holds it. Recommended. Matches a calm city and a quicker river crossing without a race.
- **B. One band.** 10–14 m/s on every road. The bridge does not feel faster.
- **C. Town 8–12, fast roads 18–22.** A bigger jump off the boulevard. Cars on the bridge are clearly quicker. Still no boost and no chase.

Tow trucks stay slower than a Z on the same road (half pace is what `world/towdrive.js` does now). They use these lanes. They do not shove.

## 7. Despawn and respawn

Ellie should not see a car pop in or vanish.

- **A. Outside her view, and outside the close band.** Remove a near car only past about 240 m, or once it is behind the camera and beyond the close draw (150 m). Respawn it further out than that, off to the side or ahead, never inside the camera frame and never on the runway. Recommended.
- **B. Further.** Despawn past 320 m. Respawn between 260 and 400 m, still outside the frame. Fewer pops, more empty road up close when she turns around.
- **C. Only behind her.** Never despawn a car in front of the camera, however far. Respawn only in the rear arc. Safest against a pop. A car at the edge of the draw distance can linger as a dot.

Far dots (past the box range) can come and go more freely. They are lights, not a body.

## 8. Weather, later

After Bob picks the options above and the behavior is in, check it against the weather API. Do that as its own pass. Likely effects, still not built:

- rain: a longer following gap (add half a length) and the low end of the speed band
- fog: despawn no closer than today, so a car does not appear out of the fog in front of her
- clear: the picked options, unchanged

No weather branch until the dry-road rules are the ones Bob chose.
