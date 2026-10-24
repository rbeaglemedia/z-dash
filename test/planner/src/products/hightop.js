import { registerProduct } from '../register.js';
import { product } from './create.js';
registerProduct(product(3, 'hightop', 'tables', 'High-top cocktail table', 30, 30, 42, 'round', { topIn: 42, round: true, edgeFor: ['stool'] }));
