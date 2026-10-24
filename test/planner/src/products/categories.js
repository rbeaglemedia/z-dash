import { registerCategory } from '../register.js';
// Catalog sections, in the order the Add sheet shows them.
const CATS = [
  ['tables', 'Tables'], ['seating', 'Seating'], ['counters', 'Counters'],
  ['tvs', 'TVs and Screens'], ['led', 'LED Walls'], ['computers', 'Computers'],
  ['kiosks', 'Kiosks'], ['audio', 'Audio'], ['power', 'Power distribution'], ['decor', 'Decor and Booths'],
];
CATS.forEach(([id, name], order) => registerCategory({ id, name, order }));
