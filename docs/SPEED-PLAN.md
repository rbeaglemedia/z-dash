# Neon World speed plan

Planning only. This file does not change the game, and it does not deploy.

Kid App only: `world.html` and `world-split.html` load the same scripts, so one drawing fix covers both. Adult `index.html` stays untouched.

The live game that was measured is commit `a265d75` (root pages). `origin/main` at `679e4bb` adds a hidden `/test` preview of the in-flight frame work. That preview is pull request 56. It is not a second copy of this plan.

## For Bob

Roblox feels smooth because the picture is drawn on the graphics chip, at a steady beat, and a slow machine quietly drops detail instead of stuttering. Neon World draws the city as hundreds of lines on a flat canvas, then copies a 3D picture of the Z back onto that canvas every frame. That copy is the expensive part.

Two clocks matter:

| Goal | How fast a frame has to finish |
| --- | --- |
| Galaxy, steady 110 | under about 9.1 ms, held, not averaged |
| Galaxy panel at 120 Hz | under 8.3 ms |
| Ellie's iPad, steady 60 | under 16.7 ms |
| Ellie's iPad, steady 30 (the acceptable floor) | under 33 ms, every frame, with no drops to 5 |

What you see today: the Galaxy sits around 70–90 and flickers between about 55 and 115. Ellie's base iPad on iPadOS 17.7.8 Safari sits around 5–30. A steady 30 feels smoother than a number that swings from 5 to 30, even when the average looks similar.

The 2018 base iPad is the machine that cannot leave iPadOS 17. It has an A10 chip, 2 GB of memory, and a 60 Hz screen. Its landscape page is 1024×768. A newer iPad that simply has not been updated would be faster. The 5–30 band matches the older one, so this plan aims at that one.

A loading screen of about 10 seconds on a fast device, and longer on the iPad, is a fair trade. The game may bake cars, glow, and shaders then. The picture during play stays the picture you have now unless you say yes to a change below.

### Where the time goes

Measured in a lab browser that fakes the graphics chip in software (SwiftShader). Those milliseconds are **not** the Galaxy's frame rate and **not** the iPad's frame rate. The counts — how many strokes, how big the pictures — are what the code does on the real devices too. Full numbers are in `test-results/speed-plan-profile.json`.

On the phone-sized picture (drawing buffer 1688×780, which is what the game already uses when the Galaxy reports a pixel ratio of 3):

- A normal flying frame spent about **66 ms**. About **62 ms** of that was drawing the Z, and about **59 ms** of that was copying the finished Z off the graphics chip onto the flat canvas.
- The same frame with the Z turned off was about **3 ms** of script plus about **9 ms** of software paint. The city, the roads, the traffic sprites, and the dashboard fit in that.
- The frame issued about **340 strokes**, **220 fills**, and **50 live glows** (`shadowBlur` turned on). The glow is assigned about 150 times a frame, and about 50 of those are a real blur.
- The light frames in the same run (about 3.5 ms) are the existing "skip the Z this frame and reuse last picture" path. It only switches on after the meter stays under 58. A Galaxy sitting at 70–90 never takes that path, so every Galaxy frame pays for a fresh Z.

On the base-iPad-sized picture (drawing buffer **1024×768**, game pixel ratio forced to 1):

- The 1440×1080 cap does not shrink this screen. The buffer is the full page.
- A normal frame spent about **118 ms**. About **114 ms** was the Z, and about **111 ms** was the copy.
- The graphics-chip picture of the Z was **960×960**. On the phone-sized run it was **480×480**. The iPad is copying about four times as many pixels for the same car, because the car's buffer follows the device pixel ratio (2) while the city buffer is forced to 1.
- With the Z turned off, script was about **3 ms** and software paint about **5 ms**. In this lab the iPad city is cheaper than the phone city, because the buffer is smaller and software paint is kind to glow. Ellie's real iPad is slow for the opposite reason: the graphics chip has to do those 50 glows, and it has to wait on that 960×960 copy.

Other measured facts:

- 88 buildings, 150 solid boxes, 30 traffic cars (12 of them fully simulated).
- While cruising or flying, the close-up window grids are already off (0 window faces over the runway). The slow building art is not the open-air frame.
- A traffic view that has never been drawn spikes one frame by about **20–70 ms**. Once that view is in the cache, the traffic pass is about 0 ms. That hitch is what the loading screen in pull request 56 is for.
- The purple ground grid is about **0.5 ms**. Batching it would not move the Galaxy to 110 or the iPad to 30.
- Driving math, the crew, and the on-foot buttons were under 0.1 ms in the October 22 bisect. This lab did not re-time them. They are not the frame.

So the ranked work below is aimed at three real costs: the copy of the Z, the live glow on a weak graphics chip, and a frame clock that wobbles instead of locking.

### What is already being built

These are in flight. This plan does not redo them.

| Work | Where | What it already covers |
| --- | --- | --- |
| Frame pacing, iPad size ladder, loading-screen bake | Pull request 56, and the hidden `/test` preview on main (`679e4bb`) | The Z skips a redraw only when **its own** frame stays slower than 8.6 ms, and comes back only under 7.2 ms. A 70–90 average can no longer flap the skip. iPad-only size steps: 100%, 84%, 70%, 58%, 48%, 38%, and only while that iPad misses about 55 fps. Phones stay full size. Traffic pictures and shaders bake on the loading card (about 10 s fast, longer on a slow iPad). One animation callback. `?perf=1` draws the frame-time graph. |
| WebGL city prototype | Pull request 59, `?gl=1` | Buildings and glow on the graphics chip, behind a flag. The lab script cost is a few tenths of a millisecond, and nothing copies the city picture back. The picture is close (about 94–98% of pixels within a small step) and still needs your eye before it becomes the default. |
| Resolution audit | Cloud agent `bc-187f66f3`, still running | Owns the "Z looks soft, then snaps sharp" bug, the `?perf=1` readout of buffer versus page size, and a clamp so every offscreen picture stays inside its budget. The 960×960 versus 480×480 car buffer measured here is their bug to fix. |
| FPS Guard | Cloud agent `bc-80b22465`, branch `cursor/perf-guard-a3ad`, still running | A lab check on every pull request. It compares software-graphics times with a saved baseline. It will not fail a pull request until the frame work has landed and the baseline is refreshed. It does not claim a Galaxy or iPad frame rate. |

Pull request 56's own lab note matches this profile: on that preview the car copy was 58 ms of a 61 ms phone frame, and the skipped frame was about 2 ms. That branch steadies the flicker. It does not make the copy itself fit in 8.3 ms. A flat 110 still needs the copy to go away.

### Ranked plan

Do these in order, after you write "plan approved, build it". Each line is one reviewable change. Slow-device picture changes stay on the slow device. Anything that touches every device is in the yes/no list, even when the goal is an identical picture.

**1. Leave the Z on the graphics chip.**

Today the Z is drawn in 3D, then copied into the flat canvas, then the dashboard is painted on top. The copy is the frame. Draw the Z into its own graphics-chip layer and paint the city and the dashboard in the layers they already have, so nothing reads the picture back.

- Galaxy: this is the change that can move 70–90 toward a steady 110. On the phone the whole frame is already about 11–14 ms. The lab says the copy is most of the heavy frame, and pull request 56 says the heavy frame is the one that misses 8.3 ms. Removing it leaves the city, the glow, and a cheap paste of the Z. If those fit in about 9 ms, 110 holds. If the glow is what is left, item 4 finishes the job.
- iPad: largest single cut. The lab copy was about 111 ms from a 960×960 picture. Taking that stall off an A10 should lift the bad end of 5–30 by a lot. It does not, by itself, promise 60.
- Risk: the dashboard is drawn on the city canvas after the car, so the layer order has to be designed or a line of the HUD can slip under the car. One-pixel seams are the failure mode.
- Effort: medium. The car draw, the page canvas stack, and a screenshot compare. No new engine.
- Picture: meant to be the same. It is yes/no 1 because it changes every device.

**2. Lock a steady beat.**

Roblox shows a new picture on a fixed clock. Neon World asks the screen for the next frame as soon as the last one finished, so a 120 Hz Galaxy alternates a heavy frame and a light one and the meter reads 55, then 115. Pull request 56 stops the Z-skip from flapping. It does not yet hold the screen on one clock.

- Galaxy: while frames fit in 8.3 ms, stay on the 120 Hz beat (that is the 110+ goal). When they miss, hold a flat 60 instead of wobbling. A flat 60 is smoother than 55–115 and it is not 110. 110 still depends on item 1.
- iPad: the panel is 60 Hz. Hold 60 while frames fit in 16.7 ms. When they do not, hold 30. A flat 30 is the acceptable result on this iPad. Drops to 5 go away once every frame fits in 33 ms.
- Risk: locking 60 on the Galaxy too early would throw away the 120 Hz panel on a day the game could have held it. The rule is "120 when the frame fits, 60 when it does not," with a gap so it does not hunt.
- Effort: small. One clock in the city loop, on top of the preview's car timer.
- Picture: each shown frame is the same scene. The motion gets steadier. Yes/no 2, because every device feels it.

**3. Let the resolution audit clamp the car buffer.**

Measured here, not fixed here. iPad city buffer 1024×768 at pixel ratio 1, car buffer 960×960. Phone city buffer 1688×780, car buffer 480×480. The audit agent is already tracing that snap and that extra scale. A second clamp in this plan would collide with them.

- Galaxy: the city is already capped at pixel ratio 2 (1688×780 on a ratio-3 phone). Confirm the car uses that same cap. Gain is small if item 1 has already stopped the copy.
- iPad: if the copy still exists, cutting 960 down toward the city size is about four times fewer copied pixels. Stacks with the size ladder in pull request 56, which only shrinks the city buffer.
- Risk: a wrong clamp makes the Z soft on a fast iPad. The audit's rule is full quality from the first frame, inside the budget.
- Effort: theirs. This plan waits for their pull request.
- Picture: the snap goes away. A fast device stays sharp. A slow device stays inside the budget it already has.

**4. Draw glow once, at load.**

About 50 live blurs a frame: the horizon line, the rings, and the dashboard strokes. The rule is no new `shadowBlur`. The blurs already in the game stay until you approve a replacement. Software paint hides their cost (the 9 ms phone flush includes them and still looks cheap). A phone graphics chip, and especially the A10, does not hide them. Each blur builds a second picture and smears it.

- Slow devices first: during the loading screen, draw the horizon glow, the ring glow, and the dashboard glows into small pictures, and paste those. The Galaxy keeps today's live glow until the screenshots match.
- Galaxy, only if you say yes to the all-device version: a few milliseconds, which is the gap between "close to 110" and "holding 110" after item 1.
- iPad: this is the other large cut, next to the car copy. Expected to matter as much as resolution on the A10, because blur cost does not shrink as nicely as a smaller buffer.
- Risk: the glow looks different. Side-by-side shots from the same camera spots decide it. If they do not match, it stays on the slow device only, and you still have to accept that look on the iPad.
- Effort: medium. Bake during the loading card pull request 56 already added. No blur radius gets added anywhere.
- Picture: yes/no 3 for every device. Slow-device-only is the fallback and still needs your eye.

**5. Grow the WebGL city, still behind the flag, and give it a resolution knob.**

Pull request 59 draws buildings and glow on the graphics chip without copying them back. That is the Roblox-style city. Keep it on `?gl=1` until you accept the picture. Then the iPad's size ladder should scale that one graphics-chip image, which is how a quality setting actually works. The Galaxy stays at full size.

- Galaxy: small once item 1 has landed. The city is already the cheap part of a phone frame (about 1 ms of script in this lab, under 1 ms in the preview's own note). Use `?perf=1` on the real phone. If it names the city, this item moves up.
- iPad: this is the path from a flat 30 toward a flat 60. A graphics-chip city at a smaller internal size is a soft picture on purpose, and only on the slow device. Promise 30. Treat 60 as a measurement on Ellie's iPad after this exists, not as a number this plan can guarantee on an A10.
- Risk: edges already differ a little in the prototype (a few percent of pixels, mostly outlines). Your screenshots are the gate.
- Effort: large, and already started. Extend `world/gl-city.js`. Do not start a second graphics project.
- Picture: unchanged on the Galaxy. Softer only on a device that cannot hold the frame, which is the ladder you already have in the preview.

**6. Fallback only: a book of Z pictures baked at load.**

Use this only if you say no to item 1. Traffic already works this way (a picture per paint and angle, 160 px, two new ones a frame, cache of 140). The chase camera sits at a fixed distance, so the Z could be a book of angles baked during the 10 seconds.

A fine book is too big for 2 GB. A book that fits (on the order of 10 MB) steps the angle, and the Z would click between views the way distant traffic does. That is a visible change, so it would be slow-device only. The Galaxy would keep the live Z. Item 1 is the better version of the same idea: one live picture, no copy, no angle steps.

**7. Ship the app in a web shell. Do not rewrite the engine yet.**

You are in the Apple and Google Play programs. The store build should be a shell around these pages (Capacitor is the usual one). On iPhone and iPad that shell is WKWebView, which is the same WebKit engine as Safari. On Android it is the system WebView, which is the same family as Chrome. Full screen, no browser bar resizing the canvas, the game stays the foreground app. That is worth a little speed and a lot of polish. It is not the jump from 5 fps to 60. Do it after the frame is accepted, as its own job, so a store review is not mixed with a drawing change.

A native engine (Metal on the iPad, Vulkan on the Galaxy, which is what Roblox actually runs) would throw out the flat canvas and the copy. That is a new drawing program for the city, the Z, and the traffic. It is the right move only if, after items 1 through 5, Ellie's iPad still cannot hold a flat 30. That is not clear yet. This plan does not start that rewrite.

### What a flat 110 and a flat 30 need, together

On the Galaxy, items 1 and 2, then a real-phone `?perf=1` check. If the worst frame is under about 9 ms, 110 is held and item 4 can wait. If the graph names glow, item 4 on the phone is the follow-up, and that is a yes/no because it changes every device.

On the iPad, the preview's size ladder plus items 1, 3, and 4. The promise at the end of that set is a **flat 30**, with the picture softer only on that iPad. Item 5 is how a later build tries for 60. Item 7's shell does not change those odds in a way you would feel.

### Yes/no, every device, picture stays if the shots match

Reply yes or no to each. None of these ship inside this pull request.

1. **Leave the Z on the graphics chip** on every device (item 1). Same car, dashboard on top, no copy back. Screenshots from the same spots before it is the default.
2. **Steady clock** on every device (item 2). Galaxy on the 120 Hz beat while the frame fits, otherwise a flat 60. iPad a flat 60, or a flat 30 when the frame cannot finish in 33 ms.
3. **Baked glow on every device** (item 4), only after side-by-side shots match. Until they match, the bake is iPad-only and you still sign that iPad look.
4. **One-stroke ground grid.** Same lines, under a millisecond. Low value. Included so it is not snuck into a later change.

### Slow devices only

These may change sharpness on the iPad and must leave the Galaxy and the PC on today's picture.

- The size ladder already in the `/test` preview (down to 38% only while the iPad misses about 55 fps).
- The car-buffer clamp from the resolution audit.
- Baked glow, if you say no to yes/no 3 and yes to the iPad-only look.
- A smaller internal picture on the WebGL city, after you have accepted that city, and only while the iPad frame is late.
- The 30 fps lock, only while 60 does not fit.
- The angle-book of the Z, only if you say no to yes/no 1.

Close-up windows, roof trim, and corner shapes already turn off with speed. Roof trim and corner shapes were dropped earlier because they held downtown near 26–31 fps. They stay off. This plan does not bring them back, and it does not thin the windows on the Galaxy.

### Loading screen

Already the design in pull request 56: a "waking the city" card, about 10 seconds on a fast device, longer on the iPad, with a list a server can replace later (`world/warm-manifest.json` in that branch). This plan adds, when those items are approved:

- Glow pictures (item 4), on the slow path first.
- A tiny warm-up draw of the Z so the first flying frame is not the one that compiles the shaders. The preview already does a 64 px warm draw. Keep that.
- Do not bake a giant angle book on the Galaxy.

### App shells, in plain terms

| Way of shipping | What Ellie and the Galaxy actually run | Speed | When |
| --- | --- | --- | --- |
| Safari and Chrome, as now | This page | The baseline | Now |
| Capacitor, or another store shell | The same page inside the system web view | A little faster, mostly from full screen and staying in the foreground. Same drawing. | After the frame is accepted. Separate pull request. |
| Native Metal / Vulkan, or a game engine | A new drawing program | The only way to be in Roblox's league if the web graphics path misses a flat 30 on the A10 | Not unless items 1–5 have been measured on Ellie's iPad and still miss 30 |

Store accounts do not make the page faster. They only let the same page be installed.

### How we will know

Lab times stay in the FPS Guard, refreshed after pull request 56 merges, and turned on as a failing check only after that baseline is honest. The Guard's software milliseconds are a regression alarm. They are not the Galaxy number.

The numbers that count are five pairs on the real Galaxy and five pairs on Ellie's iPad, same camera spots, with `?perf=1` so the graph shows the worst pass. Attach those next to the shots. One browser at a time.

Pass looks like this:

- Galaxy: the worst common frame under about 9 ms, meter steady at 110 or better, no 55/115 flicker.
- iPad: a flat 30 or better, no drops to 5. A flat 60 is a win. A miss of 30 after items 1–5 is the point where a native renderer gets a real conversation.

### What this pull request does not do

No gameplay edits. No `shadowBlur` added. No change to `index.html`. No deploy. No second WebGL prototype. No second iPad ladder. No FPS Guard copy. The build starts when you write "plan approved, build it", and only for the items you said yes to.
