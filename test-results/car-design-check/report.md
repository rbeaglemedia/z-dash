# 370Z design check

Target `cursor/traffic-option-b-2bdb` `b99040c722bd` · pr-78

Result: **FAIL**

Bar: `docs/CAR-DESIGN-CHECK.md`. Close copies match his 370Z from every angle. Wheels are real wheels. No 160 px bake. Far cars may be simpler. The frame stays cheap.

## 1. Close shape, paint, and light

- **Close copy does not match his Z** `close-shape`
  rear: Silhouette does not match his Z (IoU 0.42). three: Silhouette does not match his Z (IoU 0.27).
  Shots: shots/close-rear.png, shots/close-three.png

## 2. Wheels

Pass.

## 3. Resolution

Pass.

## 4. Far LOD

Far shots are recorded. A simpler shape is allowed there.

## 5. Frame cost

Pass.

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

Twelve close copies, cache warmed in 1511 ms. Median frame 334.4 ms with them, 314.7 ms without. Delta 19.7 ms. Sample spread 66 ms. Gate: a stable delta above 3.5 ms. Software GL, 4× CPU, five pairs. This is not a Galaxy measurement.
The spread of the five pairs is larger than the delta, so this probe does not fail the frame.

GL: WebKit WebGL / WebKit
