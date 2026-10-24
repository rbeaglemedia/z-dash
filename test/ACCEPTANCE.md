# Bob's device checklist

Tick these on your own phone, iPad, and PC. Nothing here is published until you say go. After that, the Tools app stays at `/test/`.

- [ ] Open `/test/` and add it to the home screen. The icon says ZD Tools. The kid app and the TWA icon stay as they are.
- [ ] Adult screens, the kid menu, and a normal Neon World visit look the same as before. No wrench, no speed change, no physics change.
- [ ] The FPS pill is top-right, inside the notch/safe area, about 13px bold mono on a dark pill, and not on a button. Crew and Neon Drawing already have a pause button in that corner, so the pill sits just under it. Dance Stage's pause button owns the corner and the wave button hangs under it, so the pill stays on the right, under both. The kid menu's settings button and speedometer own that corner, so the pill sits beside them, still on the right, clear of the tabs. The Tools hub leaves a right gutter, so the pill stays in the corner beside Hide dock and Lock.
- [ ] Neon World still has one FPS readout, not two.
- [ ] Wrench stays hidden until you enter the PIN, tap the extreme top-left corner five times, or open a `?dev=1` link.
- [ ] FPS Lab numbers match Chrome's Performance panel on the same drive (about 5%).
- [ ] Kill switches, one at a time, change the picture and come back exactly when turned off.
- [ ] Benchmark runs the same 60-second route and gives a score you can copy.
- [ ] 100/150/200/250/300/360 apply only after you tap them. A normal visit is unchanged.
- [ ] Physics presets save, load, and reset. Reset puts the real defaults back.
- [ ] Ellie can tap Love it / Meh / No and you can export the list.
- [ ] If a tool breaks, the car still runs and a message says so.

Free tools to use alongside this: Chrome remote debugging of an Android phone at `chrome://inspect`, the DevTools Performance panel, and the Spector button on FPS Lab.

One-line include for Character Viewer, DEV Builder, and Adventure:

```html
<script src="../shared/fps-counter.js"></script>
```

Adventure at the site root uses `shared/fps-counter.js` instead of `../shared/fps-counter.js`.
