# City Builder flying clip — before / after

Same pinned pose on every sample: car at x=186, y=8, z=1836, yaw 0, wings open, City Builder HQ ahead. Headless Chrome, `--disable-gpu`. Five FPS samples per device. Game counter is `FLY.fps`.

| device | viewport | DPR | CPU throttle | before FPS | after FPS |
| --- | --- | --- | --- | --- | --- |
| phone | 844×390 | 3 | 4 | 20, 20, 20, 20, 20 | 20, 20, 20, 20, 20 |
| iPad | 1180×820 | 2 | 2 | 20, 20, 20, 22.5, 28 | 20, 20, 20, 22.5, 28 |
| PC | 1366×768 | 1 | 1 | 21.3, 27.1, 27.3, 26.3, 29 | 22.5, 27.1, 27.1, 27.3, 26.3 |

Phone canvas backing store stayed 1688×780 (the game caps mobile DPR at 2). No script errors.

Flying at that spot, `DETAIL.stats()` reported `footSegs: 0` and `onFoot: 0` both before and after. Interior lines were not in the flying scene.

On foot at the builder door, outdoor eye-level segments went from 90 (interiors included) to 74 (apron, mat, parking, planters, lamp, blade only).

Entry, using the existing `enterDoor` path:

- Front door at (186, 1888): interior cache `{id:22, n:16}`, room canvas 844 wide.
- Garage bay of the same shop: interior cache `{id:22, n:16}`, `garage: true`.
- `stepBackOutside` on both: interior cache null, room canvas reset to 2×2.

After the clip, the largest stroked coordinate was the horizon line at 2× canvas width (1688 phone, 2360 iPad, 2560 PC). Near-plane edges no longer run off to tens of thousands of pixels.

`tools/ui-polish-audit.js` wrote `test-results/ui-polish-interiors.md` (124 screens). World interior is clean. World drive/walk overlaps match the previous full audit. Adult index and menu findings were left alone.
