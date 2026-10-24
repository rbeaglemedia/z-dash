# Traffic rules frame time

Headless Chrome, software WebGL. Phone 844×390, device scale 2, touch on. Five interleaved pairs. 69 frames each after 1.2 s with the player parked on a street and all 30 cars up. p95 is the 95th percentile frame time. 1% low is 1000 divided by the 99th percentile frame time. This VM is not Bob's phone (he sees 60–80 there).

Measured on `f2dd9a8`. The log commit after this does not change the game files.

| | before `f6678f4` | after `f2dd9a8` |
| --- | ---: | ---: |
| median | 66.6 ms | 66.6 ms |
| p95 | 66.7 ms (15.0 fps) | 66.7 ms (15.0 fps) |
| 1% low | 100 ms (10.0 fps) | 83.4 ms (12.0 fps) |

The sim step itself is about 0.16 ms before and 0.17 ms after, apart from drawing. No `shadowBlur` was added. The close-car picture is unchanged, so the 370Z Design Check was not re-run.

`node tools/traffic-rules-check.js` passed on this game code: busy crossing stops, an empty crossing rolls at 4 m/s, a busy NOS apron stops, his Z is not moved, town holds 10–15, highway holds 16–20.

Phone shots, same street crossing, same camera:

- `before-stop-phone.png` / `after-stop-phone.png` — gold car. Before it drives through (s 93.8, 12 m/s). After it stops short (s 75.2, 0 m/s). Crossing is at s 83.3.
- `before-yield-phone.png` / `after-yield-phone.png` — pink car behind his white Z. Before it keeps 14 m/s. After it stops (0 m/s) and his Z stays put.
