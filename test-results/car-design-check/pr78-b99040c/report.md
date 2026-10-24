# 370Z design check

Target `HEAD` `b99040c722bd` · PR 78 b99040c

Result: **FAIL**

Bar: `docs/CAR-DESIGN-CHECK.md`. Close copies match his 370Z from every angle. Wheels are real wheels. No 160 px bake. Far cars may be simpler. The frame stays cheap. Every copy loads the same GLB file and path as the player and the garage.

## 1. Close shape, paint, and light

- **Close copy does not match his Z** `close-shape`
  rear: Silhouette does not match his Z (IoU 0.41). three: Silhouette does not match his Z (IoU 0.27).
  Shots: shots/close-rear.png, shots/close-three.png

## 2. Wheels

- **Wheel marks face the camera** `wheel-visual`
  rear: 2 extra round silver marks. From this angle a real wheel is thin, not a star facing the lens.
  Shots: shots/close-rear.png

## 3. Resolution

Pass.

## 4. Far LOD

Far shots are recorded. A simpler shape is allowed there.

## 5. Frame cost

Pass.

## 6. Same GLB file and path

Pass. `shared/assets/370z-glb.js` loaded as `assets/370z.glb`, sha256 `fdba257f6422` (1800836 bytes). The player Z, Garage 370Z, and the traffic copy use that file and that path. Runtime buffer matches.

## Shots

| View | Range | Result |
| --- | --- | --- |
| rear | close | FAIL |
| front | close | pass |
| side | close | pass |
| three | close | FAIL |
| rear | far | pass |
| front | far | pass |
| side | far | pass |
| three | far | pass |

## FPS probe

Twelve close copies, cache warmed in 1007 ms. Median frame 300.3 ms with them, 249.2 ms without. Delta 51.1 ms. Sample spread 149.9 ms. Gate: a stable delta above 3.5 ms. Software GL, 4× CPU, five pairs. This is not a Galaxy measurement.
The spread of the five pairs is larger than the delta, so this probe does not fail the frame.

GL: WebKit WebGL / WebKit
