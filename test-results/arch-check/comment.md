<!-- ARCHITECTURE-CHECK -->

## ARCHITECTURE-CHECK

**FAIL** on `cursor/house-row-styles-52fc` `48aace48b023`.

Kid App buildings only. 31 reviewed. Judged against `/workspace/docs/NEON-WORLD-STYLE.md`. Full log: `test-results/arch-check/report.md`.

- **Garage door is not car-sized** (20)
  The mouth graphic sits on the center of the bay. It has to clear the 370Z (1.85 m wide, 1.32 m tall) with room to spare.
- **Two window systems share the wall** (25)
  The close view draws dashed floor lines every 5.5 m and 1.65×1.2 m panes on a different pitch. A floor line cuts through a pane.
- **Roof is a blank slab from the air** (20)
  The cap is closed and the neon edge draws. Nothing else is on the roof: no pad, tank, or antenna. A flying view cannot tell this roof from a lid.
- **Sign is not readable from the street** (1)
  At the front camera the word "JUMP" is 6.35 px.
- **Building is short next to a person** (4)
  The roof is under three person-heights (1.7 m).
- **Color is outside the neon set** (4)
  Stroke #ff9a2e is not in the night palette.
- **Not enough ramps**
  This layout has 39 ramps besides tow-truck beds. The original city has 70, including the river-edge launches. More than that is fine. Fewer is not.
- **Purpose is not readable from the air** (5)
  A flying view has to show the purpose. A sky drop can use its helipad. A dance building can show the mural. Anything else needs its purpose word at least 10 px from the roof camera. Put that word on the roof in straight boxes and a glow strip.
- **Purpose is not readable at street level** (3)
  The street sign has to use a word from that purpose in docs/NEON-WORLD-STYLE.md and measure at least 10 px at the front camera.
- **Purpose is not in the style guide** (4)
  Add SNACK to the Purpose list in docs/NEON-WORLD-STYLE.md, with the words a player should read, or mark the building generic.
- **Unapproved new building**
  The city has 31 solid buildings. Bob approved 24. A moved building is not a new one. An extra block that loads in the game is. A pitch under Ideas for Bob is not.
- **Building blocks a road** (1)
  The footprint covers a street, the highway, the runway, or the taxiway. Keep the pavement clear so a car can pass.
- **Building pass set shadowBlur**
  A review draw assigned a non-zero shadowBlur 193 times. The probe forced the value back to 0 so the shot still shows the building. Glow belongs off this path. Source: world/neon-paint.js:2708 (10); world/neon-paint.js:2719 (8); world/neon-paint.js:2740 (8); world/neon-paint.js:2770 (lw * (s.brush === 'spray' ? 2.2 : 1.4)); world/neon-paint.js:2775 (Math.max(2, lw * 0.3)).

Warnings (they do not fail the review):

- **Style guide was not loaded**
  docs/NEON-WORLD-STYLE.md could not be read, so this run did not judge brand or capability against Bob's latest edits.

FPS (software GL, one near building / in-view pass):

- phone 0.2 ms / 0.4 ms over 20 buildings
- ipad 0.3 ms / 1.2 ms over 20 buildings
- pc 0.1 ms / 0.3 ms over 20 buildings

Ramps: 39 (floor 70, no ceiling). River-edge small jumps: 3.
Tunnel: 200 m × 160 m, bore 30 m, ceiling 10 m.

Dance mural:

- Z Company Arts 58.88×9.9 m
