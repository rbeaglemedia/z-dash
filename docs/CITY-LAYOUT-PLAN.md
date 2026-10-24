# Neon World city layout plan

Plan only. No game code. The airport stays in the middle, with its ramps, and the rest of the city is arranged around it.

Nothing is built until Bob picks an option and writes "plan approved, build it".

## Plain English

Today the 24 shops are scattered. A home sits next to a showroom, the dance halls don't share a street, and the tower shares its block with a cafe and a soccer shop. The roads are fine. The buildings were placed without neighborhoods.

This plan keeps every building, every height, and every footprint. It keeps the black placeholder boxes. It lines the buildings up into places Ellie can name:

- **Home streets** on the west, two blocks (a house, pets, and pizza on each).
- **The park** between the homes and the west car shops, so those two don't fill one view.
- **Car shops** in two rows: one west of the park, one north-east of the tower. The west highway between them stays open, which leaves a clear run at the highway jump.
- **Play** on the east: both arcades and both soccer shops, on the road that leads to the dome.
- **The tower** alone in downtown.
- **The builder island** on the pads it already uses, north of the river.
- **The runway** empty down the middle, from spawn to the river. She still starts at (0, 0), looking up the airport.
- **The west highway tunnel** left exactly as it is, including the open mouths you line up on to fly through.

The two options are the same map. The only difference is the Sky Drop roof (the 62 m pad).

- **Option A.** The roof stays where it is now, on the west side of the runway. The east side, with the arcades and the soccer shops, stays a little emptier. Pick this if the glide should keep today's pad.
- **Option B.** The roof moves to the east side, next to the arcades, so the play side has the big jump. Pick this if the jump should live with the arcades.

Either way the airport does not move, and the buildings stay the black placeholders.

To change a later round, name the block. "Slide the arcades north" changes one pair of buildings. The other option does not have to be redrawn.

## Outsides stay the same size

Footprints and heights stay exactly as planned. The black boxes do not get bigger. A note that the buildings feel small is about the rooms inside, once you walk in. A bigger room is a later interior pass. It is not this map, and it does not change a street, a ramp, or a run-up.

## The current city

North is up. Cyan strip down the middle is the runway and the flying lane. That strip is the anchor. Every arrow is a ramp, and the tip is the launch. The white arrows on the banks are the river launches.

![Current Neon World, top-down](city-layout/current.png)

## Option A — Sky Drop stays on the west

Home streets on the west, car shops split by the park, play on the east, the tower alone. The big cyan jump roof stays on the west shoulder of the runway, where she already glides to it. Same 82 ramps as today. Two plaza lots slide so a shop does not sit on a run-up.

![Option A, top-down](city-layout/option-a.png)

## Option B — Sky Drop moves to the east

Same streets, same buildings, same tower, same ramps. Only the cyan jump roof crosses the runway and sits with the arcades. It does not cover a ramp or a landing.

![Option B, top-down](city-layout/option-b.png)

## What does not move

- The runway, the taxiway, the half-pipe, the loop, and the ramps beside the runway.
- The river, both bridges, and the river-edge jumps. The small jump that just clears the water at about 80 mph stays the same size and the same place on the bank.
- The west highway tunnel. Same hill, same bore, same ceiling, same guide lines, same place. The mouths stay clear. Details and the flag are in the tunnel section below.
- The park, the soccer dome, the road out to the dome, and the race track.
- The builder sandbox north of the river, and both builder HQs. They stay on today's pads. Sliding them along the bank would put them on top of the north-bank jumps.
- The road centerlines. Traffic, Hot Drop, the tow trucks, and the minimap all read those lines. New roads would be a separate plan.
- Spawn at (0, 0). Ellie's saved home (it looks up a HOME building, not a coordinate). The Garage Z link (it looks up a GARAGE). Objectives.
- Traffic stays 30 cars (12 simulated, 18 dots).
- Both dance halls keep a 64 m mural wall, 18 m and 20 m tall, with the Z Company Arts sign. The wall faces east, onto a street, in both options. It is not smaller than today's mural.

## Tunnel

**Tunnel changes: none.** The layout did not need any.

The tunnel stays the hill on the west highway at x −530..−370, z 500..700. The hill is 160 m wide, 200 m long, and 34 m tall. The bore is the highway itself, 30 m wide (x −465..−435). The ceiling is 10 m. Flying into that ceiling still eases you down instead of crashing. The two cyan guide lines stay on the bore edges, from the south mouth to the north mouth, 1 m off the road. Nothing in this plan resizes, reshapes, lengthens, or moves any of that.

The mouths stay clear for 60 m, which is the lead-in the game already uses when it draws the tunnel. No new building enters that bore, on either side. The nearest shop to the south mouth is the south pizza cafe, 138 m down the road and 25 m off the side of the bore (144 m from the mouth center). The nearest shop to the north mouth is the north pizza cafe, 138 m down the road and 21 m off the bore (143 m from the mouth center). The west jump roof, in Option A, sits beside the runway, about 140 m east of the hill, not on the highway.

The pale green bars on the maps are those two clear mouths. They are not a new tunnel.

The ramp count, the river launches, and the two plaza slides are in the next section. The tunnel is not one of those slides.

## Ramps and jumps

Counted from the placements in `world/city.js` on current main. **82 ramp pieces, plus the half-pipe and the loop.** Options A and B keep all 82. Same height, same length, same width, same rotation, so the slope the car launches on does not change. No new ramps were added, so none are marked new. Twelve pieces move, because two plazas have to slide out from under a shop. The other 70 stay on today's coordinates.

The angle in the tables is the rise over the length. That is the slope the game uses when the car leaves the lip. A kicker is 1.6 m over 10 m (9.1°). A medium is 3.5 m over 24 m (8.3°). A big launch is 7.5 m over 60 m (7.1°). The highway ramp is already the odd one in the game, 6 m over 60 m (5.7°), and it stays that way.

### River edge

Ten river jumps. None of them move, and none of them change height or length. The three kickers are the just-over jumps: 8 m wide, 10 m long, 1.6 m high, 9.1°, on the same bank spots as today. At a normal run they land in the water. That water is the landing they were built for, and it stays clear.

- South bank, x −40, z 1767, launches north. This is the runway-side jump. The run-up is the open shoulder south of it (the checked box is x −44..−36, z 1750..1762). Landing is the river, z 1780..1840.
- North bank, x 60, z 1853, launches south into that same water. Run-up is north of it, x 56..64, z 1858..1870, clear of both builder HQs.
- South bank, x −250, z 1767, launches north into the water. Same size, same angle.

The two big launches are the ones that clear the river. Their far-bank strips are empty:

- South bank, x 120, z 1742, 7.1°, launches north. Run-up x 112..128, z 1672..1712. Landing on the north bank, x 112..128, z 1846..1880. The builder HQs start at x 164, so they are not in that strip.
- North bank, x −120, z 1878, 7.1°, launches south. Run-up x −128..−112, z 1908..1948, up into the open sandbox. Landing on the south bank, x −128..−112, z 1740..1774, short of the west car shops.

The five medium river ramps stay at 8.3°. A normal run drops them in the water. A faster run reaches the far bank, and those strips are clear too (x −106..−94, x 244..256, and x −256..−244, plus the two beside the bridges at x 94..106 and x 294..306). The north car shops end at z 1686, south of the south-bank landing, and they do not share an x with a landing that would hit them.

### How a landing was judged clear

A relocated building is a block if it overlaps the ramp, the ground behind it, or the ground past the lip. The checked distance is 40 m for a big launch, the highway ramp, the taxiway ramp, or the street ramp; 24 m for a medium or an embankment; 12 m for a kicker, a curb, or a road hump. A tow truck uses the lane behind its bed. The little gap kicker on each truck (the steep lip, starting 1.5 m up on the bed) is part of that same jump. River kickers use the water as the landing. River mediums and big launches use the far-bank strip, with the water in between left open.

That check is clean for today's city, for Option A, and for Option B. The log is `docs/city-layout/ramp-check.txt`.

### What slides

Plaza 3 today is x 160..240, z 310..490. The new arcade covers it. One block north (z 510..690) still puts the big launch's 40 m run-up inside that arcade. The lot goes to **x 160..240, z 520..700**, so the run-up starts at z 492, clear of the arcade by 6 m. Same six pieces, same angles, same directions.

Plaza 4 today is x −540..−472, z 310..490. The new west pizza shop covers it. The next block south (z 110..290) still puts that launch's run-up inside the pizza shop. The lot goes to **x −540..−472, z −90..90**, the open west block beside spawn, so the run-up is the cross street. Same six pieces.

Plazas 1, 2, and 5 stay. So do the airport ramps, the river jumps, the highway ramp, the street ramp, the taxiway ramp, the garage kicker, the embankments, the road humps, the six tow trucks, the half-pipe, and the loop.

The half-pipe stays at x −95, z 260 (footprint x −127..−63, z 200..320, walls 5 m), with 20 m of open ground at both ends. The loop stays at x −80, z 1440, heading north, radius 12 m, lane 8 m, exit 9 m to the east. The west car shops do not reach it.

Option B's jump roof is about 8 m east of tow truck 1 (x 254, z 600). The truck's landing is only as wide as the bed, and it does not enter the building. The drive check on that gap stays in the test section.

The arrows on all three maps are these ramps. White arrows are the river edge.

### Full list, today's positions

+x is east, +z is north. Size is width × length × height, in meters, before a rotation turns a side-facing ramp. The run-up and landing boxes are the ones the check used.

### plaza (30)

| # | Ramp | Place | Size (w×d×h m) | Angle | Launches | Run-up | Landing |
|---|---|---|---|---|---|---|---|
| 1 | plaza 1 launch | x 300, z -248 | 16×60×7.5 | 7.1° | north | 40 m south (x 292..308, z -318..-278) | 40 m north (x 292..308, z -218..-178) |
| 2 | plaza 1 medium | x 276, z -130 | 12×24×3.5 | 8.3° | south | 24 m north (x 270..282, z -118..-94) | 24 m south (x 270..282, z -166..-142) |
| 3 | plaza 1 kick | x 328, z -200 | 8×10×1.6 | 9.1° | north | 12 m south (x 324..332, z -217..-205) | 12 m north (x 324..332, z -195..-183) |
| 4 | plaza 1 hidden kick, hidden | x 328, z -170 | 8×10×1.6 | 9.1° | north | 12 m south (x 324..332, z -187..-175) | 12 m north (x 324..332, z -165..-153) |
| 5 | plaza 1 curb west | x 263.5, z -188 | 10×5×0.8 | 9.1° | east | 12 m west (x 249..261, z -193..-183) | 12 m east (x 266..278, z -193..-183) |
| 6 | plaza 1 curb east | x 336.5, z -212 | 10×5×0.8 | 9.1° | west | 12 m east (x 339..351, z -217..-207) | 12 m west (x 322..334, z -217..-207) |
| 7 | plaza 2 launch | x 300, z 448 | 16×60×7.5 | 7.1° | south | 40 m north (x 292..308, z 478..518) | 40 m south (x 292..308, z 378..418) |
| 8 | plaza 2 medium | x 276, z 330 | 12×24×3.5 | 8.3° | north | 24 m south (x 270..282, z 294..318) | 24 m north (x 270..282, z 342..366) |
| 9 | plaza 2 kick | x 328, z 400 | 8×10×1.6 | 9.1° | south | 12 m north (x 324..332, z 405..417) | 12 m south (x 324..332, z 383..395) |
| 10 | plaza 2 hidden kick, hidden | x 328, z 370 | 8×10×1.6 | 9.1° | south | 12 m north (x 324..332, z 375..387) | 12 m south (x 324..332, z 353..365) |
| 11 | plaza 2 curb west | x 263.5, z 412 | 10×5×0.8 | 9.1° | east | 12 m west (x 249..261, z 407..417) | 12 m east (x 266..278, z 407..417) |
| 12 | plaza 2 curb east | x 336.5, z 388 | 10×5×0.8 | 9.1° | west | 12 m east (x 339..351, z 383..393) | 12 m west (x 322..334, z 383..393) |
| 13 | plaza 3 launch | x 200, z 352 | 16×60×7.5 | 7.1° | north | 40 m south (x 192..208, z 282..322) | 40 m north (x 192..208, z 382..422) |
| 14 | plaza 3 medium | x 176, z 470 | 12×24×3.5 | 8.3° | south | 24 m north (x 170..182, z 482..506) | 24 m south (x 170..182, z 434..458) |
| 15 | plaza 3 kick | x 228, z 400 | 8×10×1.6 | 9.1° | north | 12 m south (x 224..232, z 383..395) | 12 m north (x 224..232, z 405..417) |
| 16 | plaza 3 hidden kick, hidden | x 228, z 430 | 8×10×1.6 | 9.1° | north | 12 m south (x 224..232, z 413..425) | 12 m north (x 224..232, z 435..447) |
| 17 | plaza 3 curb west | x 163.5, z 412 | 10×5×0.8 | 9.1° | east | 12 m west (x 149..161, z 407..417) | 12 m east (x 166..178, z 407..417) |
| 18 | plaza 3 curb east | x 236.5, z 388 | 10×5×0.8 | 9.1° | west | 12 m east (x 239..251, z 383..393) | 12 m west (x 222..234, z 383..393) |
| 19 | plaza 4 launch | x -506, z 448 | 16×60×7.5 | 7.1° | south | 40 m north (x -514..-498, z 478..518) | 40 m south (x -514..-498, z 378..418) |
| 20 | plaza 4 medium | x -524, z 330 | 12×24×3.5 | 8.3° | north | 24 m south (x -530..-518, z 294..318) | 24 m north (x -530..-518, z 342..366) |
| 21 | plaza 4 kick | x -484, z 400 | 8×10×1.6 | 9.1° | south | 12 m north (x -488..-480, z 405..417) | 12 m south (x -488..-480, z 383..395) |
| 22 | plaza 4 hidden kick, hidden | x -484, z 370 | 8×10×1.6 | 9.1° | south | 12 m north (x -488..-480, z 375..387) | 12 m south (x -488..-480, z 353..365) |
| 23 | plaza 4 curb west | x -536.5, z 412 | 10×5×0.8 | 9.1° | east | 12 m west (x -551..-539, z 407..417) | 12 m east (x -534..-522, z 407..417) |
| 24 | plaza 4 curb east | x -475.5, z 388 | 10×5×0.8 | 9.1° | west | 12 m east (x -473..-461, z 383..393) | 12 m west (x -490..-478, z 383..393) |
| 25 | plaza 5 launch | x -200, z 1352 | 16×60×7.5 | 7.1° | north | 40 m south (x -208..-192, z 1282..1322) | 40 m north (x -208..-192, z 1382..1422) |
| 26 | plaza 5 medium | x -224, z 1470 | 12×24×3.5 | 8.3° | south | 24 m north (x -230..-218, z 1482..1506) | 24 m south (x -230..-218, z 1434..1458) |
| 27 | plaza 5 kick | x -172, z 1400 | 8×10×1.6 | 9.1° | north | 12 m south (x -176..-168, z 1383..1395) | 12 m north (x -176..-168, z 1405..1417) |
| 28 | plaza 5 hidden kick, hidden | x -172, z 1430 | 8×10×1.6 | 9.1° | north | 12 m south (x -176..-168, z 1413..1425) | 12 m north (x -176..-168, z 1435..1447) |
| 29 | plaza 5 curb west | x -236.5, z 1412 | 10×5×0.8 | 9.1° | east | 12 m west (x -251..-239, z 1407..1417) | 12 m east (x -234..-222, z 1407..1417) |
| 30 | plaza 5 curb east | x -163.5, z 1388 | 10×5×0.8 | 9.1° | west | 12 m east (x -161..-149, z 1383..1393) | 12 m west (x -178..-166, z 1383..1393) |

### garage (1)

| # | Ramp | Place | Size (w×d×h m) | Angle | Launches | Run-up | Landing |
|---|---|---|---|---|---|---|---|
| 31 | garage kicker | x 528, z 409 | 8×10×1.6 | 9.1° | north | 12 m south (x 524..532, z 392..404) | 12 m north (x 524..532, z 414..426) |

### base (3)

| # | Ramp | Place | Size (w×d×h m) | Angle | Launches | Run-up | Landing |
|---|---|---|---|---|---|---|---|
| 32 | taxiway ramp | x 50, z 790 | 16×60×7.5 | 7.1° | north | 40 m south (x 42..58, z 720..760) | 40 m north (x 42..58, z 820..860) |
| 33 | street ramp | x 250, z 350 | 14×40×4 | 5.7° | north | 40 m south (x 243..257, z 290..330) | 40 m north (x 243..257, z 370..410) |
| 34 | highway ramp | x -450, z 1630 | 24×60×6 | 5.7° | north | 40 m south (x -462..-438, z 1560..1600) | 40 m north (x -462..-438, z 1660..1700) |

### airport (13)

| # | Ramp | Place | Size (w×d×h m) | Angle | Launches | Run-up | Landing |
|---|---|---|---|---|---|---|---|
| 35 | airport med | x 120, z 150 | 12×24×3.5 | 8.3° | north | 24 m south (x 114..126, z 114..138) | 24 m north (x 114..126, z 162..186) |
| 36 | airport kick | x 120, z 420 | 8×10×1.6 | 9.1° | north | 12 m south (x 116..124, z 403..415) | 12 m north (x 116..124, z 425..437) |
| 37 | airport launch | x 120, z 640 | 16×60×7.5 | 7.1° | north | 40 m south (x 112..128, z 570..610) | 40 m north (x 112..128, z 670..710) |
| 38 | airport med | x 120, z 1000 | 12×24×3.5 | 8.3° | south | 24 m north (x 114..126, z 1012..1036) | 24 m south (x 114..126, z 964..988) |
| 39 | airport kick, hidden | x 120, z 1250 | 8×10×1.6 | 9.1° | north | 12 m south (x 116..124, z 1233..1245) | 12 m north (x 116..124, z 1255..1267) |
| 40 | airport kick | x 125, z 1390 | 8×10×1.6 | 9.1° | south | 12 m north (x 121..129, z 1395..1407) | 12 m south (x 121..129, z 1373..1385) |
| 41 | airport med | x -40, z 520 | 12×24×3.5 | 8.3° | north | 24 m south (x -46..-34, z 484..508) | 24 m north (x -46..-34, z 532..556) |
| 42 | airport launch | x -110, z 700 | 16×60×7.5 | 7.1° | north | 40 m south (x -118..-102, z 630..670) | 40 m north (x -118..-102, z 730..770) |
| 43 | airport kick, hidden | x -40, z 900 | 8×10×1.6 | 9.1° | north | 12 m south (x -44..-36, z 883..895) | 12 m north (x -44..-36, z 905..917) |
| 44 | airport med | x -110, z 1100 | 12×24×3.5 | 8.3° | south | 24 m north (x -116..-104, z 1112..1136) | 24 m south (x -116..-104, z 1064..1088) |
| 45 | airport kick | x -40, z 1250 | 8×10×1.6 | 9.1° | north | 12 m south (x -44..-36, z 1233..1245) | 12 m north (x -44..-36, z 1255..1267) |
| 46 | airport kick | x -125, z 1600 | 8×10×1.6 | 9.1° | south | 12 m north (x -129..-121, z 1605..1617) | 12 m south (x -129..-121, z 1583..1595) |
| 47 | airport kick, hidden | x -40, z 60 | 8×10×1.6 | 9.1° | south | 12 m north (x -44..-36, z 65..77) | 12 m south (x -44..-36, z 43..55) |

### river (10)

| # | Ramp | Place | Size (w×d×h m) | Angle | Launches | Run-up | Landing |
|---|---|---|---|---|---|---|---|
| 48 | river south bank launch | x 120, z 1742 | 16×60×7.5 | 7.1° | north | 40 m south (x 112..128, z 1672..1712) | north bank after the water (x 112..128, z 1846..1880) |
| 49 | river south bank med | x -100, z 1760 | 12×24×3.5 | 8.3° | north | 24 m south (x -106..-94, z 1724..1748) | north bank after the water (x -106..-94, z 1846..1880) |
| 50 | river south bank kick | x -40, z 1767 | 8×10×1.6 | 9.1° | north | 12 m south (x -44..-36, z 1750..1762) | water, by design (the just-over jump) (x -44..-36, z 1780..1840) |
| 51 | river north bank med | x 100, z 1860 | 12×24×3.5 | 8.3° | south | 24 m north (x 94..106, z 1872..1896) | south bank after the water (x 94..106, z 1740..1774) |
| 52 | river north bank launch | x -120, z 1878 | 16×60×7.5 | 7.1° | south | 40 m north (x -128..-112, z 1908..1948) | south bank after the water (x -128..-112, z 1740..1774) |
| 53 | river north bank kick | x 60, z 1853 | 8×10×1.6 | 9.1° | south | 12 m north (x 56..64, z 1858..1870) | water, by design (the just-over jump) (x 56..64, z 1780..1840) |
| 54 | river south bank med | x 250, z 1760 | 12×24×3.5 | 8.3° | north | 24 m south (x 244..256, z 1724..1748) | north bank after the water (x 244..256, z 1846..1880) |
| 55 | river south bank kick | x -250, z 1767 | 8×10×1.6 | 9.1° | north | 12 m south (x -254..-246, z 1750..1762) | water, by design (the just-over jump) (x -254..-246, z 1780..1840) |
| 56 | river north bank med | x 300, z 1860 | 12×24×3.5 | 8.3° | south | 24 m north (x 294..306, z 1872..1896) | south bank after the water (x 294..306, z 1740..1774) |
| 57 | river north bank med | x -250, z 1860 | 12×24×3.5 | 8.3° | south | 24 m north (x -256..-244, z 1872..1896) | south bank after the water (x -256..-244, z 1740..1774) |

### bank (8)

| # | Ramp | Place | Size (w×d×h m) | Angle | Launches | Run-up | Landing |
|---|---|---|---|---|---|---|---|
| 58 | embankment, hidden | x 300, z -345 | 20×30×4 | 7.6° | south | 24 m north (x 290..310, z -330..-306) | 24 m south (x 290..310, z -384..-360) |
| 59 | embankment, hidden | x -300, z -345 | 20×30×4 | 7.6° | south | 24 m north (x -310..-290, z -330..-306) | 24 m south (x -310..-290, z -384..-360) |
| 60 | embankment, hidden | x 600, z 520 | 20×30×4 | 7.6° | east | 24 m west (x 561..585, z 510..530) | 24 m east (x 615..639, z 510..530) |
| 61 | embankment, hidden | x 600, z 1500 | 20×30×4 | 7.6° | east | 24 m west (x 561..585, z 1490..1510) | 24 m east (x 615..639, z 1490..1510) |
| 62 | embankment, hidden | x -600, z 960 | 20×30×4 | 7.6° | west | 24 m east (x -585..-561, z 950..970) | 24 m west (x -639..-615, z 950..970) |
| 63 | embankment, hidden | x 300, z 2150 | 20×30×4 | 7.6° | north | 24 m south (x 290..310, z 2111..2135) | 24 m north (x 290..310, z 2165..2189) |
| 64 | embankment, hidden | x -260, z 2150 | 20×30×4 | 7.6° | north | 24 m south (x -270..-250, z 2111..2135) | 24 m north (x -270..-250, z 2165..2189) |
| 65 | embankment, hidden | x -600, z 1500 | 20×30×4 | 7.6° | west | 24 m east (x -585..-561, z 1490..1510) | 24 m west (x -639..-615, z 1490..1510) |

### crest (5)

| # | Ramp | Place | Size (w×d×h m) | Angle | Launches | Run-up | Landing |
|---|---|---|---|---|---|---|---|
| 66 | road crest, hidden | x 400, z 300 | 20×19×1.8 | 5.4° | east | 12 m west (x 378.5..390.5, z 290..310) | 12 m east (x 409.5..421.5, z 290..310) |
| 67 | road crest, hidden | x -300, z 900 | 20×19×1.8 | 5.4° | west | 12 m east (x -290.5..-278.5, z 890..910) | 12 m west (x -321.5..-309.5, z 890..910) |
| 68 | road crest, hidden | x 350, z 1400 | 20×19×1.8 | 5.4° | north | 12 m south (x 340..360, z 1378.5..1390.5) | 12 m north (x 340..360, z 1409.5..1421.5) |
| 69 | road crest, hidden | x -250, z 300 | 20×19×1.8 | 5.4° | south | 12 m north (x -260..-240, z 309.5..321.5) | 12 m south (x -260..-240, z 278.5..290.5) |
| 70 | road crest, hidden | x 450, z -200 | 20×19×1.8 | 5.4° | north | 12 m south (x 440..460, z -221.5..-209.5) | 12 m north (x 440..460, z -190.5..-178.5) |

### tow (12)

| # | Ramp | Place | Size (w×d×h m) | Angle | Launches | Run-up | Landing |
|---|---|---|---|---|---|---|---|
| 71 | tow 1 bed | x 254, z 597.3 | 3.6×8.7×2.6 | 16.7° | north | 24 m south (x 252.2..255.8, z 569..593) | 24 m north (x 252.2..255.8, z 601.7..625.7) |
| 72 | tow 1 gap kicker | x 254, z 603 | 3.6×2.6×1.2 | 24.8° | north | same truck |  |
| 73 | tow 2 bed | x -354, z 1202.7 | 3.6×8.7×2.6 | 16.7° | south | 24 m north (x -355.8..-352.2, z 1207..1231) | 24 m south (x -355.8..-352.2, z 1174.3..1198.3) |
| 74 | tow 2 gap kicker | x -354, z 1197 | 3.6×2.6×1.2 | 24.8° | south | same truck |  |
| 75 | tow 3 bed | x -154, z 797.3 | 3.6×8.7×2.6 | 16.7° | north | 24 m south (x -155.8..-152.2, z 769..793) | 24 m north (x -155.8..-152.2, z 801.7..825.7) |
| 76 | tow 3 gap kicker | x -154, z 803 | 3.6×2.6×1.2 | 24.8° | north | same truck |  |
| 77 | tow 4 bed | x -246, z -2.7 | 3.6×8.7×2.6 | 16.7° | north | 24 m south (x -247.8..-244.2, z -31..-7) | 24 m north (x -247.8..-244.2, z 1.7..25.7) |
| 78 | tow 4 gap kicker | x -246, z 3 | 3.6×2.6×1.2 | 24.8° | north | same truck |  |
| 79 | tow 5 bed | x 154, z 1597.3 | 3.6×8.7×2.6 | 16.7° | north | 24 m south (x 152.2..155.8, z 1569..1593) | 24 m north (x 152.2..155.8, z 1601.7..1625.7) |
| 80 | tow 5 gap kicker | x 154, z 1603 | 3.6×2.6×1.2 | 24.8° | north | same truck |  |
| 81 | tow 6 bed | x -546, z 402.7 | 3.6×8.7×2.6 | 16.7° | south | 24 m north (x -547.8..-544.2, z 407..431) | 24 m south (x -547.8..-544.2, z 374.3..398.3) |
| 82 | tow 6 gap kicker | x -546, z 397 | 3.6×2.6×1.2 | 24.8° | south | same truck |  |

### Plaza 3 and plaza 4 on options A and B

Same pieces as the rows above. Only the place, the run-up, and the landing move.

| # | Ramp | Place | Size (w×d×h m) | Angle | Launches | Run-up | Landing |
|---|---|---|---|---|---|---|---|
| 13 | plaza 3 launch | x 200, z 562 | 16×60×7.5 | 7.1° | north | 40 m south (x 192..208, z 492..532) | 40 m north (x 192..208, z 592..632) |
| 14 | plaza 3 medium | x 176, z 680 | 12×24×3.5 | 8.3° | south | 24 m north (x 170..182, z 692..716) | 24 m south (x 170..182, z 644..668) |
| 15 | plaza 3 kick | x 228, z 610 | 8×10×1.6 | 9.1° | north | 12 m south (x 224..232, z 593..605) | 12 m north (x 224..232, z 615..627) |
| 16 | plaza 3 hidden kick, hidden | x 228, z 640 | 8×10×1.6 | 9.1° | north | 12 m south (x 224..232, z 623..635) | 12 m north (x 224..232, z 645..657) |
| 17 | plaza 3 curb west | x 163.5, z 622 | 10×5×0.8 | 9.1° | east | 12 m west (x 149..161, z 617..627) | 12 m east (x 166..178, z 617..627) |
| 18 | plaza 3 curb east | x 236.5, z 598 | 10×5×0.8 | 9.1° | west | 12 m east (x 239..251, z 593..603) | 12 m west (x 222..234, z 593..603) |
| 19 | plaza 4 launch | x -506, z 48 | 16×60×7.5 | 7.1° | south | 40 m north (x -514..-498, z 78..118) | 40 m south (x -514..-498, z -22..18) |
| 20 | plaza 4 medium | x -524, z -70 | 12×24×3.5 | 8.3° | north | 24 m south (x -530..-518, z -106..-82) | 24 m north (x -530..-518, z -58..-34) |
| 21 | plaza 4 kick | x -484, z 0 | 8×10×1.6 | 9.1° | south | 12 m north (x -488..-480, z 5..17) | 12 m south (x -488..-480, z -17..-5) |
| 22 | plaza 4 hidden kick, hidden | x -484, z -30 | 8×10×1.6 | 9.1° | south | 12 m north (x -488..-480, z -25..-13) | 12 m south (x -488..-480, z -47..-35) |
| 23 | plaza 4 curb west | x -536.5, z 12 | 10×5×0.8 | 9.1° | east | 12 m west (x -551..-539, z 7..17) | 12 m east (x -534..-522, z 7..17) |
| 24 | plaza 4 curb east | x -475.5, z -12 | 10×5×0.8 | 9.1° | west | 12 m east (x -473..-461, z -17..-7) | 12 m west (x -490..-478, z -17..-7) |

## What moves, and why

Heights and footprints match today. A star marks a roof pad. Coordinates are meters. +x is east, +z is north.

| # | Building | Now | Both options, unless noted | Why |
|---|---|---|---|---|
| 6 | Home, 11 m | Spawn south, by the runway | West home street, south block. x −408..−364, z 314..362 | Her first house fronts a street, not the runway. |
| 15 | Pets, 12 m | Far west, by the park | Same south block. x −336..−296, z 314..362 | Pets next to the house. |
| 17 | Pizza, 12 m | West, mid-map | Same south block. x −534..−490, z 314..362 | Pizza on the same street. |
| 14 | Home, 12 m | Far west | West home street, north block. x −404..−364, z 838..886 | Second house gets its own street, with the park to the north. |
| 16 | Pets, 13 m | By the park | Same north block. x −336..−292, z 838..886 | Second pet shop with the second house. |
| 19 | Pizza, 13 m | Next to the tower | Same north block. x −534..−486, z 838..886 | Moves the cafe off the tower's block. |
| 12 | Dance, 18 m | West, mid-map. Mural faces east | South of spawn's first cross street. x −224..−164, z 114..178. Mural still faces east | The 64 m wall gets its own view. It does not share the jump roof's shot. |
| 18 | Dance, 20 m | Beside the tower. Mural faces west | North home avenue. x −224..−164, z 914..978. Mural faces east, still 64 m | Gets the mural off the tower. The wall is the same length as today. |
| 2 | Sky Drop roof, 62 m ★ | West shoulder. x −232..−168, z 518..682 | **A:** stays there. **B:** east shoulder, x 264..328, z 518..682 | The one choice. A keeps the glide where it is tuned. B puts the roof with the arcades. |
| 1 | Garage, 26 m ★ | Spawn south | West car row, north of the park. x −428..−364, z 1314..1478 | The big garage leaves the runway and joins the car shops. |
| 10 | Neon paint, 14 m | West, mid-map | Same west car row. x −534..−490, z 1314..1362 | Paint with the garages. |
| 7 | Showroom, 16 m | Spawn south | Same west car row. x −534..−470, z 1426..1482 | The small showroom leaves spawn. |
| 9 | Garage, 15 m | East, by the dome | Same west car row. x −312..−264, z 1396..1486 | Second garage with the first, not beside the stadium. |
| 3 | Showroom, 18 m ★ | Downtown, south of the tower | North-east car row. x 164..228, z 1514..1678 | The long glass showroom leaves the tower's block. |
| 4 | NOS, 34 m ★ | Far west | Same north-east row. x 364..428, z 1514..1678 | The tall fuel shop stands with the other car shops, off the tower. |
| 11 | Neon paint, 15 m | West | Same north-east row. x 492..536, z 1514..1562 | Second paint shop with the north row. |
| 8 | NOS, 12 m | Spawn south | Same north-east row. x 496..536, z 1640..1686 | Small fuel shop leaves the runway. |
| 13 | Arcade, 18 m | East of the runway | Play, on the way to the dome. x 164..220, z 422..486 | Arcades share a district. |
| 20 | Arcade, 17 m | Further east | Play, one avenue north. x 164..216, z 822..886 | Far enough from the first arcade that one shot doesn't pay for both. |
| 21 | Soccer shop, 16 m | By the dome | Play, on the dome road. x 464..520, z 314..402 | The shop faces the road to the field. The dome itself does not move. |
| 22 | Soccer shop, 16 m | East, mid-map | Just north of the other shop. x 464..520, z 410..478 | The pair reads as the stadium block. |
| 5 | Sky tower, 239 m ★ | Downtown | Stays. x 465..535, z 1165..1235 | Downtown is this one tower. That is the shot that has to stay cheap, and the slot a future PC skyline can grow into. |
| 23 | Builder HQ, 15 m | North bank | Stays. x 164..208, z 1856..1888 | On the bank, clear of the river jumps. |
| 24 | Builder HQ, 16 m | North bank | Stays. x 364..408, z 1856..1886 | Same reason. |

Every purpose still has two buildings: home, paint, garage, dance, pets, arcade, NOS, sky drop (the roof and the tower), builder, soccer, pizza, showroom.

## Frame rate

This plan does not re-bench the game, and it does not touch the FPS agent's files. The numbers below are counts, plus the benches already published.

How the city draws today (`world/city-draw.js`): a building within **170 m** is drawn with doors, windows, parking, and neon. From there out to **950 m** it is a silhouette. There is no occlusion culling, so every building inside that radius is paid for. Keeping the 170 m count down is the layout's lever. The speed plan (PR 63) measured the city script at about **3 ms** once the car copy was turned off. The copy itself was about **59 ms** of a **66 ms** phone frame in that lab. The phone target in that plan is a steady **110** (the copy has to fit in **8.3 ms**). The iPad talk in that plan is a flat **30**. PR 51's phone baseline of today's city, before this layout, was about **8 fps** driving and about **2.6 fps** on foot past the dance hall, where the close-up lines turn on.

So this layout will not take the phone from 8 fps to 110. The copy is the frame. What the layout can do is stop the close-up pass from stacking shops in the shots Ellie actually plays: the runway, the jump roof, the tower, the mural.

Count of the 24 buildings within 170 m. Full grid is in `docs/city-layout/near-counts.txt`.

| Camera | Today | Option A | Option B |
|---|---:|---:|---:|
| Runway at spawn | 0 | 0 | 0 |
| South home street | 1 | 3 | 3 |
| South dance mural | 1 | 1 | 1 |
| Sky Drop roof | 1 | 1 | 2 |
| North home street | 3 | 3 | 3 |
| North dance mural | 0 | 2 | 2 |
| West car shops | 2 | 4 | 4 |
| Open west highway | 1 | 1 | 1 |
| North-east car shops | 0 | 2 | 2 |
| Play street | 2 | 3 | 4 |
| Tower face | 4 | 1 | 1 |
| Stadium gate | 2 | 2 | 2 |
| Builder pads | 2 | 2 | 2 |
| Busiest road crossing | 5 | 4 | 4 |
| Busiest spot on a 20 m grid | 5 | 5 | 5 |

Today's busy spot is a mix at the east edge of spawn: two garages, a home, a showroom, and a soccer shop. Option A's busy spot is the block between the west jump roof and the north home street (the street itself, at the doors, sees 3). Option B's busy spot is the east riverbank, where the north car shops face the builder island (the road just south of the river sees 4). Neither option is worse than today's worst spot. The tower shot goes from 4 detailed buildings to 1. That is the estimate: a cheaper tower, mural, and runway, not a new frame rate. The 110 fps phone target and the iPad target stay with the FPS work.

Option A is the lighter of the two. The jump roof stays at 1 near building, and the play street stays at 3. Option B puts the roof next to an arcade (2) and lifts the play street to 4, which is still inside today's worst.

## What is removed

Nothing. Same 24 buildings, same 82 ramps, same half-pipe, same loop, same roads, same river, same tunnel, same dome, same track, same park, same builder sandbox. Two plazas slide so they are not buried under an arcade and a cafe. Their ramps go with them, at the same angles.

## Ideas for Bob

Suggestions only. They are not in Option A or Option B. The airport anchor and the other fixed constraints still apply. No theme change gets built unless Bob asks for it by name.

Ellie is 10 and ahead of that on games, and the game is a web canvas on a phone and an iPad. The same map should still work when this becomes a PC game. The layout above is already shaped for that: districts don't overlap, so a later game can fill one district without repainting the others, and the runway corridor is reserved so a terminal can be added later without moving the ramps.

1. **Keep the neon airport-city.** The runway in the middle is the idea of the game. A new theme (space, fantasy, a realistic downtown) would throw away the airport, the mural, and the cars. The version that scales is a richer version of this city, not a different genre.
2. **Name the places in her words**, on signs, whenever the building look is allowed to change. Home Street, the Park, Car Shops, the Dome, the Tower, the Island. She can give directions. A PC game keeps the names and fills the blocks in. That is a sign pass, not a new map.
3. **Leave the runway empty on purpose.** A later PC build, or a later iPad build if the frame ever has room, can add a terminal and gates in the corridor. One more big building there would sit in every flying shot. Not now.
4. **Downtown stays one tower until a PC build.** That district is the slot for a skyline. Adding offices next to the tower on the phone would spend the shot this plan just made cheap.
5. **A school on Home Street, a fire station, or a train on the roads that already exist** would make the city feel lived-in. Each new building is another close-up. They wait until the phone holds its frame. The roads can already carry a bus or a train with no new pavement.
6. **Next round is a slide, not a redraw.** The two options differ by one building so a note like "the car shops feel far from home" can move one row. The black boxes stay until the building-look work is cleared.
7. **A second tunnel, only as a comparison, and not on this map.** The west highway tunnel stays the one she already flies. If you want another to set beside it, put a separate short one on the empty east avenue at x = 350, from z 940 to 1060, between Play and the tower. Same 30 m bore and same 10 m ceiling, so the flying physics match, but 120 m long instead of 200 m. It does not touch the existing hill, the guide lines, or either mouth. It is not in Option A or Option B.

## Architecture Check packet

For the Architecture Check agent, bc-c7ace59c. This PR is a plan. It does not change `world/`. It is not a pass. Please reply on the PR with pass or fail per row.

| Check | This plan |
|---|---|
| 24 shops, two of each purpose | Yes. Count checked. |
| Footprints and heights unchanged, including pads at 26, 62, 18, 34, and 239 m | Yes. Checked against today's `shop()` calls. |
| Dance mural | Seeds 12 and 18 keep a 64 m east face, 18 m and 20 m tall. The wall is not shorter than today's 64 m face. Antenna heights (14 m and 16 m) stay at build. The sign stays Z Company Arts. |
| Black placeholder boxes | Unchanged. No new meshes. |
| Airport | Runway, taxiway, half-pipe, loop, and shoulder ramps unchanged. Both options are drawn around them. |
| Tunnel | No change. Hill, bore, 10 m ceiling, and cyan guide lines stay. Both 60 m mouths are clear of new buildings. A second tunnel is an idea only, on the east avenue, and is not in either option. |
| River and bridges | Unchanged. All 10 river jumps stay, including the three 9.1° kickers that land in the water. Far-bank strips for the big launches are clear. |
| Builder HQs | Seeds 23 and 24 stay on today's pads. Moving them overlaps the north-bank jumps. Sandbox north of the river unchanged. |
| Roads, traffic, Hot Drop, tows | Centerlines unchanged. Traffic stays 30. No building covers a tow point. |
| Spawn | (0, 0). |
| Ramps | 82 pieces on main, plus the half-pipe and the loop. A and B keep 82, at the same height, length, and rotation. No new ramps. Run-ups and landings are clear of relocated buildings, including every river-edge launch. Please verify the count and the landings. |
| Plazas | Two rectangles overlap new buildings. Not done here. At build time the arcade lot slides to x 160..240, z 520..700, and the pizza lot slides to x −540..−472, z −90..90. A one-block slide still leaves a big-launch run-up inside a shop. Ramps go with the lots. The other three plazas stay. |
| Building size | Footprints and heights unchanged. Interior room size is not this plan. |
| FPS files | Not touched. |
| Adult `index.html` | Not touched. |

## Driving it on the /test/ copy

Not built. Bob picks an option first. When he does, the playable version is the whole Neon World that already lives under `/test/`, with these black boxes moved onto the new map. It is not a bare map, and it is not the live site.

`/test/world.html` and `/test/world-split.html` already run the full game. They load traffic, walking, doors, the app each building opens, the airport and its ramps, the river jump, the tunnel, soccer, Hot Drop, the minimap, the pet and Z, Garage and Home, saves, menus, and the controls. Both pages read `test/world/city.js`. The live pages stay on today's map.

### What the build changes

One file: `test/world/city.js`. The 24 shop positions, the street faces, the district names, and two plaza rectangles. Same black boxes, same heights, same footprints, same signs and colors. No new art. Traffic, the house code, objectives, soccer, the minimap, and the menus stay as they are. Then bump the `?v=` on that script in both test pages so a refresh loads it.

### What keeps working without rewiring

These look up a building by its purpose, or they draw whatever boxes the city built. They do not remember today's coordinates. This is true for both options.

- **Minimap.** It draws the buildings from the city list when the page loads. The runway plane icon stays at (0, 730). The soccer ball stays on the dome. The builder-zone box stays. Hot Drop is a live star, not a baked shop. Labels follow the purpose (HOME, GARAGE, and the rest), not the old district names.
- **Doors and the apps they open.** Doors are generated from the street face. Walking up still opens the same thing it opens now: Home and Ellie's saved house, Garage Z, the pet and crew page, the dance stage, neon paint, the cafe, the arcade, NOS, and the builder blueprints. A soccer shop still sends her to the dome, and the dome does not move. A sky-drop door is not an indoor room. It sends her to that building's own roof, then launches her, using the box she is standing at. There is no second coordinate to update.
- **Saves, menus, and controls.** The house save, the car paint, and the start-mode choice are not map coordinates. Two homes still share one house save, same as today. Both garages still open Garage Z. Menus and controls do not change.
- **Traffic.** The roads are the same lines, including the tunnel stretch cars do not spawn in. A car skips a stretch only if a wall sits in the lane. None of these shops cover a lane. The 30 cars stay 30 cars.
- **Hot Drop and objectives.** After a Sky Drop landing, Hot Drop picks a road point 200–340 m ahead. The road points do not move. There is no objective pinned to an old shop coordinate.
- **Spawn.** She still starts at (0, 0) on the empty runway. Sky Drop still starts in the air at (180, 520), altitude 460. That point is not inside a building in either option.
- **Airport, river jump, tunnel, soccer field, pet, and Z.** Not moved. The pet greeting happens inside the house. Z is the car.

### What has to be done or it breaks (both options)

- **Two plazas have to slide, or their ramps spawn inside shops.** The ramps are built inside the plaza rectangle. The new arcade covers the lot at x 160..240, z 310..490. The new south pizza shop covers the lot at x −540..−472, z 310..490. Leave them and those ramps are inside the buildings, and the doors are a mess. Slide the arcade lot to x 160..240, z 520..700. Slide the pizza lot to x −540..−472, z −90..90. One block is not enough: the big launch on each lot still needs 40 m of clear ground, and that run-up would end inside the shop. The other three plazas stay. Same slide for A and B. Do not change a ramp's height, length, or rotation while doing it.
- **Keep the street faces in the table.** A wall that is not on a street gets a fallback door on the south side, which can open into an alley. The faces in this plan were checked against the curb rule, so the generated doors land on the street.

### Option A only

Nothing else. The jump roof stays on today's west pad, so the Sky Drop start is the same glide she has now. The tow truck at (254, 600) stays in the open play street, clear of that roof. The tow at (−546, 400) stays clear of the pizza shop. No spawn, minimap, traffic, or door code to edit.

### Option B only

- The jump roof is the only extra move: x 264..328, z 518..682, still 62 m, still a roof pad. The elevator follows that box. The walk code does not have a separate coordinate for it.
- She still appears at (180, 520) in the air, just west of that roof, heading mostly north. She does not spawn inside it. She is not pointed at it. The mode still runs. If the glide should face the roof, that is one number, the yaw in `resetSkyDrop` inside `test/world/state.js`, and only on the test copy. The rest of the game does not need it.
- The tow truck at (254, 600) sits about 8 m west of the new roof. It is not inside the building. On the drive, check that the jump does not kiss the wall. If it feels tight, nudge that one truck a few meters west, still in the road. The other five trucks stay.

### What to drive before calling it playable

On `/test/world.html`, with the black boxes: start on the runway, fly the tunnel both ways, take the small river jump, and open one of each building (home, garage, pets, dance, paint, soccer, and a sky-drop roof). Check the minimap labels moved with the shops. Trigger a Sky Drop and a Hot Drop. Watch traffic on a home street and on the north car row. Option B adds the tow-next-to-the-roof check. That pass is the whole game, not a map screenshot.

## If the plan is approved

The first build is the section above: `test/world/city.js` only, inside the existing `/test/` game, plus the two plaza slides. Not the live `world.html`. No draw-code changes, no traffic changes, no new art. Then the drive pass, on the commit that was actually tested.

Pictures and the count log: `docs/city-layout/`. The picture generator is `docs/city-layout/layout-maps.mjs`. It is not part of the game.
