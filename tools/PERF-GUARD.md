# PERF-GUARD

Headless Chrome regression bench for Neon World. It is test-only: it does not add a script, a flag, or a branch to the game, so play cost stays zero.

Software GL (`--disable-gpu`, SwiftShader) times are **relative to the machine that ran the bench**. They are not a Galaxy, a phone, or an iPad A10 frame rate. The same commit on a different CPU will not match these milliseconds. The tool scales frame times when the CPU calib is within 2× of the baseline, and it skips the frame-time gates when the machines are further apart. Flicker and steady heap growth still count.

## What it runs

Pages: `world-split.html`. `world.html` is the same file today (the bench checks the bytes and runs both if they ever diverge). `jr.html` is the Kid App shell, sampled on the phone viewport.

Viewports:

| Name | CSS | DPR asked | CPU | Touch |
| --- | --- | --- | --- | --- |
| phone | 844×390 | 2 | none | yes |
| ipad | 1024×768 | 2 | ×4 stand-in for an A10 | yes |
| pc | 1280×720 | 1 | none | no |

The game may still cap the iPad buffer (on main that cap is DPR 1). The row records the buffer that was actually used.

Scenes, pinned from the outside so the game source stays untouched:

| Id | What |
| --- | --- |
| air | Wings-open flight in the open air south of the city |
| face | Sky-tower west face filling the view (car at x=452, y=36, z=1200, looking east) |
| shops | City Builder HQ (car at x=186, y=8, z=1836, yaw 0, wings open) |
| drive | Street drive north on the downtown road at x=250 |
| house | Inside Ellie's spawn HOME with the room item buttons open |
| closet | Same room. Clicks a closet / wardrobe control when the page has one. Until then it opens the furniture item list (`furniture-drill`) |

Frame ms is the time spent inside the animation callbacks for that frame. The house loop and the city loop both get counted when they share a frame. Median, 1% low (mean of the slowest 1% of frames), and max are recorded, plus DOM nodes and rAF rate.

Flicker is a separate pass. It downscales the game canvases (`#cback`, `#cgl`, `#c`, or the room canvas when the interior is up) and flags a frame where a large region goes blank for one frame or flashes and comes back.

Heap is a 3-minute open-air flight on the phone viewport, sampled every 5 seconds. It fails when each third of the flight is higher than the last and the end does not fall back (a cache that fills and then sits still, or a GC sawtooth, does not fail).

## Fail rules

Against `tools/perf-guard-baseline.json`:

- median frame work worse by more than 5%
- 1% low worse by more than 10%
- any flicker frame
- steady heap growth

`enforce` in that JSON is **false** until the FPS work in PR #56 lands and the baseline is refreshed. While it is false, the GitHub job posts the PERF-GUARD comment and does **not** fail the check, so in-progress FPS and WebGL branches are not blocked. Set `"enforce": true` after the refresh to make the job fail on a regression. `--strict` does that for one local run. `--measure` always exits 0.

A crashed bench (Chrome missing, page did not boot) still exits 1.

## How other agents run it

From a checkout of the branch you want to measure. Node 22+. Chrome on `PATH`, or `CHROME=/path/to/google-chrome`.

```bash
# Short loop while you are changing the game. Always exit 0. 20s heap.
node tools/perf-guard.mjs --quick --measure

# One scene, one viewport, no heap.
node tools/perf-guard.mjs --quick --measure --heap-ms 0 --viewport phone --only air,face

# Before / after on YOUR machine (this is the comparison that matches).
node tools/perf-guard.mjs --quick --measure --out /tmp/before.json
# ... switch to the other branch, or point at the hidden preview ...
node tools/perf-guard.mjs --quick --measure --baseline /tmp/before.json --out /tmp/after.json

# The in-progress FPS preview that lives at /test (do not edit those files).
node tools/perf-guard.mjs --quick --measure --page test/world-split.html --baseline tools/perf-guard-baseline.json

# WebGL prototype, when that branch is checked out. Default play stays 2D.
node tools/perf-guard.mjs --quick --measure --page world-split.html

# Full 3-minute heap, all scenes, all viewports. This is what CI runs.
node tools/perf-guard.mjs

# Replace the committed baseline. Keeps the current "enforce" flag.
node tools/perf-guard.mjs --write-baseline

# Offline compare of two saved runs.
node tools/perf-guard.mjs --compare before.json after.json

node tools/perf-guard.mjs --self-test
```

`--force-host` applies the 5% / 10% gates even when the CPU calib does not match the baseline. Use that only when you know the two runs are comparable.

Do not edit `world/boot.js`, `world/camera.js`, `world/city-draw.js`, `world/house.js`, `world/traffic.js`, `shared/car-draw.js`, or the WebGL files from PR #59 to make a number move. The bench drives the existing globals (`P`, `CITY`, `WALK_MODE`, `openGarage`).

## Refresh after the FPS fixes merge

1. Check out the merged main.
2. `node tools/perf-guard.mjs --write-baseline`
3. Confirm closet rows say `closet-node` or `closet-button` if a closet control exists, and that flicker counts are 0.
4. Set `"enforce": true` in `tools/perf-guard-baseline.json`.
5. Open a PR. The next PERF-GUARD run fails the job on a regression.

If GitHub's runner is a different CPU than the machine that wrote the file, download the `perf-guard` artifact and use that JSON as the baseline so the frame-time gates are not scaled.

## CI

`.github/workflows/perf-guard.yml` runs on every pull request, uploads `test-results/perf-guard-pr.json`, and posts or updates one `<!-- PERF-GUARD -->` comment with the pass/fail table.
