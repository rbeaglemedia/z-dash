# Neon World resolution audit

Kid app only (`world.html`, `world-split.html`, and the hidden `/test` preview). Adult `index.html` was not changed. Nothing here was deployed or merged.

Headless Chrome (SwiftShader), one browser, four viewports. The animation loop was stepped one frame at a time so a software-GL city could not run away. Screenshots are the first presented frame with the start card hidden. `?perf=1` draws the `#zRes` overlay (top left). PR 56's `#zPerf` box is unchanged.

## What was over the cap

The city canvas was already inside its rule. The 370Z was not.

`X.render` sized the shared WebGL canvas as logical sprite pixels times `min(devicePixelRatio, 2)`. On an iPad the city is DPR 1, so the car was 2× per side (4× the pixels) of the image actually drawn on the city. The `/test` preview also warmed that same canvas at 64×64, which is 128×128 after the extra DPR. The next real frame jumped it to 1024×1024. That is the low-res-then-sharp snap: a small GL bitmap, then a resize. A touch or a later frame was enough to present the sharp copy.

## Measured backing stores

Cap is 1440×1080 = 1,555,200 pixels, except desktop (not in this table) at 1280×720. "Raw" is the old car buffer: logical size rounded to 16, times `min(devicePixelRatio, 2)`.

| Viewport | devicePixelRatio | City CSS | City backing before | Car GL before | City backing after | Car GL after | Violations |
| --- | --- | --- | --- | --- | --- | --- | --- |
| iPad 1180×820, touch, iPad UA | 2 | 1180×820 | 1180×820 (DPR 1) | 1024×1024 (`_d` 2, logical 512) | 1180×820 (DPR 1) | 512×512 (`_d` 1) from frame 0 | 0 |
| iPad rotated 820×1180 | 2 | 820×1180 | 820×1180 | 1120×1120 | 820×1180 | 560×560 | 0 |
| Galaxy 412×915, touch | 3 | 412×915 | 824×1830 (DPR 2) | 1120×1120 | 824×1830 (DPR 2) | 1120×1120 | 0 |
| Galaxy rotated 915×412 | 3 | 915×412 | 1830×824 | 512×512 | 1830×824 | 512×512 | 0 |
| Phone 480×1040, touch | 3 | 480×1040 | 960×2080 (1,996,800 px) | 1120×1120 | 847×1835 (DPR 1.764, 1,554,245 px) | 992×992 | 0 |
| `/test` iPad warm-up, then first frame | 2 | 1180×820 | warm 128×128, then 1024×1024 | same | warm 512×512, first frame stays 512×512 | same | 0 |

Input (pointer + touch) did not change any of these sizes. The iPad city is under the area cap, so it is not scaled down. `raw` on the iPad overlay stays 1024 and `budget` stays 512, which is the old overshoot shown next to the clamped buffer.

## Galaxy flicker

A Galaxy-like DPR of 3 does not add a second multiply on the car. Both the city and the old sprite path already stop at 2. 412×915 at DPR 2 is 1,507,920 pixels, just under 1,555,200. The car's 1120×1120 buffer is 560 CSS pixels times that same DPR 2, so it matches the city. The dips and flicker are not this overshoot. A taller phone (480×1040) did exceed the cap at DPR 2; that path now drops to DPR 1.764 so the backing stays inside 1440×1080.

## Offscreen canvases

- Traffic sprites stay 160×160. Logged against that budget, not resized.
- Tow-truck sheets stay 7680×336. That is an atlas. Clamping it to the screen would break the cells. It is logged against an 8192×4096 ceiling and left alone.
- Minimap bake is about 1156×1292, under a 1440×1440 note. Not a screen view, so it is not scaled to the viewport.
- Neon studio and the wall canvas no longer multiply DPR twice. The GL copy uses `pixelRatio: 1` and `maxBuf` equal to the 2D canvas, and that canvas goes through the same area cap.
- Dance stage and the walk-room canvas use the same view budget when `res.js` is loaded.
- Flame sprites stay 64×64.

## What "full quality" means here

The first frame is 1:1 with the capped city canvas. On the iPad that is DPR 1, so the car is not a 2× retina sprite sitting on a 1× city. Raising the city to device DPR 2 would put a 1180×820 screen at 2360×1640, which is past the 1440×1080 cap and is the cost the iPad cap exists to avoid.

## Guard

`world/res.js` (and `test/world/res.js`) plans the budget, clamps the city buffer on every resize, and clamps any on-screen canvas that is over its view budget. WebGL is resized with `setPixelRatio` / `setSize` only. Assigning `canvas.width` on the live car canvas would drop the context. A violation is `console.warn` once per signature and stored on `window.ZRES.log`. The car blit refuses a GL buffer shorter than the budget, so a 64px warm-up cannot be stretched across the car. When the GL size does change, that frame is rendered twice with `gl.finish()` between them.

`?perf=1` shows devicePixelRatio, applied DPR, CSS size, `#c` backing, plan, cap, car blit, GL backing, `drawingBuffer`, raw vs budget, and the parse / load / input / resize samples.
