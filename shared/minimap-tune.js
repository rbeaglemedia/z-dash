'use strict';
// Neon World split minimap. Distances are metres. Icon sizes are HUD pixels.
// City streets default to 20 m wide (world/city.js addRoad). The grid runs about
// x -560..1100 and z -300..2100, so 3400 m across the widget shows that city.
window.MINIMAP_TUNE = {
  spanClose: 300,  // metres across the map on the ground
  spanFar: 3400,   // metres across at high altitude, about the whole city
  altClose: 24,    // at and below this height, stay zoomed in. Bumps and small hops sit here.
  altFar: 240,     // at and above this height, spanFar
  ease: 0.8,       // seconds for the zoom to follow altitude
  street: 20,      // ground icon is about this many metres wide, one street
  iconMin: 20      // smallest the icon sprite gets, in HUD px, so it stays readable zoomed out
};
