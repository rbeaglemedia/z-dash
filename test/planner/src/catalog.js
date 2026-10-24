// v1 catalog from esp-v3-must-have-items.xlsx. Sizes are TYPICAL or ESTIMATES (inches), converted to feet.
// Not a list of our exact inventory. No prices anywhere.
// snapsTo rules: 'top' (onto table/counter tops), 'edge' (tuck to table edges), 'wall' (wall-mount: room walls,
// booth walls, pipe and drape), 'wallfloor' (floor-standing against a room wall or booth back wall),
// 'backwall' (inside a booth against its back wall), 'nearwall' (floor, against a room wall).
// Each product is src/products/<id>.js and registers itself. Adding one does not edit this file or main.js.
import { registeredProducts, registeredCategories } from './register.js';
import.meta.glob(['./products/*.js', '!./products/*.test.js'], { eager: true }); // v3.34: test files are not shipped in the app

const ft = (i) => Math.round((i / 12) * 1000) / 1000;
const strip = ({ order, ...rest }) => rest;
export const CATS = registeredCategories().map(strip);
export const ITEMS = registeredProducts().map(strip);
export const BY_ID = Object.fromEntries(ITEMS.map((i) => [i.id, i]));
for (const i of ITEMS) { if (i.panelIn) i.panel = ft(i.panelIn); if (i.wallDIn) i.wallD = ft(i.wallDIn); if (i.mountCenterIn) i.mountY = ft(i.mountCenterIn - i.panelIn / 2); if (i.sideHIn) i.sideH = ft(i.sideHIn); }
export const sizeText = (i) => `${+(i.w).toFixed(2)} × ${+(i.d).toFixed(2)} ft, ${+(i.h).toFixed(2)} ft tall (typical)`;
