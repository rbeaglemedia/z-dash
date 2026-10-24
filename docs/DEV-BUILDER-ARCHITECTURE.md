# DEV Builder architecture check

For the building and road edits in DEV Builder M2. Plan only was the previous step. This is the build Bob picked on Oct 24. It is not deployed.

## What a map edit is

`CITY.editorDoc()` reads the current Neon World. Buildings are the `type: 'building'` objects already in `CITY.OBJS`. Roads are `CITY.ROADS.toJSON()`. Spawns are the player at (0, 0) and Sky Drop at (180, 520).

A write passes `PLANNER_TOOLS.guardM2` first. If a guard fails, the city is not changed and the previous document stays.

## M2 locks

| Locked | Rule |
| --- | --- |
| Highway, bridge, tunnel, track | Endpoint, width, and kind cannot change. A new segment whose both ends sit on the highway x (−450) is refused |
| Player spawn and Sky Drop | The pins cannot move. A building whose box, grown by 3 m, covers either pin is refused |
| New streets | Kind must be `street`. A sample every 4 m that lands inside a building is refused |

Kit buildings and boulevard streets can move. A new street is allowed on open ground.

## How a change hits the drive

`world.html` and `world-split.html` load the editor. On those live addresses the save goes to `localStorage` key `zdash.city.editor.v1` and the drive city is not rebuilt.

`/test/world.html` and `/test/world-split.html` are the P2 pages. There `CITY.editorDoc(doc)` may:

- Move a building with the existing `CITY.remove` and `CITY.placePrefab`. The prefab stays axis-aligned. The 15° yaw is stored on the document and drawn in the editor. The drive box does not become a rotated mesh.
- Add a street with `ROADS.addRoad`. The same endpoints are not added twice. Traffic reads lanes at page load, so the test page picks up the street on that load. `physics.js` is not edited.

The live committed `world/city.js` shop list is not rewritten. Rollback of a test edit is clearing the storage key, or not taking the second publish go. That second go has not been built and has not been asked for.

## Q2 tools

| Tool | What it writes |
| --- | --- |
| Roof | Stacked boxes on the building footprint: flat, pitched, or dome. Drawn in the editor. No new drive-frame shader and no `shadowBlur` |
| Measure | Two taps. The readout is metres |
| Align | The selected building faces the nearest street. A group lines up on the left edge |
| Group | Tapped buildings move together. One undo step |
| Rotate 15 | Yaw steps by 15°. The shared tool also still has quarter turns for Ellie's Builder |

## Frame cost

The editor is closed until Bob holds both opposite corners for 2 seconds. Closed, it does not draw and it does not run a frame loop. Open, it draws once per pointer event on its own canvas. Flat fills and strokes. Glow is a brighter color. There is no `shadowBlur`.

## Shared code

`world/planner-tools.js` is the only copy of snap, rotate, move, copy, history, roof, measure, align, group, and `guardM2`. Ellie's Builder should load that file. It should not paste a second copy.
