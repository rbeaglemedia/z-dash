# Cafe row

The try link puts four cafes on the map. A normal walk does not. The script is `world/interior-try-map.js`, and it runs only when `world.html?interiorTry=1` is set.

## Where they sit

City Layout's boulevard map has one house. It is on the west sidewalk of the yard lane in Homestead, south of spawn. That lane is the house street. It is not Builder Bay. Builder Bay is the southeast street at x = 840, and it has no house to stand across from.

The yard lane center is x = −220, width 12 m. The pavement is x −226 to −214. The east curb is x = −214. The shop rule in `world/city-layout.js` puts the road face 4 m outside the curb, so the cafe face is x = −210. The doors face west, toward the lane.

The house and the Stage cafe are 44 m deep. These four stop at x = −170, 40 m deep. The architecture check treats the Car Row connector at x = −160 as a street for the whole map, and a 44 m depth would cover that band. The real pavement of the yard lane stays clear.

Frontage is 33 m, with an 8 m gap, so every center stays inside Homestead (z −900 to −560) and on the lane (the lane ends at z = −716). Cafe 2 is the door across from the house.

| Door | Style | x0 | x1 | z0 | z1 | Sign |
| --- | --- | --- | --- | --- | --- | --- |
| Cafe 1 | 1 Beach shack | −210 | −170 | −716 | −683 | CAFE 1 |
| Cafe 2 | 2 Wood bakery | −210 | −170 | −675 | −642 | CAFE 2 |
| Cafe 3 | 3 Pop diner | −210 | −170 | −634 | −601 | CAFE 3 |
| Cafe 4 | 4 Night counter | −210 | −170 | −593 | −560 | CAFE 4 |

Arcade, pet lounge, soccer shop, and Builder HQ keep the 1 2 3 4 buttons. The cafe room does not.

Nothing here deploys.
