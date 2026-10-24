# Z-DASH and Z-DASH JR separation plan

Planning only. This file does not change the game, the dash, or the live site.

Z-DASH is Bob's adult driver app: `index.html`, the OBDLink adapter, Spotify, and the phone he uses with Android Auto, AAWireless, and the Kenwood. Z-DASH JR is Ellie's Kid App: `jr.html`, Neon World (`world.html` / `world-split.html`), and the kid games. The goal is two apps that do not load each other's code, and that can later be two store listings under the C.F.R., Inc. Apple and Google accounts. They still need a way to share a few things: DAD'S SHIFTS, BOXES from real drives, and the saved Garage Z car.

## For Bob

Today both apps are one website, and each big page still carries the other app inside it.

- `jr.html` is about 7.4 MB. It is Ellie's menu, and it also contains the OBD adapter code, Spotify, and the live link to Dad's phone. Opening her app loads Dad's car code even when she only wants Neon World.
- `index.html` is about 7.3 MB. It is your dash, and it also contains a full copy of her game (Passenger Mode, DAD'S SHIFTS, the garage save). Your page does not load her separate Neon World scripts. The game text is still in the file.
- One service worker and two home-screen manifests both claim the whole site. An update for one app can refresh the cache the other app uses.
- Saves already sit in one place on the phone, because both pages are the same website (`z.beagle.games`). Her garage, dances, house, and unlocks are keys in that store. Nothing in this plan deletes those keys.

Step 1 is already underway on the FPS agent (`bc-da7101de`). This plan does not rebuild it. That step makes the Kid App stop loading the adult code, turns the old dashboard into a tile, and leaves Bluetooth, Spotify, and the car link idle until that tile is opened. The same agent is also stopping the old dashboard from keeping a frozen copy alive behind Neon World. When that step lands, her games no longer boot Dad's adapter stack.

After that, the work is a series of small moves. Each one can be undone on its own. Her saves are copied and checked before any address changes. The website stays on `z.beagle.games` until you say otherwise. Two store apps come last, after the files are actually separate. A store shell does not, by itself, split the code.

What you would say yes to is marked **Needs your yes** on the steps below. The rest can be built as hidden previews when you write "plan approved, build it" for that step.

### Ranked steps

| Step | What you get | Effort | Risk | Needs your yes |
| --- | --- | --- | --- | --- |
| 1. Kid App stops loading adult code. Old dashboard becomes a tile. Connections stay idle. | Ellie can open a game without booting OBD, Spotify, or the mic. Already in progress on the FPS agent. | Theirs | Theirs. This plan does not touch `jr.html` until their pull request is in. | No. Already in progress. |
| 2. A second copy of her saves, and a written list of which keys are hers. | A bad later step cannot be the only copy of the garage, dances, house, or unlocks. | Small | Low. Nothing is deleted. No new button unless you want one. | Only if you want a visible Backup button on her menu. The silent second copy does not need a yes. |
| 3. Take her game out of your page, and keep adult code out of her pages. Same web addresses. | Your dash file no longer contains DAD'S SHIFTS. Her files no longer contain OBD or Spotify. | Large | Medium. Passenger Mode would leave your phone's dash page and live only in her app. | **Yes.** Your in-page Passenger Mode goes away. The Kid Z button and her iPad stay. |
| 4. Two service workers and two home-screen manifests that do not cover each other. | An update to the dash cannot reload her game cache, and the other way around. | Medium | Medium. A home-screen icon may need to be opened once after the update. | **Yes**, because an icon already on a phone might need that one open. |
| 5. Move her pages under a `/jr/` folder. Old addresses keep working as redirects. | A clean kid bundle for a later store app. Saves stay, because the website name does not change. | Medium | Medium. Bookmarks and the installed icon follow the redirect. | **Yes**, for the new address. The redirects are permanent. |
| 6. A small real-drive note your phone writes and her game reads. | DAD'S SHIFTS and BOXES can see a finished drive even when the two pages are not open together. The Garage Z save stays the key it already is. | Small | Low. Live QR pairing still works for a drive in progress. | No, as long as the note is only minutes, shift count, and the last drive time. |
| 7. Two installed apps (Capacitor), still one website behind them. | C.F.R., Inc. can ship Z-DASH and Z-DASH JR as two store listings. Her app has no Spotify and no OBD. | Large | Medium. The adult app needs a small Bluetooth add-on. A plain web view cannot talk to the OBDLink. | **Yes.** App names, ids, icons, and the privacy forms. |
| 8. Sharing after the two apps no longer share a website: a file she can AirDrop, the QR link, and only later an account. | Garage and real-drive boxes survive two separate store apps. | Medium, then large if there is an account | High if the website name changes first. Her phone would look empty. | **Yes** before any new domain, and **yes** before any account on `beagle.studio`. |

Benefit, in one line each: step 1 makes her games lighter now; step 2 protects her stuff; steps 3–5 make the split real on the website; step 6 keeps DAD'S SHIFTS honest; steps 7–8 are the store.

## What is already true

Measured from the live pages, not from a redesign.

| Piece | Adult (`index.html`) | Kid (`jr.html`, Neon World) |
| --- | --- | --- |
| Size | about 7.3 MB, 12,907 lines | `jr.html` about 7.4 MB, 13,839 lines. Neon World pages are about 29 KB and then load `world/` and `shared/`. |
| Entry | `/` and `index.html`. Manifest name "Z-DASH · 370Z". | `jr.html`. Manifest name "Z-DASH JR". Neon World is `world.html` and `world-split.html`. |
| Adult code inside | OBDLink (LX is the saved default), Web Bluetooth, Web Serial, Spotify (`accounts.spotify.com`, `api.spotify.com`), drive logs, the QR link that hosts the drive. | The same blocks are still in `jr.html`. `window.ZD_JR = true` only forces Passenger Mode. It does not skip those blocks. |
| Kid code inside | Passenger Mode, DAD'S SHIFTS, BOXES, and the garage save are copied into this file. External kid scripts such as `world/neon-paint.js` are not loaded. A Kid Z button links to `jr.html`. | Her games, plus the adult blocks above. The menu sends Neon World, paint, dance, crew, and soccer to the split pages. |
| Service worker | Both pages register `./sw.js`. That one worker caches `index.html` and `jr.html` together, and caches `world/` and `shared/` in a second bucket. Both manifests use scope `./`, which is the whole site. | Neon World pages do not register a worker themselves. They inherit the site worker if her menu installed it. |
| Saves | Same website, so one `localStorage` and one IndexedDB. Her keys and your keys sit side by side. | Garage Z in Neon World reads `zdash.kid.v1`. That is the same key her menu writes. |

Android Auto, AAWireless, and the Kenwood are not in the page. They are how your phone is mounted and shown in the car. The adult app is the one that must keep working on that phone. The kid app must not open the adapter radio or a head-unit feature.

The adult page already knows a web view cannot open Bluetooth by itself. The OBD code looks for `window.ZDNative` on an Android build, and otherwise uses Chrome's Web Serial or Web Bluetooth. A store build of Z-DASH needs that small native piece. Z-DASH JR must not include it.

### Her saves (do not drop these)

These are the keys a move has to carry. They live on the website origin, not in a file on disk.

- `zdash.kid.v1` — garage (paint and parts), coins, ride time, the house pointer. Neon World paints the car from `eq` inside this key.
- `zdash.house.v1` — Ellie's home.
- `zdash.char.v1`, `zdash.pet.v1`, `zdash.crew.v1` — character, pet, crew.
- `zdash.customdance.v1`, `zdash.petdance.v1`, `zdash.dancestage.v1` — recorded dances and the stage.
- `zdash.neonpaint.v1`, `zdash.wallgraffiti.v1` — paint and the graffiti wall.
- `zd_fly_unlocked`, `zd_world_unlocked`, `zd_w2_beaten` — Neon Flying, Neon World, and WANTED level 4.
- `zdw_start`, `zdw_rwxray` — Neon World start choice and runway x-ray.

### Your saves (her app must not load these)

- Adapter and car: `zdash.adapter`, `zdash.obd.pids`, `zdash.clutchSig`, `zdash.codes`, `zdash.fuel`, `zdash.extras`, `zdash.layout`, `zdash.mode`, `zdash.modeStats`.
- Music: `zdash.spotify.clientId`, `zdash.spotify.token`, `zdash.spotify.verifier`, `zdash.spotify.state`, `zdash.spotify.ret`, `zdash.music.src`, `zdash.music.vol`, `zdash.music.muted`, `zdash.music.sync`.
- Link and roles: `zdash.roles.v1`, `zdash.peers`, `zdash.link.last`, `zdash.w2key`.
- IndexedDB databases on the phone: `zdash-logs` (drive CSVs), `zdash-runs`, `zdash-roles`.

Real drives today: your phone reads the OBDLink and is the host. Her page joins with two QR codes over the same Wi-Fi (`ZD.Link`). No internet is required for that pair. While the link is up, her game treats the drive as real: ×2 coins and part boxes. The raw log stays in your phone's IndexedDB. Her shifts and ride timer are inside `zdash.kid.v1`.

## Target shape

Same website until step 8. Paths, not a new name.

```
z.beagle.games/                  Z-DASH (adult)
  index.html                     dash only
  manifest.webmanifest           scope /   start /
  sw.js                          adult caches only
  adult/                         OBD, Spotify, drive log, link host
  icons/zdash-*.png

z.beagle.games/jr/               Z-DASH JR
  index.html                     her menu (today's jr.html)
  manifest.webmanifest           scope /jr/   start /jr/
  sw.js                          kid caches only
  world.html, world-split.html   Neon World
  neon-paint.html, dance-stage.html, crew.html, char.html, ...
  world/                         city, garage, house (already split)
  icons/zdash-jr-*.png

shared/                          only files both apps truly share
  version stamp used by both workers, with each worker named apart
  the 370Z mesh bytes, if a check shows they are the same file
```

Kid-only code stays under `/jr/` (or in today's `shared/` until step 5, then moves with her). That includes `ipad.js`, the car painter, tunes, crew state, unlock flags, and the traffic models. Adult code never imports those, and her pages never import `adult/`.

`shared/version.js` is loaded by the service worker and by her menu. Two workers can keep reading one stamp. Each worker's cache name must start with its own prefix (`zdash-adult-` and `zdash-jr-`) so one activate step cannot delete the other cache. Today `sw.js` deletes every cache that starts with `zdash-` or `world-split-`. That rule has to be split before two workers exist.

A standing redirect stays at the old addresses: `jr.html`, `world.html`, `world-split.html`, and the other kid pages. In-flight Neon World work can keep those names. The redirect is the compatibility promise.

### What each app is allowed to open

| | Z-DASH | Z-DASH JR |
| --- | --- | --- |
| OBDLink, Bluetooth, Web Serial, `ZDNative` | Yes | No |
| Spotify and the beat microphone | Yes | No |
| Drive log IndexedDB | Yes | No |
| QR link | Host | Guest, and only after she taps JOIN DAD'S CAR |
| Neon World, garage, dances, house | No | Yes |
| Camera for her pet and dance recorder | No | Yes, on the device, already in the kid pages. Store forms must say so. |
| Android Auto / Kenwood / AAWireless | The phone you already use in the car. Not a web feature. | No automotive feature, no head-unit permission |

A check, added beside the existing adult-isolation audit, fails a pull request if her pages mention Spotify, Bluetooth, OBD, or `index.html`, and if your page mentions DAD'S SHIFTS, her game scripts, or her save keys. The Kid Z link and the real-drive note in step 6 are the allowed exceptions.

## Saves now, and sharing later

**Now, one website.** `localStorage` and IndexedDB are per website name, not per folder. `/` and `/jr/` on `z.beagle.games` still see the same saves. Step 5 does not move her garage. The silent copy in step 2 writes `zdash.kid.backup.v1` next to the real key and refreshes it when she saves. It is a spare, not a second garage.

**Live drive.** The QR link stays the way a drive in progress counts. Her guest half is a small script loaded when she taps JOIN, not at startup. That matches step 1 (idle until asked) and keeps the kid app free of the adapter.

**Finished drive.** Step 6 adds `zdash.realdrive.v1`: how many minutes, how many shifts, and when the drive ended. Your page writes it. Her game reads it for DAD'S SHIFTS and BOXES. It does not contain GPS, Spotify tokens, or the CSV. The CSV stays in `zdash-logs` on your side.

**Two store apps.** Each Capacitor app has its own private storage. The website keys do not appear inside the installed app by magic. Before those listings go live, her first launch on a phone that already has the website can offer a one-time copy. On a new iPad the copy is a file you hand her, or the QR link, which step 8 teaches to carry the garage blob and the real-drive note. Order is fixed: the file and the QR work before any account exists.

**Account, later, only if you want it.** A Beagle login on a host you own (`beagle.studio` is the candidate). Her app would talk only to that host, and only to fetch the garage and the drive note. No Spotify, no ads, no analytics kit. This is a new product, not part of the file split.

## Domains

Stay on `https://z.beagle.games` through steps 1–7. That name is what her phone's saves are tied to.

`beagle.studio` is a possible later home for the account, or for a grown-up site, not for the next edit. Two website names do not share saves. Pointing JR at a new name before step 8 would open an empty garage.

GitHub Pages still publishes from `main`. Every stage previews under `/test/` first, the same way the frame work does. Nothing here changes DNS.

## Store packaging

Two Capacitor projects, two application ids, one C.F.R., Inc. seller on each store. You pick the ids (a reasonable pair is a Z-DASH id and a Z-DASH JR id under the company). They are not chosen in this plan.

- JR is a web view around the `/jr/` bundle, stored inside the app so a parking garage still runs. No Bluetooth plugin. No Spotify. The network list in the store build is empty until you approve a first-party host.
- Z-DASH is a web view around the adult pages plus the native OBD add-on the page already expects (`ZDNative`). Spotify stays in this app only. Android Auto is not implied by Capacitor. A free-form dash does not drop onto a Kenwood through Android Auto's templates without a separate native screen, and that screen is its own yes later. AAWireless and the Kenwood keep working the way they do now: your phone runs Z-DASH.

Kids-category privacy for JR, as a build rule rather than a legal opinion:

- No third-party connections. The blocked list is Spotify, any OBD cloud, Sketchfab fetches (the car model is already packed in the file), font servers, crash reporters, and ad or analytics kits.
- Credits to Kenney, Creative Commons, or Sketchfab can stay in an offline text file. The app must not request those sites.
- No links out of the app except a parent gate, if a link is required at all.
- Camera for the pet and dance recorder stays on the device. The store privacy form has to say the camera is used, and that nothing is uploaded. That form is part of the step 7 yes.
- Apple's Kids category and Google's Families rules both reject third-party ads and tracking. Shipping JR in the kids category means those rules apply to every update. If you would rather list it as a general app that children use with a parent, say so at step 7. The no-third-party rule in this plan stays either way.

## Migration, and how a step comes back

Every stage is its own pull request, previewed under `/test/`, and not merged until you accept it. `main` is the live site.

Saves:

1. Step 2 copies her keys to `zdash.kid.backup.v1` before any later step runs.
2. A move reads the backup, confirms the garage paint id and the unlock flags, then leaves both copies in place.
3. No step calls `localStorage.clear()`, and no step deletes `zdash-logs`, `zdash-runs`, or `zdash-roles`.
4. A key is removed only in a later pull request, after you have opened her app and the car color matches, and that pull request is its own yes.

Rollback for each stage:

| Step | Undo |
| --- | --- |
| 1 | Revert the FPS agent's pull request. Her page goes back to loading the blocks it loads today. Saves are untouched. |
| 2 | Delete the backup key in a one-line revert, or leave it. The real key was never moved. |
| 3 | Revert the pull request. Passenger Mode returns inside `index.html`. Her files gain the adult blocks back only if that revert is what you want. Preview this revert on `/test/` before it hits `main`. |
| 4 | Put the single `sw.js` back. Cache names change with the version stamp, so the old worker installs and the pages reload. Do not delete her backup key. |
| 5 | Point the redirects back at the root copies, which stay in the repo until you say the folder move is settled. |
| 6 | Stop writing `zdash.realdrive.v1`. Her game falls back to the live QR link, which is the path she has now. |
| 7 | Unpublish the store listing. The website is still the app she uses. The website was not removed. |
| 8 | Turn the account off. The file export and the QR link remain. Do not change `z.beagle.games` as part of turning an account off. |

Home-screen icons: after step 4 or 5, open the icon once. If it shows the wrong app, remove the icon and add it again from the right page. Saves are still in the website, not in the icon.

## How this sits next to the other work

- FPS agent `bc-da7101de` (pull request 56, and the dashboard parking still on that branch): owns step 1. This plan does not edit `jr.html` in parallel with them.
- Speed plan (`docs/SPEED-PLAN.md`, pull request 63): Neon World drawing only. It does not edit `index.html`. URL redirects in step 5 exist so that work can keep saying `world.html`.
- Resolution audit and FPS Guard: kid pages only. The new isolation check belongs with the existing adult-isolation audit, not with the frame-time bench.
- Adult `index.html` stays the dash until step 3, and step 3 waits for your yes.

## What this pull request does not do

No file moves, no service-worker edits, no DNS, no store listings, no save migration. Build for a step starts when you write "plan approved, build it" and, on the steps marked above, "yes".
