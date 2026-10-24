# PR #89 weather overlay check — FAIL

Head `b11c1ced8b6f446fa16901f9fb37da25f1617bd1` on `cursor/weather-overlay-c773`. Base is `origin/main` `e279c9a`. Compared with PR #85 at `d4deed17ebf486969833138d8ed84c420746554d`. No deploy. Adult `index.html` is the same blob as main (`0bcb666f`).

| Check | Result |
| --- | --- |
| Loads on `world.html` and `world-split.html` | PASS on this commit |
| Zones match the Boulevards layout and the minimap | PASS for the four rectangles |
| Weather zones on the minimap | Yes. PR #85 already draws them. This PR does not. |
| Runway, tunnel, and bridge anchors stay clear | PASS when `CITY.LAYOUT` is on the page. The stand-in file does not clear the center bridge's south 20 m |
| Bob's Z visible and readable | PASS in all six stills |
| No `shadowBlur` in the weather pass | PASS |
| FPS on phone, iPad, and PC | PASS (re-measured). The thick path is not slower than weather off |
| Merges cleanly with #85 at `d4deed1` | FAIL |

## Both pages

`world.html` and `world-split.html` are the same file on this commit. Both add one line, before `boot.js`:

`world/weather.js?v=30`

`boot.js` calls `WEATHER.tick`, `WEATHER.drawWall` (before the car), and `WEATHER.drawFilter` (then `drawZ()`). Cache stays world 30. PR #85 is already world 32.

## Zones and the minimap

`world/weather-zones.json` uses the same four rectangles as `CITY.LAYOUT.weather` at `d4deed1`:

| name | x0 | x1 | z0 | z1 |
| --- | --- | --- | --- | --- |
| Sand | -350 | -170 | 40 | 1000 |
| Fog | -180 | 250 | 1530 | 1660 |
| Rain | 240 | 640 | 240 | 760 |
| Fog | -480 | -80 | -400 | -160 |

When `window.CITY_LAYOUT.weather` is present, `weather.js` adopts it immediately and reports source `interfaces`. Names Sand / Fog / Rain become kinds sand / fog / rain. The stand-in file is the fallback when that object is missing. This commit does not load `city-layout.js`, so a run of this branch alone uses the stand-in.

Weather zones should show on the minimap. `world/hud.js` at `d4deed1` already paints `CITY.LAYOUT.weather` as a dashed hatch and labels the names when the map span is at least 1200 m. This PR does not edit `hud.js`. The hatch is the full rectangle. It does not cut the runway, tunnel, or bridge holes.

## Anchors

With the boulevard anchors as the holes, `inZone` is clear at the runway `(0, 800)`, the tunnel `(-450, 600)`, the center bridge tip `(0, 1650)`, and the west bridge `(-450, 1800)`. Player speed is unchanged. The only zone/anchor overlap is the north fog over the center bridge: x -14..14, z 1640..1660 (28 m by 20 m). The layout hole punches that box out. A point just beside the hole, `(20, 1650)`, stays fog.

The stand-in clear list is a different box (runway -20..20 / -55..1522, tunnel z 470..730, a river box from z 1700, plus the homestead yard). It does not cover z 1640..1660. On the stand-in, `(0, 1650)` is fog. That is the center bridge's south end on the Boulevards map.

Runway and tunnel do not intersect any of the four rectangles, so they are clear on both sources.

## Bob's Z and shadowBlur

The six stills on this commit (`sand`, `fog`, and `rain`, outside and inside) show the wireframe Z in front of the curtain or the filter. The filter is drawn, then `drawZ()`. The car stays readable.

`weather.js` sets `shadowBlur` to 0 on the curtain and the filter. The diff does not add a non-zero blur. `boot.js` still blurs the horizon (14) and the rings (8). Those lines were already there.

## FPS

Re-ran `node tools/weather-bench.js --fps` on this commit. Headless Chrome, software WebGL, five pairs of 40 frames, car stopped in the west sand at x=-260, z=460. The harness stays under 110 fps, so every after-sample is the thick path (far draw 320 m, density 0.78). API source `stand-in`, no failed checks.

| device | viewport | throttle | before avg | after avg |
| --- | --- | --- | --- | --- |
| phone | 844×390 dpr 2 | 4 | 119.2 ms | 103.8 ms |
| iPad | 1180×820 dpr 2 | 2 | 103.4 ms | 96.6 ms |
| PC | 1366×768 dpr 1 | 1 | 48.3 ms | 40.4 ms |

The author's log on the same commit is slower (phone 193.9 to 187.4 ms, iPad 192.3 to 166.5, PC 101.0 to 91.9) and reaches the same conclusion: weather on is not slower than weather off, because the thick path shortens the far draw. The light path (110 fps and above) keeps 950 m. This machine did not reach it either.

## Merge with `d4deed1`

`git merge-tree` conflicts in `world.html` and `world-split.html`. #85 rewrote the script list from `?v=30` to `?v=32`. This PR inserts `weather.js?v=30` in that same list. `world/boot.js` and `world/city-draw.js` auto-merge and keep the weather hooks.

Until someone keeps the v=32 pages and adds `world/weather.js?v=32` to both, the two branches do not combine.
