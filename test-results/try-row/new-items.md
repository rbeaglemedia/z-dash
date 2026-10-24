# New doors

Architecture Check on `ccf65f46b95d`. The whole city report is still **FAIL**. The new doors **PASS**.

## Count

| | |
| --- | --- |
| Live solids | 31 |
| Try-only solids | 7 (homes 2 to 4, and cafes 1 to 4) |
| Approved | 24 |

The try-only doors are not in the live count. Approved stays 24. The 31 against 24 is the city that was already on this branch.

## Road-block list

| Sign | Id | Budget | Road |
| --- | --- | --- | --- |
| HOME 1 | 0 | live | clear |
| HOME 2 | 46 | try-only | clear |
| HOME 3 | 47 | try-only | clear |
| HOME 4 | 48 | try-only | clear |
| CAFE 1 | 49 | try-only | clear |
| CAFE 2 | 50 | try-only | clear |
| CAFE 3 | 51 | try-only | clear |
| CAFE 4 | 52 | try-only | clear |

Doors pass. The new solids are not in the garage, window, roof, sign, scale, or purpose findings.

## Old city findings

These were already on the city. None of them name homes 2 to 4 or cafes 1 to 4.

- Live count 31 against approved 24.
- SKY_DROP 3 blocks a street.
- Garage mouths are narrower than the 370Z. HOME 1 is in that list. Homes 2 to 4 are not.
- Two window systems share the wall, on the older solids.
- Blank roofs, including HOME 1 and the Stage cafe. The try-only roofs have an antenna.
- SKY_DROP 3 sign is under 10 px.
- Four snack stands are 5 m, use #ff9a2e, and are missing from the purpose list.
- Purpose words fail on the garage, showroom, NOS, Builder HQ, and the soccer shop.
- 39 ramps against the floor of 70.
- shadowBlur is set in world/neon-paint.js.

Full log: `test-results/try-row/report.md`.
