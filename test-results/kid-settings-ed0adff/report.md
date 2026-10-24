# PR #83 kid settings check — FAIL

Head `ed0adff91538d33b51ebe93628491b9c3df3add4` on `cursor/kid-lazy-driver-9e5c` (parent `097c351`). Compared with `origin/main` `e279c9a`. No deploy.

The new gear screen is only on the hidden preview `test/jr.html`. Live `jr.html` and live `index.html` are byte-identical to main.

| Check | Result |
| --- | --- |
| Adult `index.html` untouched | PASS |
| Gear does not load Spotify, OBD, driver shell, or phone-link | PASS on `test/jr.html` |
| Shared keys keep Ellie's values | PASS |
| Phone, iPad, and PC | Opens on all three. Phone landscape 844×390 covers LOCKS with DONE |
| UI Polish | FAIL |

## Adult index.html

`index.html` blob is `0bcb666f6bf4252985a65a3c298df0ecff8582f4` on both `e279c9a` and `ed0adff`. The branch diff is `test/` plus test-results only. A live load of `/index.html` has no `#kSet` and does not request `app-settings.js`, `kid-seam.js`, `kid-idle.js`, or anything under `/test/`.

Live `jr.html` is also unchanged (`d29240d04d5c2986f987d033d4e93b086bb0d534`). Its gear still opens the adult panel:

`$('#kGear').addEventListener('click', () => { if (ZD.Settings) ZD.Settings.toggle(); else $('#settings').classList.remove('hidden'); });`

## Adult scripts from the kid gear

On `test/jr.html?stay=1&nokstart=1&kmenu=1` the gear click only runs `openKidSet()` / `closeKidSet()`. It does not call `ZD.kidLoad`. After the click, script list is unchanged:

- `shared/kid-idle.js`
- `shared/kid-seam.js`
- `shared/app-settings.js`
- `shared/version.js`
- `shared/ipad.js`
- `driver/roles.js` (parent passcode; already on the page before the gear)

No `music.js`, `obd-source.js`, `shell.js`, `link.js`, `qrcode.js`, `jsqr.js`, or Spotify host. `ZD.Music` is absent. Adult `#settings` stays `display: none` and `.hidden` while `body.kidon` is set. Editing name, volume, mute, low detail, and wake adds no adult scripts.

`ZD.kidLoad('adult')` still exists, and it still fetches Spotify, OBD, shell, and phone-link, but only from `setOn(false)` (leaving Passenger Mode). The JR page forces Passenger Mode on, so opening the gear does not take that path.

## Shared keys

Seeded before load: name `ELLIE`, `zdash.music.vol` `55`, muted `0`, low detail `0`, wake `1`, plus coins 12, stars 3, shifts 41, `carName` `ELLIE Z`, `ellieNote` `keep-me`, house, and the other profile keys.

The open screen read them back: `HI, ELLIE · ELLIE`, VOLUME 55, LOW DETAIL OFF, KEEP SCREEN ON ON, MPH.

Saving the name `GLOW UP` left `ellieNote`, `carName`, coins, stars, shifts, paint `cyan`, rims `gtx04`, and `house` in place. Volume, mute, low detail, and wake were still the seeded values until those controls were used. Setting volume 42, mute on, low detail on, and wake off wrote `42`, `1`, `1`, and `0`. These sibling keys were unchanged: `zdash.house.v1`, `zdash.char.v1`, `zdash.pet.v1`, `zdash.crew.v1`, `zdash.neonpaint.v1`, `zdash_vinyls_v1`, `zdash_neon_paint_v1`, `zdash.customdance.v1`, `zdash.petdance.v1`.

The name save rewrites `zdash.kid.v1` through the existing JR profile object, so empty equipment slots get the page's default ids. Ellie's own fields stay.

## Phone, iPad, PC, and UI Polish

Headless Chrome, same viewports as `tools/ui-polish-audit.js`, gear opened, then that auditor's overlap / clip / font / touch checks. Screenshots are in `screenshots/`.

| Viewport | Screen opens | UI Polish errors |
| --- | --- | --- |
| phone 844×390 | yes | LOCKS overlaps DONE by 80×17px |
| phone 390×844 | yes | 0 |
| phone 667×375 | yes | 0 |
| iPad 1180×820 | yes | 0 |
| iPad 820×1180 | yes | 0 |
| iPad 1024×768 | yes | 0 |
| PC 1366×768 | yes | 0 |
| PC 1920×1080 | yes | 0 |

DONE is `position: sticky; bottom: 0`. On the short phone landscape the LOCKS button sits under it. That is an error in the UI Polish tool, so this screen does not pass UI Polish.

The MPH label (`#kSetUnits`) is `text-align: start`. Buttons and the title are centered and not underlined. The UI Polish menu rule does not select `.units`, so that label is not what fails the tool.
