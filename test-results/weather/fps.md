# Weather frame times

Same pose for every pair: car stopped inside the west sand at x=-260, z=460, yaw north. Headless Chrome, software WebGL, one browser. Five pairs. Each number is the average of 40 `requestAnimationFrame` gaps, in milliseconds.

Before = `weather.bench('off')` (no curtain, no filter, far draw restored to 950 m). After = weather on at the live frame rate. This harness stays under 110 fps, so every after-sample is the thick path: far draw 320 m, outline 320 m, roads still 360 m, building detail still 170 m, ground grid 8. Density 0.78.

Phone emulation is 844×390 at dpr 2. The kid world caps phone backing-store DPR at 2, so a dpr-3 device still paints a 1688×780 buffer. Throttle 4 matches the city-builder phone harness.

| device | viewport | dpr | throttle | before ms | after ms | before avg | after avg |
|---|---|---|---|---|---|---|---|
| phone | 844×390 | 2 | 4 | 251.75, 191.16, 171.42, 166.98, 188.15 | 176.76, 202.45, 186.54, 188.84, 182.61 | 193.9 | 187.4 |
| iPad | 1180×820 | 2 | 2 | 258.43, 166.17, 197.84, 172.83, 166.32 | 156.89, 172.94, 161.76, 162.35, 178.55 | 192.3 | 166.5 |
| PC | 1366×768 | 1 | 1 | 132.46, 84.68, 93.75, 82.15, 111.81 | 86.82, 93.78, 90.32, 91.91, 96.47 | 101.0 | 91.9 |

The curtain plus the scrolling filter does not add frame time. On the throttled iPad the shortened far draw is faster (about 192 ms to 167 ms). Streets in front of the car stay at 360 m.

The light path (110 fps and above) keeps the far draw at 950 m. The six stills were taken with `debugFps` pinned at 140 so they show that look: `thickMix` 0, density 0.30, dist 950, player car sprite present. A real Galaxy at 110+ stays on that path. This headless run never got there, so it only measures the thick path.

API checks passed. Source `stand-in` (same rectangles as `CITY.LAYOUT.weather` on PR #85). `name: "Sand" | "Rain" | "Fog"` maps to kind. Player speed is unchanged by `weather.tick`.

Clip `drive-into-sand.mp4` starts just east of the sand (x=-150, z=460) and ends inside it at x=-299.4, z=460, 28.9 m/s, kind sand, density 0.30.
