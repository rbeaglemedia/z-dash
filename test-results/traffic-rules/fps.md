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

Labeled phone frames for the go/no-go, 844×390 at device scale 2, his white Z in every frame:

- `traffic_rules_before_crossing_phone.png` / `traffic_rules_after_crossing_phone.png` — gold car at the street crossing. Before 7.6 m/s in the crossing. After 0 m/s short of it.
- `traffic_rules_before_yield_phone.png` / `traffic_rules_after_yield_phone.png` — pink car behind his Z. Before 14 m/s. After 0 m/s, and his Z stays put.
- `traffic_rules_before_nos_apron_phone.png` / `traffic_rules_after_nos_apron_phone.png` — gold car at the FIELD NOS station. The boulevard lanes run beside the pump box, so this frame draws that station's apron marks out to the street it faces. Before the car is in the apron at 4.1 m/s. After it is stopped at the apron.
