# Planner export for Z-DASH

Builder UI and logic, and the full object catalog. Each object includes its parts, dimensions, and materials. Preset layouts show how objects combine into sets.

No venue list and no venue names are in this zip. No `LICENSE` file was in the planner repository. License records are in `LICENSES.xlsx`. `three` is MIT and is not bundled.

Read `MODES.md` first, then `TOOLS.md` for the editor tools, then `objects/README.md`. Technology tags are in `TECH.json` and `src/tech-tags.js`.

## Files

### `LICENSES.xlsx`
- **Does:** License ledger.
- **Imports:** none
- **License source:** This file is the license source for the rows cited on the other files.

### `MODES.md`
- **Does:** How to port Builder mode and Place objects mode, where the editor-tool map lives, and where the object catalog study lives.
- **Imports:** none
- **License source:** Written for this export. Not a planner source file.

### `TECH.json`
- **Does:** Same tag index as src/tech-tags.js, in JSON.
- **Imports:** none
- **License source:** Written for this export so technology items are tagged for house placement. Not a planner source file.

### `TOOLS.md`
- **Does:** Short map of every editor tool: UI control, logic file, and what the planner does not implement.
- **Imports:** none
- **License source:** Written for this export so the Z-DASH DEV Builder can reuse the editor tools. Not a planner source file.

### `index.html`
- **Does:** App shell. Builder and Place objects are the two mode buttons. Run event and quote are removed from this copy.
- **Imports:** none
- **License source:** Our own — UI icons (v3.8, inline SVG in index.html) (source: n/a)

### `objects/README.md`
- **Does:** How to read each object and the sets objects form.
- **Imports:** none
- **License source:** Written for this export from the planner meshes and preset layouts. Not a planner source file.

### `objects/catalog.json`
- **Does:** Every catalog object: envelope size, placement, and each mesh part with shape, size, position, and flat color.
- **Imports:** none
- **License source:** Written for this export from the planner meshes and preset layouts. Not a planner source file.

### `objects/sets.json`
- **Does:** Booth, Classroom, Banquet, Theater, and Registration at Essentials, Standard, and Showcase, laid out in the 30 × 40 size chip.
- **Imports:** none
- **License source:** Written for this export from the planner meshes and preset layouts. Not a planner source file.

### `package.json`
- **Does:** npm scripts. three is the 3D library (MIT). Install it; it is not in the zip.
- **Imports:** none
- **License source:** OFL-1.1 — Outfit font (@fontsource/outfit) (source: https://fonts.google.com/specimen/Outfit) OFL-1.1 — Inter font (@fontsource/inter) (source: https://fonts.google.com/specimen/Inter)

### `public/brand/rentacomputer-icon-192.png`
- **Does:** Rentacomputer.com brand image used by the shell.
- **Imports:** none
- **License source:** Company asset (Rentacomputer.com, own brand) — see LICENSES.xlsx rows for the Rentacomputer.com logo and app icons.

### `public/brand/rentacomputer-icon-512.png`
- **Does:** Rentacomputer.com brand image used by the shell.
- **Imports:** none
- **License source:** Company asset (Rentacomputer.com, own brand) — see LICENSES.xlsx rows for the Rentacomputer.com logo and app icons.

### `public/brand/rentacomputer-icon-64.png`
- **Does:** Rentacomputer.com brand image used by the shell.
- **Imports:** none
- **License source:** Company asset (Rentacomputer.com, own brand) — see LICENSES.xlsx rows for the Rentacomputer.com logo and app icons.

### `public/brand/rentacomputer-logo.png`
- **Does:** Rentacomputer.com brand image used by the shell.
- **Imports:** none
- **License source:** Company asset (Rentacomputer.com, own brand) — see LICENSES.xlsx rows for the Rentacomputer.com logo and app icons.

### `src/app/clear.js`
- **Does:** Lane: Clear room. ---------- v3.23 Clear room (active floor only; one undo step; stops a running event first) ----------
- **Imports:** `./runtime.js`
- **License source:** Own work (Rentacomputer.com), code-built. No third-party model or photo is embedded. See LICENSES.xlsx.

### `src/app/input.js`
- **Does:** Pointer tools: box, walls, door, and dragging placed objects.
- **Imports:** `./runtime.js`, `three`, `../walls.js`, `../logic.js`, `../camera.js`, `../fun.js`
- **License source:** Own work (Rentacomputer.com), code-built. No third-party model or photo is embedded. See LICENSES.xlsx. Imports three.js (MIT; npm package three@0.169, not bundled).

### `src/app/levels.js`
- **Does:** Lane: floors.
- **Imports:** `./runtime.js`, `three`, `../grid.js`, `../logic.js`
- **License source:** Own work (Rentacomputer.com), code-built. No third-party model or photo is embedded. See LICENSES.xlsx. Imports three.js (MIT; npm package three@0.169, not bundled).

### `src/app/place.js`
- **Does:** Add-item sheet, select, rotate, copy, and delete.
- **Imports:** `./runtime.js`, `three`, `../catalog.js`, `../logic.js`, `../icons.js`, `../fun.js`
- **License source:** Own work (Rentacomputer.com), code-built. No third-party model or photo is embedded. See LICENSES.xlsx. Imports three.js (MIT; npm package three@0.169, not bundled).

### `src/app/presets.js`
- **Does:** Lane: event preset wiring. Layout math stays in src/fun.js and src/fill.js. ---------- v3.9 event presets: one tap fills the room (one undo step, asks before replacing items) ---------- v3.30 tech level: how much tech a preset adds. Essentials = furniture +...
- **Imports:** `./runtime.js`, `../brand.js`, `../grid.js`, `../walls.js`, `../logic.js`, `../fun.js`, `../autodoor.js`
- **License source:** Own work (Rentacomputer.com), code-built. No third-party model or photo is embedded. See LICENSES.xlsx.

### `src/app/render.js`
- **Does:** Lane: rebuild the room, item meshes, the camera and the draw loop.
- **Imports:** `./runtime.js`, `three`, `../walls.js`, `../catalog.js`, `../logic.js`, `../meshes.js`, `../camera.js`
- **License source:** Own work (Rentacomputer.com), code-built. No third-party model or photo is embedded. See LICENSES.xlsx. Imports three.js (MIT; npm package three@0.169, not bundled).

### `src/app/runtime.js`
- **Does:** Shared runtime. Each lane assigns its state and functions here during import.
- **Imports:** none
- **License source:** Own work (Rentacomputer.com), code-built. No third-party model or photo is embedded. See LICENSES.xlsx.

### `src/app/scene.js`
- **Does:** Lane: scene, camera, renderer, lights and effects.
- **Imports:** `./runtime.js`, `../brand.js`, `three`, `three/examples/jsm/utils/BufferGeometryUtils.js`, `../grid.js`, `../walls.js`
- **License source:** Own work (Rentacomputer.com), code-built. No third-party model or photo is embedded. See LICENSES.xlsx. Imports three.js (MIT; npm package three@0.169, not bundled).

### `src/app/shell.js`
- **Does:** Screens, mode switch, size chips, and clear. Builder and Place objects are the two mode buttons.
- **Imports:** `./runtime.js`, `three`, `../walls.js`, `../logic.js`, `../fun.js`, `../autodoor.js`
- **License source:** Own work (Rentacomputer.com), code-built. No third-party model or photo is embedded. See LICENSES.xlsx. Imports three.js (MIT; npm package three@0.169, not bundled).

### `src/app/state.js`
- **Does:** Lane: save / load / undo, plus the shared room state. ---------- error capture (shown in the hidden debug overlay: triple-tap the version label) ----------
- **Imports:** `./runtime.js`, `../brand.js`, `../grid.js`, `../history.js`, `../fun.js`
- **License source:** Own work (Rentacomputer.com), code-built. No third-party model or photo is embedded. See LICENSES.xlsx.

### `src/app/view.js`
- **Does:** Lane: top view, pan, wall height, Same again, and the share picture. ---------- v3.8 view switches: top-down, one-finger Turn or Pan, walls Low / Full / Hidden ---------- ---------- v3.8 Same again (tap a placed item to copy it) and keep placing ----------
- **Imports:** `./runtime.js`, `../brand.js`, `../walls.js`, `../catalog.js`, `../logic.js`
- **License source:** Own work (Rentacomputer.com), code-built. No third-party model or photo is embedded. See LICENSES.xlsx.

### `src/autodoor.js`
- **Does:** Puts one door on a size preset that has none. Stands in for the simulation autoDoor, which is not in this bundle.
- **Imports:** `./walls.js`
- **License source:** Written for this export so Builder can start without the Run event simulation. Not a planner source file.

### `src/brand.js`
- **Does:** Rentacomputer.com colours, fonts, and copy.
- **Imports:** none
- **License source:** Company asset (Rentacomputer.com, own brand) — Rentacomputer.com brand colours and font stack (src/brand.js) (source: https://www.rentacomputer.com public CSS)

### `src/camera.js`
- **Does:** Pure camera + touch guards (no DOM) so the selftest can check them. v3.8: two-finger drag pans (the midpoint moves the view); pinch zooms and twist turns. Tilt is one-finger Turn only. Two-finger update: zoom only when both spreads are big enough (a pinch t...
- **Imports:** none
- **License source:** Own work (Rentacomputer.com), code-built. No third-party model or photo is embedded. See LICENSES.xlsx.

### `src/catalog.js`
- **Does:** Full object catalog assembled from src/products. No prices.
- **Imports:** `import.meta.glob(['./products/*.js', '!./products/*.test.js'])`, `./register.js`
- **License source:** Own work (Rentacomputer.com), code-built. No third-party model or photo is embedded. See LICENSES.xlsx.

### `src/fun.js`
- **Does:** v3.9 pure helpers: furniture that follows a pushed wall, and one-tap event layouts. No DOM, no three.js. Items that ride along when wall segment i of run pi is pushed: anything mounted on that wall, or whose footprint comes within 0.5 ft of the wall face, p...
- **Imports:** `import.meta.glob('./presets/*.js')`, `./walls.js`, `./logic.js`, `./register.js`
- **License source:** Own work (Rentacomputer.com), code-built. No third-party model or photo is embedded. See LICENSES.xlsx.

### `src/grid.js`
- **Does:** Save / load (v3.3: walls instead of tiles). Pure, no DOM.
- **Imports:** `./logic.js`, `./walls.js`
- **License source:** Own work (Rentacomputer.com), code-built. No third-party model or photo is embedded. See LICENSES.xlsx.

### `src/history.js`
- **Does:** Bounded undo / redo of whole-layout snapshots (plain JSON strings: no GPU objects are ever kept in history). Call after every action; only real changes become steps. Returns true when a step was added.
- **Imports:** none
- **License source:** Own work (Rentacomputer.com), code-built. No third-party model or photo is embedded. See LICENSES.xlsx.

### `src/icons.js`
- **Does:** Inline SVG icons for categories and products.
- **Imports:** `./brand.js`
- **License source:** Our own — Product and category icons (v3.5, 24 SVGs in src/icons.js) (source: n/a (drawn for this app))

### `src/logic.js`
- **Does:** Pure placement + snapping logic (no DOM, no three.js) so the selftest can check it. 1 unit = 1 ft. Walls that belong to items: booth back and side walls (inner faces) and both faces of pipe and drape.
- **Imports:** `./catalog.js`, `./walls.js`, `./products/stage.js`, `./products/lineup.js`
- **License source:** Own work (Rentacomputer.com), code-built. No third-party model or photo is embedded. See LICENSES.xlsx.

### `src/main.js`
- **Does:** Starts both modes. Loads the builder and placement lanes, then opens on Builder. Supplies empty venue and fill drawers so rebuild can run. Does not load the object study files, Run event, or quote.
- **Imports:** `./brand.js`, `./style.css`, `./app/state.js`, `./app/view.js`, `./app/presets.js`, `./app/shell.js`, `./app/scene.js`, `./app/render.js`, `./app/place.js`, `./app/input.js`, `./app/levels.js`, `./app/clear.js`, `./app/runtime.js`
- **License source:** Written for this export so the two modes start without Run event or quote. Not a planner source file.

### `src/meshes.js`
- **Does:** Code-built 3D shapes. 1 unit = 1 ft.
- **Imports:** `./brand.js`, `three`, `three/examples/jsm/utils/BufferGeometryUtils.js`
- **License source:** Our own — 3D models (v3.5, code-built in src/meshes.js) (source: n/a (three.js primitives, MIT library)) Own work (Rentacomputer.com), code-built — Product/furniture detail geometry v3.27 (src/meshes.js: pleated skirts and drapes, chair frames, round rims, counter rails, TV stand spine/shelf, LED cabinet frame, laptop hinge, kiosk reader, power box handle/feeder) (source: —) Imports three.js (MIT; npm package three@0.169, not bundled).

### `src/presets/banquet.js`
- **Does:** Registers the Banquet event layout (Round tables with 8 chairs).
- **Imports:** `../register.js`
- **License source:** Own work (Rentacomputer.com), code-built. No third-party model or photo is embedded. See LICENSES.xlsx.

### `src/presets/booth.js`
- **Does:** Registers the Booth event layout (10 x 10 booths along the walls, a table in each).
- **Imports:** `../register.js`
- **License source:** Own work (Rentacomputer.com), code-built. No third-party model or photo is embedded. See LICENSES.xlsx.

### `src/presets/classroom.js`
- **Does:** Registers the Classroom event layout (Rows of tables facing a podium).
- **Imports:** `../register.js`
- **License source:** Own work (Rentacomputer.com), code-built. No third-party model or photo is embedded. See LICENSES.xlsx.

### `src/presets/registration.js`
- **Does:** Registers the Registration event layout (Check-in tables, laptops, signs and kiosks).
- **Imports:** `../register.js`
- **License source:** Own work (Rentacomputer.com), code-built. No third-party model or photo is embedded. See LICENSES.xlsx.

### `src/presets/theater.js`
- **Does:** Registers the Theater event layout (Rows of chairs facing a stage (36 in rows)).
- **Imports:** `../register.js`
- **License source:** Own work (Rentacomputer.com), code-built. No third-party model or photo is embedded. See LICENSES.xlsx.

### `src/products/avselftest.js`
- **Does:** Audio, camera, and hotspot checks. This file loads with the other product files. runAvTests() runs only from the selftest page (#sum). The app has no #sum, so the checks do not run at startup. Shared files were not edited. These lines already exist on maste...
- **Imports:** `./products/avselftest.js`, `three`, `../catalog.js`, `../meshes.js`, `../icons.js`, `../brand.js`, `../logic.js`, `../walls.js`, `../register.js`, `./micset.js`, `./uplight.js`, `./stagelight.js`
- **License source:** Own work (Rentacomputer.com), code-built. No third-party model or photo is embedded. See LICENSES.xlsx. Imports three.js (MIT; npm package three@0.169, not bundled).

### `src/products/backbar.js`
- **Does:** Backbar. The spreadsheet row is only the CORT Posh front bar. No backbar size is in the sheet. Placeholder from rental listings that cluster around 72 in wide and about 84 in tall: https://www.luxerentals.com/furniture/bar-backs-towers/bar-back/essex-bar-ba...
- **Imports:** `../register.js`, `./create.js`, `../brand.js`, `./geom.js`
- **License source:** Own work (Rentacomputer.com), code-built — LED furniture, pedestal, display cube, event bar, backbar, and vending meshes v3.36 (src/products/glowcube.js, glowbar.js, pedestal.js, displaycube.js, eventbar.js, backbar.js, vending.js) (source: —)

### `src/products/badgeprinter.js`
- **Does:** Badge printer. Sits on a table. UNCONFIRMED brand: missing-products.xlsx lists Zebra ZC300 or Epson ColorWorks C3500. Footprint uses the sheet's Zebra ZC300 single-sided size, which matches the Zebra spec (6.2 W × 15.1 D × 10.2 H in): https://www.zebra.com/...
- **Imports:** `../register.js`, `./create.js`, `../brand.js`, `./geom.js`
- **License source:** Own work (Rentacomputer.com), code-built — Badge printer, projector with screen, charging table meshes v3.33 (src/products/badgeprinter.js, projscreen.js, chargetable.js, geom.js) (source: —)

### `src/products/booth10.js`
- **Does:** Catalog object: 10 × 10 booth (back and side walls).
- **Imports:** `../register.js`, `./create.js`
- **License source:** Own work (Rentacomputer.com), code-built. No third-party model or photo is embedded. See LICENSES.xlsx.

### `src/products/booth20.js`
- **Does:** Catalog object: 10 × 20 booth (back and side walls).
- **Imports:** `../register.js`, `./create.js`
- **License source:** Own work (Rentacomputer.com), code-built. No third-party model or photo is embedded. See LICENSES.xlsx.

### `src/products/brandctr.js`
- **Does:** Catalog object: Branded counter.
- **Imports:** `../register.js`, `./create.js`
- **License source:** Own work (Rentacomputer.com), code-built. No third-party model or photo is embedded. See LICENSES.xlsx.

### `src/products/categories.js`
- **Does:** Catalog sections, in the order the Add sheet shows them.
- **Imports:** `../register.js`
- **License source:** Own work (Rentacomputer.com), code-built. No third-party model or photo is embedded. See LICENSES.xlsx.

### `src/products/chair.js`
- **Does:** Catalog object: Banquet chair.
- **Imports:** `../register.js`, `./create.js`
- **License source:** Own work (Rentacomputer.com), code-built. No third-party model or photo is embedded. See LICENSES.xlsx.

### `src/products/charger.js`
- **Does:** missing-products.xlsx — Charging locker. ChargeTech 8-bay UV charging locker CT-300119, 19 × 8 × 26 in. Retailer listings agree; the maker sheet was not opened. Medium confidence. Stand versus table is not confirmed. Placed on the floor against a wall.
- **Imports:** `../register.js`, `./create.js`, `./draw.js`
- **License source:** Own work (Rentacomputer.com), code-built — Code-built meshes for digital signage, 85 in TV, desktop computer, copier, charging locker v3.36 (src/products/digisign.js, tv85.js, desktop.js, copier.js, charger.js, draw.js) (source: —)

### `src/products/chargetable.js`
- **Does:** Phone charging table. UNCONFIRMED model. missing-products.xlsx gives the ChargeTech Hightop Power Table CT-300124, 23.6 × 23.6 × 43.3 in, which matches the maker sheet: https://chargetech.com/cdn/shop/files/Hightop_Power_Table_Spec_Sheet.pdf The same sheet...
- **Imports:** `../register.js`, `./create.js`, `../brand.js`, `./geom.js`
- **License source:** Own work (Rentacomputer.com), code-built — Badge printer, projector with screen, charging table meshes v3.33 (src/products/badgeprinter.js, projscreen.js, chargetable.js, geom.js) (source: —)

### `src/products/conf.js`
- **Does:** Catalog object: Conference table.
- **Imports:** `../register.js`, `./create.js`
- **License source:** Own work (Rentacomputer.com), code-built. No third-party model or photo is embedded. See LICENSES.xlsx.

### `src/products/copier.js`
- **Does:** missing-products.xlsx — Copier / multifunction printer. Canon imageRUNNER ADVANCE DX C5840i, 24.375 × 28.5 × 36.875 in (maker spec). Bob has not confirmed this model. Control-panel size is not published, so no video screen is named.
- **Imports:** `../register.js`, `./create.js`, `./draw.js`
- **License source:** Own work (Rentacomputer.com), code-built — Code-built meshes for digital signage, 85 in TV, desktop computer, copier, charging locker v3.36 (src/products/digisign.js, tv85.js, desktop.js, copier.js, charger.js, draw.js) (source: —)

### `src/products/create.js`
- **Does:** Same shape the catalog has always built. Inches in, feet out. No prices.
- **Imports:** none
- **License source:** Own work (Rentacomputer.com), code-built. No third-party model or photo is embedded. See LICENSES.xlsx.

### `src/products/desktop.js`
- **Does:** missing-products.xlsx — Desktop computer (tower + monitor). Tower: Dell OptiPlex Tower 7020, 6.06 × 11.5 × 12.77 in (manufacturer). Monitor: the existing catalog item (24 × 8 × 18 in), which is flagged — no confident source. The sheet does not publish a com...
- **Imports:** `../register.js`, `./create.js`, `./draw.js`
- **License source:** Own work (Rentacomputer.com), code-built — Code-built meshes for digital signage, 85 in TV, desktop computer, copier, charging locker v3.36 (src/products/digisign.js, tv85.js, desktop.js, copier.js, charger.js, draw.js) (source: —)

### `src/products/digisign.js`
- **Does:** missing-products.xlsx — Digital signage on a floor stand (TV on stand / agenda board). Samsung QM55C panel 48.7 × 1.1 × 27.9 in. Chief PFQUB cart base 36.1 W × 25.3 D. Column H is "UNCONFIRMED overall" (mount height depends on the cart setting).
- **Imports:** `../register.js`, `./create.js`, `./draw.js`
- **License source:** Own work (Rentacomputer.com), code-built — Code-built meshes for digital signage, 85 in TV, desktop computer, copier, charging locker v3.36 (src/products/digisign.js, tv85.js, desktop.js, copier.js, charger.js, draw.js) (source: —)

### `src/products/displaycube.js`
- **Does:** Display cube. The spreadsheet's only numbered size in this row is the 12 × 12 × 42 pedestal. A separate cube standard, flagged: Set Shop lists 24x24x24, and Pro Party Rental publishes 24 × 24 × 24. https://setshop.com/cubes-pedestals-rental/ https://propart...
- **Imports:** `../register.js`, `./create.js`, `../brand.js`, `./geom.js`
- **License source:** Own work (Rentacomputer.com), code-built — LED furniture, pedestal, display cube, event bar, backbar, and vending meshes v3.36 (src/products/glowcube.js, glowbar.js, pedestal.js, displaycube.js, eventbar.js, backbar.js, vending.js) (source: —)

### `src/products/drape.js`
- **Does:** Catalog object: Pipe and drape (10 ft section).
- **Imports:** `../register.js`, `./create.js`
- **License source:** Own work (Rentacomputer.com), code-built. No third-party model or photo is embedded. See LICENSES.xlsx.

### `src/products/draw.js`
- **Does:** Shared drawing helpers for code-built products. three.js primitives only (MIT). No third-party models, no photos, no textures. Own work. One material per screen so a later video texture does not paint every display at once.
- **Imports:** `three`, `../brand.js`
- **License source:** Own work (Rentacomputer.com), code-built — Code-built meshes for digital signage, 85 in TV, desktop computer, copier, charging locker v3.36 (src/products/digisign.js, tv85.js, desktop.js, copier.js, charger.js, draw.js) (source: —) Imports three.js (MIT; npm package three@0.169, not bundled).

### `src/products/eventbar.js`
- **Does:** Event bar. missing-products.xlsx candidate: CORT Posh 6 ft bar, 72 × 30 × 40.25 in. https://www.cortevents.com/posh-6-bar Bob has not confirmed that Rentacomputer.com rents bars. Generic shape. No maker marks. Code-drawn.
- **Imports:** `../register.js`, `./create.js`, `../brand.js`, `./geom.js`
- **License source:** Own work (Rentacomputer.com), code-built — LED furniture, pedestal, display cube, event bar, backbar, and vending meshes v3.36 (src/products/glowcube.js, glowbar.js, pedestal.js, displaycube.js, eventbar.js, backbar.js, vending.js) (source: —)

### `src/products/exec.js`
- **Does:** Catalog object: Executive chair.
- **Imports:** `../register.js`, `./create.js`
- **License source:** Own work (Rentacomputer.com), code-built. No third-party model or photo is embedded. See LICENSES.xlsx.

### `src/products/feeder.js`
- **Does:** Feeder cable section. missing-products.xlsx gives the cable ramp only (36 × 20 × 2.31 in). No sourced cable diameter or length. This section uses that ramp's 36 in length and 2.31 in height for both depth and height so a run lines up with the ramps. Not a s...
- **Imports:** `../register.js`, `./create.js`, `../brand.js`, `./geom.js`
- **License source:** Own work (Rentacomputer.com), code-built — Barricade, metal detector, tent, generator, feeder cable, cable ramp, radio, interpretation booth meshes v3.36 (src/products/qbar.js, wtmeter.js, tent.js, generator.js, feeder.js, ramp.js, radio.js, ibooth.js) (source: —)

### `src/products/furnish.test.js`
- **Does:** Product tests for LED furniture, pedestals, bars, and the vending placeholder. Runs only when the selftest calls runFurnishTests. Importing this file does not run it. Not shipped: catalog.js globs src/products/*.js and skips *.test.js. Hook lines for src/te...
- **Imports:** `./products/furnish.test.js`, `../catalog.js`, `../register.js`, `../meshes.js`, `../icons.js`, `../brand.js`, `three`, `./vending.js`
- **License source:** Own work (Rentacomputer.com), code-built. No third-party model or photo is embedded. See LICENSES.xlsx. Imports three.js (MIT; npm package three@0.169, not bundled).

### `src/products/gear.test.js`
- **Does:** Product tests for orders 70-77. Loaded by the selftest page only (see lineup.js). Not imported by the app, and not run at app startup.
- **Imports:** `../register.js`, `../catalog.js`, `../meshes.js`, `three`, `../icons.js`, `../brand.js`, `../logic.js`, `../walls.js`, `./lineup.js`, `./wtmeter.js`
- **License source:** Own work (Rentacomputer.com), code-built. No third-party model or photo is embedded. See LICENSES.xlsx. Imports three.js (MIT; npm package three@0.169, not bundled).

### `src/products/generator.js`
- **Does:** Generator. missing-products.xlsx: Honda EU7000is, handles folded, 33.4 × 27.6 × 28.4 in. Portable versus towable is UNCONFIRMED. Sits outside a closed room (mode wall, real depth).
- **Imports:** `../register.js`, `./create.js`, `../brand.js`, `./geom.js`
- **License source:** Own work (Rentacomputer.com), code-built — Barricade, metal detector, tent, generator, feeder cable, cable ramp, radio, interpretation booth meshes v3.36 (src/products/qbar.js, wtmeter.js, tent.js, generator.js, feeder.js, ramp.js, radio.js, ibooth.js) (source: —)

### `src/products/geom.js`
- **Does:** Shared primitives for code-drawn products. Materials are cached; geometries are per mesh.
- **Imports:** `three`
- **License source:** Own work (Rentacomputer.com), code-built — Badge printer, projector with screen, charging table meshes v3.33 (src/products/badgeprinter.js, projscreen.js, chargetable.js, geom.js) (source: —) Imports three.js (MIT; npm package three@0.169, not bundled).

### `src/products/glowbar.js`
- **Does:** LED glow bar. The spreadsheet sizes only the 16 in cube and asks whether bars are rented. Three rental pages publish 72 × 24 × 42 in. Others differ, so this stays flagged. https://moderneventrentalchi.com/product/6ft-led-bar/ (72 × 24 × 42) https://www.mode...
- **Imports:** `../register.js`, `./create.js`, `../brand.js`, `./geom.js`
- **License source:** Own work (Rentacomputer.com), code-built — LED furniture, pedestal, display cube, event bar, backbar, and vending meshes v3.36 (src/products/glowcube.js, glowbar.js, pedestal.js, displaycube.js, eventbar.js, backbar.js, vending.js) (source: —)

### `src/products/glowcube.js`
- **Does:** LED glow cube. missing-products.xlsx: 16 × 16 × 16 in, three rental listings. https://glowmi.com/products/led-illuminated-cube-chair https://rsvpparty.com/product/led-cube-16-x-16-cordless/ https://www.magicjumprentals.com/rentals/51_furniture/933_led-cube-16
- **Imports:** `../register.js`, `./create.js`, `../brand.js`, `./geom.js`
- **License source:** Own work (Rentacomputer.com), code-built — LED furniture, pedestal, display cube, event bar, backbar, and vending meshes v3.36 (src/products/glowcube.js, glowbar.js, pedestal.js, displaycube.js, eventbar.js, backbar.js, vending.js) (source: —)

### `src/products/gooseneck.js`
- **Does:** Podium mic. Code-drawn here. No third-party mesh. The missing-products.xlsx row names a podium gooseneck, but it does not list a gooseneck length. The only mic body on that row is the Shure SM58 handheld: 1.46 in diameter × 6.93 in long. https://content-fil...
- **Imports:** `../register.js`, `./create.js`, `../brand.js`, `./geom.js`
- **License source:** Own work (Rentacomputer.com), code-built — Audio and streaming meshes v3.36 (src/products/mixer.js, subwoofer.js, micset.js, gooseneck.js, streamkit.js, hotspot.js; uplight.js and stagelight.js held, not registered) (source: —)

### `src/products/hightop.js`
- **Does:** Catalog object: High-top cocktail table.
- **Imports:** `../register.js`, `./create.js`
- **License source:** Own work (Rentacomputer.com), code-built. No third-party model or photo is embedded. See LICENSES.xlsx.

### `src/products/hotspot.js`
- **Does:** Wi-Fi hotspot. Code-drawn here. No third-party mesh. Small; sits on a table. missing-products.xlsx "Wi-Fi hotspot / cellular router". Pepwave MAX BR1 Pro 5G candidate, 5.78 × 5.08 × 1.15 in. https://download.peplink.com/resources/pepwave_br1_pro_5g_datashee...
- **Imports:** `../register.js`, `./create.js`, `../brand.js`, `./geom.js`
- **License source:** Own work (Rentacomputer.com), code-built — Audio and streaming meshes v3.36 (src/products/mixer.js, subwoofer.js, micset.js, gooseneck.js, streamkit.js, hotspot.js; uplight.js and stagelight.js held, not registered) (source: —)

### `src/products/ibooth.js`
- **Does:** Interpretation booth. missing-products.xlsx: ISO 4043 mobile booth, 2 interpreters. Envelope is the INTERNAL minimum 63 × 63 × 79 in. Exterior size is UNCONFIRMED. Bob has not confirmed booths versus receivers only. Sits against a wall.
- **Imports:** `../register.js`, `./create.js`, `../brand.js`, `./geom.js`
- **License source:** Own work (Rentacomputer.com), code-built — Barricade, metal detector, tent, generator, feeder cable, cable ramp, radio, interpretation booth meshes v3.36 (src/products/qbar.js, wtmeter.js, tent.js, generator.js, feeder.js, ramp.js, radio.js, ibooth.js) (source: —)

### `src/products/ipad.js`
- **Does:** Catalog object: iPad on a stand.
- **Imports:** `../register.js`, `./create.js`
- **License source:** Own work (Rentacomputer.com), code-built. No third-party model or photo is embedded. See LICENSES.xlsx.

### `src/products/kiosk.js`
- **Does:** iPad / tablet kiosk. Published envelope stays 18 x 18 x 48 in (flagged, unconfirmed). The 3D shape is the floor pedestal below. Shape stays "kiosk" so Run Event still binds the glass: src/sim/screens.js lists "kiosk" and paints any panel-coloured mesh.
- **Imports:** `../register.js`, `./create.js`, `../brand.js`, `three`, `./screenface.js`
- **License source:** Own work (Rentacomputer.com), code-built (three.js primitives) — iPad / tablet floor pedestal kiosk v3.39 (src/products/kiosk.js) (source: —) Imports three.js (MIT; npm package three@0.169, not bundled).

### `src/products/lane40check.js`
- **Does:** Lane 40 checks. The catalog glob loads this file with the products, including at app startup. Nothing here runs a check unless this document is selftest.html. The app and the ?selftest iframe do not.
- **Imports:** `../catalog.js`, `../register.js`, `../meshes.js`, `../logic.js`, `../walls.js`, `three`, `./draw.js`, `../brand.js`
- **License source:** Own work (Rentacomputer.com), code-built. No third-party model or photo is embedded. See LICENSES.xlsx. Imports three.js (MIT; npm package three@0.169, not bundled).

### `src/products/laptop.js`
- **Does:** Catalog object: Laptop.
- **Imports:** `../register.js`, `./create.js`
- **License source:** Own work (Rentacomputer.com), code-built. No third-party model or photo is embedded. See LICENSES.xlsx.

### `src/products/led.js`
- **Does:** Catalog object: LED video wall (6 × 4 panels).
- **Imports:** `../register.js`, `./create.js`
- **License source:** Own work (Rentacomputer.com), code-built. No third-party model or photo is embedded. See LICENSES.xlsx.

### `src/products/ledposter.js`
- **Does:** Catalog object: LED poster display.
- **Imports:** `../register.js`, `./create.js`
- **License source:** Own work (Rentacomputer.com), code-built. No third-party model or photo is embedded. See LICENSES.xlsx.

### `src/products/ledtrailer.js`
- **Does:** Catalog object: LED screen trailer.
- **Imports:** `../register.js`, `./create.js`
- **License source:** Own work (Rentacomputer.com), code-built. No third-party model or photo is embedded. See LICENSES.xlsx.

### `src/products/lineup.js`
- **Does:** End-to-end lines (queue barricades, feeder cables, cable ramps) and outside-the-room placement (generator). Product files set place: 'end' or place: 'outside'. logic.js has no product snap hook, and this lane cannot edit it. mount() below wraps the live dra...
- **Imports:** `./products/lineup.js`, `./products/gear.test.js`, `../logic.js`, `../walls.js`
- **License source:** Own work (Rentacomputer.com), code-built. No third-party model or photo is embedded. See LICENSES.xlsx.

### `src/products/lounge.js`
- **Does:** Catalog object: Lounge chair.
- **Imports:** `../register.js`, `./create.js`
- **License source:** Own work (Rentacomputer.com), code-built. No third-party model or photo is embedded. See LICENSES.xlsx.

### `src/products/micset.js`
- **Does:** Wireless mic set on a table. Code-drawn here. No third-party mesh. missing-products.xlsx "Wireless microphones (handheld/lav/headset) + podium gooseneck mic". Sourced parts on that row: Shure SLXD4 receiver 7.76 W × 5.98 D × 1.65 H in; SLXD24/SM58 handheld...
- **Imports:** `../register.js`, `./create.js`, `../brand.js`, `./geom.js`
- **License source:** Own work (Rentacomputer.com), code-built — Audio and streaming meshes v3.36 (src/products/mixer.js, subwoofer.js, micset.js, gooseneck.js, streamkit.js, hotspot.js; uplight.js and stagelight.js held, not registered) (source: —)

### `src/products/mixer.js`
- **Does:** Audio mixer on a table (front of house). Code-drawn here. No third-party mesh. missing-products.xlsx "Mixer / audio console + subwoofer". The W × D × H columns are the mixer, not the subwoofer: 24.84 × 20.16 × 8.39 in. Behringer X32 Compact candidate (retai...
- **Imports:** `../register.js`, `./create.js`, `../brand.js`, `./geom.js`
- **License source:** Own work (Rentacomputer.com), code-built — Audio and streaming meshes v3.36 (src/products/mixer.js, subwoofer.js, micset.js, gooseneck.js, streamkit.js, hotspot.js; uplight.js and stagelight.js held, not registered) (source: —)

### `src/products/monitor.js`
- **Does:** Catalog object: Desktop monitor 24–27 in.
- **Imports:** `../register.js`, `./create.js`
- **License source:** Own work (Rentacomputer.com), code-built. No third-party model or photo is embedded. See LICENSES.xlsx.

### `src/products/newitems.test.js`
- **Does:** Checks the badge printer, projector with screen, and phone charging table.
- **Imports:** `three`, `../catalog.js`, `../meshes.js`, `../icons.js`, `../brand.js`, `../logic.js`, `../walls.js`, `./projscreen.js`
- **License source:** Own work (Rentacomputer.com), code-built. No third-party model or photo is embedded. See LICENSES.xlsx. Imports three.js (MIT; npm package three@0.169, not bundled).

### `src/products/pedestal.js`
- **Does:** Display pedestal. missing-products.xlsx: 12 × 12 × 42 in. https://formdecor.com/products/table-bar-rental/side-table-rental/linea-pedestal-black-large-clear-glass/ (12 × 12 × 42) https://setshop.com/cubes-pedestals-rental/ lists 12x12x42 among rental pedest...
- **Imports:** `../register.js`, `./create.js`, `../brand.js`, `./geom.js`
- **License source:** Own work (Rentacomputer.com), code-built — LED furniture, pedestal, display cube, event bar, backbar, and vending meshes v3.36 (src/products/glowcube.js, glowbar.js, pedestal.js, displaycube.js, eventbar.js, backbar.js, vending.js) (source: —)

### `src/products/podium.js`
- **Does:** Catalog object: Podium / lectern.
- **Imports:** `../register.js`, `./create.js`
- **License source:** Own work (Rentacomputer.com), code-built. No third-party model or photo is embedded. See LICENSES.xlsx.

### `src/products/powerbox.js`
- **Does:** Catalog object: Power distribution box.
- **Imports:** `../register.js`, `./create.js`
- **License source:** Own work (Rentacomputer.com), code-built. No third-party model or photo is embedded. See LICENSES.xlsx.

### `src/products/projscreen.js`
- **Does:** Projector with a screen. The screen mesh is named videoScreen so a later pass can put video on it. UNCONFIRMED projector model. missing-products.xlsx uses the Epson Pro L1100U with the standard lens, including feet: sheet rounds 23.1 × 19.4 × 8.3 in from th...
- **Imports:** `three`, `../register.js`, `./create.js`, `../brand.js`, `./geom.js`, `../catalog.js`, `../logic.js`
- **License source:** Own work (Rentacomputer.com), code-built — Badge printer, projector with screen, charging table meshes v3.33 (src/products/badgeprinter.js, projscreen.js, chargetable.js, geom.js) (source: —) Imports three.js (MIT; npm package three@0.169, not bundled).

### `src/products/qbar.js`
- **Does:** Queue barricade. missing-products.xlsx: steel bike-rack, 100 in long, 43 in tall. Feet depth is the sheet's ~20 in and is UNCONFIRMED. Sections snap end to end.
- **Imports:** `../register.js`, `./create.js`, `../brand.js`, `./geom.js`
- **License source:** Own work (Rentacomputer.com), code-built — Barricade, metal detector, tent, generator, feeder cable, cable ramp, radio, interpretation booth meshes v3.36 (src/products/qbar.js, wtmeter.js, tent.js, generator.js, feeder.js, ramp.js, radio.js, ibooth.js) (source: —)

### `src/products/radio.js`
- **Does:** Two-way radio. missing-products.xlsx: Motorola CP200d, 2.4 × 1.7 × 5 in. Staff-desk add-on (snaps onto a counter or table top). Bob has not confirmed whether radios show on the plan.
- **Imports:** `../register.js`, `./create.js`, `../brand.js`, `./geom.js`
- **License source:** Own work (Rentacomputer.com), code-built — Barricade, metal detector, tent, generator, feeder cable, cable ramp, radio, interpretation booth meshes v3.36 (src/products/qbar.js, wtmeter.js, tent.js, generator.js, feeder.js, ramp.js, radio.js, ibooth.js) (source: —)

### `src/products/ramp.js`
- **Does:** Cable ramp. missing-products.xlsx: Checkers Linebacker 5-channel candidate, 36 × 20 × 2.31 in. Which ramp is rented is UNCONFIRMED. Sections snap end to end along the 36 in side.
- **Imports:** `../register.js`, `./create.js`, `../brand.js`, `./geom.js`
- **License source:** Own work (Rentacomputer.com), code-built — Barricade, metal detector, tent, generator, feeder cable, cable ramp, radio, interpretation booth meshes v3.36 (src/products/qbar.js, wtmeter.js, tent.js, generator.js, feeder.js, ramp.js, radio.js, ibooth.js) (source: —)

### `src/products/regctr.js`
- **Does:** Catalog object: Registration counter.
- **Imports:** `../register.js`, `./create.js`
- **License source:** Own work (Rentacomputer.com), code-built. No third-party model or photo is embedded. See LICENSES.xlsx.

### `src/products/round60.js`
- **Does:** Catalog object: 60 in round table.
- **Imports:** `../register.js`, `./create.js`
- **License source:** Own work (Rentacomputer.com), code-built. No third-party model or photo is embedded. See LICENSES.xlsx.

### `src/products/screen.js`
- **Does:** Catalog object: Projector screen.
- **Imports:** `../register.js`, `./create.js`
- **License source:** Own work (Rentacomputer.com), code-built. No third-party model or photo is embedded. See LICENSES.xlsx.

### `src/products/screenface.js`
- **Does:** Shared by the touchscreen kiosk and touchscreen table. meshes.js is a shared file and this job only adds product files, so an unknown shape still comes out of buildMesh as one white box of the product envelope. That box is swapped here for the real code-dra...
- **Imports:** `three`
- **License source:** Own work (Rentacomputer.com), code-built — Touchscreen kiosk + table meshes v3.33 (src/products/touchkiosk.js, touchtable.js, screenface.js) (source: —) Imports three.js (MIT; npm package three@0.169, not bundled).

### `src/products/speaker.js`
- **Does:** Catalog object: Powered speaker on stand.
- **Imports:** `../register.js`, `./create.js`
- **License source:** Own work (Rentacomputer.com), code-built. No third-party model or photo is embedded. See LICENSES.xlsx.

### `src/products/stage.js`
- **Does:** Modular stage deck. Code-drawn geometry only (our own). No prices. Sizes: missing-products.xlsx "Stage / riser platform" (Wenger StageTek 4×8), then the maker sheets cited there. Deck 96 × 48 in is the published 4 × 8 ft rectangle. Deck height default is 24...
- **Imports:** `../register.js`, `./create.js`, `three`, `three/examples/jsm/utils/BufferGeometryUtils.js`
- **License source:** Own work (Rentacomputer.com), code-built — Stage deck 4 × 8 ft mesh (deck, legs, skirt, stairs) (source: —) Imports three.js (MIT; npm package three@0.169, not bundled).

### `src/products/stage.preview.html`
- **Does:** Browser preview of the 4 × 8 ft stage deck at true scale.
- **Imports:** `three`, `three/examples/jsm/controls/OrbitControls.js`, `./stage.js`
- **License source:** Own work (Rentacomputer.com), code-built. No third-party model or photo is embedded. See LICENSES.xlsx. Imports three.js (MIT; npm package three@0.169, not bundled).

### `src/products/stage.register.js`
- **Does:** v3.35 merge line for PR #7. stage.js keeps no call of its own (its test checks that). Drawn through the catalog draw hook (meshes.js default case); joined edges arrive in opt from render.js.
- **Imports:** `./stage.js`
- **License source:** Own work (Rentacomputer.com), code-built. No third-party model or photo is embedded. See LICENSES.xlsx.

### `src/products/stage.test.mjs`
- **Does:** Stage deck checks. Not loaded by the catalog glob (that only takes *.js).
- **Imports:** `node:fs`, `node:test`, `node:assert/strict`, `three`, `./stage.js`
- **License source:** Own work (Rentacomputer.com), code-built. No third-party model or photo is embedded. See LICENSES.xlsx. Imports three.js (MIT; npm package three@0.169, not bundled).

### `src/products/stagelight.js`
- **Does:** Stage light on a stand. Not registered. Same missing-products.xlsx row as the uplight. The only dimensions on that row are the Wenger StageTek stage deck (96 × 48 in, height 8–40 in, 24 typical). A stand light was not given a size. None was invented.
- **Imports:** none
- **License source:** Own work (Rentacomputer.com), code-built — Audio and streaming meshes v3.36 (src/products/mixer.js, subwoofer.js, micset.js, gooseneck.js, streamkit.js, hotspot.js; uplight.js and stagelight.js held, not registered) (source: —)

### `src/products/stool.js`
- **Does:** Catalog object: Bar stool.
- **Imports:** `../register.js`, `./create.js`
- **License source:** Own work (Rentacomputer.com), code-built. No third-party model or photo is embedded. See LICENSES.xlsx.

### `src/products/streamkit.js`
- **Does:** Camera and live-streaming kit on a tripod. Code-drawn here. No third-party mesh. missing-products.xlsx "Camera & live streaming kit (camera on tripod)". Sheet size: 7.5 W × 16.5 D × 68.9 H in (H is the tripod maximum). Sony PXW-Z190 candidate and Manfrotto...
- **Imports:** `../register.js`, `./create.js`, `../brand.js`, `./geom.js`
- **License source:** Own work (Rentacomputer.com), code-built — Audio and streaming meshes v3.36 (src/products/mixer.js, subwoofer.js, micset.js, gooseneck.js, streamkit.js, hotspot.js; uplight.js and stagelight.js held, not registered) (source: —)

### `src/products/subwoofer.js`
- **Does:** Subwoofer. Code-drawn here. No third-party mesh. Same missing-products.xlsx row as the mixer. The columns are the mixer. The subwoofer size is in the model text: JBL EON718S, 24 W × 25.1 D × 26.3 H in. https://jblpro.com/en/products/jbl-eon718s
- **Imports:** `../register.js`, `./create.js`, `../brand.js`, `./geom.js`
- **License source:** Own work (Rentacomputer.com), code-built — Audio and streaming meshes v3.36 (src/products/mixer.js, subwoofer.js, micset.js, gooseneck.js, streamkit.js, hotspot.js; uplight.js and stagelight.js held, not registered) (source: —)

### `src/products/table6.js`
- **Does:** Catalog object: 6 ft banquet table.
- **Imports:** `../register.js`, `./create.js`
- **License source:** Own work (Rentacomputer.com), code-built. No third-party model or photo is embedded. See LICENSES.xlsx.

### `src/products/table8.js`
- **Does:** Catalog object: 8 ft banquet table.
- **Imports:** `../register.js`, `./create.js`
- **License source:** Own work (Rentacomputer.com), code-built. No third-party model or photo is embedded. See LICENSES.xlsx.

### `src/products/tent.js`
- **Does:** Event tent. missing-products.xlsx: 20 × 20 ft high-peak frame tent, 8 ft legs, peak 16 ft 9 in. Bob has not confirmed tents, or which sizes. Outdoor use. Placement indoors is not blocked.
- **Imports:** `../register.js`, `./create.js`, `../brand.js`, `./geom.js`
- **License source:** Own work (Rentacomputer.com), code-built — Barricade, metal detector, tent, generator, feeder cable, cable ramp, radio, interpretation booth meshes v3.36 (src/products/qbar.js, wtmeter.js, tent.js, generator.js, feeder.js, ramp.js, radio.js, ibooth.js) (source: —)

### `src/products/touchkiosk.js`
- **Does:** Our own icon. Falls back through icons.js only if this id is missing. Envelope: Peerless-AV KIPICT2555 spec, 34.00 x 75.06 x 19.00 in (W x H x D). https://files.focusedtechnology.com/libimages/peerless-kipict2555-spec.pdf missing-products.xlsx names the can...
- **Imports:** `../register.js`, `./create.js`, `../brand.js`, `../icons.js`, `./screenface.js`
- **License source:** Own work (Rentacomputer.com), code-built — Touchscreen kiosk + table meshes v3.33 (src/products/touchkiosk.js, touchtable.js, screenface.js) (source: —)

### `src/products/touchscreen.test.js`
- **Does:** v3.34: product tests for the touchscreen kiosk and table; src/tests.js runs them in the selftest.
- **Imports:** `./touchkiosk.js`, `./touchtable.js`, `./kiosk.js`, `./table6.js`, `../register.js`, `../meshes.js`, `three`, `../icons.js`, `../brand.js`, `./screenface.js`
- **License source:** Own work (Rentacomputer.com), code-built. No third-party model or photo is embedded. See LICENSES.xlsx. Imports three.js (MIT; npm package three@0.169, not bundled).

### `src/products/touchtable.js`
- **Does:** Envelope: Visionair-e 55 in Designer Interactive Touch Table, 71.0 x 35.6 x 29.0 in (L x W x H). https://www.visionair-e.com/alpha-touch-screen-tables-wall-panels One maker page. missing-products.xlsx still asks 55 or 65 in, table or tilt. 16:9 is that page...
- **Imports:** `../register.js`, `./create.js`, `../brand.js`, `../icons.js`, `./screenface.js`
- **License source:** Own work (Rentacomputer.com), code-built — Touchscreen kiosk + table meshes v3.33 (src/products/touchkiosk.js, touchtable.js, screenface.js) (source: —)

### `src/products/tower.js`
- **Does:** Catalog object: Charging tower.
- **Imports:** `../register.js`, `./create.js`
- **License source:** Own work (Rentacomputer.com), code-built. No third-party model or photo is embedded. See LICENSES.xlsx.

### `src/products/tv55.js`
- **Does:** Catalog object: 55 in TV.
- **Imports:** `../register.js`, `./create.js`
- **License source:** Own work (Rentacomputer.com), code-built. No third-party model or photo is embedded. See LICENSES.xlsx.

### `src/products/tv75.js`
- **Does:** Catalog object: 75 in TV.
- **Imports:** `../register.js`, `./create.js`
- **License source:** Own work (Rentacomputer.com), code-built. No third-party model or photo is embedded. See LICENSES.xlsx.

### `src/products/tv85.js`
- **Does:** missing-products.xlsx — Large format TV (85–98 in). Drawn model: Samsung QM85C. Panel width 74.97 in, panel height 42.71 in. Stand STN-L6585C footprint 31.97 × 13.07 in. On-stand overall height is UNCONFIRMED. QM85C panel thickness is not in the sheet. The...
- **Imports:** `../register.js`, `./create.js`, `./draw.js`
- **License source:** Own work (Rentacomputer.com), code-built — Code-built meshes for digital signage, 85 in TV, desktop computer, copier, charging locker v3.36 (src/products/digisign.js, tv85.js, desktop.js, copier.js, charger.js, draw.js) (source: —)

### `src/products/uplight.js`
- **Does:** Uplight. Not registered. missing-products.xlsx row "Lighting (uplights / stage lights)" repeats the Wenger StageTek stage deck: 96 × 48 in, height "8-40 (24 typical)", and the stage question "Which stage brand/deck size and heights do we rent?"
- **Imports:** none
- **License source:** Own work (Rentacomputer.com), code-built — Audio and streaming meshes v3.36 (src/products/mixer.js, subwoofer.js, micset.js, gooseneck.js, streamkit.js, hotspot.js; uplight.js and stagelight.js held, not registered) (source: —)

### `src/products/vending.js`
- **Does:** Vending machine. missing-products.xlsx: no model, size UNCONFIRMED. Placeholder is one maker's cabinet, not a shared standard. Two AMS sheets agree: https://amsvendors.com/wp-content/uploads/2025/04/Classic-Snack-2025.pdf (5-wide: 72 H × 39 W × 35 D)
- **Imports:** `three`, `../register.js`, `./create.js`, `../brand.js`, `./geom.js`
- **License source:** Own work (Rentacomputer.com), code-built — LED furniture, pedestal, display cube, event bar, backbar, and vending meshes v3.36 (src/products/glowcube.js, glowbar.js, pedestal.js, displaycube.js, eventbar.js, backbar.js, vending.js) (source: —) Imports three.js (MIT; npm package three@0.169, not bundled).

### `src/products/wtmeter.js`
- **Does:** Walk-through metal detector. missing-products.xlsx: CEIA HI-PE Multi-Zone candidate. 32.9 W × 26 D × 88.8 H in. Opening 28.3 W × 80.7 H in. Which model is rented is UNCONFIRMED. Control housing stays inside the right upright so the walk-through stays open t...
- **Imports:** `../register.js`, `./create.js`, `../brand.js`, `./geom.js`
- **License source:** Own work (Rentacomputer.com), code-built — Barricade, metal detector, tent, generator, feeder cable, cable ramp, radio, interpretation booth meshes v3.36 (src/products/qbar.js, wtmeter.js, tent.js, generator.js, feeder.js, ramp.js, radio.js, ibooth.js) (source: —)

### `src/register.js`
- **Does:** Plug-in registries. A new product, preset, panel or sim feature registers itself from its own file. src/main.js does not gain a line when one is added.
- **Imports:** none
- **License source:** Own work (Rentacomputer.com), code-built. No third-party model or photo is embedded. See LICENSES.xlsx.

### `src/style.css`
- **Does:** Layout and controls for both modes.
- **Imports:** none
- **License source:** Own work (Rentacomputer.com), code-built. No third-party model or photo is embedded. See LICENSES.xlsx.

### `src/tech-tags.js`
- **Does:** Technology and screen tags for every catalog object. House placement should filter on tech and screen.
- **Imports:** none
- **License source:** Written for this export so technology items are tagged for house placement. Not a planner source file.

### `src/walls.js`
- **Does:** Wall, box, and door geometry. 1 unit = 1 ft. Closed polygons are the outline a roof would cover. No roof mesh.
- **Imports:** none
- **License source:** Own work (Rentacomputer.com), code-built. No third-party model or photo is embedded. See LICENSES.xlsx.

### `vite.config.js`
- **Does:** Dev server and build. Fills Rentacomputer.com tokens in index.html. This copy builds index.html only.
- **Imports:** `path`, `./src/brand.js`
- **License source:** Own work (Rentacomputer.com), code-built. No third-party model or photo is embedded. See LICENSES.xlsx.

### `MANIFEST.md`
- **Does:** This list: each file, what it does, what it imports, and the license source.
- **Imports:** none
- **License source:** Written for this export. It records the license rows; it is not a separate software license.
