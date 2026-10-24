# Adventure build order

Plan only. No code in this step. Story, jobs, and the car key stay in `docs/ADVENTURE-WORLD-PLAN.md`. This page is the order we build in, and how we catch a slow frame before it becomes a mystery like Neon World.

Buy nothing. Do not deploy. Do not edit Neon World files. No menu tile.

## One-page summary

Milestone 0 is already in `adventure.html`: one courtyard, Ellie, and one pet (fox by default). The lab phone hitch after the opening curtain is 4.4 ms. The curtain's own first draw is still 86 ms. That 86 ms has to be under 80 ms, and the on-screen meter has to exist, before any new art.

Build one small thing at a time, in this order: the meter, one house, one neighbor, Swing, Spark, the bow, one foe, then the foe cap and one pet move, then one extra meadow. Each step is measured alone. If the frame test goes red, we bisect that step the same day. We do not start the next step on a red gate.

A frame has a budget. On the phone the whole frame is 20 ms. On the iPad it is 33 ms. On a PC it is 16.7 ms. World, player, pet, Swing, Spark, bow, foes, and the meter each have their own slice. The screen shows a frame-time graph, those slices, and the draw count. `?perf=1` writes down a dip: how long the frame was, which slice was biggest, the draw count, and what she was doing.

The automated test uses a throttled phone picture (844×390, one pixel per screen pixel, CPU slowed 4×). It must pass p95, p99, the longest hitch, and a warmup hitch under 80 ms. The lab is not Bob's phone. A lab pass means "cheap enough to keep going." His phone is still the column that says a milestone is done.

Neon dipped to about 25 fps because the phone did work the lab did not show: blurred strokes far off screen, a car picture read back every frame, a canvas twice as wide as the phone, and cache clears that forced redraws. We had a single fps number and no slice that said which system it was. Adventure does not copy that shape. One canvas, no blur, pixel ratio 1, shaders warmed behind the curtain, and a named slice on every dip.

## 1. Milestone order

Smallest first. One new system per step. M0 is done. The names line up with the story milestones, split so a dip has one suspect.

| Step | What is added | Still absent |
| --- | --- | --- |
| M0 | Courtyard, Ellie walking, one pet at her heel. Done. | House, neighbor, weapon, foe. |
| M0b | The meter in section 3, on that same scene. Curtain's first draw under 80 ms. | No new mesh. |
| M1 | One glass house shell. | No room inside. No second building. |
| M2 | Nia, standing. Knock and job 1 only after she is cheap at idle. | No crowd. The awake cap starts at 1, then 3 / 4 / 6. |
| M3 | Swing only. She can hit a post. | No Spark, no bow, no foe. |
| M4 | Spark only. | No bow. |
| M5 | The bow. Aim, then let go. | No second foe. |
| M6 | One crate crab. Cap is 1. | No moth, wisp, or brute. |
| M7 | Awake cap 3 iPad / 4 phone / 6 PC. One pet move, the favorite. | No extra pets. Aussie still waits on a free file. |
| M8 | One gate into a tiny meadow. The courtyard drops detail while she is through it. | No ridge, no ruins, no car. |

Do not add a weapon "while the house is open." Do not add a second foe in the same step as the first. The car key, jobs 6 and 7, and the harder lane stay after M8, in the story plan, and only if the iPad still holds a flat 30.

## 2. Frame budget

Times are update plus draw for that system, on a steady walk. A system that is not in the scene yet is 0. The slices add up to the frame.

| System | Phone | iPad | PC |
| --- | --- | --- | --- |
| World (ground, walls, house) | 6 ms | 10 ms | 5 ms |
| Player | 2 ms | 3 ms | 2 ms |
| Pet | 1.5 ms | 2 ms | 1 ms |
| Swing | 1.5 ms | 2 ms | 1 ms |
| Spark | 1 ms | 2 ms | 1 ms |
| Bow | 2 ms | 3 ms | 1.5 ms |
| Foes and neighbors, inside the cap | 3 ms | 6 ms | 2.5 ms |
| Meter and buttons | 1 ms | 2 ms | 1 ms |
| Spare, including a poof and a garbage pause | 2 ms | 3 ms | 1.7 ms |
| Whole frame | 20 ms | 33 ms | 16.7 ms |

20 ms is 50 fps. 33 ms is a flat 30. 16.7 ms is 60 fps. A poof is 8–12 motes once, taken from the spare, not a new system that stays on.

Caps for the whole scene at M8. Earlier steps should sit well under these. Crossing a cap fails the step even if the frame time still passes.

| | Phone | iPad | PC |
| --- | --- | --- | --- |
| Draw calls | 120 | 80 | 200 |
| Triangles | 35,000 | 28,000 | 60,000 |
| Textures, decoded | 16 MB | 12 MB | 32 MB |
| Whole page, resident | 55 MB | 40 MB | 80 MB |

Ellie stays near 6,000 triangles on the phone and iPad, 8,000 on a PC, one 256 atlas (128 if 256 misses). A pet stays under 2,500 triangles and a 128 texture. A house shell stays under 800 triangles and uses the shared wall kit. Windows instance. On the iPad, at most eight real glass panes in view. The rest are a flat cyan card. Eight shared materials for the square. One chunk in memory. The 2 GB iPad does not keep two towns.

## 3. Diagnostics, from the next build

The meter ships in M0b, before the house. It has to be cheap. Its own slice is the 1 ms / 2 ms / 1 ms row above. It never reads the picture back. Neon lost about 30 ms a frame doing that.

On screen, whenever `?fps=1` or `?perf=1` is set:

- A graph of the last 120 frame times. A line at that device's budget. Drawn as bars on a small canvas that is not the game canvas, updated every fourth frame.
- A breakdown: world, player, pet, swing, spark, bow, foes, meter. Each number is update, draw, and garbage pause. Garbage pause is the gap between the end of our work and the end of the frame.
- Draw calls, triangles, and decoded texture size, read from the renderer info we already have.

`?perf=1` also keeps a log. The log is a fixed list of 50 dips. Nothing new is allocated on a calm frame. A dip is written only when a frame is over that device's p95 budget, or over 50 ms, or when the warmup hitch is over 80 ms. Each dip stores:

- the time, and how long the frame was
- which slice was the biggest
- draw calls, triangles, texture size
- what was happening: idle, walk, run, swing, spark, shot, foe spawn, or a chunk load
- the step name (M0b, M1, …)

A button copies the log. The automated test fails a run that dipped and did not name a slice.

## 4. The gate

A step is not done, and the next step does not start, until this passes on that step's commit.

The automated phone is throttled: viewport 844×390, pixel ratio locked at 1, CPU slowed 4×, one browser. iPad 1024×768 and PC 1366×768 run in the same lab without the CPU slowdown. 360 frames. The first 30 are warmup. The curtain's compile and first draw are timed too.

| | p95 | p99 | Longest hitch after warmup | Warmup hitch |
| --- | --- | --- | --- | --- |
| Phone | at most 20 ms | at most 33 ms | at most 50 ms | under 80 ms |
| iPad | at most 33 ms | at most 50 ms | at most 50 ms | under 80 ms |
| PC | at most 16.7 ms | at most 33 ms | at most 33 ms | under 80 ms |

Warmup hitch means two numbers, and both have to be under 80 ms: the worst of the first 30 frames after the curtain, and the curtain's own first draw. M0's after-curtain hitch is 4.4 ms. Its curtain draw is 86 ms, so M0b is not allowed to add art until that draw is under 80 ms.

If a new commit fails and its parent passed, bisect that range before writing the next feature. The bisect uses the same throttled phone test. Fix the first bad commit. Do not stack a second system on a red gate.

A lab pass is not "done on the phone." Bob's phone is still the column that closes a step. Five on/off pairs, one browser at a time, same camera spots as the last step.

## 5. Asset rules

- Pool sparks, arrows, motes, and foes. No creating and throwing away meshes in a fight.
- No new objects, arrays, or closures in the steady loop. The dip log reuses its 50 slots.
- Repeated props (walls, windows, lamps, motes) are instanced. One draw for many copies.
- Far foes and the courtyard behind a gate drop to a cheaper shape, then unload. Ellie and the pet do not drop out to save a frame.
- One texture atlas per family (Ellie, pets, the town kit). No unique 2k picture per prop.
- Shaders and the first draw run while the opening curtain is up, before the warmup frames start. A new material in a later step is warmed the same way, not on the first swing.
- No `shadowBlur`. No shadow map. No second game canvas. Glow is in the texture. Pixel ratio stays 1.
- If a frame runs long, drop in this order: motes, extra glass, face swaps, edge strips, a far foe. Ellie, the pet, and her run stay.

## 6. Lessons from Neon World

Neon dipped to about 25 fps on the phone. The lab could not explain it, because the lab and the phone were not doing the same work.

- Blurred strokes kept drawing far off the screen, on the order of thousands in a short span. The lab clipped them. A phone GPU still paid for them.
- Reading the car picture back with `getImageData` cost about 30 ms of a frame in every version we bisected. The fps number moved for a reason that was not the city.
- The phone canvas was 1688×780 because the pixel ratio was 2. Adventure locks the pixel ratio at 1.
- A traffic cache clear, and a buffer resize treated as a resize of the car, forced redraws on frames that were supposed to be cheap.
- A skip that turned off as soon as the frame rate twitched never stayed on at the rate the phone actually held.
- A second WebGL view for buildings was dropped after the dips. Adventure stays on one canvas.
- Pass timings and stroke counts made the bisect possible. A lone fps number did not. That is why every adventure dip has to name a slice and what she was doing.
