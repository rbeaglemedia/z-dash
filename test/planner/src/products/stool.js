import { registerProduct } from '../register.js';
import { product } from './create.js';
registerProduct(product(7, 'stool', 'seating', 'Bar stool', 16, 16, 30, 'stool', { snapsTo: ['edge'], edgeKind: 'stool' }));
