# Z-DASH and Z-DASH JR separation plan

Planning only. This file does not change the game, the dash, or the live site.

Z-DASH is Bob's adult driver app: `index.html`, the OBDLink adapter, Spotify, and the phone he uses with Android Auto, AAWireless, and the Kenwood. Z-DASH JR is Ellie's Kid App: `jr.html`, Neon World (`world.html` / `world-split.html`), and the kid games. The goal is two apps that do not load each other's code, and that can later be two store listings under the C.F.R., Inc. Apple and Google accounts. They still need a way to share a few things: DAD'S SHIFTS, BOXES from real drives, and the saved Garage Z car.

## For Bob

Today both apps are one website, and each big page still carries the other app inside it.

- `jr.html` is about 7.4 MB. It is Ellie's menu, and it also contains the OBD adapter code, Spotify, and the live link to Dad's phone. Opening her app loads Dad's car code even when she only wants Neon World.
- `index.html` is about 7.3 MB. It is your dash, and it also contains a full copy of her game (Passenger Mode, DAD'S SHIFTS, the garage save). Your page does not load her separate Neon World scripts. The game text is still in the file.
- One service worker and two home-screen manifests both claim the whole site. An update for one app can refresh the cache the other app uses.
- Saves already sit in one place on the phone, because both pages are the same website (`z.beagle.games`). Her garage, dances, house, and unlocks are keys in that store. Nothing in this plan deletes those keys.
- The 3D 370Z is one car, pasted in more than one place. Neon World loads the shared file. Your dash page, her menu, and Neon Flying each carry their own paste of those same bytes. Changing the shared file today leaves the pasted cars as they are. Every paste stays until you say otherwise. The check is in the section "The 370Z model" below.
- Her gear button opens your settings screen. The same panel is pasted into both pages, and Passenger Mode hides the rows from MUSIC downward. Her name, the keep-awake choice, and low detail live in the same phone store as your dash. The section "Settings" below splits the two screens and copies her values into a small shared record before anything moves. Every old key stays.

Step 1 is already underway on the FPS agent (`bc-da7101de`). This plan does not rebuild it. That step makes the Kid App stop loading the adult code, turns the old dashboard into a tile, and leaves Bluetooth, Spotify, and the car link idle until that tile is opened. The same agent is also stopping the old dashboard from keeping a frozen copy alive behind Neon World. When that step lands, her games no longer boot Dad's adapter stack.

After that, the work is a series of small moves. Each one can be undone on its own. Her saves are copied and checked before any address changes. The website stays on `z.beagle.games` until you say otherwise. Two store apps come last, after the files are actually separate. A store shell does not, by itself, split the code.

What you would say yes to is marked **Needs your yes** on the steps below. The rest can be built as hidden previews when you write "plan approved, build it" for that step.

### Ranked steps

| Step | What you get | Effort | Risk | Needs your yes |
| --- | --- | --- | --- | --- |
| 1. Kid App stops loading adult code. Old dashboard becomes a tile. Connections stay idle. | Ellie can open a game without booting OBD, Spotify, or the mic. Already in progress on the FPS agent. | Theirs | Theirs. This plan does not touch `jr.html` until their pull request is in. | No. Already in progress. |
| 2. A second copy of her saves, and a written list of which keys are hers. | A bad later step cannot be the only copy of the garage, dances, house, or unlocks. | Small | Low. Nothing is deleted. No new button unless you want one. | Only if you want a visible Backup button on her menu. The silent second copy does not need a yes. |
| 3. Take her game out of your page, and keep adult code out of her pages. Same web addresses. | Your dash file no longer contains DAD'S SHIFTS. Her files no longer contain OBD or Spotify. | Large | Medium. Passenger Mode would leave your phone's dash page and live only in her app. | **Yes.** Your in-page Passenger Mode goes away. The Kid Z button and her iPad stay. |
| M. One shared 370Z file, and one version stamp both apps read. Pasted copies stay until you say to remove them. | A new Z model reaches your page, her menu, Neon Flying, and Neon World together. | Small, after you say yes. | Low while each paste remains as a spare. | **Yes** before any paste is removed. **Yes** again if you would rather the two apps keep different cars on purpose. |
| S. Separate settings screens, plus one small shared record for sound, units, and her name. | Her gear shows her rows. Your gear shows the dash. Her name, miles, and sound choice survive the split. | Small for the silent copy. Medium for the two screens. | Low while the old keys stay and both screens still read them. | **Yes** for the new gear screen (the Stillen row leaves her list). The silent copy of her name and toggles does not need a yes. |
| 4. Two service workers and two home-screen manifests that do not cover each other. | An update to the dash cannot reload her game cache, and the other way around. | Medium | Medium. A home-screen icon may need to be opened once after the update. | **Yes**, because an icon already on a phone might need that one open. |
| 5. Move her pages under a `/jr/` folder. Old addresses keep working as redirects. | A clean kid bundle for a later store app. Saves stay, because the website name does not change. | Medium | Medium. Bookmarks and the installed icon follow the redirect. | **Yes**, for the new address. The redirects are permanent. |
| 6. A small real-drive note your phone writes and her game reads. | DAD'S SHIFTS and BOXES can see a finished drive even when the two pages are not open together. The Garage Z save stays the key it already is. | Small | Low. Live QR pairing still works for a drive in progress. | No, as long as the note is only minutes, shift count, and the last drive time. |
| 7. Two installed apps (Capacitor), still one website behind them. | C.F.R., Inc. can ship Z-DASH and Z-DASH JR as two store listings. Her app has no Spotify and no OBD. | Large | Medium. The adult app needs a small Bluetooth add-on. A plain web view cannot talk to the OBDLink. | **Yes.** App names, ids, icons, and the privacy forms. |
| 8. Sharing after the two apps no longer share a website: a file she can AirDrop, the QR link, and only later an account. | Garage and real-drive boxes survive two separate store apps. | Medium, then large if there is an account | High if the website name changes first. Her phone would look empty. | **Yes** before any new domain, and **yes** before any account on `beagle.studio`. |

Benefit, in one line each: step 1 makes her games lighter now; step 2 protects her stuff; steps 3–5 make the split real on the website; step M makes a new 370Z show up in both apps; step S gives each app its own settings and keeps her name; step 6 keeps DAD'S SHIFTS honest; steps 7–8 are the store.

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

- `zdash.kid.v1` — garage (paint and parts), coins, ride time, the house pointer, and her car name (`name`, up to 14 letters; a fresh profile starts as `ELLIE'S Z`). Neon World paints the car from `eq` inside this key. The garage name box is where she types it.
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
  version.js                     world stamp, plus a model stamp both workers read
  assets/370z-glb.js             the one 370Z mesh (checked: same bytes in every paste)
  zd-embed.js                    the credit line, and the pointer to that mesh
  settings.js                    sound, units, and player name (three fields)
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
| M | Revert the pull request that pointed a page at the shared file. The paste in that page is still there, so the car she had remains. After a later yes removes a paste, put that paste back from git and preview it on `/test/` first. |
| S | Revert the new gear screen. Her gear opens today's panel again. The shared record and her old keys are both still on the phone, so her name and toggles remain. Leave the shared record in place. |
| 4 | Put the single `sw.js` back. Cache names change with the version stamp, so the old worker installs and the pages reload. Do not delete her backup key. |
| 5 | Point the redirects back at the root copies, which stay in the repo until you say the folder move is settled. |
| 6 | Stop writing `zdash.realdrive.v1`. Her game falls back to the live QR link, which is the path she has now. |
| 7 | Unpublish the store listing. The website is still the app she uses. The website was not removed. |
| 8 | Turn the account off. The file export and the QR link remain. Do not change `z.beagle.games` as part of turning an account off. |

Home-screen icons: after step 4 or 5, open the icon once. If it shows the wrong app, remove the icon and add it again from the right page. Saves are still in the website, not in the icon.

## The 370Z model

Bob's guess is right: the car was copied. There is one mesh, and the site is holding several pastes of it. There is no `.glb` file on disk. The model is packed as text inside JavaScript. Decoded, that text is 1,800,836 bytes. SHA-256 `fdba257f6422e0bb3c4a4f0d2eb874c29a959b56cd90fced549ed4fe5b03e5bf`. Every paste below decodes to that same hash.

It is the Sketchfab model NISSAN_370Z_IMPROVED by WolfGames36 (after hasancarspro454), license CC BY 4.0, exported by Sketchfab 17.8.0. The file has 369 meshes and 745 named parts, and no image textures. The credit is inside the model and again in `shared/zd-embed.js`. Her store app keeps that credit as text in the file. It does not call sketchfab.com.

### Which app loads which

| Where the bytes sit | Who uses them |
| --- | --- |
| `shared/assets/370z-glb.js` (2,401,140 bytes on disk, including the wrapper) | Neon World (`world.html`, `world-split.html`) and Neon Paint (`neon-paint.html`). They load this file, then `shared/zd-embed.js` points the viewer at it. |
| Pasted inside `index.html` | Adult Z-DASH. The page does not request the shared file. The showroom viewer inside this page reads the paste. |
| Pasted inside `jr.html` | Kid App menu. Same: the paste, and the page does not request the shared file. |
| Pasted inside `fly3.html` | Neon Flying, the flying tile on her menu. |
| Pasted inside `fly2.html` | An older flying test. No menu tile opens it. The bytes match. The file stays. |
| `test/shared/assets/370z-glb.js`, `test/jr.html`, `test/fly3.html` | The hidden `/test` preview. The shared-file copy is byte-for-byte the live file today. It is a snapshot. A later edit to the live file leaves the preview alone until that preview is rebuilt. |

History, from the commits: the model first lived in the adult demo. It was copied into Z-DASH JR when that app was added, then into the flying pages. On 22 Oct 2026 the Neon World split (`cbd7f34`) copied those bytes out to `shared/assets/370z-glb.js` and left the pastes in the big pages. That is the copy Bob remembered. The hashes still match, so none of the pastes has been edited on its own since.

Two other drawings sit beside this mesh. They are separate, and this plan leaves them separate.

- `shared/car-wire.js` is a hand-built outline of a 370Z (length 4.25 m and the proportions written in that file), used when she flies. Neon World loads that one file. It is a different picture from the Sketchfab mesh.
- `shared/car-model.js` is the program that draws the Sketchfab mesh. Neon World and Neon Paint load it. The same program text is pasted inside `jr.html`, `fly2.html`, and `fly3.html`. The paste inside `index.html` is the same program through most of its length, and it is missing a few later lines (a camera field-of-view add, and two paint settings). Sharing the mesh leaves those programs where they are. Merging the drawing program is its own yes, and this plan does not ask for it yet.

The other 3D files (sedan, SUV, police, the Kenney traffic set) follow the same paste pattern. Each file in `shared/assets/traffic/` matches the paste inside `index.html`, `jr.html`, `fly2.html`, and `fly3.html`. Neon World already loads the shared traffic files. Those cars belong to her world and move with her at step 5. One file each in the repo, her pages load it, and the pastes stay until you say otherwise. Step 3 is what takes those pastes out of the adult page, and that step already needs your yes.

### One shared copy, and how a new model reaches both apps

Keep a single copy in the repo: `shared/assets/370z-glb.js`, with `shared/zd-embed.js` as the credit and the pointer. Neon World already works this way. Step M points the adult page, her menu, and Neon Flying at that same file, the way Neon World does. Until that switch is proven on `/test/`, each paste stays in the page as the spare.

A per-app copy is the setup you have now, and it is why a new model would miss someone. Editing the shared file updates Neon World and Neon Paint when the phone can reach the network. It leaves the car inside your dash page, her menu, and Neon Flying on the old paste. Choose a per-app copy only if you want the two apps to be allowed to show different cars. In that case each app gets its own file and its own stamp, and a new model reaches the other app when someone copies it on purpose. That choice is a yes. The default in this plan is the one shared file.

Version stamp, so "both" is real:

- Add `ZD_MODEL` next to `ZD_WORLD` in `shared/version.js`. The value is a short hash of the mesh bytes (today that hash begins `fdba257f6422`). Every page loads `shared/assets/370z-glb.js?m=` plus that same value. Bump the stamp only when the bytes change.
- The `?v=30` on Neon World and the `?v=28` still on Neon Paint are the world number, and they already disagree, on the same file. The offline helper matches a shared file while ignoring that `?v=` number, so the number does not keep an old mesh and a new mesh apart in the cache. An online phone gets the new file on refresh, because those pages are network-first. An offline phone keeps the cached file until the cache name changes.
- When the mesh changes, the stamp changes, and the cache name includes the stamp (`world-split-v` plus the world number plus `ZD_MODEL`, and later each app's own cache name). One activate drops the old mesh for every page that uses the shared file. Both workers from step 4 cache that one URL. Her saves are a different store and stay put.
- The `/test` preview is a snapshot. Rebuilding that preview is part of shipping the new mesh, so the preview car matches.

Store apps, at step 7: the build copies that one file into each app package. Her app still runs with no network, and the credit stays inside the file. Both apps record `ZD_MODEL` so you can see they match. A new model is a new build of both apps from the same file. Letting her installed app download the model from `z.beagle.games` later is a separate yes, because her network list stays empty until you approve a first-party host.

Nothing in step M deletes a paste, the `/test` copies, the wireframe, or a traffic file. Removing a paste, after the shared file is what that page actually shows, is its own pull request and its own yes. Rollback before that yes is reverting the pull request that added the script tag; the paste is still in the file. Rollback after a paste has been removed is putting that paste back from git, previewed on `/test/` first.

## Settings

Her gear is your settings screen. Both big pages contain the same panel, pasted in, 6,861 bytes, SHA-256 beginning `6f581c9f0b57c3dd`. It is in `index.html`, `jr.html`, and the hidden preview `test/jr.html`. It is not a shared file. Neon World, Neon Paint, and the flying pages do not have this panel. On her menu the gear button (`#kGear`, titled "Settings (turn Passenger Mode off here)") opens it. On your dash the gear (`#btnSettings`) opens the same panel.

Passenger Mode adds a class that hides every block from the MUSIC heading down. The code that does that is in both pages. What she still sees above that cut:

- Passenger Mode, JOIN DAD'S CAR, SHARE TO PASSENGER, SET PARENT PASSCODE, REGISTER AS DRIVER DEVICE.
- PERFORMANCE: LOW DETAIL, KEEP SCREEN ON, FPS COUNTER, and STILLEN BUMPER (BETA).

What that cut hides, while leaving the markup in her file: Spotify and music sync, the OBD adapter, drive logs, shift light, health-watch limits, the Rotrex reminder, fuel tank size, and the sim replay buttons.

### What is saved today

There is no units switch. Speed, distance, and the tank are miles and gallons, and the health limits are °F. There is no kid sound on/off key. `world/sound.js` is a one-line stub that says sound is future. Game effects call `ZD.Music.sfx` (a siren is one caller). The saved sound values are the adult music keys.

| Saved value | Key | Who the gear shows it to |
| --- | --- | --- |
| Her car name, up to 14 letters | `name` inside `zdash.kid.v1` (a reader also checks `carName`) | The garage name box, not the gear panel |
| Low detail | `zdash.lowdetail` | Both, from the shared panel |
| Keep screen on | `zdash.wake` (missing key means on) | Both, from the shared panel |
| FPS on the dash gear | `zdash.fps` | The gear button writes this key |
| FPS inside her game | `zdash.kidFps` | Her game reads this key. It is a second flag, so the two counters can disagree |
| WANTED steer | `zdash.wantedSteer` | Her game |
| Stillen bumper | `zdash.drvStillen` | Her gear too, because the button sits above the MUSIC cut |
| Music volume, mute, source, beat sync | `zdash.music.vol` (default 70), `zdash.music.muted`, `zdash.music.src`, `zdash.music.sync` | Your rows. Hidden on her gear. Same phone store |
| Shift light, health limits, Rotrex miles | `zdash.extras` | Your rows |
| Tank size | `settings` inside `zdash.fuel` | Your rows |
| Dash widgets | `zdash.layout` | Your dash |
| Parent passcode and which phone is the driver | `zdash.roles.v1` | The buttons at the top of the panel |
| Passenger Mode flag | `zdash.kidOn` | A session flag. A cold open of your dash does not turn Passenger Mode back on from it |

Step 2's spare copy includes her name inside `zdash.kid.v1` and these phone toggles: `zdash.lowdetail`, `zdash.wake`, `zdash.fps`, `zdash.kidFps`, `zdash.wantedSteer`. The spare is a copy. The real keys stay.

### Two screens, and three shared fields

`shared/settings.js` is the only shared settings code. It reads and writes one record, `zdash.settings.v1`:

- `name` — her player name. Copied from `zdash.kid.v1.name`. If that is empty and `carName` is set, copy `carName`. A blank shared record does not replace a name she already has, including a stored `ELLIE'S Z`.
- `units` — `miles` or `km`. Default `miles`, which is what every screen shows today. Adult limits stored as °F and gallons stay stored that way. A later km choice changes the label on screen. It does not rewrite `zdash.extras` or the tank size.
- `sound` — `on` or `off`, for game sounds. Default `on`, so her games keep the sounds they make now. Spotify volume and mute stay on your dash (`zdash.music.*`). Her app does not read those keys. `world/sound.js` will read this switch when sound is built. Until then the switch is stored and her games behave as they do now.

Each app then has its own screen and its own other values.

Her screen, opened by her gear: her name, sound, units, low detail, keep screen on, her FPS counter, WANTED steer, and a parent row for the passcode and JOIN DAD'S CAR. The passcode stays in `zdash.roles.v1` on the phone. It is not one of the three shared fields, and step 8's file does not carry it. Stillen, Spotify, OBD, logs, shift light, health, fuel, and sim are absent from her screen. The Stillen key stays on your side.

Your screen, opened by your gear: the driver rows you have now, including Stillen. It can show her name. It does not have its own box that writes her name, so a dash default cannot replace it. Editing the name happens on her gear and in the garage name box. Both write `zdash.settings.v1.name` and `zdash.kid.v1.name` until you say the profile copy can stop being the second writer. If those two ever disagree, the name inside `zdash.kid.v1` wins, and the shared record is updated to match.

Her other toggles are seeded once into `zdash.jr.settings.v1`, from the keys above, so the split starts from the choices already on the phone. Low detail and keep-awake are copied as they are today (keep-awake counts as on when `zdash.wake` is missing). Her FPS field is `zdash.kidFps` when that key is set, and otherwise one copy of `zdash.fps`, so the gear's last FPS choice is kept. After that, her screen writes her record. It does not keep writing `zdash.fps`, so her counter and your dash counter can differ. Your dash keeps writing the keys it writes today.

The record has a version number. A later field is added beside the ones already there. A save reads the record, changes one field, and writes it back, so an older page does not drop a field it does not know.

On one website, `/` and `/jr/` still see the same store, so the shared record is just a key. On two store apps, step 8's file and the QR link carry `zdash.settings.v1` next to the garage blob. Sound, units, and her name arrive with the garage. Each app's private toggles stay in that app.

Nothing in step S deletes a key, the pasted panel, or the `/test` copy of it. Removing the pasted panel from a page, after that page's own screen is what the gear opens, is its own pull request and its own yes. Until then an old page still reads the old keys, and a new page reads the new record and falls back to the old key when the new record is missing. Rollback is reverting the new gear. Both copies of her values are still on the phone.

## How this sits next to the other work

- FPS agent `bc-da7101de` (pull request 56, and the dashboard parking still on that branch): owns step 1. This plan does not edit `jr.html` in parallel with them.
- Speed plan (`docs/SPEED-PLAN.md`, pull request 63): Neon World drawing only. It does not edit `index.html`. URL redirects in step 5 exist so that work can keep saying `world.html`.
- Resolution audit and FPS Guard: kid pages only. The new isolation check belongs with the existing adult-isolation audit, not with the frame-time bench.
- Adult `index.html` stays the dash until step 3, and step 3 waits for your yes.

## What this pull request does not do

No file moves, no service-worker edits, no DNS, no store listings, no save migration, and no model or settings file deleted or merged. The 370Z check and the settings-panel check are hashes of copies already in the repo. Build for a step starts when you write "plan approved, build it" and, on the steps marked above, "yes".
