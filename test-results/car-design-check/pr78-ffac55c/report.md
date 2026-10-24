# 370Z design check

Target `HEAD` `ffac55c16407` · PR 78 ffac55c

Result: **FAIL**

Bar: `docs/CAR-DESIGN-CHECK.md`. Close copies match his 370Z from every angle. Wheels are real wheels. No 160 px bake. Far cars may be simpler. The frame stays cheap.

## 1. Close shape, paint, and light

- **Close copy does not match his Z** `close-shape`
  rear: Silhouette does not match his Z (IoU 0.40). side: Silhouette does not match his Z (IoU 0.52). three: Silhouette does not match his Z (IoU 0.26).
  Shots: shots/close-rear.png, shots/close-side.png, shots/close-three.png

## 2. Wheels

- **Traffic wheels are screen-space cards** `wheel-decal`
  world/traffic.js drawWheels composites a 16 px wheel picture in screen space (16×16). The card faces the camera. Squashing it does not put a tire in the wheel well, and it does not steer about the vertical axle.
  Shots: shots/close-rear.png, shots/close-front.png, shots/close-side.png, shots/close-three.png

## 3. Resolution

- **Close traffic bake is 160 px** `bake-px`
  shared/traffic-tune.js spritePx is 160. A close copy of the 370Z has to be at least 256 px at the source. A 160 px bake reads smeared once the chase camera stretches it.
  Shots: shots/close-rear.png, shots/close-front.png, shots/close-side.png, shots/close-three.png
- **Close picture is coarse on screen** `bake-visual`
  rear: The copy is smeared. Edge detail is 26% of his Z. front: The copy is smeared. Edge detail is 29% of his Z.
  Shots: shots/close-rear.png, shots/close-front.png

## 4. Far LOD

Far shots are recorded. A simpler shape is allowed there.

## 5. Frame cost

Pass.

## Shots

| View | Range | Result |
| --- | --- | --- |
| rear | close | FAIL |
| front | close | FAIL |
| side | close | FAIL |
| three | close | FAIL |
| rear | far | pass |
| front | far | pass |
| side | far | pass |
| three | far | pass |

## FPS probe

Twelve close copies, cache warmed in 988 ms. Median frame 267.2 ms with them, 211.7 ms without. Delta 55.5 ms. Sample spread 79.6 ms. Gate: a stable delta above 3.5 ms. Software GL, 4× CPU, five pairs. This is not a Galaxy measurement.
The spread of the five pairs is larger than the delta, so this probe does not fail the frame.

GL: WebKit WebGL / WebKit
