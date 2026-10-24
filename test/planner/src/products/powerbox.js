import { registerProduct } from '../register.js';
import { product } from './create.js';
registerProduct(product(24, 'powerbox', 'power', 'Power distribution box', 24, 16, 18, 'powerbox', { snapsTo: ['nearwall'] }));
