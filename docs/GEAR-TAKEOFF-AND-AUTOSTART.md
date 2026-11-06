# Gear, takeoff, and auto-start — investigation only

Documentation only. No app behavior changes. This does not make the adult app store-ready.

Two trees were compared. The gear, scoring, CSV, and OBD statements below are the same text in both. Line numbers differ because the unmerged adult cleanup removed other code, not because these functions were edited.

| Tree | What it is | Commit |
| --- | --- | --- |
| Live site | `main`, what GitHub Pages publishes | `b6f3708` |
| Review build | PR118, adult Passenger Sharing removed. Not published. | `bb1c73b` on `cursor/remove-adult-share-19b9` |

Citations are `main` line, then PR118 line. Example: `index.html` 4844 / 4447.

Bob's car, as previously recorded in the app and in this request: 2010 manual 370Z, supercharged, EcuTek tune, EcuConnect logs and an OBDLink used historically. The exact adapter plugged in today, whether the ECU exposes gear / neutral / reverse / clutch, and whether a native Android wrapper exists on a phone are unknown until a log or the wrapper project is in hand. The code default `zdash.adapter` is `obdlink-lx` (`index.html` 8922 / 5965, comment dated Oct 18). That is a saved default, not proof of the adapter in the car.

No hardware was connected for this note. Nothing here is a generic OBD capability claim, and no Nissan Mode 22 PID was added or assumed.

## What each input actually provides

Live OBD (`Elm327Source`) polls standard Mode 01. The fast request is `010C0D110B` (`index.html` 9068 / 6111): RPM, vehicle speed, throttle, MAP. Every live frame is then emitted with `gear: null` and `clutch: null` (`index.html` 9083 / 6126). The protocol table has only `elm327`. An `ecutek-evi` protocol is a comment about a future plug-in (`index.html` 8930 / 6048). It is not built.

`ZD.CLUTCH_CANDIDATES` is never defined. The clutch probe loops an empty list and records status `unknown` (`index.html` 8640 / 5683 and 5724 on PR118). The comment in that block says a Nissan clutch switch over Mode 22 or CAN is not confirmed for this car, so none is shipped.

CSV replay (`ZD.parseCsvLog`, columns at `index.html` 8836 / 5879) will use a gear or clutch column only when the header matches `/gear/i` or `/clutch/i`. The comment above the table says the names vary and should be edited once Bob's file is seen. A header that merely contains those letters (for example a gearbox temperature) can map the wrong column. That is a code footgun, not evidence that EcuConnect has a gear channel.

The demo simulator invents neutral, clutch, and launches so the scorer has something to grade (`index.html` 4871 / 4474). Demo frames are not the car.

`window.ZDNative` is only a call site: `connect`, `write`, `onData`, `close`, plus `shareFile`. If it is missing, live connect throws `Native bridge not present (only in the Android app build)` (`index.html` 8980 / 6023). This repo has no Android project, no Gradle file, and no `AndroidManifest.xml`. A separate historical cloud agent (`bc-9e53207c`) was an Android TWA test; that wrapper is not in this repo and was not re-opened for this note.

## Gear is ratio inference, not a measured gear

`ZD.CAR.gears` is the six forward ratios `[3.794, 2.324, 1.624, 1.271, 1.0, 0.794]` with final drive `3.692` and a rear tire `295/35R19` (`index.html` 4782 / 4385). There is no reverse ratio.

`ZD.inferGear(rpm, mph)` (`index.html` 4844 / 4447):

- Returns `null` unless speed is over 4 mph and rpm is over 400.
- Picks the forward gear whose rpm-per-mph is closest.
- Returns that gear only if the relative error is within 7%. Otherwise `null`.

Using those constants, locked rpm per mph is about 174, 106, 74, 58, 46, 36 for gears 1 through 6. First is about 1.63 times second, so a locked first gear is not close to second. A miss of first is the function returning `null`, not a likely swap of 1 and 2. This arithmetic uses the numbers in the file. It is not a measurement of Bob's speedometer or tire.

The shift scorer (`index.html` 5194 / 4797) does not trust a single guess:

- A live frame's `gear` is `null`, so the scorer calls `inferGear`.
- It latches a gear only after three frames in a row agree, and only while it does not already have one.
- It starts a scored shift only when a gear is already latched, speed is over 6 mph, and the ratio then moves to a different gear (or a real boolean clutch input goes down).
- Below about 3 mph with no matching gear, it clears the latched gear.
- A shift that lasts over 4 seconds, or speed that falls under 4 mph, is abandoned.

The drive-screen glyph (`index.html` 9869 / 6912) is:

- `N` only when the frame's gear is exactly `0`.
- `1`–`6` when the frame's gear is in that range.
- Otherwise the latched scorer gear, if the frame's clutch is not `true`.
- Otherwise `–`.

Live OBD never sends `0`, so the screen cannot show a measured neutral. At rest the inference is `null` and the latch is cleared, so the screen is `–` (unknown), not `N`. That is the safe behavior already in the code. It must stay unknown during clutch slip too: slip is exactly when rpm and speed do not match a gear, so inference returns `null`. Showing the previous gear through that moment would be a stale label. The screen does keep the latched gear while `f.clutch` is not the boolean `true`. On live OBD clutch is `null`, so a gear latched earlier can remain on screen until speed falls under about 3 mph. That hold is a display choice, not a signal that the gearbox is still in that gear.

The warm-idle check treats `gear == null` plus throttle under 3% as neutral (`index.html` 5638 / 5241). That is only for the idle-dip detector. It is not a neutral switch, and it can count "stopped, foot off the throttle, gear unknown" as idle even if the transmission is in gear with the clutch down.

### Why first can be missing (code, not a new theory)

Confirmed from the thresholds above:

1. Live OBD does not supply a gear.
2. Under 4 mph, inference is forced to `null`, so the pull away from a stop has no first gear yet.
3. OBD speed is used as a coarse mph value. The scorer comment on cruise `downLurch` (`index.html` 5142 / 4745) says OBD speed comes in 1 mph steps. A 1 mph step is a 25% ratio error at 5 mph, about 11% at 10 mph, and about 7% at 15 mph. The acceptance band is 7%, so first often fails the band until speed is well clear of the 4 mph floor, before tire growth or clutch slip is considered.
4. While the clutch is slipping, rpm does not match any forward gear, so inference stays `null` and the three-frame latch never starts.
5. A 1→2 shift is scored only if first was already latched. If the car is in second before three clean first-gear frames have landed, the scorer never had a "from" gear. The screen can go from `–` to `2`.
6. CSV text `N` or `R` does not survive parsing. The cell is `parseFloat`'d (`index.html` just after the column table, 5918 on PR118). `parseFloat("N")` and `parseFloat("R")` are not numbers, so the frame gear becomes `null`. A numeric `0` would display as `N`. A numeric `-1` is not `0` and is not `>= 1`, so it is ignored and inference runs instead. There is no reverse glyph.

Hypothesis, not confirmed: Bob's EcuConnect file might already contain a gear or clutch column the app would use if the header matches. That is why the log below is the next evidence. It is not a reason to invent a PID.

Reverse: there is no reverse ratio and no reverse state. A reverse ratio close to first could be mislabeled as first if it fell inside 7%. The repo does not contain that ratio, so this note does not claim the car would or would not be mislabeled. Unknown stays unknown.

## Takeoff scoring

There is no takeoff score on measured frames.

- The 0–60 / 60–130 timer (`index.html` 5657 / 5260) starts when speed crosses 0.5 mph upward. It does not read gear or clutch. It is a timer, not a smoothness grade.
- The road dyno discards pulls in gear 1 and 2 (`index.html` 5367 / 4969) and says those gears are traction-limited. That comment is the app's own estimate policy, not a measured clutch result.
- Shift points come from rpm change versus the inferred ratio, and from speed jerk (`clutchRate`, `lurch` in `ZD.SCORING`). The scorer text calls the rpm rate "clutch smoothness." It is a proxy for how fast rpm is pulled toward the new gear's ratio. It is not clutch pedal position, slip distance, or clutch wear.
- The demo driver has a scripted launch. That path does not run on a live adapter frame.
- Cruise mode already subtracts from the driving score when longitudinal accel from speed exceeds about 0.45 g. That penalizes a harsh start. It still is not a clutch measurement.
- Race-mode coaching text tells the driver to hold high rpm and get back to full throttle. A future takeoff feature must not copy that. It must not award points for a launch, wide-open throttle, or high speed, and it must not label an estimate as measured clutch position.

A takeoff score is not justified until a log shows a real clutch or gear channel, or until Bob accepts an explicitly labeled smoothness proxy (rpm-to-ratio rate and speed jerk only) that stays off by default and does not rank launches.

## What a log can already export

Settings → EXPORT RUN writes the run recorder (`R.sample`, `index.html` 8722 / 5765). Each sample row has rpm, speed, a gear cell, throttle, coolant, and the raw Mode 01 values from the last poll. The gear cell is the frame gear, else the scorer's latched gear, else `inferGear` when speed is over 3 mph, else blank. On a live adapter the frame gear is `null`, so a parked idle row has a blank gear cell. That is useful: it shows the live path received no gear. It cannot reveal a gear channel the poll never asked for.

The recorder stores rows in IndexedDB (`zdash-runs`) and leaves the phone through the share sheet or a download. This note did not find the recorder uploading samples. Continuous collection, if it is ever built, has to stay on the device the same way. Recording more is not permission to send the log anywhere.

## One log Bob can provide

The easiest check needs no driving and no phone use in the car.

From a computer, send an EcuConnect CSV that already exists. The header row is the part that matters, plus two or three data rows from a time the file already shows the engine idling (speed about 0). Do not record a new drive for this.

What that file answers:

- Whether any column is actually named like gear, neutral, reverse, or clutch.
- Whether those cells are numbers, `N` / `R`, or blank at idle.
- Whether the app's `/gear/i` match would bind the right column.

Until that file is seen, gear on the live path remains the 1–6 inference above, neutral on the live screen remains unknown (`–`), and reverse remains unsupported.

## Proposed next implementation PRs

Not started. PR115–118 stay as they are.

1. **Display and parser tests only, in this repo.** Keep `–` for unknown. Do not paint `null` as `N` or invent `R`. Add tests that `inferGear` is `null` at 4 mph and below, `null` when the ratio is outside 7%, and a gear only inside that band; that CSV cells `N` and `R` stay unknown; that numeric `0` is the only `N`; that a live-style frame (`gear: null`, `clutch: null`, speed 0, rpm at idle) draws `–`. No new PIDs and no scoring change.
2. **Map a verified column, only after the EcuConnect header is in hand.** If, and only if, that file has a gear or clutch column whose idle and driving cells match the header, prefer that column over inference and lock the header strings in a fixture test. If the column is absent, close the PR with that finding. Do not guess a Mode 22 PID.
3. **Takeoff score: do not build yet.** If a later PR adds anything, it is a cruise-only note from the existing rpm-rate and speed-jerk proxies, labeled "estimate, not clutch position," default off, no points for throttle or speed, and it must not coach a harder launch.

## Auto-start when the car or the OBD port wakes

Bob asked for a setting, default considered here as off, that starts the app and keeps it collecting when the car or the OBD port starts sending a signal. Optional. Android and native requirements are not met in this repo, so this note does not add a switch.

### Two different requests

- **Foreground auto-launch** means the dash screen comes up by itself. Android 10 and later block an app from starting an activity in the background except in listed cases (a visible window, a notification the user taps, a companion-device association, and the other cases in [Restrictions on starting activities from the background](https://developer.android.com/guide/components/activities/background-starts)). A closed Z-DASH does not qualify just because an OBD plug got power.
- **Background collection** means a process keeps the adapter link and writes local samples while the screen is not in front. That is a foreground service, not an activity launch. From Android 12, an app targeting that release cannot start a foreground service from the background except in listed cases, or the system throws `ForegroundServiceStartNotAllowedException` ([Restrictions on starting a foreground service from the background](https://developer.android.com/develop/background-work/services/fgs/restrictions-bg-start)). Android 14 requires a service type and its permissions ([Foreground service types](https://developer.android.com/develop/background-work/services/fgs/service-types)). The type that matches a Bluetooth accessory is `connectedDevice`, with `FOREGROUND_SERVICE_CONNECTED_DEVICE`, and a granted Bluetooth runtime permission (`BLUETOOTH_CONNECT` or `BLUETOOTH_SCAN`). `startForeground()` is what makes that work user-visible; the platform shows the service's notification. A silent always-on poll is not the supported shape.

Android's own Bluetooth background guide says a connection can continue while the app is in the background, but the process can still be killed, and starting an activity or a foreground service from the background is restricted ([Communicate in the background](https://developer.android.com/develop/connectivity/bluetooth/ble/background)). One documented exception is Companion Device Manager with `REQUEST_COMPANION_START_FOREGROUND_SERVICES_FROM_BACKGROUND`. Whether Bob's adapter can be registered that way is unknown. The in-repo profiles use classic Bluetooth serial for OBDLink MX+ and LX, and BLE for OBDLink CX (`index.html` 8920 / 5963). Classic serial and BLE are not the same permission and scan story. The phone's Android version is also unknown.

### What the website can and cannot do

The published app is a page. Web Bluetooth and Web Serial run only while that page is open, and the page cannot be opened by the adapter. A service worker does not receive OBD bytes for a closed tab. A Settings switch in `index.html` that claimed to "turn the app on with the car" would not work. This note does not add that switch and does not suggest a browser workaround that pretends to wake a closed app.

A native package could do the smaller job: user turns the setting on, the app is allowed to hold a foreground service with a visible notification, and samples stay on the phone. Bringing the dash activity forward on its own is a separate, mostly disallowed step. The honest setting is "keep collecting while the car is running," not "open the screen by itself." Even that setting waits on a real Android project.

### OBD power is not ignition

The OBD connector can be powered with accessory, with ignition, or constantly, depending on how the car is wired. This repo does not document which of those the 2010 370Z does. A Bluetooth socket can also stay up after the key is off. RPM at 0 is not enough to call the engine off: the recorder already treats rpm at or above 400 as "the engine ran" (`R.sample`), and a single 0 can be a stall, a poll gap, or an ECU that has stopped answering while the adapter is still powered.

A later native design, if the wrapper exists, should use all of these bounds:

- Default off. The first run does not monitor.
- Turning the setting off stops the service and any reconnect timer immediately, and nothing starts again until the user turns it on.
- Start collecting only after a user-granted foreground service is allowed to run, and only after the adapter link is up and RPM has stayed above 400 for several seconds. RPM `010C` is a signal this app already polls. It is not a new Nissan PID.
- Stop after the socket is gone, or after RPM has stayed at 0 and no frames have arrived for a bounded stretch. Then wait with backoff before a reconnect scan. Do not poll forever while the car is parked.
- Write samples only on the device. Do not upload them.
- Keep the notification for as long as the service runs, so the collection is visible and the user can stop it.

### Artifact required before any implementation PR

The next auto-start PR is not a change to `index.html`. It needs the Android project that actually creates `window.ZDNative` (`connect`, `write`, `onData`, `close`) and that is not in `rbeaglemedia/z-dash`. A TWA shell that only opens the website still cannot hold an OBD socket after the page is gone, so a TWA test build is not that project.

When that project is found, the minimal PR is:

- One opt-in, default off.
- A `connectedDevice` foreground service with its permission and a visible notification.
- Manual off cancels the service and the reconnect work.
- No background activity launch.
- Local log only, same fields the run recorder already stores.
- Tests: with the setting off, no service starts; turning it off stops a running service; a lost socket does not tight-loop; a frame with rpm 0 does not by itself count as a finished trip; the service does not open a network upload.

Until that project is in hand, there is nothing safe to build.
