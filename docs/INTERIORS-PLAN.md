# Interiors plan

Bob picks one number per room, then writes "plan approved, build it". The live rooms are not built in this change. Nothing deploys. Adult `index.html`, `world.html`, and `world-split.html` stay as they are.

These six rooms replace the one shared shell in `world/house.js` (`walkPaintRoom`) when a later build is approved. That shell is about 8.4 m wide, 6.3 m deep, and 3.1 m tall. That size is retired. Each option below is the space behind the door. The meters do not grow the shop on the map.

Paint, the garage, and the dance hall launch an app, so they are out of this plan. NOS, the showroom, and the sky pad are drive-up, so they are out of this plan. The Garage Z link stays `jr.html#garage`.

## How to look

Open the review page. It uses the live interior painter (`world/style-sampler.js`), the shared prop catalog (`PLANNER_PROPS`), and `PLANNER_TOOLS.roof` for the stacked caps. Ellie and her pet are the same pair that painter already draws.

```text
test/interiors-review.html?room=house&style=2
```

`room` is `house`, `arcade`, `cafe`, `pets`, `soccer`, or `builder`. `style` is 1, 2, 3, or 4.

Each shot is that page, with the room name, the style name, a one-line description, and the paint time burned in. The contact sheet for a room is those four shots on one iPad-sized page (`1180 × 820`).

## What changed from the first plan

The first pass offered two photos of the same modern room, one with a glow strip. Ellie needs looks that differ in layout, color, materials, light, and one signature piece. Each room now has four rough in-engine options.

Straight boxes and flat color. Glass is a pale pane with a brighter edge. Wood is a flat tan fill. A plant is a square planter and flat green cards. A glow is a thin lit box. These review files do not set shadowBlur.

Every house option keeps a glass wall. The outdoor city stays the neon night city.

## People

Ellie is drawn at 1.7 m with a filled torso (`#2f7f96`), legs on the floor, and a head on the shoulders. Her pet stands on the same floor. The ears land at 0.74 m, about 0.43 of her height. On the glass-loft shot the pet's pixels are 0.42 of her full height, and both stand on the same floor line. Anatomy Check reviews that pair. This plan does not change the pet rig or the character.

## Doors

A kit is keyed by purpose. It stores no city id and no world x or z. Both copies of a purpose share one kit. City layout PR #68 can land either option. The door code already opens the kit and returns her to that door. The near wall has a 2 m opening. Props stay out of the door gap (x from -1.2 to 1.2, z from 0 to 2.2).

## Frame cost

While a room is open, the city loop is held. The indoor frame is the room painter. Floor area does not add cost. Box count does.

Paint time below is 40 paints in headless Chrome on this machine, then one labeled frame. It is not a Galaxy measurement. The 110 fps line is 9.1 ms. Every option is under 0.5 ms, so the estimate is about 110 fps, with margin. FPS Guard reviews the real build.

## Saved home

House options show the saved pieces (sofa or the hero prop, a pet bed, a screen) and do not write keys.

- Keys stay `zdash.house.v1` and the house object inside `zdash.kid.v1`.
- Theme, furniture, pet bed, and sign stay the fields they are now.

The review page does not write those keys, and it does not write `zdash.ellie.builder.v1`.

## Pick list

Reply with one number per room. A mix is fine.

| Room | 1 | 2 | 3 | 4 |
| --- | --- | --- | --- | --- |
| House | Glass loft, 24×18×4.8, 0.41 ms | Timber cabin, 22×16×4.2, 0.26 ms | Sky penthouse, 30×20×7.2, 0.33 ms | Block home, 24×18×5.4, 0.30 ms |
| Arcade | Retro lane, 36×16×5.2, 0.35 ms | Pop hall, 32×22×6.8, 0.24 ms | Space pit, 30×16×8, 0.26 ms | Block arcade, 28×18×5.6, 0.28 ms |
| Cafe | Beach shack, 28×18×4.8, 0.41 ms | Wood bakery, 24×16×4.2, 0.27 ms | Pop diner, 32×18×5.4, 0.28 ms | Night counter, 26×16×4.8, 0.37 ms |
| Pet lounge | Garden yard, 36×24×5.4, 0.32 ms | Cabin den, 26×18×4.2, 0.26 ms | Aqua bay, 34×20×5.2, 0.29 ms | Block park, 30×22×5.2, 0.19 ms |
| Soccer shop | Shop pitch, 48×30×6.8, 0.25 ms | Beach pitch, 44×28×5.6, 0.23 ms | Cup night, 46×28×7, 0.22 ms | Block field, 40×26×6.2, 0.17 ms |
| Builder HQ | Glass studio, 28×18×5.5, 0.21 ms | Space lab, 30×16×8, 0.24 ms | Wood workshop, 26×18×4.6, 0.27 ms | Sky office, 32×18×7.2, 0.25 ms |

The soccer shop is the largest because the kick happens inside. It is still a shop with a small pitch. It does not move the car to the outdoor dome.

## House

Walk the room. The four saved controls stay. Step outside when she is done.

1. **Glass loft.** A bright glass house with a cyan light and a soft sofa.
2. **Timber cabin.** A warm wood cabin with a big window and a stone hearth. A timber partition splits the room. The cap is stacked boxes from `PLANNER_TOOLS.roof`.
3. **Sky penthouse.** A tall glass room with a gold edge and a low lounge.
4. **Block home.** Chunky wood blocks, a glass window, and a cube seat.

![House, four looks](interiors/house-sheet.png)

![House 1, Glass loft](interiors/house-1-glass.png)
![House 2, Timber cabin](interiors/house-2-cabin.png)
![House 3, Sky penthouse](interiors/house-3-sky.png)
![House 4, Block home](interiors/house-4-block.png)

## Arcade

Walk the aisle. The jackpot sits on the far cabinet. Using it adds 500 points. Step outside.

1. **Retro lane.** A purple hall of bright cabinets and a gold jackpot.
2. **Pop hall.** A tall room of pink, mint, and lemon game cabinets.
3. **Space pit.** A very tall pale hall with a cyan strip and a screen row.
4. **Block arcade.** Giant red, blue, and yellow cube machines.

![Arcade, four looks](interiors/arcade-sheet.png)

![Arcade 1, Retro lane](interiors/arcade-1-retro.png)
![Arcade 2, Pop hall](interiors/arcade-2-pop.png)
![Arcade 3, Space pit](interiors/arcade-3-space.png)
![Arcade 4, Block arcade](interiors/arcade-4-block.png)

## Cafe

Order at the counter. The order adds 250 points and the NOS bump the counter already gives. Step outside.

1. **Beach shack.** Sand, aqua glass, palms, and a long snack counter.
2. **Wood bakery.** Warm wood, a long counter, and two tables.
3. **Pop diner.** A mint room with cherry booths and a big menu screen.
4. **Night counter.** A bright counter, a gold lip, and glass on the night. The room stays light. The panes look out on a dark blue night.

![Cafe, four looks](interiors/cafe-sheet.png)

![Cafe 1, Beach shack](interiors/cafe-1-beach.png)
![Cafe 2, Wood bakery](interiors/cafe-2-wood.png)
![Cafe 3, Pop diner](interiors/cafe-3-pop.png)
![Cafe 4, Night counter](interiors/cafe-4-night.png)

## Pet lounge

Greet at a pen. The pet with her stands on the floor at 0.74 m. Step outside.

1. **Garden yard.** A long garden with pots, glass, and two low pens.
2. **Cabin den.** A wood pet room with a window and two pens.
3. **Aqua bay.** A bright teal bay with glass and cyan pen rails.
4. **Block park.** Cube pens and a green play pad.

![Pet lounge, four looks](interiors/pets-sheet.png)

![Pet lounge 1, Garden yard](interiors/pets-1-garden.png)
![Pet lounge 2, Cabin den](interiors/pets-2-cabin.png)
![Pet lounge 3, Aqua bay](interiors/pets-3-aqua.png)
![Pet lounge 4, Block park](interiors/pets-4-block.png)

## Soccer shop

Kick off stands her on foot at the goal in this room and puts a ball there. The car stays at the shop. The outdoor dome stays where it is. The street word SOCCER stays the sign the audit already decided.

1. **Shop pitch.** A bright shop, a green pitch, and one goal.
2. **Beach pitch.** Sand around a turquoise pitch and a wood goal.
3. **Cup night.** A lit green pitch, blue seats, and a cyan goal.
4. **Block field.** Chunky seats, a cube goal, and a green pitch.

![Soccer shop, four looks](interiors/soccer-sheet.png)

![Soccer shop 1, Shop pitch](interiors/soccer-1-pitch.png)
![Soccer shop 2, Beach pitch](interiors/soccer-2-beach.png)
![Soccer shop 3, Cup night](interiors/soccer-3-cup.png)
![Soccer shop 4, Block field](interiors/soccer-4-block.png)

## Builder HQ

Tap a blueprint board. The toast still points at the sandbox outside. The sandbox stays outside. The street word BUILD stays the sign the audit already decided.

1. **Glass studio.** A bright desk, three boards, and a tiny block city.
2. **Space lab.** A very tall pale lab with a cyan strip and a desk model.
3. **Wood workshop.** Wood benches, a tool wall, and a high window.
4. **Sky office.** Tall glass, a gold edge, and one model on a stand.

![Builder HQ, four looks](interiors/builder-sheet.png)

![Builder HQ 1, Glass studio](interiors/builder-1-studio.png)
![Builder HQ 2, Space lab](interiors/builder-2-space.png)
![Builder HQ 3, Wood workshop](interiors/builder-3-wood.png)
![Builder HQ 4, Sky office](interiors/builder-4-sky.png)

## Who reviews the build

After Bob picks and writes "plan approved, build it":

- The interiors build replaces the shared shell for these six purposes. One editor. The paint door and the dance door stay with their owners.
- Architecture Check reviews the rooms once they exist. This pass already keeps straight boxes, flat color, a glass face on every house, the door gap clear, and ceilings above 4.2 m.
- Anatomy Check reviews Ellie at 1.7 m with a torso, and the pet at 0.74 m on the floor. The shots use that live pair.
- FPS Guard reviews the frame. This plan does not add a bench.

## What this plan does not do

It does not edit `world.html`, `world-split.html`, `jr.html`, or `index.html`. It does not build a live room, deploy, or pick city layout option A or B. It does not change a saved home key, the Garage Z link, a pet rig, or a character. It does not add a shop. The count stays 24.
