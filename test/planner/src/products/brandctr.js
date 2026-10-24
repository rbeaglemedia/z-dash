import { registerProduct } from '../register.js';
import { product } from './create.js';
registerProduct(product(10, 'brandctr', 'counters', 'Branded counter', 48, 24, 42, 'counter', { topIn: 42, snapsTo: ['backwall'] }));
