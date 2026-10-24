import { registerProduct } from '../register.js';
import { product } from './create.js';
registerProduct(product(12, 'tv75', 'tvs', '75 in TV', 65.7, 28, 72, 'tv', { snapsTo: ['wall'], panelIn: 38, wallDIn: 3, mountCenterIn: 62 }));
