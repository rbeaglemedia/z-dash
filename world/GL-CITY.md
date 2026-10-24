# Neon World WebGL buildings (prototype)

Query gate: `world-split.html?gl=1`. Default play is unchanged. `?glow=1` adds a halo from `world/gl-city-manifest.json`. This is a prototype on its own branch. It does not deploy.

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

Filled in by `node tools/gl-city-bench.js` on this branch. See `test-results/gl-city/`. Headless software WebGL cannot show 100 FPS. Phone target remains 100+ on a Galaxy at 1688×780. iPad target is a large gain over the ~15 FPS Bob measured on the A10.
