# 370Z design check

Target `cursor/traffic-option-b-2bdb` `5baec7871071` · pr-78

Result: **PASS**

Bar: `docs/CAR-DESIGN-CHECK.md`. Close copies match his 370Z from every angle. Wheels are real wheels. No 160 px bake. Far cars may be simpler. The frame stays cheap.

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

Twelve close copies, cache warmed in 1289 ms. Median frame 331.1 ms with them, 331.7 ms without. Delta -0.6 ms. Sample spread 44 ms. Gate: a stable delta above 3.5 ms. Software GL, 4× CPU, five pairs. This is not a Galaxy measurement.
The spread of the five pairs is larger than the delta, so this probe does not fail the frame.

GL: WebKit WebGL / WebKit
