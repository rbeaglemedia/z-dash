import { registerProduct } from '../register.js';
import { product } from './create.js';
registerProduct(product(4, 'conf', 'tables', 'Conference table', 96, 48, 30, 'table', { topIn: 30, edgeFor: ['chair'] }));
