# Neon World WebGL buildings (prototype)

**On hold.** Bob changed the goal on 2026-10-24. The new look stays unbuilt until the current FPS round lands (car-copy removal and the resolution clamp) and Bob says go. `index.html` stays untouched. Color and detail land one object type at a time, buildings first. Cars, props, and the rest wait.

The look proposal below is for Bob to pick. This branch keeps the black-solid `?gl=1` fallback. No model files are in the repo.

## Same count, new map

The shop count stays 24, two of each purpose, until Bob approves an addition. Lots and the district plan can move. The game is unchanged until Bob says go. The top-down proposal is `test-results/gl-city/looks/city-map-proposed.png`. North is up. Numbers on that image match the table below.

The runway (`|x| < 18`, `z` about -80 to 1520), the west highway (`x = -450`), the river (`z` 1780–1840), and the outer track stay. The stadium slides from `x = 830` to `x = 700`, `z = 280`, so the soccer doors open onto about a 70 m promenade (shop edge at `x = 526`, pitch edge at `x = 598`). The generic far-outline skyline stays the far ring. It does not grow a purpose sign.

| # | Purpose | Proposed lot (x0, x1, z0, z1) | Why it sits there |
|---|---|---|---|
| 1 | HOME | 100, 144, 60, 108 | Ellie's house, just east of the runway start. Door faces the runway. |
| 2 | HOME | 100, 140, 128, 176 | Guest cottage on the same block. Same saved house choices. |
| 3 | GARAGE | 180, 228, 60, 150 | Driveway garage. A walk from the porch, no runway crossing. Opens Garage Z. |
| 4 | NOS | 250, 290, 60, 106 | Pump beside that driveway. |
| 5 | SHOWROOM | 180, 244, 168, 224 | Small Z-DASH pavilion on the home cross street. |
| 6 | NEON_PAINT | 200, 244, 380, 428 | Paint studio on the arts walk. |
| 7 | DANCE | 200, 260, 450, 514 | Mural faces west, toward the runway walk. Wall stays 64×18 m. |
| 8 | ARCADE | 290, 346, 450, 514 | Arts walk, beside the mural. |
| 9 | ARCADE | 290, 342, 540, 604 | Second arcade on the same walk. |
| 10 | CAFE | -280, -236, 960, 1008 | Pizza cafe on the south edge of the park. |
| 11 | PETS | -420, -380, 1040, 1088 | West of the park green, off the highway. |
| 12 | PETS | -420, -376, 1120, 1168 | Second pet lounge on that same edge. |
| 13 | NOS | -400, -336, 1400, 1564 | Fuel depot on the highway, east of the lanes. |
| 14 | SKY_DROP | 90, 154, 1100, 1264 | Helipad deck. The glide from sky start lands here. |
| 15 | SKY_DROP | 200, 270, 1165, 1235 | Sky tower, 70×70×239 m, beside the deck. |
| 16 | DANCE | 310, 370, 1160, 1224 | Downtown mural faces west, toward the deck. Wall stays 64×20 m. |
| 17 | NEON_PAINT | 310, 354, 1260, 1308 | Second studio beside that mural. |
| 18 | SHOWROOM | 90, 154, 1320, 1484 | Long glass Z-DASH on the runway side of downtown. |
| 19 | CAFE | 310, 358, 1340, 1388 | Downtown pizza cafe. |
| 20 | SOCCER | 470, 526, 230, 318 | Faces east toward the moved stadium. |
| 21 | SOCCER | 470, 526, 330, 398 | Beside the first, same promenade. |
| 22 | GARAGE | 400, 464, 720, 884 | Pit pad on the way to the track. Same Garage Z save. |
| 23 | BUILDER | -70, -26, 1888, 1920 | HQ north of the river, west of the center bridge. |
| 24 | BUILDER | 40, 84, 1888, 1918 | HQ on the other side of that bridge. |

### How you move

Drive starts at `(0, 0)` on the runway, facing north. The runway is the slow spine. The west highway is the fast spine, tunnel included. Cross streets sit at `z` 220, 360, 960, 1280, and 1700. Bridges cross the river at `x = 0` and at the highway.

Fly starts at `(180, 980)`, height 460, and glides north onto the deck. Today `resetSkyDrop` in `world/state.js` uses `(180, 520, 460)`. When this map is built, that air point moves with the deck. The rooftop elevator already uses the building's own center and roof, so it follows shop 15 without a saved coordinate.

Walk from the porch of shop 1 to the bay of shop 3 on the driveway. The arts sidewalk runs along `x ≈ 160` past the paint studio, the mural, and both arcades. The park loop is the west green: cafe, then the two pet lounges. Soccer is a short walk east from shops 20 and 21 onto the pitch.

### Saves stay put

Ellie's house choices live in `localStorage` key `zdash.house.v1`, and a copy on `zdash.kid.v1` under `house`. That is the wall theme, furniture, pet bed, and neon sign, plus the Garage page's sofa, arcade, and dance floor. The save does not store a coordinate or a building id. Both HOME shops keep `purpose: 'HOME'`, so either door reads and writes the same choices.

Garage Z reads `zdash.kid.v1` → `eq` in `world/garagez.js` and paints the world Z. A door opens it only when `purpose === 'GARAGE'`. Both GARAGE shops keep that purpose. The driveway one is the walk from home. The pit one is the same link when she is on the sports side. Nothing in that save points at the old lot.

Shop order can change the in-memory building id. Do not write that id into the house save or the kid save. Doors keep working by purpose. The dance mural follows `purpose === 'DANCE'` through `isTaggedArts`, not the old coordinates.

Each purpose still has a shape, a color, and a sign so it reads at a glance. The shape is the same at every tier. Street and on-foot add surface detail on that shape. The portraits are the look of each purpose. The map is where that purpose sits.

| Purpose | How it reads |
|---|---|
| HOME | Pitched roof, green, a person door and a garage door, sign HOME. |
| NEON_PAINT | Magenta studio, paint swatches on the wall, sign NEON. |
| GARAGE | Amber bay wider and taller than the car (3.6×2.8 m), sign GARAGE. |
| DANCE | Flat mural wall at least 64×18 m (east) or 64×20 m (west). Sign Z COMPANY ARTS. The mural stays on that face. |
| PETS | Green front, paw mark, sign PETS. |
| ARCADE | Marquee over the sidewalk, pixel lights, sign ARCADE. |
| NOS | Gold, tanks on the roof, sign NOS. |
| SKY_DROP | Tall cyan shaft, a landing pad with an H on the roof, and the sign JUMP. The portrait is the 70×70×239 tower. The 64×164×62 deck sits beside it downtown and wears the same pad and the same JUMP sign. |
| BUILDER | Stepped blocks, sign PIXEL. |
| SOCCER | Stands around a field, sign TURBO. |
| CAFE | Red awning, sign PIZZA. |
| SHOWROOM | Glass front with a car in the window, sign Z-DASH. |
| GENERIC | Dark box, sparse windows, no purpose word. |

Street-front, three-quarter, roof, and on-foot frames for each of these are in `test-results/arch-check/shots/purpose-{PURPOSE}-{front|threeq|roof|foot}-{phone|ipad|pc}.png`. The iPad street-front lineup is `test-results/gl-city/looks/purpose-front-sheet.png`.

## Ideas for Bob

These three are not in the 24. They are not built, and they do not get a `shop()` call, unless Bob says yes. Each one is a dashed footprint on the map and a portrait in `test-results/gl-city/looks/idea-sheet.png`.

| Idea | Suggested purpose | Where it would sit | Why it is worth a yes |
|---|---|---|---|
| CAR WASH | A drive-through wash for the Z. Sign WASH. | Beside the driveway pump, x 300–340, z 70–110. | She already paints the Z at Garage Z. A wash is a drive toy on the way out of the house, and there is no page for it yet. |
| RIVER DOCK | A pier on the water. Sign DOCK. | South bank, x 200–280, z 1748–1772, clear of the river channel. | The river is a barrier today. A dock is a flying landmark and a place a boat could live later. No boat page exists yet. |
| STORY NOOK | A quiet reading house. Sign READ. | By the park cafe, x -360–-324, z 900–940. | Home is for her saved rooms. A small nook is a calm walk-in that is not a shop, a garage, or a cafe. No page exists yet. |

## Detail tiers (approved plan, folded into the look)

Shapes, doors, and garages are the same at every tier. Only the surface changes.

| Tier | When | Surface |
|---|---|---|
| Arcade | `P.driveMode === 'arcade'`, and while airborne | Lighter window grid. A static baked roof cap so a flyover still reads. This is a baked mark in the atlas, separate from the live `roofTrim` stroke in `shared/detail-tune.js` (`roofTrim: false`, because that stroke held downtown near 26 fps against about 60 with it off). |
| Street | `P.driveMode === 'street'`, on the ground | The same boxes, doors, and garages, plus richer eye-level facade and storefront detail for each building purpose. |
| On foot | `WALK_MODE.onFoot` | Highest tier. Extra eye-level detail inside `onFootDetailDist` (38 m). This tier is outside the WINGS toggle. |

Street storefronts cover the 24 `shop()` buildings in `world/city.js`, across six districts (`SPAWN_SOUTH`, `ARTS_GARAGE`, `PARKSIDE_WEST`, `DOWNTOWN_CORE`, `SPORTS_EAST`, `BUILDER_NORTH`) and twelve purposes in `WALK_DOOR` (`HOME`, `SHOWROOM`, `NEON_PAINT`, `GARAGE`, `NOS`, `DANCE`, `PETS`, `CAFE`, `ARCADE`, `SKY_DROP`, `SOCCER`, `BUILDER`). The existing caps stay: `storefrontDist` 48 m, `storefrontMaxSpeed` 12, `storefrontMaxSegs` 260, `faceBudget` / `maxWindowFaces` 4.

The WINGS control is the live A/B. `toggleDrive()` / `setDriveMode()` in `world/input.js` flips `P.driveMode` between `arcade` and `street`. Bob compares those two on the Galaxy by flipping WINGS / STREET. On-foot detail stays on its own path and is not what that toggle measures.

### Z dance building (mural wall)

The building may take a new shape. It keeps at least one flat wall as large as the wall the mural uses today, and the mural stays on that face. `isTaggedArts` paints the mural on every DANCE building, so this covers both shops. On the proposed map the arts shop's mural faces west, toward the runway walk, and the wall stays 64×18 m. The downtown mural stays a west face, 64×20 m, toward the sky deck. The tag follows `purpose === 'DANCE'`, not the old coordinates.

| Shop | Flat wall that stays | Facing |
|---|---|---|
| Arts & Garage, `shop(-224,-164,360,424,18)` | East face, 64 m wide × 18 m tall | East (`face: 'e'`) |
| Downtown, `shop(264,324,1160,1224,20)` | West face, 64 m wide × 20 m tall | West (`face: 'w'`) |

Today each shop is one tier, so that face is the whole building. A later shape may add a side mass, a deeper body, or a set-back crown. That extra geometry stays behind this rectangle. It does not inset, curve, or cover the mural wall. Trim, the sign in the band above the mural, and the entrance stay off the mural quad, as they do now.

The mural quad and its placement stay the ones `muralFrame` in `world/neon-paint.js` already computes: on that same face, `y0` 3.2 m, height `min(14, h * 0.55)` and also capped by `h - 3.5`, width `min(min(dx, dz) * 1.55, face span * 0.92)` centered on the face, painted `0.04` m off the wall. The strokes are the same in Arcade and in Street, and the same on every shape.

Shape options, each drawn in Arcade and in Street. The flat wall in front is the same size in all three:

| Option | What changes around the wall |
|---|---|
| Box | The wall is the whole building, as it is today. |
| Shoulder | A taller mass sits behind the right edge. The front wall is still the full rectangle. |
| Crown | A set-back roof rises behind the top of the same wall. |

Files for the side-by-side options: `test-results/gl-city/looks/dance-options-{arcade|street}-{phone|ipad|pc}.png` and `dance-options-sheet.png`. The city looks use one option each so the shape is not tied to the art source: (a) box, (b) shoulder, (c) crown.

Architecture Check (`bc-c7ace59c`) reviews building changes before they are reported to Bob. Its standard shots are the ones below, at phone 844×390, iPad 1024×768, and PC 1280×720. Street front and the three-quarter view use the Street surface. The roof / flying view uses Arcade. The on-foot close-up uses the on-foot surface. The wall, the door, and the mural quad are the same in all four.

| Shot | File view name | Surface |
|---|---|---|
| Street front | `front` | Street |
| Three-quarter | `threeq` | Street |
| Roof / flying | `roof` | Arcade |
| On-foot close-up | `foot` | On foot |

Each dance shape has those twelve frames: `test-results/arch-check/shots/b-DANCE-{box|shoulder|crown}-{front|threeq|roof|foot}-{phone|ipad|pc}.png`. The same files are under `test-results/gl-city/looks/dance-{shape}-{view}-{size}.png`. The iPad contact sheet is `dance-review-sheet.png`. A 1.7 m person, a 0.74 m pet, and a 4.25 × 1.85 × 1.32 m car sit in the shot for scale. The person door is 1.2 × 2.3 m at street level, in the left margin, clear of the mural. The checker's own tool is not on a branch yet, so these frames are the evidence that review will use. This proposal does not mark that review passed.

### `?perf=1` readout (specified, not built)

When the look is built, `?perf=1` shows two fields on the existing perf line:

1. The tier in force: `ON FOOT` when `WALK_MODE.onFoot`, otherwise `STREET` when `P.driveMode === 'street'`, otherwise `ARCADE`.
2. The building-pass milliseconds for that frame (the building submit, kept apart from car, ground, and HUD).

The readout is off unless the query is present, so a normal session pays nothing for it. No `shadowBlur`. This branch does not add the readout. It lands with the building look, after the FPS round and after Bob says go.

## Building source proposal (still on hold)

Bob asked whether Neon World needs more free 3D building models or should build them in-game. Three options, each drawn in Arcade and in Street. Every frame includes the Z dance mural on a full-size flat wall; the shape around that wall is box, shoulder, or crown as noted above. Mockups are drawings at the phone (844×390), iPad (1024×768), and PC (1366×768) sizes. They are drawings, not screenshots of the game. Files: `test-results/gl-city/looks/` named `{a|b|c}-{arcade|street}-{phone|ipad|pc}.png`, plus `sheet.png` (six iPad frames, Arcade then Street for each look).

Millisecond figures are estimates for the building pass on a Galaxy-class GPU. They were not measured on a phone or an iPad. The basis is the black-solid spike: 4–27 buildings submitted in 0.1–0.5 ms of JS on SwiftShader, while the whole software frame was 14–24 ms. That software frame does not transfer to a device. The budget is the whole frame: under about 9 ms on the Galaxy (steady 110+), and 16.7 ms or 33 ms on iPad (steady 60 or 30). The car, ground, and HUD still share that frame. Glow is baked into the window atlas. No `shadowBlur`. On-foot detail is a further small add inside 38 m, and it is not the number the WINGS toggle is for.

| | (a) procedural | (b) free models | (c) hybrid |
|---|---|---|---|
| What | Instanced box, glass, neon trim, one window atlas. LOD drops far faces to a flat color. Built from today's `CITY.BL` boxes. | Kenney and Quaternius low-poly kits, used as the city. | Same as (a) for the blocks. A few landmarks (spire, pitched-roof house, stadium) as their own meshes, built in the same primitive kit. |
| Arcade building pass | 0.4–1.2 ms. Sparse windows, one baked roof cap, no purpose storefronts. | 0.8–2 ms with one shared atlas. | 0.5–1.6 ms. |
| Street building pass | 0.7–2.0 ms. Same draws, denser windows, storefronts only on the near purposeful buildings (the caps above). | 2–6 ms if each mesh keeps its own material. | 0.8–2.5 ms. |
| Download | One atlas, about 0.3–0.6 MB. No meshes. | Published zips, none of them in this repo: Kenney City Kit Commercial 2.1 is 4.1 MB, Kenney City Kit Suburban 2.0 is 3 MB, KayKit City Builder Bits free edition is 4.6 MB. The 2018 OpenGameArt "LowPoly Buildings" zip is 2.5 MB and is a different upload from the 2019 Quaternius Buildings Pack, which publishes no zip size. A trimmed runtime set was not measured. | About 0.3–0.6 MB if the landmarks are built in code. Add about 0.2–1 MB only if a few outside meshes are added later. |
| Style | Full control. Cyan, magenta, glass, the same family as the homes. Risk: the skyline can look repeated. | Needs a recolor into neon. The shortlist below is bright toy-block and pastel houses. Quaternius Cyberpunk Game Kit is characters, platforms, and turrets, so it is out. No CC0 glass-curtain tower pack turned up. The closest towers are Kenney's commercial block skyscrapers. | High, if the landmarks use the same trim and atlas. The skyline gets a house, a tower, and a stadium in the same palette. |
| License, for an App Store build by C.F.R., Inc. | None. The art is ours. | See the license notes under this table. Each zip's own license file has to be read before ship. This is not legal advice. | None if the landmarks are in-code. A later Kenney mesh stays low-risk only after that zip's license file is checked. Do not host Quaternius files on a public URL. |
| Effort | Medium. One instanced shader and an atlas on boxes the city already has. | High. Import, fit each model to a `CITY.BL` footprint, retexture into the neon palette, and keep a license log. | A step past (a): three landmark assemblies in the same primitive kit. |

License notes, checked 2026-10-24 from the publishers' pages, not from files in this repo:

- Kenney's support page says the game assets are CC0, commercial use is allowed, and attribution is not required. Do not use the Kenney logo. Confirm the license file inside the zip before an App Store build. Source: https://kenney.nl/support
- Quaternius Asset License v1.0, last updated 2026-08-28, allows a commercial game with no credit, and forbids reselling or redistributing the assets themselves as assets. Source: https://quaternius.com/license.html
- Older Quaternius uploads on OpenGameArt are marked CC0, including LowPoly Buildings (2.5 MB, 2018). A third-party pack list checked 2026-10-10 still tags many Quaternius packs CC0, including a cyberpunk kit. That disagrees with the site-wide QAL enough that the license file inside each zip is the one that counts.
- QAL also fights the idea of serving the original models from a URL later. CC0 does not.

### Style-reference shortlist (research only)

Checked 2026-10-24 from the publishers' pages. Nothing was downloaded into the repo. Poly Pizza is a viewer, not the author, and it mixes CC0 with CC-BY. A Poly Pizza label is not the license. For an App Store archive the zip has to come from the author so `License.txt` is in the file. CC-BY is commercial-OK with a credits line. NC packs are out. This is not legal advice.

| Pack | License on the page | Size / polys | Fit for a bright Neon World |
|---|---|---|---|
| [Kenney City Kit Suburban 2.0](https://kenney.nl/assets/city-kit-suburban) | CC0 on Kenney's support page. Confirm `License.txt` in the zip. | OpenGameArt zip 3 MB. Kenney's page lists no tris. A HydeCo parse of the houses reports 21 types, about 770–2062 tris. Preview: https://opengameart.org/sites/default/files/preview_1324.png | Pitched roofs, garages, yards, pastel. Closest Brookhaven silhouette. Needs a neon recolor. |
| [Kenney City Kit Commercial 2.1](https://kenney.nl/assets/city-kit-commercial) | Same CC0 claim. Confirm the zip. | OpenGameArt zip 4.1 MB. Page says 50+ objects (awnings, signs). Per-model tris were not counted here. A third-party count (promoteindex, claimed 2026-10-21) says 41 models and a CC0 `License.txt`. We did not open the zip. Preview: https://opengameart.org/sites/default/files/preview_1327.png | Block towers, window grids, shop awnings, flat bright colors. Useful shop and tower silhouettes. These are solid blocks with window grids, which is the look (a) and (c) can build in code. |
| [KayKit City Builder Bits 1.0, free edition](https://kaylousberg.itch.io/city-builder-bits) | Itch page and `LICENSE.txt` are CC0 1.0 (commercial OK, credit optional). The itch blurb also asks people not to resell unmodified copies. That sentence is outside the CC0 grant. Paid add-ons (8.1 MB at $3.95, source 9.1 MB at $5.95) are out of this shortlist. | Free download 4.6 MB. HydeCo parse: buildings about 435–1885 tris, one 1024 gradient atlas. | Brightest toy-city of the set, fewer house shapes than Kenney suburban. Poly Pizza mirror: https://poly.pizza/bundle/City-Builder-Bits-1wLdnIddSx |
| [Quaternius Buildings Pack](https://quaternius.com/packs/buildings.html) (Jan 2019) | The live page's license field says CC0, 9 models, commercial OK. Site-wide QAL v1.0 (2026-08-28) forbids redistributing the assets as assets and does not apply retroactively to copies already obtained under an earlier version. The zip's own license file is the one that counts, and it has not been read. | Page prints no poly count and no zip size. Do not assign the 2018 OpenGameArt 2.5 MB "LowPoly Buildings" zip to this pack. The two archives were not compared. Preview: https://quaternius.com/assets/images/fullres/buildings.jpg | Bright simple low-poly. Hold until the zip license file is read. |
| [Quaternius Ultimate Buildings](https://quaternius.com/packs/ultimatetexturedbuildings.html) (Dec 2019) and [Simple Buildings](https://quaternius.com/packs/simplebuildings.html) (Aug 2017) | Pages state commercial use. The license field did not print CC0. A 2019 Patreon post called Ultimate CC0. Hold until each zip's license file is read. | Ultimate: 76 textured modular pieces, no size printed. Simple: 10 models (hospital, houses, shop), no size printed. Previews on those pages. | Textured and simple low-poly. Out of the pick until the license file is in hand. |

**Recommendation: (c), with the landmarks built in code.** The city is already boxes, so instanced glass and a window atlas is the FPS path and the style path, and the Arcade-to-Street gap stays inside the building-pass rows above. A house roof, a spire, and a stadium rim are enough skyline. Free models stay style references. If Bob later wants a silhouette this kit cannot make, the pack to open is a Kenney CC0 zip, after he picks and after `License.txt` in that zip is read. Downloads wait for that pick. KayKit's paid add-ons stay out. Quaternius stays on hold until a zip license file is read, and those files would not be hosted from a public URL.

The new target is not a match to today's black buildings. Move off the black fill while keeping Neon World: cyan and magenta neon, synthwave, glass and bright accents in the same family as the Brookhaven-inspired homes. The frame still has to fit the steady-FPS budget: Galaxy steady 110+ with the whole frame under about 9 ms, iPad steady 60 and 30. Use instancing or batching, LOD, and baked glow. No `shadowBlur`. The drawing that ships today stays as the fallback.

Query gate: `world-split.html?gl=1`. Default play is unchanged. `?glow=1` adds a halo from `world/gl-city-manifest.json`. This is a prototype on its own branch. It does not deploy. The `?gl=1` path below still paints the current black solid. That match is the fallback, not the new art direction.

## What other agents keep

`GLCITY` does not own canvas caps, iPad scale, car-sprite skip, traffic bake cache, or warm-up. Those belong to the FPS agent (`split-pc-fps`, PR 52, `bc-da7101de`). This branch starts at main `a265d75` (v30) and does not copy that work.

- Projection stays `camS` / `scr` / `NEAR` / `W` / `H` / `DPR`.
- `drawBldg` still runs for signs, doors, parking, and graffiti. Detail's window panes and storefronts still run after it.
- Traffic sprites that are already in `TRAFFIC._cache` are drawn in the same depth pass. The bake itself is untouched. A car with no sprite yet still uses the 2D draw.
- The car renderer `ZD.Xray` is not resized. Buildings use their own WebGL1 canvas (`#cgl`). `?gl=1` stacks three canvases in `.kbody`: `#cback` (sky and ground), `#cgl` (buildings and cached traffic sprites), `#c` (signs, doors, the car, HUD). Nothing copies a WebGL bitmap into a 2D canvas.

## API (`window.GLCITY`)

| Member | Meaning |
|---|---|
| `enabled` | True when the URL has `?gl=1`. |
| `active()` | Context and shaders are up. False falls back to the 2D solid. |
| `beginUnder()` | Points the shared `ctx` at `#cback` for the sky and ground pass. |
| `beginOver()` | Points `ctx` back at `#c` and clears it so the city shows through. |
| `compose(items)` | Draws the depth pass on `#cgl`. No blit. Called after `beginOver`. |
| `skipSolid(b)` | `drawBldg` draws leftovers only. |
| `skipDyn(o)` | Traffic slot already drawn as a depth-tested sprite. |
| `stats()` | Counts and `submitMs` / `gpuMs` / `blitMs` for the last frame. `blitMs` stays 0. |
| `manifest` | Parsed `world/gl-city-manifest.json` once the fetch resolves. |
| `loadMs` | Time until that fetch (and the kernel image) finished. |
| `limits` | WebGL1 version, max texture size, max attributes, GPU renderer string. |

`c.slot` on a traffic car gained `traffic: 1` and `car`. Nothing else reads those fields.

Assets: `GLCITY` fetches the manifest on startup and does not block the first frame. A bad URL leaves the hard edge in place. Replace `assets[].url` with a server path later. Geometry is not in the manifest. It is still built from `CITY.BL`.

## Picture

v30 building edges are hard 1.2–2.4px strokes. `?gl=1` matches that: opaque fill `#0a0612` (hills `#05100a`), screen-space edge width 1.8px inside 400 m and 1.2px past it, window dashes 1.6px in `b.wc` at the same rows as `winRows`. `?glow=1` widens the edge by 7px and fades it. That flag is off in the comparison shots.

Known gaps versus the 2D painter, on purpose for this prototype:

- Rings, ramps, pipes, hoops, and loops still draw on `#c`, so they can cover a nearer building.
- Signs, doors, and detail panes draw on `#c`, so a nearer building does not hide them.
- Dash phase starts at each window row. The 2D path continues one dash across the whole stroke.
- Outline blocks fill the caps and stroke the verticals. Side faces stay open, same as the far silhouette.

## Feasibility

A building face is a few camera-facing quads plus screen-space line quads. WebGL1 can draw that in two or three `drawArrays` calls. iOS Safari ignores wide `gl.LINES`, so edges are triangles. The context is `webgl` (not WebGL2): no float textures, no vertex-array objects, no multiple render targets, no `gl_FragDepth`, no derivatives. Sprite textures are non-power-of-two with `CLAMP_TO_EDGE` and `LINEAR`, which is the WebGL1 rule. If the context is lost or the shader fails, `active()` goes false and `drawBldg` draws the 2D solid again.

A per-frame `drawImage` of the WebGL canvas was measured at about 9 ms of ReadPixels on this VM's software GL, which made `?gl=1` slower than 2D. The stack removes that copy. `blitMs` is 0. Headless Chrome here is software WebGL, so its FPS is not the phone's FPS. The number that transfers is CPU time in `submitMs` plus `gpuMs`.

## Phases

1. **This PR.** `?gl=1` solids, window dashes, edges, and cached traffic sprites. 2D fallback stays.
2. Move signs, doors, and detail panes into the same depth pass so a near wall hides them.
3. Optional: draw the sky and ground in the same WebGL canvas. The readback blit is already gone.
4. Turn the glow kernel on only after Bob accepts the look change.
5. Host the kernel (and any later facade atlas) at the manifest URL.

## Measured frame times

`node tools/gl-city-bench.js` on 2026-10-24. Chrome `--disable-gpu`, SwiftShader, WebGL 1.0, GLSL ES 1.0. Five frame gaps per shot, first gap dropped. The player car draw is stubbed, so `raf` is the city pass. Logs and shots: `test-results/gl-city/`.

| view | canvas | shot | 2D raf ms | GL raf ms | GL compose ms | blit ms | buildings |
|---|---|---|---:|---:|---:|---:|---:|
| phone | 1688×780 DPR 2 | air | 16.5 | 20.5 | 0.4 | 0 | 25 |
| phone | 1688×780 DPR 2 | face | 15.5 | 20.5 | 0.2 | 0 | 7 |
| phone | 1688×780 DPR 2 | shops | 16.3 | 24.1 | 0.5 | 0 | 19 |
| phone | 1688×780 DPR 2 | glow | 16.2 | 16.5 | 0.3 | 0 | 27 |
| iPad | 1024×768 DPR 1 | air | 14.0 | 15.3 | 0.1 | 0 | 15 |
| iPad | 1024×768 DPR 1 | face | 16.8 | 16.7 | 0.1 | 0 | 4 |
| iPad | 1024×768 DPR 1 | shops | 14.0 | 13.9 | 0.3 | 0 | 14 |
| iPad | 1024×768 DPR 1 | glow | 16.6 | 15.9 | 0.2 | 0 | 25 |
| PC | 1280×720 DPR 1 | air | 15.9 | 16.7 | 0.4 | 0 | 24 |
| PC | 1280×720 DPR 1 | face | 15.1 | 14.1 | 0.2 | 0 | 6 |
| PC | 1280×720 DPR 1 | shops | 13.2 | 13.9 | 0.3 | 0 | 19 |
| PC | 1280×720 DPR 1 | glow | 16.7 | 14.4 | 0.3 | 0 | 25 |

The iPad buffer is 1024×768 at DPR 1 because that cap is already in `camera.js` on main. This branch does not change it. Bob's ~15 FPS figure was a 1024×768 CSS view at DPR 2. This bench does not reproduce that buffer.

`compose` (submit plus the GL draw) is 0.1–0.5 ms. `blit` is 0. Manifest load was about 2.7 s, inside the 10 s budget. SwiftShader still spends the frame in software raster, and that cost shows up in `raf`, not in `compose`. On this VM the GL path is about the same speed as 2D, and slower on the phone-sized buffer (about 16 ms vs about 20 ms). That is not a Galaxy and not an A10. This run does not measure 100 FPS, and it does not measure the A10's 15 FPS. Those stay device targets. What transferred is: the solid is a few tenths of a millisecond of JS, and nothing reads the GL buffer back.

### Picture match

Same camera for each pair. Share of pixels within a channel-sum of 12, and the share that differ by more than 24 (visible edges):

| view | air ≤12 / >24 | face ≤12 / >24 | shops ≤12 / >24 | glow ≤12 / >24 |
|---|---|---|---|---|
| phone | 93.7% / 3.7% | 98.2% / 1.2% | 96.0% / 3.3% | 96.4% / 3.2% |
| iPad | 98.0% / 1.3% | 98.3% / 1.5% | 97.5% / 1.9% | 97.0% / 2.6% |
| PC | 97.9% / 1.0% | 96.7% / 2.4% | 95.5% / 3.2% | 96.0% / 3.1% |

The face shot is the closest exact match (phone 86% identical, iPad 96%, PC 90%). The rest of the difference is canvas antialiasing against hard GL quads, and the dash phase noted above. Side-by-side sheets are `test-results/gl-city/sheets/`.
