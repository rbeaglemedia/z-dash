<!-- CAR-DESIGN-CHECK -->

**370Z design check: PASS**

`cursor/traffic-option-b-2bdb` `5baec7871071` · pr-78

Close copies match his 370Z on shape, wheels, resolution, and frame cost. Far LODs are allowed to be simpler.

Sheets show his Z and the traffic copy in the same frame, then zoomed. Nearest-neighbor zoom keeps a coarse bake blocky.

- `close-rear.png` close rear — pass
- `close-front.png` close front — pass
- `close-side.png` close side — pass
- `close-three.png` close three — pass
- `far-rear.png` far rear — pass
- `far-front.png` far front — pass
- `far-side.png` far side — pass
- `far-three.png` far three — pass

Standard: `docs/CAR-DESIGN-CHECK.md`. Checker: `node tools/car-design-check.mjs --review`.