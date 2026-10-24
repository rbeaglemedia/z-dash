# House row and cafe row

The try link puts four houses and four cafes on the yard lane. A normal walk does not add the extra doors. The script is `world/interior-try-map.js`, and it runs only when `world.html?interiorTry=1` is set.

## Where they sit

City Layout's boulevard map has one house. It is on the west sidewalk of the yard lane in Homestead, south of spawn. That lane is the house street. It is not Builder Bay. Builder Bay is the southeast street at x = 840, and it has no house to stand across from.

The yard lane center is x = −220, width 12 m. The pavement is x −226 to −214. The west curb is x = −226, so the house face is x = −230. The east curb is x = −214, so the cafe face is x = −210. House doors face east. Cafe doors face west.

The live house stays at its footprint and the try link labels it HOME 1. The pet lounge and the garage stay put, so homes 2, 3, and 4 stand north of the pet lounge on the same sidewalk. The cafes stand on the opposite sidewalk, each one sharing its house's frontage. Cafe depth stops at x = −170. The architecture check treats the Car Row connector at x = −160 as a street for the whole map, and a deeper cafe would cover that band.

The try link also stretches the Homestead district north to z = −370, so the new centers sit inside the district. That stretch is only on the try link. The cross streets the checker draws at z = −128 and z = −80 stay north of the row.

Homes 2 to 4 and every cafe are marked try-only. They are not part of the live solid count. Each of those roofs carries an antenna. Their height is 7.5 m.

| Door | Style | x0 | x1 | z0 | z1 | Sign |
| --- | --- | --- | --- | --- | --- | --- |
| Home 1 | 1 Glass loft | −274 | −230 | −678 | −630 | HOME 1 |
| Cafe 1 | 1 Beach shack | −210 | −170 | −678 | −630 | CAFE 1 |
| Home 2 | 2 Timber cabin | −274 | −230 | −548 | −515 | HOME 2 |
| Cafe 2 | 2 Wood bakery | −210 | −170 | −548 | −515 | CAFE 2 |
| Home 3 | 3 Sky penthouse | −274 | −230 | −507 | −474 | HOME 3 |
| Cafe 3 | 3 Pop diner | −210 | −170 | −507 | −474 | CAFE 3 |
| Home 4 | 4 Block home | −274 | −230 | −466 | −433 | HOME 4 |
| Cafe 4 | 4 Night counter | −210 | −170 | −466 | −433 | CAFE 4 |

Arcade, pet lounge, soccer shop, and Builder HQ keep the 1 2 3 4 buttons. A house room and a cafe room do not.

Nothing here deploys.
