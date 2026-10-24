# Option 1 frame time vs live main

Headless Chrome, software WebGL, `world-split.html`. Player parked on a street so all 30 traffic cars are up (12 simulated + 18 dots). Median is the middle of 36 animation frames after 1.8 s. This VM cannot show a phone's real frame rate. The comparison is this branch against `main` at `e279c9a`, same harness.

| view | this branch median | main median | this branch p95 | main p95 |
|---|---:|---:|---:|---:|
| phone 844×390 dpr 2 | 83.3 ms | 66.7 ms | 116.7 ms | 100 ms |
| iPad 1180×820 dpr 2 | 150 ms | 116.7 ms | 200 ms | 166.6 ms |
| PC 1366×768 dpr 1 | 83.3 ms | 66.7 ms | 100.1 ms | 100 ms |

Traffic audit on every sample: 30 cars, 0 on the runway, 0 off a lane, 0 inside a solid.

Minimap bake on this branch is `option1-boulevards` (roads, river, both bridges, 8 districts, 36 places). Live main still bakes the old bounds.

Measured on `4b41cdc`.
