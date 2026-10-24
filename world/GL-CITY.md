# Neon World WebGL buildings (prototype)

**On hold.** Bob changed the goal on 2026-10-24. Do not build the new look until the current FPS round lands (car-copy removal and the resolution clamp) and Bob says go. Do not touch `index.html`.

The look proposal below is for Bob to pick. No renderer work, and no model files in the repo, until the FPS round lands and Bob says go.

## Building source proposal (still on hold)

Bob asked whether Neon World needs more free 3D building models or should build them in-game. Three options. Mockups are drawings at the phone (844×390), iPad (1024×768), and PC (1366×768) sizes. They are not screenshots of the game. Files: `test-results/gl-city/looks/`.

Millisecond figures are estimates for the building pass on a Galaxy-class GPU. They were not measured on a phone or an iPad. The basis is the black-solid spike: 4–27 buildings submitted in 0.1–0.5 ms of JS on SwiftShader, while the whole software frame was 14–24 ms. That software frame does not transfer to a device. The budget is the whole frame, not just buildings: under about 9 ms on the Galaxy (steady 110+), and 16.7 ms or 33 ms on iPad (steady 60 or 30). The car, ground, and HUD still share that frame. Glow is baked into the window atlas. No `shadowBlur`.

| | (a) procedural | (b) free models | (c) hybrid |
|---|---|---|---|
| What | Instanced box, glass, neon trim, one window atlas. LOD drops far faces to a flat color. Built from today's `CITY.BL` boxes. | Kenney and Quaternius low-poly kits, used as the city. | Same as (a) for the blocks. A few landmarks (spire, pitched-roof house, stadium) as their own meshes. |
| Building-pass estimate | 0.5–2 ms if it is one or two instanced draws. | 2–6 ms if each mesh keeps its own material. About 1–3 ms if everything is forced onto one atlas and instanced. | 0.7–2.5 ms: (a) plus one extra draw for a handful of landmarks. |
| Download | One atlas, about 0.3–0.6 MB. No meshes. | Kenney City Kit (Commercial) 2.1 is published as a 4.1 MB zip (OpenGameArt). Quaternius "LowPoly Buildings" (2018) is published as a 2.5 MB zip there. A trimmed runtime set could be smaller and was not measured, because nothing was downloaded. | About 0.3–0.6 MB if the landmarks are built in code. Add about 0.2–1 MB only if a few outside meshes are added later. |
| Style | Full control. Cyan, magenta, glass, the same family as the homes. Risk: the skyline can look repeated. | Low until recolored. Kenney's city kits are flat, friendly low-poly, not synthwave. A Quaternius cyberpunk kit may sit closer, and it was not opened. | High, if the landmarks use the same trim and atlas. The skyline gets a house, a tower, and a stadium without a new palette. |
| License, for an App Store build by C.F.R., Inc. | None. The art is ours. | See the license notes under this table. Each zip's own license file has to be read before ship. This is not legal advice. | None if the landmarks are in-code. A later Kenney mesh stays low-risk only after that zip's license file is checked. Do not host Quaternius files on a public URL. |
| Effort | Medium. One instanced shader and an atlas on boxes the city already has. | High. Import, fit each model to a `CITY.BL` footprint, retexture into the neon palette, and keep a license log. | A step past (a): three landmark assemblies in the same primitive kit. |

License notes, checked 2026-10-24 from the publishers' pages, not from files in this repo:

- Kenney's support page says the game assets are CC0, commercial use is allowed, and attribution is not required. Do not use the Kenney logo. Confirm the license file inside the zip before an App Store build. Source: https://kenney.nl/support
- Quaternius Asset License v1.0, last updated 2026-08-28, allows a commercial game with no credit, and forbids reselling or redistributing the assets themselves as assets. Source: https://quaternius.com/license.html
- Older Quaternius uploads on OpenGameArt are marked CC0, including LowPoly Buildings (2.5 MB, 2018). A third-party pack list checked 2026-10-10 still tags many Quaternius packs CC0, including a cyberpunk kit. That disagrees with the site-wide QAL enough that the license file inside each zip is the one that counts.
- QAL also fights the idea of serving the original models from a URL later. CC0 does not.

**Recommendation: (c), with the landmarks built in code, not downloaded.** The city is already boxes, so instanced glass and a window atlas is the FPS path and the style path. A house roof, a spire, and a stadium rim are enough skyline, and they do not need Kenney or Quaternius. Free models are not required. If Bob later wants a silhouette this kit cannot make, the only pack to consider is a Kenney CC0 zip, after he picks and after the license file in that zip is read. No downloads until then.

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
