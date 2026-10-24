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

Which tricks from a big console game (the GTA kind) we can borrow, before the App Store and after it, is the section "AAA console tricks (GTA-style)" at the end. That section does not start a second car-copy fix, a second resolution clamp, or a second WebGL city.

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

## AAA console tricks (GTA-style)

Planning only. Nothing here is a build.

### For Bob

GTA stays smooth by drawing less of the city, drawing the repeated parts in one pass, and refusing to show a half-finished frame. Almost all of that works in the browser, on the Galaxy and on Ellie's iPad, before any App Store build. Putting Neon World in a store shell does not turn those tricks on. The shell is still the same web page. The one trick that waits until after the app is packaged is a native Metal drawing program, and only if the iPad still cannot hold a flat 30 after the work already ranked above.

Three jobs stay where they are. This section does not rebuild them.

- Taking the Z copy off the frame is item 1 above. A console game never copies the car back onto a flat picture. That is still the change that can move the Galaxy toward a steady 110.
- The resolution clamp is the resolution audit's job (item 3). The iPad size ladder is pull request 56.
- A graphics-chip city is pull request 59, grown by item 5. Instancing, a resolution knob, and a sharper car on top of a softer city belong inside that city, after you accept the picture.

What the lab already showed, so the gains below stay honest: with the Z turned off, the city and the dashboard were about 3 ms of script. There are 88 buildings and 30 traffic cars. Far buildings are already skipped. Close-up windows already turn off while she is moving. Traffic is already a small picture per car, and that cache is what hitching for 20–70 ms was about. The ground grid was about 0.5 ms. A trick aimed at the city cannot, by itself, produce a steady 110. A steady 110 still needs item 1, then the steady clock.

### Where each trick sits

| Trick | When it can run | Where it sits against the plan | Galaxy, toward a steady 110 | iPad, toward a steady 60 or a flat 30 |
| --- | --- | --- | --- | --- |
| Fixed frame cap and pacing | Browser, now | This is item 2. Pull request 56 already steadies the car skip. | The difference between 55–115 flicker and a held 110, after the frame fits in about 9 ms. | Holds 60, or a flat 30 when 60 does not fit. Stops the drops to 5. |
| Baked lighting and glow | Browser, now | This is item 4. | A few milliseconds after item 1, if glow is what `?perf=1` still names. | The other large cut on the A10, beside the car copy. |
| Dynamic resolution and upscaling, car kept sharp | Browser, now, once the Z is its own layer | Fold into item 5. The clamp stays with the audit. The ladder stays with pull request 56. | Full size. No gain, and no softening. | The path from a flat 30 toward 60. The city goes soft. The Z stays sharp. |
| Instancing and batching | Browser WebGL, inside pull request 59 | After item 5, in that same city. The canvas grid is yes/no 4. | About nothing. The city is already the cheap part. | Useful only if the graphics-chip city is still the slow pass. |
| LOD and distance impostors | Browser, now. A billboard building waits for the WebGL city. | Traffic and window distances already do this. A new building impostor is after item 5, and only if a profile names buildings. | Under a millisecond. Does not make 110. | Small, after the car copy and the glow are gone. |
| Frustum and occlusion culling | Frustum is already on. Hardware occlusion is the wrong tool. | Leave `cityItems` as it is. | None on top of today's skip. | None you would feel. The flying view sees the skyline. |
| Texture atlases | Browser WebGL, after the city has real textures | Not a step in the ranked plan. The Z model has no pictures inside it. | None today. | None today. |
| Pooling and a quiet frame | Browser, now | Pull request 56 already reuses the frame list. A further pass waits for a real-phone spike. | Removes a hitch. Does not raise the steady number. | Same. The 20–70 ms traffic hitch is the one already queued for the loading card. |
| World streaming | Not for this city | Off the plan unless the map grows a lot. | None. Can add a hitch. | None. Can add a hitch. |
| Metal, after the App Store | Only a native app, after packaging | This is item 7. The store shell is not this. | A new drawing program. Out of scope while item 1 can fit the frame. | The conversation starts only if items 1–5 still miss a flat 30 on Ellie's iPad. |

### Fixed frame cap and pacing

**When:** the browser, now. A store shell uses the same clock.

GTA picks 30 or 60 and holds it. It would rather repeat a finished picture than show a late one. Neon World currently asks the screen for the next frame the moment the last one ends, so a 120 Hz Galaxy can alternate a heavy frame and a light one.

This is item 2. Pull request 56 already stops the Z-skip from flapping (skip when the car's own frame stays over 8.6 ms, return under 7.2 ms). The clock on top of that is: Galaxy stays on the 120 Hz beat while a frame fits in 8.3 ms, otherwise a flat 60. iPad holds 60 while a frame fits in 16.7 ms, otherwise a flat 30.

- Galaxy: this is how 110 stays 110 instead of flickering 55–115. It cannot create a 9 ms frame. Item 1 has to do that.
- iPad: a flat 30 is the acceptable result. A flat 60 is the later measurement.
- Risk: locking 60 on the Galaxy on a day the frame would have fit throws away the 120 Hz panel. The gap in item 2 is what stops the hunt.
- Effort: small. One clock. No second pacer.
- Picture: the same scene, shown on a steadier beat. Yes/no 2.

### Baked lighting and glow

**When:** the browser, now, during the loading card. A store shell does not bake glow for us.

GTA lights the world while the level loads, then draws those light pictures. It does not re-blur the neon every frame. Neon World still does. About 50 live glows a frame, and the rule is no new `shadowBlur`.

This is item 4. Horizon, rings, and dashboard glows become small pictures made at load, then pasted. Slow devices first. Every device only after side-by-side shots match (yes/no 3).

- Galaxy: a few milliseconds, which is the gap between "close to 110" and "holding 110" after item 1. Use `?perf=1` on the phone before doing it there.
- iPad: large. Blur cost on the A10 does not shrink just because the buffer shrinks.
- Risk: the glow looks different. Shots from the same camera spots decide it.
- Effort: medium. The loading card in pull request 56 is the place. No new blur radius.
- Picture: meant to match. If it does not, it stays on the iPad only, and you still sign that iPad look.

### Dynamic resolution and upscaling, with the car kept sharp

**When:** the browser, now. WebGL can draw into a smaller picture and stretch it up. The store shell uses the same stretch.

GTA drops the world's internal size when a frame is late, stretches that picture up to the screen, and keeps the car and the HUD sharp. The soft part is the city. The car is not soft.

Neon World already has two pieces of this, and they stay with their owners:

- Pull request 56's iPad ladder shrinks the whole flat picture (100% down to 38%) only while that iPad misses about 55 fps. The pasted Z shrinks with it, so the car goes soft too.
- The resolution audit clamps every offscreen picture, including the 960×960 car buffer on the iPad versus 480×480 on the phone. That clamp is theirs.

The piece this plan adds, inside item 5 after you accept the WebGL city, is the split GTA uses. The city image is the one that shrinks and gets stretched. The Z stays on its own graphics-chip layer at the sharp size the audit allows, and the dashboard stays vectors on the full-size canvas, which is how it is drawn today. The Z layer is not stretched. Before item 1, the Z is still a picture copied onto the city, so shrinking the city softens the car and the copy is still the frame. Upscaling does not get the Galaxy to 110.

- Galaxy: stay at full size. The ladder and the upscale are iPad-only, same rule as the preview.
- iPad: this is the path from a flat 30 toward a flat 60, after the copy and the glow are gone. Promise 30. Treat 60 as a measurement.
- Risk: a city that is softer than the car can look like a sticker if the gap is huge. The ladder's existing steps are the limit. A fast iPad that is holding the frame stays full size.
- Effort: medium, and only inside `world/gl-city.js` plus the layer from item 1. No second clamp, no second ladder.
- Picture: Galaxy unchanged. iPad city softer only while the frame is late. The Z stays at the clamped sharp size.

### Instancing and batching of traffic, windows, and the grid

**When:** real instancing is WebGL, in the browser, inside pull request 59. The flat canvas cannot instance. Packaging does not add it.

GTA draws every traffic car, every repeated window, and every lamp as one batch: one shape, many positions. Neon World draws each of those as its own line on the canvas.

What is already cheap, so a batch has little to win:

- Windows: at most 4 wall faces with a grid, and none of them while she is cruising or flying. The open-air frame measured 0 window faces.
- Lamps and trees: a few billboard dots inside a distance budget (6 lamps, 8 trees). The word "instanced" in the tune file means those dots, not a graphics-chip batch.
- Traffic: 30 cars, 12 simulated, each a cached picture. Once the cache is warm the traffic pass was about 0 ms. A graphics-chip instance of the traffic meshes would replace that picture cache. It is a follow-up inside the WebGL city if you want traffic to be real meshes. It is not a canvas change.
- Grid: about 0.5 ms, roughly 90 strokes. One stroke for the same lines is yes/no 4. It does not move either device to its goal.

- Galaxy: under a millisecond on the canvas. On a WebGL city that is already a few tenths of a millisecond of script, instancing is polish unless `?perf=1` names that pass.
- iPad: the same, until the graphics-chip city is the slow pass. Then one batch of windows and one batch of traffic is the right cut, inside pull request 59, not a new project.
- Risk: a batch that sorts wrong flickers a window or a car through a building. Traffic as meshes would drop the angle-step look of today's pictures, which is a picture change and needs your eye.
- Effort: small for the one-stroke grid. Medium for instances inside the existing WebGL city. Large if someone starts a second city to do it.
- Picture: the grid is the same lines. Instanced windows should match. Instanced traffic meshes are a visible change and wait for a yes.

### LOD and distance impostors

**When:** the browser, now. Billboard impostors are a WebGL or canvas picture. The store shell does not load the city in chunks for us.

GTA draws a near building as a model and a far building as a flat picture (an impostor), and swaps as you approach. Neon World already has a simple version. Far buildings are skipped past the draw distance. Mid buildings lose their roof detail. Windows exist only up close, and only a few of them. Traffic at a distance is already an impostor: a baked picture, with an angle step you can see.

A GTA-style building impostor would replace a far tower with a picture. The city has 88 buildings, and the ones past the draw distance are already gone. The measured open-air city is about 3 ms of script. An impostor pass has to beat that, and it has to avoid the traffic hitch (20–70 ms the first time a picture is made).

- Galaxy: under a millisecond if it does anything. Not the 110 project.
- iPad: small, and only after item 1 and item 4, if a profile still names buildings. It is not the cut that turns 5–30 into a flat 30.
- Risk: the building pops when the picture swaps for the model. That pop is a picture change, so it would be iPad-only, and only after you have seen it.
- Effort: medium. Bake the far pictures on the loading card, the way traffic already bakes. Do not invent a second detail system beside `shared/detail-tune.js`.
- Picture: a swap you can see if the impostor is coarse. Near buildings stay as they are.

### Frustum and occlusion culling

**When:** the frustum test is already in the browser. A hardware occlusion query is the wrong tool on this page, before or after the store.

GTA skips anything outside the camera, and skips anything hidden behind a closer building. Neon World already skips anything outside the camera: `cityItems` drops a building that is past the draw distance or off the sides of the view. That is the frustum test.

Occlusion (hidden behind another building) is a weak win here. She is often in the air, looking at a skyline, so most towers are visible on purpose. A graphics-chip occlusion query answers by reading a result back from the chip. That read is the same kind of stall as the car copy. This plan does not add it.

- Galaxy: no gain on top of today's skip.
- iPad: no gain you would feel. A query would risk a new stall.
- Risk: a tighter frustum makes a tower pop at the edge of the screen. Today's margin stays.
- Effort: none. Leave the test that is there.
- Picture: unchanged.

### Texture atlases

**When:** the browser, once a WebGL material actually has pictures. Not before. The store shell does not need an atlas either.

GTA packs many small pictures into one sheet so the chip does not switch pictures all frame. The 370Z file has materials and no images. The city is drawn with strokes and flat colors. There is no pile of tiny textures to pack.

An atlas becomes useful if pull request 59, or a later Z material, grows a set of small pictures (signs, window cards, light glows). Pack them once at load. That is a loading-screen job, not a frame job, and it waits until those pictures exist.

- Galaxy: none today.
- iPad: none today. An atlas does not make the A10 hold 30.
- Risk: a bad pack puts the wrong picture on a sign. Easy to see, easy to revert.
- Effort: small, later, inside the WebGL city. Not a ranked step now.
- Picture: the same, if the pack is right.

### Object pooling and a frame that does not collect garbage

**When:** the browser, now. A store shell runs the same JavaScript.

GTA reuses the same lists and the same cars every frame so the engine does not stop to clean up memory. A cleanup pause is a hitch, not a lower average.

Pull request 56 already reuses the per-frame item list. Traffic already reuses a cache of 140 pictures. The driving math was under 0.1 ms in the October 22 bisect. This lab's city script was about 3 ms. The hitch we have measured is the traffic cache filling (20–70 ms), and the loading card in pull request 56 is what pays that before you fly.

A further "allocate nothing" pass is worth doing when `?perf=1` on the real Galaxy or the real iPad shows a single spiked frame that the graph calls garbage. It is not worth doing ahead of the car copy on a guess.

- Galaxy: a hitch goes away. The steady 110 number does not move.
- iPad: the same. A hitch reads as a drop toward 5. Removing one is good. It is not the flat-30 plan.
- Risk: a reused list that still holds last frame's building draws a ghost. The preview's pool is the pattern to copy.
- Effort: small, after a profile names it. No new pool beside the one in pull request 56.
- Picture: unchanged.

### World streaming and chunk load / unload

**When:** not for this world, in the browser or in a store build.

GTA streams because the map does not fit in memory. A neighborhood loads as you drive in, and the one behind you unloads. Neon World's city is one generated town: 88 buildings, 150 boxes, seed 90210, all of it already in the page. It fits. The frame cost of that town, without the Z, was about 3 ms of script.

Unloading a chunk would save memory we are not short of in the page, and the next time she flies back the chunk would hitch the way the traffic cache hitchs. That is the failure mode. Streaming becomes a real idea only if a later world is many times this city. It is not a step on the way to 110 or to a flat 30, and the App Store does not make this city large.

- Galaxy: no frame gain. A hitch if a chunk comes back.
- iPad: the same, with less memory to spare (2 GB, shared with iPadOS). The page's city is still small next to that. The 370Z text and the pasted pages are the heavy files, and those are the separation plan's problem, not a streaming problem.
- Risk: a missing block of city, or a hitch on the way back.
- Effort: large, for no measured frame win.
- Picture: a hole, if it fails. Identical, if it works and never unloads anything you can see.

### Metal, after the App Store

**When:** only after packaging, and only as a native drawing program. The Capacitor shell is still WebKit on the iPad and the system web view on the Galaxy. That shell can do every trick above. It cannot run Metal.

GTA on a console draws with the console's own graphics API. On Ellie's iPad that API is Metal. On the Galaxy it is Vulkan. Roblox does the same kind of thing. Neon World's store build, as item 7 describes it, is the page inside a web view. Full screen, no browser bar, a little speed, the same drawing, including the same WebGL.

A Metal (and Vulkan) renderer is a new program for the city, the Z, and the traffic. It throws out the flat canvas and the copy. It is the right conversation only after items 1 through 5 have been measured on Ellie's iPad and a flat 30 still misses. Item 7 already says that. This section does not start the rewrite, and it does not move that rewrite to "before the store."

- Galaxy: if item 1 fits in about 9 ms, Metal is extra. The web graphics chip can hold 110.
- iPad: the only technique on this list that can pass a ceiling WebGL cannot. We do not know that ceiling yet. The promise before that measurement is still a flat 30 from items 1, 3, 4, and 5.
- Risk: a second game to keep in sync with the web one, for as long as both exist.
- Effort: a new drawing program. Larger than items 1 through 5 together.
- Picture: has to be accepted all over again. Screenshots from the same spots.

### What this pull request does not do

No gameplay edits. No `shadowBlur` added. No change to `index.html`. No deploy. No second WebGL prototype. No second iPad ladder. No FPS Guard copy. No Metal prototype. The build starts when you write "plan approved, build it", and only for the items you said yes to.
