# Architecture check

Test-only review of Neon World buildings. It does not ship in the game, it does not edit building code, and it does not deploy. `world.html` never loads these files.

The checker loads the real Kid App city (`world/city.js`, `world/city-draw.js`, `world/detail.js`, `world/neon-paint.js`) in headless Chrome, measures what those scripts draw, and writes a pass/fail report plus standard shots. Adult `index.html` is out of scope.

Run it before a building change is reported to Bob. A fail is a review, not a license to loosen the bar.

## Run

```bash
node tools/arch-check.mjs --out test-results/arch-check
```

| Flag | What it does |
| --- | --- |
| `--root <tree>` | Repo root. Default is the parent of `tools/`. |
| `--out <dir>` | Report directory. Default `test-results/arch-check`. |
| `--no-shots` | Geometry, style, mural, and FPS only. No PNGs. |
| `--only PURPOSE` | Limit shots to one purpose, for example `DANCE`. Checks still cover every solid building. |
| `--review` | Exit 0 when the architecture fails, so CI can post the comment and stay green. A checker or calibration failure still exits 2. |
| `--write-baseline` | Record today's dance-mural sizes in `tools/arch-check-baseline.json`. Later runs compare against that floor. They do not raise it. |
| `--fps-baseline <file>` | PERF-GUARD baseline JSON. Default is `tools/perf-guard-baseline.json` when that file is in the tree. |
| `--plan <file>` | Also read this building plan or proposal. Repeat the flag for more than one file. |
| `--plans-only` | Judge plans against the style guide and skip Chrome. Use this before a build, when there is no new city yet. |

Needs Node and `google-chrome` (`CHROME` overrides the binary). No npm packages. Software GL (`--disable-gpu`), same host caveat as PERF-GUARD (PR #62): milliseconds are this machine, not a phone.

### Exit codes

| Code | Meaning |
| --- | --- |
| 0 | Pass, or `--review` with an architecture fail. |
| 1 | Architecture fail. Calibration passed. |
| 2 | Checker crash or calibration fail. Building results are not trusted. |

Outputs:

- `report.json` and `report.md` — full verdict
- `comment.md` — PR comment, marked `<!-- ARCHITECTURE-CHECK -->`
- `shots/` — one PNG per building, view, and size

## What gets reviewed

Solid buildings only: `kind` `b` and `landmark`, with boxes, and not a tow cab. Outlines, bills, pylons, and hills are not in the shot set.

References, read from `shared/car-wire.js` when the page can fetch it (hardcoded fallback matches today's `ZDM`):

| Thing | Size |
| --- | --- |
| 370Z | 4.25 m long, 1.85 m wide, 1.32 m tall |
| Person (Ellie) | 1.7 m |
| Pet | 0.74 m |

## Checks

Calibration runs first. It must pass a good person door (1.4×2.4 m at street level), fail a floating, short, narrow, or buried door, pass a 2.4×2.6 m garage mouth, fail the 1.44×2.45 m mouth, and pass/fail the window, overlap, z-fight, and shadowBlur judges. If calibration fails, exit 2 and ignore the city verdict.

**Scale.** Short side at least 1.2× the car length. Height at least 3 person-heights. A tower taller than 8× its short side is a needle. Ground floor (`GFH`, 4.5 m today) stays between person + 0.5 m and 7 m.

**Doors.** Measured from the live `drawDoors` quads, not a copied constant. A person door sits on the street (not floating above 0.15 m, not buried below −0.05 m), at least 0.85 m wide, and at least person + 0.25 m tall. It must land on a door in the building data.

**Garages.** The bay itself must fit the car (width + 0.4 m, length + 0.6 m, height + 0.5 m). The drawn mouth must clear the car too (width + 0.25 m, height + 0.35 m). Today's mouth is about 1.44×2.45 m on a bay that does fit; that mouth fails. A lot door is a person door. Bay collision slabs live in `BX` and are not drawn, so they are not an intersection fail.

**Windows.** Close-up panes come from `DETAIL.wallSlots` at 1.65×1.2 m. They stay on one column grid, inside the face, and do not overlap. The dashed floor bands (every 5.5 m, inset 2 m) must not cut a door or the roof. When both systems draw on the same wall and a band cuts a pane, that is a fail: two window systems.

**Geometry.** A box whose bottom is above 0.15 m needs a box under it. Overlap inside one building, or between buildings, fails above 1 m³. Faces 0.004–0.03 m apart with more than 4 m² of shared area z-fight.

**Roofs.** The top box closes the cap and meets `b.top`. A flying view also needs a pad, tank, or antenna. A closed neon slab with none of those is a blank lid. Ground-only roof trim does not count: it is off in `DETAIL_TUNE` and does not draw while airborne.

**Tiers.** Arcade (airborne), Street (slow, in front of a door), and on-foot must keep the same boxes, doors, parking, and top. Only surface segments may differ. Arcade must not stroke storefronts. Street must add storefronts. On-foot must add foot segments.

**Count.** Solid buildings (`kind` `b` or `landmark`) must match the approved count. That number is `Approved count` in `docs/NEON-WORLD-STYLE.md`, and it starts as the 24 on main. A moved or resized footprint does not fail. A removed or merged building drops the count and fails. An extra block that actually loads fails until Bob raises the number. A plan may pitch new buildings under `Ideas for Bob`. Those lines are not approval and are not in the game, so they do not fail.

**Layout.** After a move, the city still has to work. Each building's center sits in a district. If it carries a district tag, that district contains the center, or it touches the district that does. The builder HQ stays in `BUILDER_NORTH`, and that sandbox does not take other purposes. Soccer stays on the east side (`x` at least 350). The footprint does not enter the river, a street (20 m), the highway, the runway, the taxiway, or the spawn pad at the origin. A person door stands on a road, and the ground 2.2 m outside that door is not inside a building, not in the water, and not a wall.

**Signs.** A word, `mounted`, gap from the face between −0.05 m and 0.45 m, not above the roof, and at least 10 px at the PC front camera.

**Purpose.** Read from the Purpose list in `docs/NEON-WORLD-STYLE.md` on every run. The street sign has to use one of that purpose's words and measure at least 10 px at the front camera. The same word has to measure at least 10 px from the flying roof camera, with two exceptions: a sky drop may show a helipad instead, and a dance building may show its mural in that shot. A blank roof, a wrong word (`TURBO` on a soccer shop, `PIXEL` on a builder), or a sign that is too small fails. Generic (no named purpose) accepts any readable word. A purpose that is not in the style guide fails until Bob adds a line. The fix is straight boxes and a glow strip, not a curved shell.

**Z dance mural.** Buildings with purpose `DANCE`, or a sign tagged Z Company Arts. The mural quad is one plane, no wider than the face, and inside the wall. The front shot must show mural fill (blue lift) or the pink frame `#ff4fd8`. Area is compared with `tools/arch-check-baseline.json` (match by center within 40 m). A wall more than about 2% under that floor fails. Equality passes. `--write-baseline` records the floor; a later run never raises it.

**Style.** Stroke color is one of `#ff2a3d #3ee6ff #ffb020 #ff4fd8 #7dff6b #ffe14d #fff2c0 #ffd27a #9ff3ff #ffb3e6 #8a7a9d`. Fill `#0a0612` is not a palette fail. A black slab is brand drift (a warning) while the block is still a night-city building. A custom `b.draw` fails the palette check and the capability check.

**Ramps.** Written down in `docs/NEON-WORLD-STYLE.md`. The floor is the original count on main: `rampCount` in `tools/arch-check-baseline.json`, 70 ramps that are not tow-truck beds, including the three small river-edge launches. More than that passes. Fewer fails. There is no upper limit. Every ramp, including hidden banks, crests, and curb kickers, needs 16 m of clear run-up behind the low end and 16 m of clear landing past the lip. A building or a ground-level prop in that box fails. Another ramp does not. A board you can drive under does not. On today's city the tightest run-up is still clear past 22 m and every landing is clear past 40 m, so 16 m does not fail main. The small river-edge jumps (purpose `river`, small) stay as they are now: same place within 8 m, same height within 0.2 m, same length within 1 m, same direction, and the same lip distance from the water within 2 m. That is the jump that clears the river at about 80 mph. Extra ramps, including extra river jumps, pass. Tow-truck beds are not part of the count. `--write-baseline` does not lower `rampCount`.

**Tunnel.** The bore on main: 200 m long, 160 m wide, 30 m across, ceiling 10 m, hill 34 m, open along z. Locked as `tunnel` in the baseline. A match allows 2 m on length and width, 1 m on the bore, 0.5 m on the ceiling, and 1 m on the height. A missing tunnel, a shorter one, a filled bore, or a flip onto the other axis fails. The map may move the tunnel. The size, shape, and length may not. Each mouth needs 40 m of clear pavement at the bore width, and the bore itself stays clear of buildings and ground props. The tunnel walls and the ceiling are not blockers. On today's city both mouths are clear past 60 m. `--write-baseline` does not replace an existing tunnel record.

**shadowBlur.** A runtime probe counts non-zero assignments during the review draws and forces them to 0 so the shot still renders. A static scan covers all of `world/city-draw.js` and `world/detail.js`, plus `paintMural` and `drawBuildingGraffiti` in `world/neon-paint.js`. The car studio and the tow truck glow are not building fails. Any non-zero hit fails.

**FPS.** One near building, and the in-view `drawBldg` set, on software GL. Phone buffer is 1688×780 (DPR 2). iPad is 1024×768 at DPR 1 with CPU throttle ×4. PC is 1280×720 at DPR 1. Caps: one building ≤ 8 ms phone, 16 ms iPad, 8 ms PC. The pass cap is the lower of 40 / 90 / 40 ms and 70% of the PERF-GUARD building-face median. If `tools/perf-guard-baseline.json` is absent, the published PR #62 face numbers are used (phone 68.9 ms, iPad 170.1 ms, PC 65.2 ms) and the report says `pr62-published`. This is not the 19-scene PERF-GUARD bench.

**Capability.** Read from `docs/NEON-WORLD-STYLE.md` on every run, so Bob's latest edit is the bar. The stack is canvas 2D / WebGL in Safari and Chrome, a base iPad (iPadOS 17.7.8) and Bob's Galaxy, Galaxy steady at 110 fps or better, iPad steady at 60 or 30, no `shadowBlur`, procedural instanced geometry or one light CC0 low-poly used many times, and straight boxes. Heavy curves, organic shapes, photoreal detail, a unique sculpted mesh, and a live blur fail. The simpler build from the matching style-guide bullet is the recommendation. The past miss is the curvy 370Z Stillen bumper. A sentence that only forbids the risky word is not a flag. Finished boxes pass. A building pass that sets `shadowBlur` fails here as well as under the shadow check. A custom draw path fails. More than 36 boxes on one building is a warning.

**On brand.** Same file, latest copy. Drift (all-black fill, a home that is not a glass house with a cyan strip, babyish copy) is a warning with a suggestion. It does not fail the review. A hard break (copying a Roblox or Brookhaven asset, dropping neon for a photoreal daylight city) fails. Brookhaven named as the feeling to aim at is not a break. Signs and labels are scanned the same way. Plans and proposals are scanned before a build: pass `--plan`, and any `docs/*.md` whose name contains `plan`, `proposal`, or `building` (the style guide itself is not a plan). `--plans-only` skips the city.

## Shots

For every reviewed building:

| View | Camera |
| --- | --- |
| `front` | Street, facing the sign or the person door. Eye at 2.35 m. |
| `three` | Same distance, yawed about 0.7 rad, a little higher. |
| `roof` | Airborne, looking down at the cap. Detail tier off. |
| `foot` | On foot, 2.15 m outside the person door. `camSeatFoot` places the camera. |

Sizes (logical CSS pixels, DPR 1, so the files stay small): phone 844×390, iPad 1024×768, PC 1280×720.

File name: `b{id}-{purpose}-{front|three|roof|foot}-{phone|ipad|pc}.png`.

Each shot isolates that building, a ground grid, and three scale prisms: person gold (1.7 m), pet green (0.74 m), car cyan (4.25×1.85×1.32 m). The HUD names those sizes. The whole city is not drawn.

## Baseline on current main

The first committed run is `--write-baseline` on the main the branch was cut from. That file is the mural floor. Honest fails on today's buildings stay fails. Do not edit `world/` to make the baseline pass, and do not loosen a check to hide one.

## CI

`.github/workflows/arch-check.yml` runs on pull requests that touch building files, checker files, the style guide, or any other doc a plan might live in, and on `workflow_dispatch`. It runs `node tools/arch-check.mjs --review` and posts or updates one comment marked `<!-- ARCHITECTURE-CHECK -->`. An architecture fail stays green. Brand warnings stay in the comment and do not fail the job. A checker crash fails the job. Artifacts are the report and the shots.

## What this is not

It does not change `world/city.js`, `world/city-draw.js`, `world/detail.js`, `world/neon-paint.js`, or any other building implementation. It does not merge, and it does not publish the GitHub Pages site.
