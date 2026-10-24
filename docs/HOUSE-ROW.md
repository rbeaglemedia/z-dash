# House row

The boulevard map on main has one player house. It is not a row, and it is not in the southeast.

## Where it is

Homestead, southwest of spawn. +x is east and +z is north. Spawn is (0, 0).

| | metres |
| --- | --- |
| Name | HOME |
| District | Homestead, x −360 to −100, z −900 to −560 |
| Footprint | x −274 to −230, z −678 to −630, 11 m tall |
| Street | Yard lane at x = −220. The door faces that lane. |

The pet lounge sits on the same sidewalk just north of the house. The main garage sits just south and west. Those two are not houses.

The southeast is Builder Bay. Along the street at x = 840, south of spawn, the doors are the arcade, a snack stand, and a bay. None of them is a home.

## Ask for City Layout

This branch does not move a building and does not add one. City Layout (`bc-3ff1a27b`) can add three homes so the street has four doors. Leave the current house, the pet lounge, and the garage where they are.

One place that fits, on the east sidewalk of the same yard lane, facing the lane:

| Door | x0 | x1 | z0 | z1 | h |
| --- | --- | --- | --- | --- | --- |
| House 2 | −210 | −192 | −860 | −842 | 11 |
| House 3 | −210 | −192 | −834 | −816 | 11 |
| House 4 | −210 | −192 | −808 | −790 | 11 |

The west face is 4 m outside the east curb. The footprints sit inside Homestead and clear of the house, the pets, and the garage. If Bob wants that row in the southeast instead, City Layout should use open sidewalk there and leave the arcade, the snack stand, and the bay where they are.

## What this branch does

Each HOME door, south to north, gets a look: style 1, 2, 3, 4, then repeat. The one door that exists today is style 1. The look file loads when she walks in. The city frame does not draw the room.

| Style | Name | Line |
| --- | --- | --- |
| 1 | Glass loft | A bright glass house with a cyan light and a soft sofa. |
| 2 | Timber cabin | A warm wood cabin with a big window and a stone hearth. |
| 3 | Sky penthouse | A tall glass room with a gold edge and a low lounge. |
| 4 | Block home | Chunky wood blocks, a glass window, and a cube seat. |

Every look keeps glass. Straight boxes, flat color. Ellie is 1.7 m (legs 0.82 m, torso `#2f7f96`). The pet stands on the same floor, ears at 0.74 m.

Open a look in the real painter with `world.html?rowShot=inside&homeStyle=2&notraffic=1`. The street shot is `world.html?rowShot=street&notraffic=1`. That shot parks the 370Z on the yard lane, nose toward the east door, camera just east of the car.

Paint time on this machine, boxes only: style 1 is 0.21 ms, style 2 is 0.29 ms, style 3 is 0.23 ms, style 4 is 0.32 ms. All of those sit under the 9.1 ms Galaxy frame, so the picture says about 110 fps. This host is not a phone.

Nothing here deploys. Live rooms for houses 2, 3, and 4 wait until those doors exist and Bob says go.

## Cafe street

On the try link the one house is labeled HOME 1, and homes 2, 3, and 4 stand north of the pet lounge on the same sidewalk. Four cafes stand across the lane, one style each. See `docs/CAFE-ROW.md`.

## Ellie test

The try page is `test/interior-try.html`. It opens `world.html?interiorTry=1&notraffic=1`. That query is the only way the try script loads. A normal walk does not show the buttons. This is a test link, and it does not go live from here.

Houses stay one style each. The try link labels four house doors HOME 1 to HOME 4, and four cafe doors CAFE 1 to CAFE 4 across the lane. A house room and a cafe room have FAVORITE and no 1 2 3 4 row. Arcade, pet lounge, soccer shop, and Builder HQ have buttons 1 2 3 4 plus FAVORITE. The style number is painted on the picture. Picks stay in this tab under `zdash.interior.try.v1`. Neon Paint, the garage, and the dance studio stay the apps they already are.

Paint time for those try rooms on this machine is 0.07 ms to 0.21 ms. That is under the 9.1 ms Galaxy frame, so the picture says about 110 fps. This host is not a phone.
