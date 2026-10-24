# Planner port proof — lab frame times

Headless Chrome 156, `--disable-gpu`, software GL. CPU throttle matches the city-builder clip: phone 4×, iPad 2×, PC 1×. Buffers: phone 1688×780 (CSS 844×390, dpr capped at 2), iPad 2048×1536 (CSS 1024×768, dpr 2), PC 1366×768 (dpr 1).

These are lab costs. They are not Bob's Galaxy and not the iPad 6th gen.

A single `gl.finish` around one draw did not move the clock (about 0 ms). The numbers below are a stress frame: **40 instanced draws plus `gl.finish`**. The per-draw ceiling is that frame divided by 40. It is an upper bound. House and trailer frames also upload one 256×144 texture. A filled view costs more in software GL than the same boxes seen from far away, which is why the 136-box budget view is cheaper than the 35-box house.

Galaxy steady 110 is a frame under about 9.1 ms. iPad steady 60 is under 16.7 ms. The 6th gen's acceptable floor in the speed plan is a flat 30 (under 33 ms), not 110.

| viewport | scene | instances | tris | 40-draw frame (ms) | per-draw ceiling (ms) |
| --- | --- | --- | --- | --- | --- |
| phone, cpu 4 | house | 35 | 420 | 317, 333, 350, 333, 333 | 8.3 |
| phone, cpu 4 | shell | 45 | 540 | 100, 117, 117, 100, 117 | 2.8 |
| phone, cpu 4 | remix row | 57 | 684 | 33, 67, 33, 50, 67 | 1.3 |
| phone, cpu 4 | trailer | 17 | 204 | 267, 267, 250, 267, 250 | 6.5 |
| phone, cpu 4 | budget (house + shell + 5 remixes) | 136 | 1632 | 100, 117, 133, 117, 100 | 2.8 |
| iPad, cpu 2 | house | 35 | 420 | 650, 667, 667, 683, 650 | 16.6 |
| iPad, cpu 2 | shell | 45 | 540 | 283, 283, 283, 283, 283 | 7.1 |
| iPad, cpu 2 | remix row | 57 | 684 | 67, 83, 83, 83, 67 | 1.9 |
| iPad, cpu 2 | trailer | 17 | 204 | 550, 567, 567, 567, 583 | 14.2 |
| iPad, cpu 2 | budget | 136 | 1632 | 150, 150, 167, 167, 150 | 3.9 |
| PC, cpu 1 | house | 35 | 420 | 233, 217, 200, 217, 217 | 5.4 |
| PC, cpu 1 | shell | 45 | 540 | 83, 67, 83, 83, 83 | 2.0 |
| PC, cpu 1 | remix row | 57 | 684 | 33, 33, 34, 33, 50 | 0.9 |
| PC, cpu 1 | trailer | 17 | 204 | 167, 183, 183, 183, 183 | 4.5 |
| PC, cpu 1 | budget | 136 | 1632 | 83, 83, 83, 83, 83 | 2.1 |

One draw call in every scene. No `shadowBlur`. Raw rows are in `fps.json`.

Screenshots:

- test-results/planner-port/phone-house.png
- test-results/planner-port/phone-shell.png
- test-results/planner-port/phone-props.png
- test-results/planner-port/ipad-house.png
- test-results/planner-port/ipad-shell.png
- test-results/planner-port/ipad-props.png
- test-results/planner-port/ipad-remix-food-truck.png
- test-results/planner-port/ipad-remix-welcome-gate.png
- test-results/planner-port/ipad-remix-ticket-booth.png
- test-results/planner-port/ipad-remix-speaker-tower.png
- test-results/planner-port/ipad-remix-snack-counter.png
- test-results/planner-port/ipad-trailer.png
- test-results/planner-port/pc-house.png
- test-results/planner-port/pc-shell.png
- test-results/planner-port/pc-trailer.png
