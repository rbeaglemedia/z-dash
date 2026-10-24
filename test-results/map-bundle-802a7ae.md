# Option 1 Boulevards integration check

Commit `802a7aed6358984e88a9ed8a11306dff6b3d8c9b` (PR #85, `cursor/city-boulevards-ef23`). Map stamp `1dxhsa7`. Rollback `e279c9a79a885abd11a500b018938f835f48e34c` (`4b41cdc^`, current `main`).

Result: **PASS**

| Check | Result | Detail |
| --- | --- | --- |
| Both pages | pass | `world.html` and `world-split.html` have the same 71 script tags. Both load `city-layout.js`, `city.js`, `hud.js`, `traffic.js`, `nos-station.js`, and `resume-safe.js` at `?v=32`, with the layout before `city.js`. |
| Minimap | pass | PR #37 split-map frame (`drawMini`, walker, dome, Hot Drop) now bakes `CITY.LAYOUT.minimap`. 57 roads match the driven centerlines with 0 mismatches. 8 districts: Homestead, Car Row, The Stage, Builder Bay, The Track, The Field, Riverbank, Jump Roof. 5 NOS stations are on the bake: Car Row depot (540, 2320), Stage (-900, -80), Builder Bay (1180, 200), Track (-1480, 800), Field (1180, 1340). Each sits on a fitted station. |
| Traffic | pass | Today's `world/traffic.js` still builds lanes from `CITY.ROADS`. The only edit is a slot tag. 632 lanes. 30 cars roll, none on the runway. At the bridge (0, 1810): 12 bridge, 6 highway, 12 street. At Car Row (0, 2260): 26 street. At the highway (-450, 1000): 12 highway. At the Track NOS (-1480, 800): 18 street. |
| Cache | pass | `ZD_WORLD` 30 → 32. `ZD_BUILD_STAMP` `1792806176` → `1792827711`. `sw.js` cache names follow `ZD_WORLD`, so the caches are `zdash-f5f4db3cffe9-world32` and `world-split-v32`. |
| Rollback | pass | The bundle's first commit, `4b41cdc`, sits on `e279c9a`. That commit does not load `city-layout.js`, and its cache is world 30. |
| Ellie's saves | pass | Kept `zdash.kid.v1`, `zdash.house.v1`, `zdash.char.v1`, `zdash.pet.v1`, `zdash.crew.v1`, `zdash.neonpaint.v1`, `zdash_vinyls_v1`, `zdash_neon_paint_v1`, `zdash.customdance.v1`, `zdash.petdance.v1`. None dropped. Added key is the per-visit `zdash.world.resume.v1`. |

`tools/city-layout-check.js` on this commit also passed: stamp `1dxhsa7`, 5 fitted NOS, 548 lane samples, 0 on the runway.

Still open, and not a fail of the six checks above: the hidden `/test` preview does not load the new scripts; adult `index.html` only updates the `ZD_BUILD` stamp to world32; `spanFar` is still 3400 m; weather bands are stored and nothing draws them.

Not deployed.
