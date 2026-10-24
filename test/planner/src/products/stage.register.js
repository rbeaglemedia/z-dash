// v3.35 merge line for PR #7. stage.js keeps no call of its own (its test checks that).
// Drawn through the catalog draw hook (meshes.js default case); joined edges arrive in opt from render.js.
import { registerProduct, stageProduct, buildStageMesh } from './stage.js';

stageProduct.draw = (g, d, mode, opt = {}) => { g.add(buildStageMesh(d, opt)); };
registerProduct(stageProduct);
