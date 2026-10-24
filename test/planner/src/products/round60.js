import { registerProduct } from '../register.js';
import { product } from './create.js';
registerProduct(product(2, 'round60', 'tables', '60 in round table', 60, 60, 30, 'round', { topIn: 30, round: true, edgeFor: ['chair'] }));
