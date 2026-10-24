import { registerProduct } from '../register.js';
import { product } from './create.js';
registerProduct(product(6, 'exec', 'seating', 'Executive chair', 26, 26, 42, 'chair', { snapsTo: ['edge'], edgeKind: 'chair' }));
