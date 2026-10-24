import { registerProduct } from '../register.js';
import { product } from './create.js';
registerProduct(product(9, 'regctr', 'counters', 'Registration counter', 72, 24, 42, 'counter', { topIn: 42, snapsTo: ['backwall'] }));
