<!-- CAR-DESIGN-CHECK -->

**370Z design check: FAIL**

`HEAD` `b99040c722bd` · PR 78 b99040c

- **Rule 1 — Close copy does not match his Z.** rear: Silhouette does not match his Z (IoU 0.41). three: Silhouette does not match his Z (IoU 0.27).
- **Rule 2 — Wheel marks face the camera.** rear: 2 extra round silver marks. From this angle a real wheel is thin, not a star facing the lens.

Sheets show his Z and the traffic copy in the same frame, then zoomed. Nearest-neighbor zoom keeps a coarse bake blocky.

- `close-rear.png` close rear — FAIL
- `close-front.png` close front — pass
- `close-side.png` close side — pass
- `close-three.png` close three — FAIL
- `far-rear.png` far rear — pass
- `far-front.png` far front — pass
- `far-side.png` far side — pass
- `far-three.png` far three — pass

Standard: `docs/CAR-DESIGN-CHECK.md`. Checker: `node tools/car-design-check.mjs --review`.