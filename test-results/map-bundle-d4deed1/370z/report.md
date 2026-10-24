# Bob's 370Z on the boulevard map

Head `d4deed17ebf486969833138d8ed84c420746554d` (PR #85, `d4deed1`). Page `world.html`. Rollback of the data check remains `e279c9a`.

Result: **PASS**

The white 370Z is on screen and readable in the chase cam on the runway at spawn `(0, 0)`. Start overlay hidden. Car held still. Headless Chrome, software WebGL.

| Device | Viewport | Sprite | Zoom |
| --- | --- | --- | --- |
| Phone | 844×390, dpr 2 | 240 px, 480×480 cache, 136 colors | `phone-370z-zoom.png` |
| iPad | 1180×820, dpr 2 | 512 px, 1024×1024 cache, 129 colors | `ipad-370z-zoom.png` |
| PC | 1366×768, dpr 1 | 448 px logical, 448×448 cache, 140 colors | `pc-370z-zoom.png` |

Each zoom crop is labeled `PHONE` / `IPAD` / `PC — Bob's 370Z — map d4deed1`. The car sits dead centre (`ZV.scr` 0.5, 0.5). `ZD.Xray.ready` and `ZGL.ensure()` were true. `NOZ` was off.

`*-370z-full.png` is the whole viewport. `*-sprite.png` is the offscreen car cache alone.

The earlier data check on this same sha also passed: roads, river, bridges, districts, 5 NOS, Hot Drop, traffic, Ellie's saves, both pages. Log: `test-results/map-bundle-d4deed1/map-bundle.md`.

Game suites were not run. Not deployed.
