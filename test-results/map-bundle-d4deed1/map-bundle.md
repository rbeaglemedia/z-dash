# Combined map bundle

Head `d4deed17ebf486969833138d8ed84c420746554d` against rollback `e279c9a79a885abd11a500b018938f835f48e34c`.

Result: **PASS**

| Check | Result | Detail |
| --- | --- | --- |
| roads | pass | minimap roads 57 (street 44, highway 2, bridge 1) from CITY.LAYOUT on both pages |
| river | pass | river z 1780–1840 baked from the layout |
| bridges | pass | bridge decks 2 |
| districts | pass | districts HOMESTEAD, CAR_ROW, STAGE, BUILDER_BAY, TRACK, FIELD, RIVERBANK, DECK |
| nos | pass | 5 NOS on the minimap: nos@CAR_ROW, kitnos@STAGE, kitnos@BUILDER_BAY, kitnos@TRACK, kitnos@FIELD; fitted 5 |
| hot-drop | pass | 0,200 → 260,200 street; -990,0 → -771,0 street; 0,2000 → 12,2260 street |
| traffic | pass | lanes 632, runway 0, highway true, bridge true, stage true, car row true, highway 136, tunnel 8, bridge 24, street 392, track 72 |
| ellie-saves | pass | kept zdash.kid.v1, zdash.house.v1, zdash.char.v1, zdash.pet.v1, zdash.crew.v1, zdash.neonpaint.v1, zdash_vinyls_v1, zdash_neon_paint_v1, zdash.customdance.v1, zdash.petdance.v1 |
| both-pages | pass | script lists match; ?v= 32; NOS districts BUILDER_BAY, CAR_ROW, FIELD, STAGE, TRACK |
