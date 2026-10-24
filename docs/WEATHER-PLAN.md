# Neon World weather

A screen-overlay trick for the kid world (`world.html` and `world-split.html`). No adult `index.html`. No city-layout edits. Nothing deploys from this branch.

Weather sits on the open ground between cities. From outside a band you see a wall. Drive in and the screen gets one scrolling filter, and on a slow frame the far draw shortens so the next city has room to load. The car keeps its speed.

## Where the rectangles come from

`world/weather.js` does not contain coordinates. Each frame it reads a zone list. First match wins:

1. `window.ZD_LAYOUT_INTERFACES` — an explicit push, same shapes as below.
2. `CITY.LAYOUT.weather` or `window.CITY_LAYOUT.weather` — the Interfaces list from the City Layout PR (`{ name, x0, x1, z0, z1 }`). `name` is Sand, Fog, or Rain. Runway, tunnel, and bridge anchors on that object stay clear.
3. `docs/city-layout/interfaces.json` — same payload, if that file is on the site.
4. `world/weather-zones.json` — stand-in so this branch can be driven before that layout script is on the page. The four bands are the same rectangles as `CITY.LAYOUT.weather` on `cursor/city-boulevards-ef23` (PR #85). Replace that file, or load the layout, and the walls move. No weather code change.

Accepted shapes: `{ weather: { zones, clear } }`, `{ zones, clear }`, or an array of zones. A zone is `{ id, kind, x0, x1, z0, z1 }`, `{ name, x0, x1, z0, z1 }`, `{ kind, xa, xb, za, zb }`, or `[kind, x0, x1, z0, z1]`. `kind` (or `name`) is `sand`, `fog`, or `rain`. Optional `clear` rectangles punch holes (runway, tunnel, river jumps, homestead yard).

Option 1 bands in the stand-in:

| Band | Kind | x | z |
|---|---|---|---|
| West shoulder | sand | −350 .. −170 | 40 .. 1000 |
| North of the runway, south of the river jumps | fog | −180 .. 250 | 1530 .. 1660 |
| East gap | rain | 240 .. 640 | 240 .. 760 |
| South lane, stopping before the homestead yard | fog | −480 .. −80 | −400 .. −160 |

Cities, the homestead yard, the runway, the tunnel, and the river jumps stay clear.

## What you see

Outside, within about 280 m, the near face of a band is a curtain: three flat alpha bands and a few streaks. One fill per band, one stroke for the streaks. No `shadowBlur`, no particles.

Inside, one full-screen pass: a tint plus a repeating pattern baked once (sand bands, fog puffs, or rain streaks) and scrolled. The car sprite draws after that pass so it stays readable. The pattern moves a little. It is a sunny gold, a pale fog, or a bright rain, not a storm.

## Frames

A short average of FPS (about 0.45 s) decides thickness. One bad frame does not thicken the weather. Recovery eases out over about a second so it does not flicker.

- At 110 fps and above the filter stays light and draw distances stay where they are (`CDRAW.dist` 950, outline 1900, roads 360, building detail 170).
- Under 110 the thick mix rises with the shortfall. Far buildings and the ground fill ease toward 320 m. Roads stay 360 m, so the lane in front of the car remains. Highway dash marks, which normally draw out to 700 m, stop at the shortened far draw.
- The lower the frame rate, the thicker the filter. An iPad that is already under 110 gets the thick look from the same rule.

While `weather.prep` is true the far draw is short. That is the headroom for the city loader. This module does not load a city. Register `weather.onHeadroom(fn)` and do the work there.

The player car's speed is not touched.

## API for traffic

```js
weather.inZone(x, z)  // zone { id, kind, name, x0, x1, z0, z1 } or null
weather.density       // 0 outside, about 0.3 in light weather, up to about 0.8 when thick
weather.kind          // 'sand' | 'fog' | 'rain' | null
weather.thick         // true when the far draw is shortened
weather.viewDist      // current far draw, metres
weather.prep          // true when a loader may prepare the next city
weather.onHeadroom(fn)
weather.setZones(data) // tests, or a live Interfaces push
```

Traffic may fade sprites with density and ease off a little of their speed. This module does not do that. Do not stop traffic, and do not scale the player car.

## Files

- `world/weather.js` — module
- `world/weather-zones.json` — stand-in rectangles
- `world/boot.js` — tick, wall, filter, shorter ground grid while thick
- `world/city-draw.js` — highway dashes follow the far draw when it is under 700 m
- `world.html`, `world-split.html` — script tag only

`world/city.js` and the city-layout docs are not edited.
