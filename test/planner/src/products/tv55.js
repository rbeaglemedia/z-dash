import { registerProduct } from '../register.js';
import { product } from './create.js';
registerProduct(product(11, 'tv55', 'tvs', '55 in TV', 48.2, 24, 66, 'tv', { snapsTo: ['wall'], panelIn: 28, wallDIn: 3, mountCenterIn: 60 }));
