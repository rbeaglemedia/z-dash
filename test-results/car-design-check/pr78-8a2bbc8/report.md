# 370Z design check

Target `HEAD` `8a2bbc8d9475` · PR 78 8a2bbc8

Result: **PASS**

Bar: `docs/CAR-DESIGN-CHECK.md`. Close copies match his 370Z from every angle. Wheels are real wheels. No 160 px bake. Far cars may be simpler. The frame stays cheap. Every copy loads the same GLB file and path as the player and the garage.

## 1. Close shape, paint, and light

Pass.

## 2. Wheels

Pass.

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
| rear | close | pass |
| front | close | pass |
| side | close | pass |
| three | close | pass |
| rear | far | pass |
| front | far | pass |
| side | far | pass |
| three | far | pass |

## FPS probe

Twelve close copies, cache warmed in 1294 ms. Median frame 338.9 ms with them, 345.2 ms without. Delta -6.3 ms. Sample spread 186 ms. Gate: a stable delta above 3.5 ms. Software GL, 4× CPU, five pairs. This is not a Galaxy measurement.
The spread of the five pairs is larger than the delta, so this probe does not fail the frame.

GL: WebKit WebGL / WebKit
