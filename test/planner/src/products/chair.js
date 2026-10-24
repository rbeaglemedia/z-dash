import { registerProduct } from '../register.js';
import { product } from './create.js';
registerProduct(product(5, 'chair', 'seating', 'Banquet chair', 18, 20, 34, 'chair', { snapsTo: ['edge'], edgeKind: 'chair' }));
