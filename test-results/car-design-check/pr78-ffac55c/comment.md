<!-- CAR-DESIGN-CHECK -->

**370Z design check: FAIL**

`HEAD` `ffac55c16407` · PR 78 ffac55c

- **Rule 3 — Close traffic bake is 160 px.** shared/traffic-tune.js spritePx is 160. A close copy of the 370Z has to be at least 256 px at the source. A 160 px bake reads smeared once the chase camera stretches it.
- **Rule 2 — Traffic wheels are screen-space cards.** world/traffic.js drawWheels composites a 16 px wheel picture in screen space (16×16). The card faces the camera. Squashing it does not put a tire in the wheel well, and it does not steer about the vertical axle.
- **Rule 1 — Close copy does not match his Z.** rear: Silhouette does not match his Z (IoU 0.40). side: Silhouette does not match his Z (IoU 0.52). three: Silhouette does not match his Z (IoU 0.26).
- **Rule 3 — Close picture is coarse on screen.** rear: The copy is smeared. Edge detail is 26% of his Z. front: The copy is smeared. Edge detail is 29% of his Z.

Sheets show his Z and the traffic copy in the same frame, then zoomed. Nearest-neighbor zoom keeps a coarse bake blocky.

- `close-rear.png` close rear — FAIL
- `close-front.png` close front — FAIL
- `close-side.png` close side — FAIL
- `close-three.png` close three — FAIL
- `far-rear.png` far rear — pass
- `far-front.png` far front — pass
- `far-side.png` far side — pass
- `far-three.png` far three — pass

Standard: `docs/CAR-DESIGN-CHECK.md`. Checker: `node tools/car-design-check.mjs --review`.