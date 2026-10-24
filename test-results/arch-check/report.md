# Architecture check

Target `cursor/arch-check-652e` `f6da9f45adfb`

Result: **FAIL**

Reviewed 24 solid buildings. Shots: 288. Style guide: `docs/NEON-WORLD-STYLE.md`.

## Scale

Pass.

## Doors

Pass.

## Garages

- **Garage door is not car-sized**
  The mouth graphic sits on the center of the bay. It has to clear the 370Z (1.85 m wide, 1.32 m tall) with room to spare.
  Buildings: GARAGE `0` — 1.44×2.45 m door on a 10×9×4.4 m bay. narrower than the 370Z (1.44 m door, car is 1.85 m wide).; SKY_DROP `1` — 1.44×2.45 m door on a 10×9×4.4 m bay. narrower than the 370Z (1.44 m door, car is 1.85 m wide).; SHOWROOM `2` — 1.44×2.45 m door on a 10×9×4.4 m bay. narrower than the 370Z (1.44 m door, car is 1.85 m wide).; NOS `3` — 1.44×2.45 m door on a 10×9×4.4 m bay. narrower than the 370Z (1.44 m door, car is 1.85 m wide).; SKY_DROP `4` — 1.44×2.45 m door on a 10×9×4.4 m bay. narrower than the 370Z (1.44 m door, car is 1.85 m wide).; HOME `5` — 1.44×2.45 m door on a 10×9×4.4 m bay. narrower than the 370Z (1.44 m door, car is 1.85 m wide).; SHOWROOM `6` — 1.44×2.45 m door on a 10×9×4.4 m bay. narrower than the 370Z (1.44 m door, car is 1.85 m wide).; NOS `7` — 1.44×2.45 m door on a 10×9×4.4 m bay. narrower than the 370Z (1.44 m door, car is 1.85 m wide).; GARAGE `8` — 1.44×2.45 m door on a 10×9×4.4 m bay. narrower than the 370Z (1.44 m door, car is 1.85 m wide).; NEON_PAINT `9` — 1.44×2.45 m door on a 10×9×4.4 m bay. narrower than the 370Z (1.44 m door, car is 1.85 m wide).; NEON_PAINT `10` — 1.44×2.45 m door on a 10×9×4.4 m bay. narrower than the 370Z (1.44 m door, car is 1.85 m wide).; DANCE `11` — 1.44×2.45 m door on a 10×9×4.4 m bay. narrower than the 370Z (1.44 m door, car is 1.85 m wide).; ARCADE `12` — 1.44×2.45 m door on a 10×9×4.4 m bay. narrower than the 370Z (1.44 m door, car is 1.85 m wide).; HOME `13` — 1.44×2.45 m door on a 10×9×4.4 m bay. narrower than the 370Z (1.44 m door, car is 1.85 m wide).; DANCE `17` — 1.44×2.45 m door on a 10×9×4.4 m bay. narrower than the 370Z (1.44 m door, car is 1.85 m wide).; ARCADE `19` — 1.44×2.45 m door on a 10×9×4.4 m bay. narrower than the 370Z (1.44 m door, car is 1.85 m wide).; SOCCER `20` — 1.44×2.45 m door on a 10×9×4.4 m bay. narrower than the 370Z (1.44 m door, car is 1.85 m wide).; SOCCER `21` — 1.44×2.45 m door on a 10×9×4.4 m bay. narrower than the 370Z (1.44 m door, car is 1.85 m wide).; BUILDER `22` — 1.44×2.45 m door on a 10×9×4.4 m bay. narrower than the 370Z (1.44 m door, car is 1.85 m wide).; BUILDER `23` — 1.44×2.45 m door on a 10×9×4.4 m bay. narrower than the 370Z (1.44 m door, car is 1.85 m wide)..

## Windows

- **Two window systems share the wall**
  The close view draws dashed floor lines every 5.5 m and 1.65×1.2 m panes on a different pitch. A floor line cuts through a pane.
  Buildings: GARAGE `0`; SKY_DROP `1`; SHOWROOM `2`; NOS `3`; SKY_DROP `4`; HOME `5`; SHOWROOM `6`; NOS `7`; GARAGE `8`; NEON_PAINT `9`; NEON_PAINT `10`; DANCE `11`; ARCADE `12`; HOME `13`; PETS `14`; PETS `15`; CAFE `16`; DANCE `17`; CAFE `18`; ARCADE `19`; SOCCER `20`; SOCCER `21`; BUILDER `22`; BUILDER `23`.

## Geometry

Pass.

## Roofs

- **Roof is a blank slab from the air**
  The cap is closed and the neon edge draws. Nothing else is on the roof: no pad, tank, or antenna. A flying view cannot tell this roof from a lid.
  Buildings: HOME `5`; SHOWROOM `6`; NOS `7`; GARAGE `8`; NEON_PAINT `9`; NEON_PAINT `10`; ARCADE `12`; HOME `13`; PETS `14`; PETS `15`; CAFE `16`; CAFE `18`; ARCADE `19`; SOCCER `20`; SOCCER `21`; BUILDER `22`; BUILDER `23`.

## Detail tiers

Pass.

## Signs

- **Sign is not readable from the street**
  At the front camera the word "JUMP" is 6.35 px.
  Buildings: SKY_DROP `4`.

## Z dance mural

Pass.

## Style

Pass.

## Ramps

Pass.

## shadowBlur

- **Building pass set shadowBlur**
  A review draw assigned a non-zero shadowBlur 386 times. The probe forced the value back to 0 so the shot still shows the building. Glow belongs off this path. Source: world/neon-paint.js:2708 (10); world/neon-paint.js:2719 (8); world/neon-paint.js:2740 (8); world/neon-paint.js:2770 (lw * (s.brush === 'spray' ? 2.2 : 1.4)); world/neon-paint.js:2775 (Math.max(2, lw * 0.3)).

## FPS

Pass.

## Capability

- **Beyond the stack: blur**
  Finished building draw uses a live blur. Draw a second brighter stroke, or a thin lit box. No blur.

## On brand

- Warning: **Buildings are still all-black**
  The shared drawer fills every solid building with #0a0612 and a neon edge. Keep the night sky. Add a glass band and a cyan, magenta, lime, or gold strip, made of boxes, so the block is not a black slab.
  Buildings: GARAGE `0`; SKY_DROP `1`; SHOWROOM `2`; NOS `3`; SKY_DROP `4`; HOME `5`; SHOWROOM `6`; NOS `7`; GARAGE `8`; NEON_PAINT `9`; NEON_PAINT `10`; DANCE `11`; ARCADE `12`; HOME `13`; PETS `14`; PETS `15`; CAFE `16`; DANCE `17`; CAFE `18`; ARCADE `19`; SOCCER `20`; SOCCER `21`; BUILDER `22`; BUILDER `23`.
- Warning: **Home is not a glass house yet**
  A home wants a lighter glass face and a cyan strip, still made of boxes.
  Buildings: HOME `5`; HOME `13`.

## River-edge ramps

70 ramps besides tow trucks. Light floor 24. No upper limit.

- south bank 1.6 m × 10 m, lip 8 m from the water, at -40, 1767
- north bank 1.6 m × 10 m, lip 8 m from the water, at 60, 1853
- south bank 1.6 m × 10 m, lip 8 m from the water, at -250, 1767

## Mural floor

- Z Company Arts `11` 58.88×9.9 m (582.91 m²), flat true, intact true
- Z Company Arts `17` 58.88×11 m (647.68 m²), flat true, intact true

## FPS samples

Software GL. Milliseconds are this host, same idea as PERF-GUARD. Source for the building-face share: pr62-published.

| View | One building ms | Pass ms | Buildings | Cap one | Cap pass | Buffer |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| phone | 0.2 | 0.6 | 37 | 8 | 40 | 1688x780 |
| ipad | 0.1 | 1.1 | 37 | 16 | 90 | 1024x768 |
| pc | 0.1 | 0.3 | 37 | 8 | 40 | 1280x720 |

## What held

- Shape, doors, and garages match on Arcade, Street, and on foot.
- Dance mural walls are flat, on the face, and at least as big as the recorded floor.
- Lots of ramps (70). No upper limit. The small river-edge jump stays the one that clears the river at about 80 mph.
- Finished buildings are straight boxes on the shared drawer. Curves, organic shells, and photoreal skins are not in this city.
- Every reviewed building uses the shared neon palette and the shared box drawer.
- Person doors sit on the street, wide enough and tall enough for a 1.7 m person.
- Footprints clear the 370Z, and heights clear a 1.7 m person and a 0.74 m pet.
- No floating boxes, intersecting volumes, or z-fighting faces in the reviewed set.
- One near building and the in-view building pass stay inside the FPS caps on phone, iPad, and PC.

## Shots

Street front, three-quarter, flying roof, and on-foot close-up, at phone 844×390, iPad 1024×768, and PC 1280×720.

- `b0` shots/b0-garage-front-phone.png, shots/b0-garage-front-ipad.png, shots/b0-garage-front-pc.png, shots/b0-garage-three-phone.png, shots/b0-garage-three-ipad.png, shots/b0-garage-three-pc.png, shots/b0-garage-roof-phone.png, shots/b0-garage-roof-ipad.png, shots/b0-garage-roof-pc.png, shots/b0-garage-foot-phone.png, shots/b0-garage-foot-ipad.png, shots/b0-garage-foot-pc.png
- `b1` shots/b1-skydrop-front-phone.png, shots/b1-skydrop-front-ipad.png, shots/b1-skydrop-front-pc.png, shots/b1-skydrop-three-phone.png, shots/b1-skydrop-three-ipad.png, shots/b1-skydrop-three-pc.png, shots/b1-skydrop-roof-phone.png, shots/b1-skydrop-roof-ipad.png, shots/b1-skydrop-roof-pc.png, shots/b1-skydrop-foot-phone.png, shots/b1-skydrop-foot-ipad.png, shots/b1-skydrop-foot-pc.png
- `b2` shots/b2-showroom-front-phone.png, shots/b2-showroom-front-ipad.png, shots/b2-showroom-front-pc.png, shots/b2-showroom-three-phone.png, shots/b2-showroom-three-ipad.png, shots/b2-showroom-three-pc.png, shots/b2-showroom-roof-phone.png, shots/b2-showroom-roof-ipad.png, shots/b2-showroom-roof-pc.png, shots/b2-showroom-foot-phone.png, shots/b2-showroom-foot-ipad.png, shots/b2-showroom-foot-pc.png
- `b3` shots/b3-nos-front-phone.png, shots/b3-nos-front-ipad.png, shots/b3-nos-front-pc.png, shots/b3-nos-three-phone.png, shots/b3-nos-three-ipad.png, shots/b3-nos-three-pc.png, shots/b3-nos-roof-phone.png, shots/b3-nos-roof-ipad.png, shots/b3-nos-roof-pc.png, shots/b3-nos-foot-phone.png, shots/b3-nos-foot-ipad.png, shots/b3-nos-foot-pc.png
- `b4` shots/b4-skydrop-front-phone.png, shots/b4-skydrop-front-ipad.png, shots/b4-skydrop-front-pc.png, shots/b4-skydrop-three-phone.png, shots/b4-skydrop-three-ipad.png, shots/b4-skydrop-three-pc.png, shots/b4-skydrop-roof-phone.png, shots/b4-skydrop-roof-ipad.png, shots/b4-skydrop-roof-pc.png, shots/b4-skydrop-foot-phone.png, shots/b4-skydrop-foot-ipad.png, shots/b4-skydrop-foot-pc.png
- `b5` shots/b5-home-front-phone.png, shots/b5-home-front-ipad.png, shots/b5-home-front-pc.png, shots/b5-home-three-phone.png, shots/b5-home-three-ipad.png, shots/b5-home-three-pc.png, shots/b5-home-roof-phone.png, shots/b5-home-roof-ipad.png, shots/b5-home-roof-pc.png, shots/b5-home-foot-phone.png, shots/b5-home-foot-ipad.png, shots/b5-home-foot-pc.png
- `b6` shots/b6-showroom-front-phone.png, shots/b6-showroom-front-ipad.png, shots/b6-showroom-front-pc.png, shots/b6-showroom-three-phone.png, shots/b6-showroom-three-ipad.png, shots/b6-showroom-three-pc.png, shots/b6-showroom-roof-phone.png, shots/b6-showroom-roof-ipad.png, shots/b6-showroom-roof-pc.png, shots/b6-showroom-foot-phone.png, shots/b6-showroom-foot-ipad.png, shots/b6-showroom-foot-pc.png
- `b7` shots/b7-nos-front-phone.png, shots/b7-nos-front-ipad.png, shots/b7-nos-front-pc.png, shots/b7-nos-three-phone.png, shots/b7-nos-three-ipad.png, shots/b7-nos-three-pc.png, shots/b7-nos-roof-phone.png, shots/b7-nos-roof-ipad.png, shots/b7-nos-roof-pc.png, shots/b7-nos-foot-phone.png, shots/b7-nos-foot-ipad.png, shots/b7-nos-foot-pc.png
- `b8` shots/b8-garage-front-phone.png, shots/b8-garage-front-ipad.png, shots/b8-garage-front-pc.png, shots/b8-garage-three-phone.png, shots/b8-garage-three-ipad.png, shots/b8-garage-three-pc.png, shots/b8-garage-roof-phone.png, shots/b8-garage-roof-ipad.png, shots/b8-garage-roof-pc.png, shots/b8-garage-foot-phone.png, shots/b8-garage-foot-ipad.png, shots/b8-garage-foot-pc.png
- `b9` shots/b9-neonpaint-front-phone.png, shots/b9-neonpaint-front-ipad.png, shots/b9-neonpaint-front-pc.png, shots/b9-neonpaint-three-phone.png, shots/b9-neonpaint-three-ipad.png, shots/b9-neonpaint-three-pc.png, shots/b9-neonpaint-roof-phone.png, shots/b9-neonpaint-roof-ipad.png, shots/b9-neonpaint-roof-pc.png, shots/b9-neonpaint-foot-phone.png, shots/b9-neonpaint-foot-ipad.png, shots/b9-neonpaint-foot-pc.png
- `b10` shots/b10-neonpaint-front-phone.png, shots/b10-neonpaint-front-ipad.png, shots/b10-neonpaint-front-pc.png, shots/b10-neonpaint-three-phone.png, shots/b10-neonpaint-three-ipad.png, shots/b10-neonpaint-three-pc.png, shots/b10-neonpaint-roof-phone.png, shots/b10-neonpaint-roof-ipad.png, shots/b10-neonpaint-roof-pc.png, shots/b10-neonpaint-foot-phone.png, shots/b10-neonpaint-foot-ipad.png, shots/b10-neonpaint-foot-pc.png
- `b11` shots/b11-dance-front-phone.png, shots/b11-dance-front-ipad.png, shots/b11-dance-front-pc.png, shots/b11-dance-three-phone.png, shots/b11-dance-three-ipad.png, shots/b11-dance-three-pc.png, shots/b11-dance-roof-phone.png, shots/b11-dance-roof-ipad.png, shots/b11-dance-roof-pc.png, shots/b11-dance-foot-phone.png, shots/b11-dance-foot-ipad.png, shots/b11-dance-foot-pc.png
- `b12` shots/b12-arcade-front-phone.png, shots/b12-arcade-front-ipad.png, shots/b12-arcade-front-pc.png, shots/b12-arcade-three-phone.png, shots/b12-arcade-three-ipad.png, shots/b12-arcade-three-pc.png, shots/b12-arcade-roof-phone.png, shots/b12-arcade-roof-ipad.png, shots/b12-arcade-roof-pc.png, shots/b12-arcade-foot-phone.png, shots/b12-arcade-foot-ipad.png, shots/b12-arcade-foot-pc.png
- `b13` shots/b13-home-front-phone.png, shots/b13-home-front-ipad.png, shots/b13-home-front-pc.png, shots/b13-home-three-phone.png, shots/b13-home-three-ipad.png, shots/b13-home-three-pc.png, shots/b13-home-roof-phone.png, shots/b13-home-roof-ipad.png, shots/b13-home-roof-pc.png, shots/b13-home-foot-phone.png, shots/b13-home-foot-ipad.png, shots/b13-home-foot-pc.png
- `b14` shots/b14-pets-front-phone.png, shots/b14-pets-front-ipad.png, shots/b14-pets-front-pc.png, shots/b14-pets-three-phone.png, shots/b14-pets-three-ipad.png, shots/b14-pets-three-pc.png, shots/b14-pets-roof-phone.png, shots/b14-pets-roof-ipad.png, shots/b14-pets-roof-pc.png, shots/b14-pets-foot-phone.png, shots/b14-pets-foot-ipad.png, shots/b14-pets-foot-pc.png
- `b15` shots/b15-pets-front-phone.png, shots/b15-pets-front-ipad.png, shots/b15-pets-front-pc.png, shots/b15-pets-three-phone.png, shots/b15-pets-three-ipad.png, shots/b15-pets-three-pc.png, shots/b15-pets-roof-phone.png, shots/b15-pets-roof-ipad.png, shots/b15-pets-roof-pc.png, shots/b15-pets-foot-phone.png, shots/b15-pets-foot-ipad.png, shots/b15-pets-foot-pc.png
- `b16` shots/b16-cafe-front-phone.png, shots/b16-cafe-front-ipad.png, shots/b16-cafe-front-pc.png, shots/b16-cafe-three-phone.png, shots/b16-cafe-three-ipad.png, shots/b16-cafe-three-pc.png, shots/b16-cafe-roof-phone.png, shots/b16-cafe-roof-ipad.png, shots/b16-cafe-roof-pc.png, shots/b16-cafe-foot-phone.png, shots/b16-cafe-foot-ipad.png, shots/b16-cafe-foot-pc.png
- `b17` shots/b17-dance-front-phone.png, shots/b17-dance-front-ipad.png, shots/b17-dance-front-pc.png, shots/b17-dance-three-phone.png, shots/b17-dance-three-ipad.png, shots/b17-dance-three-pc.png, shots/b17-dance-roof-phone.png, shots/b17-dance-roof-ipad.png, shots/b17-dance-roof-pc.png, shots/b17-dance-foot-phone.png, shots/b17-dance-foot-ipad.png, shots/b17-dance-foot-pc.png
- `b18` shots/b18-cafe-front-phone.png, shots/b18-cafe-front-ipad.png, shots/b18-cafe-front-pc.png, shots/b18-cafe-three-phone.png, shots/b18-cafe-three-ipad.png, shots/b18-cafe-three-pc.png, shots/b18-cafe-roof-phone.png, shots/b18-cafe-roof-ipad.png, shots/b18-cafe-roof-pc.png, shots/b18-cafe-foot-phone.png, shots/b18-cafe-foot-ipad.png, shots/b18-cafe-foot-pc.png
- `b19` shots/b19-arcade-front-phone.png, shots/b19-arcade-front-ipad.png, shots/b19-arcade-front-pc.png, shots/b19-arcade-three-phone.png, shots/b19-arcade-three-ipad.png, shots/b19-arcade-three-pc.png, shots/b19-arcade-roof-phone.png, shots/b19-arcade-roof-ipad.png, shots/b19-arcade-roof-pc.png, shots/b19-arcade-foot-phone.png, shots/b19-arcade-foot-ipad.png, shots/b19-arcade-foot-pc.png
- `b20` shots/b20-soccer-front-phone.png, shots/b20-soccer-front-ipad.png, shots/b20-soccer-front-pc.png, shots/b20-soccer-three-phone.png, shots/b20-soccer-three-ipad.png, shots/b20-soccer-three-pc.png, shots/b20-soccer-roof-phone.png, shots/b20-soccer-roof-ipad.png, shots/b20-soccer-roof-pc.png, shots/b20-soccer-foot-phone.png, shots/b20-soccer-foot-ipad.png, shots/b20-soccer-foot-pc.png
- `b21` shots/b21-soccer-front-phone.png, shots/b21-soccer-front-ipad.png, shots/b21-soccer-front-pc.png, shots/b21-soccer-three-phone.png, shots/b21-soccer-three-ipad.png, shots/b21-soccer-three-pc.png, shots/b21-soccer-roof-phone.png, shots/b21-soccer-roof-ipad.png, shots/b21-soccer-roof-pc.png, shots/b21-soccer-foot-phone.png, shots/b21-soccer-foot-ipad.png, shots/b21-soccer-foot-pc.png
- `b22` shots/b22-builder-front-phone.png, shots/b22-builder-front-ipad.png, shots/b22-builder-front-pc.png, shots/b22-builder-three-phone.png, shots/b22-builder-three-ipad.png, shots/b22-builder-three-pc.png, shots/b22-builder-roof-phone.png, shots/b22-builder-roof-ipad.png, shots/b22-builder-roof-pc.png, shots/b22-builder-foot-phone.png, shots/b22-builder-foot-ipad.png, shots/b22-builder-foot-pc.png
- `b23` shots/b23-builder-front-phone.png, shots/b23-builder-front-ipad.png, shots/b23-builder-front-pc.png, shots/b23-builder-three-phone.png, shots/b23-builder-three-ipad.png, shots/b23-builder-three-pc.png, shots/b23-builder-roof-phone.png, shots/b23-builder-roof-ipad.png, shots/b23-builder-roof-pc.png, shots/b23-builder-foot-phone.png, shots/b23-builder-foot-ipad.png, shots/b23-builder-foot-pc.png
