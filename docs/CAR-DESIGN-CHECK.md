# 370Z Design Check

This is the bar for anything that draws Bob's 2010 370Z, or a copy of it. Traffic cars, LODs, sprites, bakes, the garage, neon paint, and trailers all sit under it. The player car in the chase camera is the design. A copy near that car has to read as the same car.

The checker is `tools/car-design-check.mjs`. It does not change the game, it does not merge, and it does not publish the GitHub Pages site. It never opens or edits adult `index.html`.

## The six rules

1. **Close copies match the 3D Z.** A traffic car near the player uses the same body shape and proportions, and the same paint and lighting style, as the showroom 370Z. It may be less detailed. It has to hold up from the front, the rear, the side, and a three-quarter view. A dark, flat, smeared stand-in fails even when it was baked from the same GLB.

2. **Wheels are real wheels.** Tires sit in the wheel wells. The wheel faces along the side of the car (the disc is visible from the side, and thin from the rear). Front wheels steer about the vertical axis. A flat card that always faces the camera fails. Squashing that card in screen space does not make it a wheel. Silver star decals floating outside the body fail.

3. **Resolution stays readable.** The close-range picture of the car is at least 256 pixels on the long side at the source, and it is not stretched over a much larger on-screen car. A 160px bake is a fail. A 16px wheel card is a fail. Question any bake in that class before calling it good.

4. **Far cars may be simpler.** Past the close range (`fullDist` in `shared/traffic-tune.js`, 150 m today) a box, a light pair, or a coarser LOD is allowed. That permission does not excuse a bad close car. A far LOD does not have to match the showroom silhouette.

5. **The frame stays cheap.** The target is 110 fps or better on Bob's Galaxy, and the same representation has to stay playable on an iPad 6th gen. No `shadowBlur` on the player sprite or the traffic copy. After the picture cache is warm, twelve close copies may not add a stable delta above 3.5 ms on a headless frame under software GL and 4× CPU. If the five on/off pairs jump around by more than that delta, the probe is reported and does not fail. This is not a Galaxy benchmark.

6. **Same GLB file and path.** The player Z and Garage 370Z load one file: `shared/assets/370z-glb.js`, exposed as `window.ZD_ASSET_GLB`, with `cfg.file` `assets/370z.glb` in `shared/zd-embed.js`. Kid App `world.html`, `world-split.html`, and `neon-paint.html` include that script. Traffic, a LOD, a sprite bake, and any other copy have to be built from that same file and that same path. A second `.glb`, a different script, an embedded GLB, or a Kenney body fails even when the picture is a low-poly cut of something else. The runtime hash of the loaded buffer has to match the hash of `shared/assets/370z-glb.js`. Garage rides the same `ZD.Xray.car` as the player. Adult `index.html` is not read.

Clothing-level extras on the player car (a spoiler, a wing, a vinyl) are notes unless they break one of these rules.

## What gets reviewed

The visual pass opens Kid App `world.html` only. It parks the real player car (the `drawZ` showroom path) and one traffic copy in empty sky, then shoots both together.

| Shot | Camera | Range |
| --- | --- | --- |
| Rear | Chase, behind and slightly above, the view Bob drives in | Close, about 11 m |
| Front | Nose-on, same height | Close |
| Side | Full side | Close |
| Three-quarter | Rear three-quarter | Close |
| The same four | Same directions | Far, about 260 m, where a simpler LOD is allowed |

Each sheet is one view: the wide frame with the player car visible, then a zoomed crop of his Z and a zoomed crop of the copy. Zooms use nearest-neighbor so a stretched bake stays blocky. The front close shot steers the copy's front axle by 0.45 rad. Real front wheels yaw. Camera-facing cards do not. The sheet names the GLB path and the first 12 hex digits of its sha256 when the loaded bytes match `shared/assets/370z-glb.js`. It says WRONG GLB when they do not.

The file scan covers the drawers a copy can hide in:

- `world/traffic.js`, `shared/traffic-tune.js`
- `shared/car-draw.js`, `shared/car-model.js`
- `shared/zd-embed.js`, `shared/assets/370z-glb.js`
- `world/garage.js`, `world/garagez.js`, `world/neon-paint.js`
- the script tags in `world.html`, `world-split.html`, and `neon-paint.html`

A close path that blits a bake under 256 px fails rule 3 even before the pixels are judged. A `drawWheels` card composited in screen space fails rule 2. `shadowBlur` in `world/traffic.js` or `shared/car-draw.js` fails rule 5. Brush glow inside the paint studio is not a car-body fail. A copy whose GLB path or bytes are not `shared/assets/370z-glb.js` / `assets/370z.glb` fails rule 6. A diff that touches adult `index.html` fails the review on its own. The checker does not try to fix it.

## How a copy passes

All six rules pass on the close shots, from every angle above. The far shots are recorded and do not have to match the silhouette. Rule 6 passes only when the copy is built from `shared/assets/370z-glb.js` at `assets/370z.glb`, the same bytes the player and the garage loaded. A checker crash is not a design fail and not a pass.

## Run it

```bash
node tools/car-design-check.mjs --review --out test-results/car-design-check
node tools/car-design-check.mjs --review --root /path/to/other/tree --label pr-78
```

`--root` defaults to this repo. Exit 0 is a pass. Exit 1 is a design fail (the report was written). Exit 2 means the checker itself broke.

Chrome is `google-chrome` or `$CHROME`. The page is software WebGL. One browser. The FPS probe is five on/off pairs after the pictures are cached.

## CI

`.github/workflows/car-design-check.yml` runs on pull requests that touch a drawer, this standard, or the checker, and on `workflow_dispatch`. It posts or updates one comment marked `<!-- CAR-DESIGN-CHECK -->`. A design fail stays green so a bad car cannot hide behind a red job. A checker crash fails the job. The report and the sheets are the artifact.

## What this is not

It does not edit `world/`, `shared/` game code, `jr.html`, or adult `index.html`. It does not deploy. A passing comment is not permission to merge.
