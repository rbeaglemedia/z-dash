<!-- ARCHITECTURE-CHECK -->

## ARCHITECTURE-CHECK

**FAIL** on `cursor/arch-check-652e` `896fb969726a`.

Kid App buildings only. 24 reviewed. Judged against `docs/NEON-WORLD-STYLE.md`. Full log: `test-results/arch-check/report.md`.

- **Garage door is not car-sized** (20)
  The mouth graphic sits on the center of the bay. It has to clear the 370Z (1.85 m wide, 1.32 m tall) with room to spare.
- **Two window systems share the wall** (24)
  The close view draws dashed floor lines every 5.5 m and 1.65×1.2 m panes on a different pitch. A floor line cuts through a pane.
- **Sign is not readable from the street** (1)
  At the front camera the word "JUMP" is 6.35 px.
- **Roof is a blank slab from the air** (17)
  The cap is closed and the neon edge draws. Nothing else is on the roof: no pad, tank, or antenna. A flying view cannot tell this roof from a lid.
- **Purpose is not readable from the air** (7)
  A flying view has to show the purpose. A sky drop can use its helipad. A dance building can show the mural. Anything else needs its purpose word at least 10 px from the roof camera. Put that word on the roof in straight boxes and a glow strip.
- **Purpose is not readable at street level** (5)
  The street sign has to use a word from that purpose in docs/NEON-WORLD-STYLE.md and measure at least 10 px at the front camera.
- **Building pass set shadowBlur**
  A review draw assigned a non-zero shadowBlur 386 times. The probe forced the value back to 0 so the shot still shows the building. Glow belongs off this path. Source: world/neon-paint.js:2708 (10); world/neon-paint.js:2719 (8); world/neon-paint.js:2740 (8); world/neon-paint.js:2770 (lw * (s.brush === 'spray' ? 2.2 : 1.4)); world/neon-paint.js:2775 (Math.max(2, lw * 0.3)).
- **Beyond the stack: blur**
  Finished building draw uses a live blur. Draw a second brighter stroke, or a thin lit box. No blur.

Warnings (they do not fail the review):

- **Buildings are still all-black** (24)
  The shared drawer fills every solid building with #0a0612 and a neon edge. Keep the night sky. Add a glass band and a cyan, magenta, lime, or gold strip, made of boxes, so the block is not a black slab.
- **Home is not a glass house yet** (2)
  A home wants a lighter glass face and a cyan strip, still made of boxes.

FPS (software GL, one near building / in-view pass):

- phone 0.1 ms / 0.4 ms over 37 buildings
- ipad 0.1 ms / 1 ms over 37 buildings
- pc 0.1 ms / 0.3 ms over 37 buildings

Ramps: 70 (floor 70, no ceiling). River-edge small jumps: 3.
Tunnel: 200 m × 160 m, bore 30 m, ceiling 10 m.

Dance mural:

- Z Company Arts 58.88×9.9 m
- Z Company Arts 58.88×11 m
