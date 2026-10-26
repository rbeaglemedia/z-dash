# Kid App and adult Z-DASH split

Plan only. No product code in this change. Nothing here deploys. Live `index.html`, live `jr.html`, and live `sw.js` stay as they are until Bob writes "plan approved, build it" and, later, a separate yes for deploy.

Measured on live `main` at `f6678f4` (cache name world33), 24 Oct 2026. Local headless Chrome only. The phone was not in this run.

## Plain English

Ellie and Bob already look like two apps (Z-DASH JR and Z-DASH), but they are one website. The kid home page, `jr.html`, is a full second copy of the adult driver app with Passenger Mode painted on top. The gear on that page opens the adult settings panel. The one service worker precaches both HTML files, about 15.3 MB, and its scope is the whole site.

Neon World's dips to about 25 fps on the phone come from inside Neon World. `world.html` loads no OBD, Spotify, Bluetooth, or adult settings object. A local test that added an empty driver stub left the frame times in the same place: worst frame 150.1 ms both times, 1% low 6.7 fps both times. The frames are spent on the city, the car draw, and the glow.

The driver code does cost the Kid App, on the home screen Ellie opens first. That page parses a 7.6 MB script, holds about 42.5 MB of JavaScript heap, and arms the simulated-OBD loop (every 16 ms), the music beat (every 20 ms), the track progress (every 200 ms), the Spotify poll (every 4 s), and the passenger-link watchdog (every 500 ms) before a drive starts. The unmerged kid preview (PR #83) already drops that home screen to about 2.3 MB of heap and 172 ms to DOMContentLoaded. That preview is not what the phone is running.

The split stays the top job: two installs, driver code gone from the kid app, Ellie's saves left untouched, kid settings with no OBD or Spotify, and a way back from every step. That is a home-screen and correctness win. Neon World frame time stays a separate job, and this plan leaves the renderer alone.

## What the adult driver code costs the Kid App right now

### Neon World (`world.html`) — driver code is already absent

| | As-is |
| --- | ---: |
| Scripts | 70 |
| Script bytes (decoded) | 6,457,770 |
| DOMContentLoaded | 3,148 ms |
| `setInterval` running | 4 (250 ms, 250 ms, 400 ms, 1,000 ms) |
| `setTimeout` | 3 |
| `requestAnimationFrame` | 1 loop, in `world/boot.js`, which calls `render()` every frame even before flying |
| Event listeners | 130 |
| `fetch` | 22, all `data:` image URLs |
| WebSocket | 0 |
| `bluetooth.requestDevice` | 0 |
| Spotify / OBD / Bluetooth URLs | 0 |
| Heap during the 6 s sample | 40.1 MB → peak 51.1 MB → 34.2 MB |
| Heap drops bigger than 2 MB | 9, about 79 MB total (a sawtooth, not a precise GC log) |

A search of those 70 scripts found no `OBDLink`, `zdash.spotify`, `navigator.bluetooth`, `accounts.spotify`, or `ZD.Settings`.

The four timers are kid-world code, not the driver:

- `world/neon-paint.js` — two 250 ms hook retries, started at load
- `world/house.js` — `setInterval(walkLockEnter, 400)`
- `world/dance-stage.js` — 1,000 ms `hookWalk`

`render()` also blurs the horizon line and the rings (`shadowBlur`). That glow is inside the frame. It is not part of this split.

Largest scripts on the page: `shared/assets/370z-glb.js` 2,401,140; `shared/car-model.js` 695,287; six traffic models about 230–277 KB each; `world/dance-stage.js` 146,401; `world/neon-paint.js` 123,153; `world/icon-garage.js` 104,496.

There is no separate V8 parse/compile number. DOMContentLoaded is the stand-in: about 3.1 s to parse and run those 6.5 MB of scripts on this machine.

### Kid home (`jr.html`) — this is where the driver code sits

Live `jr.html` is 7,599,682 bytes. Almost all of the driver is inline. The only external scripts are `shared/version.js`, `shared/ipad.js`, and `world/neon-paint.js`.

Source counts inside that file: `setInterval` 13, `requestAnimationFrame` 12, `addEventListener` 289, `setTimeout` 51, the word `bluetooth` 4, `spotify` 28, `OBD` 61, `fetch(` 7.

Idle on the menu for 2.5 s (no drive started):

| | Live kid home | PR #83 preview (`/test/`, not live) |
| --- | ---: | ---: |
| DOMContentLoaded | 456 ms | 172 ms |
| JavaScript heap | 42.5 MB | 2.3 MB |
| Intervals armed | 8 | 1 (300 ms preview cache scrub) |
| Listeners | 231 | 128 |
| `fetch` / WebSocket / Bluetooth calls | 0 / 0 / 0 | 0 / 0 / 0 |
| Gear title | Settings (turn Passenger Mode off here) | Settings |
| Kid settings panel `#kSet` | absent | present |
| Adult `#settings` node | in the page | still in the page, hidden |

Intervals armed on the live menu, and where they come from:

| Every | What |
| ---: | --- |
| 16 ms | Simulated OBD source (`SimSource` in the adult block). It starts on its own. |
| 20 ms | Music beat tick |
| 200 ms | Music progress |
| 250 ms ×2 | `world/neon-paint.js`, which `jr.html` loads on the home screen |
| 500 ms | Passenger-link watchdog |
| 4,000 ms | Spotify poll (returns immediately unless Spotify is the music source and connected) |
| 30 min | Service-worker update check |

The adult draw loop is also still scheduled while Passenger Mode is up. It skips drawing Dad's screens and keeps the driver data path running (`requestAnimationFrame(loop)` under `body.kidon`).

No Spotify, OBD, or Bluetooth request left the machine during that idle window. The timers are armed anyway, and the Bluetooth and Spotify functions are already parsed.

### Service worker precache

`sw.js` precaches these files on install. Sum is **15,351,539 bytes**:

| File | Bytes |
| --- | ---: |
| `index.html` | 7,462,115 |
| `jr.html` | 7,599,682 |
| both manifests | 1,395 |
| eight icons | 288,347 |

`world.html`, `world/`, and `shared/` are not in that list. They use a second cache (`world-split-v` + the world number), network-first, 2.5 s timeout. Off-site URLs (Spotify included) skip the worker. Once Neon World is on screen, those two HTML files are not on the frame loop. They are an install and memory cost: the kid install downloads the adult app too, because both pages register the same worker at scope `/`.

## Frame times: Neon World as-is vs driver stubbed

Local test build only. Not committed. Headless Chrome, software GL (SwiftShader), viewport 844×390, device pixel ratio 1. Warmup frames discarded, then about 6 seconds. This GPU is not the phone, so the fps numbers are a stand-in. The useful part is the comparison. Bob's ~25 fps dips were not re-shot on hardware.

The stub page is live `world.html` plus one extra script, `driver-stub.js` (294 bytes), loaded before `shared/car-model.js`. The stub sets `window.__DRIVER_STUB = { obd:false, spotify:false, bluetooth:false, settings:false }` and does nothing else. There was no driver bundle on the page to remove. Page errors: none on either run.

| | As-is | Driver stub |
| --- | ---: | ---: |
| Frames | 103 | 98 |
| Mean | 61.32 ms (16.3 fps) | 62.75 ms (15.9 fps) |
| p50 | 66.6 ms | 66.7 ms |
| p95 | 116.7 ms | 133.3 ms |
| p99 | 150.0 ms | 150.1 ms |
| Worst | 150.1 ms | 150.1 ms |
| 1% low | 6.7 fps (slowest 1% averaged 150.05 ms) | 6.7 fps (150.1 ms) |
| Scripts | 70 | 71 |

p95 is a real frame from the sample (rank `floor(0.95 × (n−1))`), not a smoothed estimate. 1% low is the average of the slowest `ceil(1%)` frames, turned into fps.

Histogram (frame time):

| Frame time | As-is | Driver stub |
| --- | ---: | ---: |
| under 8 ms | 0 | 0 |
| 8–16.7 ms (60 fps or faster) | 19 | 24 |
| 16.7–33 ms | 15 | 6 |
| 33–50 ms | 8 | 9 |
| 50–100 ms | 40 | 42 |
| 100 ms and slower | 21 | 17 |

Heap sawtooth on the stub run: 39.9 MB → peak 51.2 MB → 41.6 MB, 8 drops over 2 MB (about 64 MB). Same shape as the as-is run. Listeners stayed 130. The same four intervals stayed. Spotify, OBD, and Bluetooth URLs stayed empty.

The p95 move (117 ms to 133 ms) is sample noise on a software GPU. Worst frame and 1% low match. Stubbing the driver does not move Neon World frames, because those frames never ran driver code.

## Split steps, ranked by expected Neon World FPS gain

Expected gain is for Neon World frame time. The home-screen win is listed in the same row so it is not lost.

1. **Stop the kid install from precaching the adult app.** One worker, scope `/`, stores `index.html` and `jr.html` together (15.3 MB). That can pressure phone memory when the kid app is installed. It is not on the Neon World frame loop once the world is running, so the expected steady fps gain is small and was not measured as a frame-time change. This is the only split step with a plausible indirect link to a memory-starved dip.

2. **Cut OBD, Spotify, Bluetooth, the sim source, the passenger link, and the driver screens out of the kid home.** Measured home-screen cost: 7.6 MB parsed, 42.5 MB heap, 456 ms to DOMContentLoaded, and the 16 / 20 / 200 / 500 / 4,000 ms timers above. PR #83's preview already shows 2.3 MB and 172 ms. Expected Neon World fps gain: none. The histogram above is that result.

3. **Stop loading `world/neon-paint.js` on the kid home.** That file is why the home screen grows two 250 ms timers before Ellie opens the paint studio. Neon World still needs the file, so world frame time does not change. Small home-screen win.

4. **Kid-only settings, with the adult panel gone from the kid page.** Fixes the live gear, which still opens adult settings. Expected fps gain: none. PR #83 hides the adult panel and leaves the node in the DOM. This step removes it from the kid bundle.

5. **Zero background connections on the kid app.** This is the check after steps 2–4: no Bluetooth, no Spotify, no OBD, no sim loop, no passenger-link socket. Neon World is already clean. The world timers in the first table stay; they are kid code (paint hooks, house walk lock, dance hook), and this plan does not retune them.

6. **Two store apps, each with its own manifest scope and its own worker.** Correctness and install size. Frame-time gain is the precache item in step 1, not a second gain.

7. **Carry Ellie's saves across without rewriting them.** Required for the store split. Frame-time gain: none. Data-loss risk is why it is early in the build order below.

8. **One shared 370Z file so one model update reaches both apps.** Neon World already loads a single copy (`shared/assets/370z-glb.js`). Removing the extra copies from the two HTML files shrinks those files and the precache. It does not remove the 2.4 MB parse from Neon World. Blocked until Bob says the copies may be merged. Frame-time gain on Neon World: none.

Work that would move Neon World frames, and is **not** a split step: the world `render()` path (car readback, city, traffic, `shadowBlur` on the horizon and rings). That is where a phone dip to ~25 fps has to be. It stays parked. This plan does not start it, does not retune `zRate`, and does not bring back the DOM car composite.

## Build order

FPS rank is above. Build order is safety first. Every step is its own pull request, under `/test/` first. Live files stay untouched until a later deploy yes.

1. Land the kid settings path and then delete the adult settings markup from the kid bundle (finish what PR #83 started). Gear opens the kid panel only.
2. Cut the driver block out of the kid bundle: OBD, Spotify, Bluetooth, sim source, passenger link, driver screens. Kid menu, Neon World, and the save reads stay.
3. Give the `/test/` kid preview a worker that does not precache `index.html` or the adult icons.
4. Read-only save check: the keys below still parse, and nothing in the kid bundle writes a new shape or deletes a key.
5. Leave all three 370Z copies in place until Bob says yes.
6. Two store listings are a later decision (hosting and store accounts). Not part of the first build.

`index.html` is not in any of these diffs. Live `jr.html`, live `sw.js`, and `world/phys-ground.js` are not either.

## Rollback

Each step is one commit on its own branch. Rollback is reverting that commit. `/test/` returns to the previous preview. Live `main` is unchanged by the build, so production rollback of an unreleased step is "do nothing".

`index.html` is never edited, so the adult app cannot be broken by a kid-step revert.

No step deletes `localStorage`. A revert cannot wipe Ellie's saves, because the saves are not in the commit.

The 370Z step, when it exists, restores the three copies from git in the same revert. The adult inline copy is not deleted in the commit that first points the adult loader at a shared file.

PR #83 (`cursor/kid-lazy-driver-9e5c`, head `ed0adff`, https://github.com/rbeaglemedia/z-dash/pull/83) stays open and unmerged until this plan is approved. Reverting it only moves `/test/` on that branch. It is not on the published site.

## Two store apps

They already have two names and two icon sets:

- Adult: `manifest.webmanifest`, name "Z-DASH · 370Z", `start_url` `./`, scope `./`
- Kid: `manifest-jr.webmanifest`, name "Z-DASH JR", `start_url` `./jr.html`, scope `./`

Both scopes are the whole site, and both pages register `sw.js` at `/`. A kid install can still open the adult page. That is the same hole as the gear bug.

Target, after approval, still on one origin so saves survive:

- Kid install starts at the kid home, scope limited to kid pages, worker precache is kid files only.
- Adult install starts at `index.html`, and does not need the kid pages in its precache.
- Store listings (Apple / Google) wait for a separate yes. This plan does not publish them.

A second origin would split `localStorage` and drop Ellie's saves on the floor. Do not do that. If a store wrapper ever forces a new origin, the kid app copies the keys below once, writes only missing keys, and never deletes the source.

## Step 1 — driver code leaves the Kid App

Out of the kid bundle: OBD adapter and code reader, Spotify connect and poll, Bluetooth, the 16 ms sim source, the passenger-link / QR share, driver settings, and the adult draw loop.

Stays: kid menu, Neon World, crew, dance, garage, paint, flight page, her name, sound, and the save keys.

PR #83 already lazy-loads some driver tiles on `/test/` and points the gear at `#kSet`. It does not remove the adult `#settings` node, and it is not live. Step 1 finishes that cut on `/test/` only.

## Saves

Same keys, same JSON shapes. The kid app reads them. It does not migrate them. DAD'S SHIFTS and the Garage Z car are fields inside `zdash.kid.v1` (`shifts`, and `eq`), not separate keys. `zdash.house.v1` is the house. Vinyls are `zdash_vinyls_v1`.

`zdash.ellie.builder.v1` does not appear anywhere in live source. Older builds may still have written it. Copy it if it is on the device. Never delete it.

Also leave these alone (they are hers or shared with her screens): `zdash.char.v1`, `zdash.pet.v1`, `zdash.petdance.v1`, `zdash.customdance.v1`, `zdash.crew.v1`, `zdash.dancestage.v1`, `zdash.neonpaint.v1`, `zdash.wallgraffiti.v1`, `zdash_neon_paint_v1`, `zdash.world.resume.v1`, `zdw_start`, `zdw_rwxray`, `zdash.music.vol`, `zdash.music.muted`, `zdash.lowdetail`, `zdash.wake`, `zdash.kidFps`.

Adult keys stay too, because both apps share one origin today: `zdash.spotify.*`, `zdash.obd.pids`, `zdash.adapter`, `zdash.fuel`, `zdash.codes`, `zdash.clutchSig`, and the rest of `zdash.*`. Cutting kid code must not clear them.

There is no units key. Both apps show MPH. Do not add `zdash.units`.

Her name on the kid home is `HI, ELLIE` plus the car name from `zdash.kid.v1`.

## 370Z model

Three copies, one payload. Base64 length 2,401,116. SHA-256 prefix `280c6e9da70e9bd0`. Head `Z2xURgIAAACE`.

| Copy | Who loads it | Live-paint shader `zLiv` |
| --- | --- | --- |
| `shared/assets/370z-glb.js` | Neon World (`world.html`) | through `shared/car-model.js` (yes) |
| inline in `jr.html` | Kid home, because the kid page embeds the adult bundle | yes (37 mentions) |
| inline in `index.html` | Adult app | no (0 mentions) |

The bytes match. The loaders do not. The adult loader has no `zLiv`. The kid inline loader and `shared/car-model.js` do. Merging the loaders would change how one of the apps paints the car.

Nothing is merged or deleted until Bob says yes.

When he does, the plan for one update reaching both apps is:

- Keep the GLB in `shared/assets/370z-glb.js` (that file already is the kid world's copy).
- Point the adult loader at that file in a later, separate change. Until that change, `index.html` keeps its inline copy and keeps working if the shared file moves.
- Leave the two loaders separate, so `zLiv` stays on the kid path only.
- Do not delete the inline copies in the same commit that retargets a loader. Prove the shared file loads, then delete on a follow-up that can be reverted on its own.

## Settings, and the live gear

Live `jr.html` (and `main`'s `test/jr.html`) does this:

`$('#kGear')` click → `ZD.Settings.toggle()`, which opens `#settings`. The gear's title is "Settings (turn Passenger Mode off here)".

That is the PR #83 gap. The fix is on branch `cursor/kid-lazy-driver-9e5c` at `ed0adff`, pull request #83, and it only edits `/test/`. It has not merged, so the published kid app still opens the adult panel. On that preview the gear opens `#kSet` ("HI, ELLIE", her car name, sound, volume, MPH, low detail, keep screen on) and does not call `kidLoad('adult')`. The adult panel is still in the HTML, hidden with `body.kidon #settings { display:none }`.

Shared with the adult app, same keys, kid screen writes them itself: `zdash.music.vol`, `zdash.music.muted`, `zdash.lowdetail`, `zdash.wake`. Her name and car name come from `zdash.kid.v1`.

Kid screen does not show OBD, Spotify, Bluetooth, driver layout, or connection setup.

This plan's settings step removes the adult panel from the kid bundle so a hidden node cannot be opened, and keeps the shared keys above.

## Zero background connections

After the cut, the kid home and Neon World must show, in a repeat of this probe:

- `bluetooth.requestDevice` calls: 0
- Spotify and OBD URLs: 0
- WebSockets: 0
- no 16 ms sim interval, no 4 s Spotify poll, no 500 ms link watchdog, no 20 ms beat interval unless she is in a kid screen that needs sound

The service worker's 30-minute update check can stay. It must not fetch `index.html` for the kid install.

Neon World's 250 / 400 / 1,000 ms timers are in-world kid hooks. They are not driver connections. They are listed so a later fps pass can see them. This plan does not change them.

## Adult driver screens

`index.html` stays the adult app: OBD, Spotify, Bluetooth, driver settings, the inline 370Z, and the adult manifest. No step in this plan edits it. Kid work happens in `/test/` copies until a deploy yes.

## What this plan will not do

- No deploy, no merge to `main`, no push to `main`.
- No change to live `index.html`, live `jr.html`, live `sw.js`, or `world/phys-ground.js`.
- No save-format change, no key delete.
- No 370Z merge or delete.
- No Neon World render tuning, no `zRate` change, no DOM car composite.
- No claim that the avatar / pet work has sign-off.

## File inventory

Live tree `f6678f4`, 283 tracked files. Bucket is who loads the file today.

- **adult-only** — only the adult install needs it.
- **kid-only** — kid home, Neon World, or a kid page. A path under `shared/` is still kid-only when `index.html` does not load it.
- **shared** — both apps load it, or it is site plumbing (`sw.js`, `CNAME`).
- **not loaded** — dev tools, the unlinked `fly2.html` prototype, the stale `/test/` mirror on `main`, and old `test-results/` logs. The `/test/` mirror is an older preview (gear still opens adult settings). It is not PR #83.

Counts: adult-only 6, kid-only 89, shared 8, not loaded 180. Total 283.

| File | Bytes | Bucket | Notes |
| --- | ---: | --- | --- |
| `icons/zdash-192.png` | 13449 | adult-only |  |
| `icons/zdash-512.png` | 47179 | adult-only |  |
| `icons/zdash-apple-180.png` | 12245 | adult-only |  |
| `icons/zdash-maskable-512.png` | 43962 | adult-only |  |
| `index.html` | 7462115 | adult-only | Adult driver app. OBD, Spotify, Bluetooth, and driver settings are inline in this file. |
| `manifest.webmanifest` | 694 | adult-only | Adult install. start_url ./ scope ./ (whole site). |
| `char.html` | 62444 | kid-only | Kid page linked from the kid menu. |
| `crew.html` | 7673 | kid-only | Kid page linked from the kid menu. |
| `dance-stage.html` | 4134 | kid-only | Kid page linked from the kid menu. |
| `fly3.html` | 5540165 | kid-only | Kid flight page. The kid menu inside both HTML files links here. |
| `garage-hub.html` | 711 | kid-only | Kid page linked from the kid menu. |
| `icons/zdash-jr-192.png` | 18571 | kid-only | Kid install icon. |
| `icons/zdash-jr-512.png` | 72068 | kid-only | Kid install icon. |
| `icons/zdash-jr-apple-180.png` | 16819 | kid-only | Kid install icon. |
| `icons/zdash-jr-maskable-512.png` | 64054 | kid-only | Kid install icon. |
| `jr.html` | 7599682 | kid-only | Kid home. Today it is a second copy of the adult app plus Passenger Mode. Gear opens the adult settings panel. |
| `manifest-jr.webmanifest` | 701 | kid-only | Kid install. start_url ./jr.html scope ./ (whole site, same as the adult app). |
| `neon-paint.html` | 2145 | kid-only | Kid page linked from the kid menu. |
| `shared/assets/370z-glb.js` | 2401140 | kid-only | Kid world GLB. Same bytes as the copies inlined in index.html and jr.html. |
| `shared/assets/traffic/colormap.js` | 16611 | kid-only | Folder is named shared. Only the kid pages load it. Adult index.html does not. |
| `shared/assets/traffic/hatchback.js` | 263834 | kid-only | Folder is named shared. Only the kid pages load it. Adult index.html does not. |
| `shared/assets/traffic/k-ambulance.js` | 54268 | kid-only | Folder is named shared. Only the kid pages load it. Adult index.html does not. |
| `shared/assets/traffic/k-delivery-flat.js` | 48932 | kid-only | Folder is named shared. Only the kid pages load it. Adult index.html does not. |
| `shared/assets/traffic/k-delivery.js` | 49439 | kid-only | Folder is named shared. Only the kid pages load it. Adult index.html does not. |
| `shared/assets/traffic/k-firetruck.js` | 54880 | kid-only | Folder is named shared. Only the kid pages load it. Adult index.html does not. |
| `shared/assets/traffic/k-garbage-truck.js` | 62396 | kid-only | Folder is named shared. Only the kid pages load it. Adult index.html does not. |
| `shared/assets/traffic/k-hatchback-sports.js` | 47407 | kid-only | Folder is named shared. Only the kid pages load it. Adult index.html does not. |
| `shared/assets/traffic/k-race-future.js` | 44938 | kid-only | Folder is named shared. Only the kid pages load it. Adult index.html does not. |
| `shared/assets/traffic/k-race.js` | 42455 | kid-only | Folder is named shared. Only the kid pages load it. Adult index.html does not. |
| `shared/assets/traffic/k-sedan-sports.js` | 49275 | kid-only | Folder is named shared. Only the kid pages load it. Adult index.html does not. |
| `shared/assets/traffic/k-sedan.js` | 46200 | kid-only | Folder is named shared. Only the kid pages load it. Adult index.html does not. |
| `shared/assets/traffic/k-suv-luxury.js` | 46945 | kid-only | Folder is named shared. Only the kid pages load it. Adult index.html does not. |
| `shared/assets/traffic/k-suv.js` | 53322 | kid-only | Folder is named shared. Only the kid pages load it. Adult index.html does not. |
| `shared/assets/traffic/k-taxi.js` | 45171 | kid-only | Folder is named shared. Only the kid pages load it. Adult index.html does not. |
| `shared/assets/traffic/k-truck-flat.js` | 47273 | kid-only | Folder is named shared. Only the kid pages load it. Adult index.html does not. |
| `shared/assets/traffic/k-truck.js` | 47176 | kid-only | Folder is named shared. Only the kid pages load it. Adult index.html does not. |
| `shared/assets/traffic/k-van.js` | 46922 | kid-only | Folder is named shared. Only the kid pages load it. Adult index.html does not. |
| `shared/assets/traffic/pickup.js` | 235239 | kid-only | Folder is named shared. Only the kid pages load it. Adult index.html does not. |
| `shared/assets/traffic/police.js` | 260539 | kid-only | Folder is named shared. Only the kid pages load it. Adult index.html does not. |
| `shared/assets/traffic/sedan.js` | 229714 | kid-only | Folder is named shared. Only the kid pages load it. Adult index.html does not. |
| `shared/assets/traffic/suv.js` | 276852 | kid-only | Folder is named shared. Only the kid pages load it. Adult index.html does not. |
| `shared/assets/traffic/van.js` | 234308 | kid-only | Folder is named shared. Only the kid pages load it. Adult index.html does not. |
| `shared/car-draw.js` | 4579 | kid-only | Folder is named shared. Only the kid pages load it. Adult index.html does not. |
| `shared/car-hinge.js` | 8734 | kid-only | Folder is named shared. Only the kid pages load it. Adult index.html does not. |
| `shared/car-model.js` | 695287 | kid-only | Kid loader. Has the live-paint shader (zLiv). Adult index.html loader does not. |
| `shared/car-wire.js` | 5883 | kid-only | Folder is named shared. Only the kid pages load it. Adult index.html does not. |
| `shared/crew-state.js` | 4513 | kid-only | Folder is named shared. Only the kid pages load it. Adult index.html does not. |
| `shared/detail-tune.js` | 2532 | kid-only | Folder is named shared. Only the kid pages load it. Adult index.html does not. |
| `shared/fonts/orbitron.css` | 51533 | kid-only | Folder is named shared. Only the kid pages load it. Adult index.html does not. |
| `shared/menu-tiles.css` | 4657 | kid-only | Folder is named shared. Only the kid pages load it. Adult index.html does not. |
| `shared/minimap-tune.js` | 1014 | kid-only | Folder is named shared. Only the kid pages load it. Adult index.html does not. |
| `shared/physics.js` | 17343 | kid-only | Used by world/phys-ground.js and world/phys-air.js. Not a script tag in world.html. |
| `shared/soccer-tune.js` | 2063 | kid-only | Folder is named shared. Only the kid pages load it. Adult index.html does not. |
| `shared/steering.js` | 2442 | kid-only | Folder is named shared. Only the kid pages load it. Adult index.html does not. |
| `shared/traffic-tune.js` | 3293 | kid-only | Folder is named shared. Only the kid pages load it. Adult index.html does not. |
| `shared/tune.js` | 14912 | kid-only | Folder is named shared. Only the kid pages load it. Adult index.html does not. |
| `shared/unlock.js` | 454 | kid-only | Folder is named shared. Only the kid pages load it. Adult index.html does not. |
| `shared/zd-embed.js` | 363 | kid-only | Folder is named shared. Only the kid pages load it. Adult index.html does not. |
| `world-split.html` | 30330 | kid-only | Byte-identical copy of world.html. Service worker treats it as its own page. Do not delete without a yes. |
| `world.html` | 30330 | kid-only | Neon World. 70 scripts, no OBD, Spotify, Bluetooth, or ZD.Settings. |
| `world/GL-CITY.md` | 29559 | kid-only | Notes for the city renderer. Not loaded by the app. |
| `world/boot.js` | 6137 | kid-only | Neon World module or asset. |
| `world/camera.js` | 15623 | kid-only | Neon World module or asset. |
| `world/city-draw.js` | 33698 | kid-only | Neon World module or asset. |
| `world/city-layout.js` | 17522 | kid-only | Neon World module or asset. |
| `world/city.js` | 50084 | kid-only | Neon World module or asset. |
| `world/crew-data.js` | 32976 | kid-only | Neon World module or asset. |
| `world/crew.js` | 48605 | kid-only | Neon World module or asset. |
| `world/dance-stage.js` | 146401 | kid-only | Neon World module or asset. |
| `world/detail.js` | 76124 | kid-only | Neon World module or asset. |
| `world/flight.js` | 676 | kid-only | Neon World module or asset. |
| `world/garage.js` | 4901 | kid-only | Neon World module or asset. |
| `world/garagez.js` | 8466 | kid-only | Neon World module or asset. |
| `world/gl-assets/glow-kernel.png` | 1421 | kid-only | Sits beside the city renderer. No HTML script tag names it. |
| `world/gl-city-manifest.json` | 343 | kid-only | Neon World module or asset. |
| `world/gl-city.js` | 26916 | kid-only | Neon World module or asset. |
| `world/ground.js` | 2290 | kid-only | Neon World module or asset. |
| `world/house.js` | 61917 | kid-only | Neon World module or asset. |
| `world/hud.js` | 49133 | kid-only | Neon World module or asset. |
| `world/icon-garage.js` | 104496 | kid-only | Neon World module or asset. |
| `world/input.js` | 40392 | kid-only | Neon World module or asset. |
| `world/landings.js` | 1321 | kid-only | Neon World module or asset. |
| `world/neon-paint.js` | 123153 | kid-only | Neon World module or asset. |
| `world/nos-station.js` | 8367 | kid-only | Neon World module or asset. |
| `world/objectives.js` | 4320 | kid-only | Neon World module or asset. |
| `world/phys-air.js` | 13866 | kid-only | Neon World module or asset. |
| `world/phys-ground.js` | 18315 | kid-only | Neon World module or asset. |
| `world/ramps.js` | 2591 | kid-only | Neon World module or asset. |
| `world/resume-safe.js` | 4665 | kid-only | Neon World module or asset. |
| `world/soccer.js` | 27658 | kid-only | Neon World module or asset. |
| `world/sound.js` | 33 | kid-only | Neon World module or asset. |
| `world/state.js` | 1332 | kid-only | Neon World module or asset. |
| `world/towdrive.js` | 16286 | kid-only | Neon World module or asset. |
| `world/towtruck.js` | 14784 | kid-only | Neon World module or asset. |
| `world/traffic.js` | 40788 | kid-only | Neon World module or asset. |
| `.nojekyll` | 0 | shared |  |
| `AGENTS.md` | 1599 | shared |  |
| `CNAME` | 15 | shared |  |
| `README.md` | 8 | shared |  |
| `shared/ipad.css` | 7155 | shared | Loaded by index.html, jr.html, and world.html. |
| `shared/ipad.js` | 2629 | shared | Loaded by index.html, jr.html, and world.html. |
| `shared/version.js` | 279 | shared | Loaded by jr.html and by sw.js (importScripts). Cache name world33. |
| `sw.js` | 5359 | shared | One worker for the whole site. Precaches adult and kid HTML. Spotify and other off-site calls skip the cache. |
| `fly2.html` | 5483687 | not loaded | Old flight page. Nothing in index.html or jr.html links to it. |
| `test-results/after-ball.png` | 209057 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/after-chase-fly.png` | 280297 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/after-chase-ground.png` | 268542 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/after-chase-hang.png` | 279902 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/after-edge.png` | 236315 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/after-goal.png` | 296554 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/after-hit.png` | 223522 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/after-overview.png` | 299910 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/after-road.png` | 202534 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/after-sideline.png` | 231126 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/air-after.png` | 551429 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/air-before.png` | 537502 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/before-ball.png` | 213781 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/before-chase-fly.png` | 278208 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/before-chase-ground.png` | 269444 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/before-chase-hang.png` | 278760 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/before-edge.png` | 230201 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/before-goal.png` | 257618 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/before-hit.png` | 252571 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/before-overview.png` | 331822 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/before-road.png` | 192471 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/before-sideline.png` | 235496 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/boulevards-check.log` | 401 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/boulevards-fps.md` | 900 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/builder-fps-after.json` | 20228 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/builder-fps-before.json` | 17409 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/builder-fps.md` | 1661 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/final-log.json` | 4942 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/final-log.txt` | 1365 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/fps-bisect-oct22.md` | 3192 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/garagez2/behind-slam-closed.png` | 67852 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/garagez2/behind-slam-opening.png` | 74113 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/garagez2/behind-stock-closed.png` | 62862 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/garagez2/behind-stock-opening.png` | 74114 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/garagez2/fit.json` | 2896 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/garagez2/side-slam-closed.png` | 63504 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/garagez2/side-slam-opening.png` | 71323 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/garagez2/side-stock-closed.png` | 62999 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/garagez2/side-stock-opening.png` | 70255 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/garagez2/smoke.log` | 660 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/ipad-garage.json` | 971 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/ipad-menu.json` | 1287 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/ipad-neon.json` | 401 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/ipad-retest.json` | 2429 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/ipad-summary.json` | 1057 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/ipad-world-1180.json` | 2113 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/ipad-world-portrait.json` | 1578 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/menu-reach-main.txt` | 7980 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/merge-log.json` | 1299 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/merge-log.txt` | 700 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/move-log.json` | 9409 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/move-log.txt` | 733 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/official.json` | 2319 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/pc-1366.json` | 1997 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/pc-fps.log` | 2203 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/pc-menu-hud.log` | 1553 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/pc-tilt.log` | 6625 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/phone-844.json` | 1971 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/pwa-audit/pwa-display.txt` | 835 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/pwa-display/pwa-standalone.txt` | 4359 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/pwa-display/screenshots/android-915x412-standalone-jr-menu.png` | 820863 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/pwa-display/screenshots/android-915x412-standalone-paint.png` | 9285 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/pwa-display/screenshots/android-915x412-standalone-world.png` | 671806 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/pwa-display/screenshots/ios-844x390-standalone-jr-menu.png` | 1008366 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/pwa-display/screenshots/ios-844x390-standalone-paint.png` | 11261 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/pwa-display/screenshots/ios-844x390-standalone-world.png` | 734656 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/soccer-log.json` | 10381 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/soccer-log.txt` | 685 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/street-after.png` | 229031 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/street-before.png` | 221454 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/tow-collide-ipad.png` | 226809 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/tow-collide-pc.png` | 380874 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/tow-collide-phone.png` | 201671 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/tow-collide.json` | 3122 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/tow-collide.md` | 882 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/tow-hop.png` | 213096 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/tow-launch.png` | 223725 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/tow-moving.png` | 218612 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/tow-official.json` | 1692 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/ui-polish-adult-isolation.md` | 1890 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/ui-polish-boulevards/audit.md` | 1630 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/ui-polish-full.md` | 28323 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/ui-polish-garage-paint.md` | 18641 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/ui-polish-index-l2.md` | 3314 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/ui-polish-interiors.md` | 39607 | not loaded | Old test log or screenshot. Not served as the app. |
| `test-results/world2-log.txt` | 8032 | not loaded | Old test log or screenshot. Not served as the app. |
| `test/crew.html` | 8663 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/dance-stage.html` | 5124 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/fly3.html` | 5541155 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/garage-hub.html` | 1701 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/icons/zdash-192.png` | 13449 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/icons/zdash-512.png` | 47179 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/icons/zdash-apple-180.png` | 12245 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/icons/zdash-jr-192.png` | 18571 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/icons/zdash-jr-512.png` | 72068 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/icons/zdash-jr-apple-180.png` | 16819 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/icons/zdash-jr-maskable-512.png` | 64054 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/icons/zdash-maskable-512.png` | 43962 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/jr.html` | 7602701 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/manifest-jr.webmanifest` | 701 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/neon-paint.html` | 3135 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/shared/assets/370z-glb.js` | 2401140 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/shared/assets/traffic/colormap.js` | 16611 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/shared/assets/traffic/hatchback.js` | 263834 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/shared/assets/traffic/k-ambulance.js` | 54268 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/shared/assets/traffic/k-delivery-flat.js` | 48932 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/shared/assets/traffic/k-delivery.js` | 49439 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/shared/assets/traffic/k-firetruck.js` | 54880 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/shared/assets/traffic/k-garbage-truck.js` | 62396 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/shared/assets/traffic/k-hatchback-sports.js` | 47407 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/shared/assets/traffic/k-race-future.js` | 44938 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/shared/assets/traffic/k-race.js` | 42455 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/shared/assets/traffic/k-sedan-sports.js` | 49275 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/shared/assets/traffic/k-sedan.js` | 46200 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/shared/assets/traffic/k-suv-luxury.js` | 46945 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/shared/assets/traffic/k-suv.js` | 53322 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/shared/assets/traffic/k-taxi.js` | 45171 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/shared/assets/traffic/k-truck-flat.js` | 47273 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/shared/assets/traffic/k-truck.js` | 47176 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/shared/assets/traffic/k-van.js` | 46922 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/shared/assets/traffic/pickup.js` | 235239 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/shared/assets/traffic/police.js` | 260539 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/shared/assets/traffic/sedan.js` | 229714 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/shared/assets/traffic/suv.js` | 276852 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/shared/assets/traffic/van.js` | 234308 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/shared/car-draw.js` | 8078 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/shared/car-hinge.js` | 8734 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/shared/car-model.js` | 695287 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/shared/car-wire.js` | 5883 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/shared/crew-state.js` | 4513 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/shared/detail-tune.js` | 2532 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/shared/fonts/orbitron.css` | 51533 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/shared/ipad.css` | 7155 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/shared/ipad.js` | 2756 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/shared/menu-tiles.css` | 4657 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/shared/minimap-tune.js` | 1014 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/shared/physics.js` | 17343 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/shared/soccer-tune.js` | 2105 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/shared/steering.js` | 2442 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/shared/traffic-tune.js` | 3293 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/shared/tune.js` | 14912 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/shared/unlock.js` | 454 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/shared/version.js` | 279 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/shared/zd-embed.js` | 363 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/sw.js` | 1526 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/world-split.html` | 31124 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/world.html` | 31124 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/world/boot.js` | 29381 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/world/camera.js` | 19347 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/world/city-draw.js` | 31124 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/world/city.js` | 47672 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/world/crew-data.js` | 32976 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/world/crew.js` | 48605 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/world/dance-stage.js` | 146666 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/world/detail.js` | 77081 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/world/flight.js` | 676 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/world/garage.js` | 4901 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/world/garagez.js` | 8466 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/world/ground.js` | 2290 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/world/house.js` | 61956 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/world/hud.js` | 39054 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/world/icon-garage.js` | 104496 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/world/input.js` | 39699 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/world/landings.js` | 1321 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/world/neon-paint.js` | 123153 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/world/objectives.js` | 4320 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/world/phys-air.js` | 13989 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/world/phys-ground.js` | 18315 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/world/ramps.js` | 2591 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/world/soccer.js` | 27874 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/world/sound.js` | 33 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/world/state.js` | 1332 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/world/towdrive.js` | 16286 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/world/towtruck.js` | 14784 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/world/traffic.js` | 45993 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `test/world/warm-manifest.json` | 1144 | not loaded | Stale preview copy on main. Not PR #83. Gear here still opens adult settings. |
| `tools/city-layout-check.js` | 6930 | not loaded | Dev script. Neither app loads it. |
| `tools/pwa-display-audit.js` | 26460 | not loaded | Dev script. Neither app loads it. |
| `tools/ui-polish-audit.js` | 70077 | not loaded | Dev script. Neither app loads it. |
