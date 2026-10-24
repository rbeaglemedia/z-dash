# Neon World phone FPS bisect (Oct 22 night through v27)

Phone viewport 844×390, deviceScaleFactor 3, touch. Game canvas stayed **1688×780, DPR 2** on v17, v19, v25, v27, and this branch. The iPad pixel cap and the PC 1280×720 cap do not apply.

Headless Chrome is software WebGL. The player car sprite readback is ~30 ms of a ~38 ms open-air frame in every version, including v17, so raw FPS here cannot show a 100 fps phone. Pass timings and stroke counts are the signal. `getImageData` flush includes deferred 2D work.

## City-only flush (car and traffic stubbed), open air above the sky tower

| rev | sha | air flush |
|---|---|---|
| pre-detail | 5c52bb4 | 9.3 ms |
| detail merge | 75ceafe | 9.4 ms |
| v16 windows kept on the wall | 349255d | 11.7 ms |
| v17 Oct 22 night | 9d947a3 | 12.0 ms |
| v19 on-foot / finer traffic | 2b26be2 | 13.2 ms |
| v27 | 8777eb8 | 13.4 ms |

v16 (`67a9292` / `349255d`) is the largest always-on city step. Removing those windows would change the buildings, so they stay.

## Same harness, car and traffic live (sprite skip already at every 2nd frame because this VM is under 30 fps)

| rev | air flush | air blur strokes | wall flush | wall blur | wall player redraws / frame |
|---|---|---|---|---|---|
| v17 9d947a3 | 36.9 ms | 22 | 48.1 ms | 108 | 0.56 |
| v19 2b26be2 | 37.3 ms | 9 | 54.3 ms | 98 | 0.61 |
| v27 8777eb8 | 37.8 ms | 9 | 54.1 ms | 98 | 0.63 |
| this branch | 41.1 ms | 9 | 45.4 ms | 9 | 0.52 |

Hot Drop, crew JS, HUD, and the on-foot button sync were under 0.1 ms. Open-air canvas time did not grow from v17 to v27.

## What actually got expensive

- **Near a big face, shadow strokes leave the screen.** At the sky tower, v17 and v27 both emit ~5,000 off-screen `shadowBlur` line segments in 0.8 s (max coordinate ~220,000 px) and ~620 on-screen. Software Skia clips those before the blur, so the flush barely moves. A phone GPU does not. The screen clip already on this branch keeps 612 on-screen segments and drops the off-screen count to 28 (max 1,688, the horizon).
- **v19 `2b26be2` traffic.** `bakePerFrame` 1→2, yaw step 22.5°→15°, and `cache.clear()` at 140 keys. A traffic bake also zeroed the shared GL buffer size, and the player sprite treated that as a resize, so it redrew on the skip frame. While turning: v17 0.05 bakes/frame and 0.51 player redraws/frame; v27 0.27 bakes/frame and 0.59 player redraws/frame.
- **The sprite skip dead band.** The car redraws every frame above 50 fps and only skips below 50, then turns the skip off again above 58. A phone sitting at 57 never skips, and one faster frame turns the skip back off. `drawZ` is the dominant pass in this VM (~30 ms). The skip is the existing "same look" path (blit the previous sprite for one frame).

## Fixes on this branch

- Screen-clip off-screen edges (already committed, `f9afe86`).
- Ignore a traffic bake's buffer resize when deciding to redraw the player sprite.
- Evict the oldest traffic sprite instead of clearing the cache. A sprite still in the cache is the same bitmap.
- Arm the every-other-frame car sprite below 58 fps, and leave it on until the rate stays above 115. Buildings, HUD, and the blitted sprite are unchanged.
