'use strict';
// Neon World split-page detail. Every flag defaults on; turn one off to drop that layer.
// Distances are metres. Budgets are the most work one frame may do.
// Palette is the existing night neon set: black/dark base, cyan, pink, gold/orange, purple.
// Park green (#062a12 / #7dff6b) is the green the city already uses for the park and trees.
window.DETAIL_TUNE = {
  windows: true,       // 3D window frames on the nearest walls; never a screen-space stamp
  roofTrim: false,     // dropped: roof-edge stroke held downtown at ~26fps vs ~60 with it off
  signs: true,         // a few baked neon signs
  shapes: false,       // dropped: corner posts / ridges / crowns held downtown at ~31fps vs ~60
  lanes: true,         // dashed lane lines on the street under the camera
  crosswalks: true,    // zebra stripes at the nearest intersection
  sidewalks: true,     // curb and sidewalk edge
  streetlights: true,  // instanced billboard lamps, no real lights
  grass: true,         // dark park patches with a neon grid
  river: true,         // extra neon current lines on the nearby river
  trees: true,         // instanced neon billboard trees
  near: 48,            // nearDist: window grids inside this 3D distance (capped at 48)
  nearDist: 48,
  mid: 130,            // simpler roof line only, then culled
  roadDist: 78,        // lane / curb length around the camera
  crossDist: 115,      // show the nearest crosswalk out to here
  lightDist: 62,
  treeDist: 80,
  grassDist: 110,
  riverDist: 150,
  signDist: 110,
  faceBudget: 4,       // maxWindowFaces: wall faces with a 3D window grid (hard cap 6)
  maxWindowFaces: 4,
  trimFull: 4,         // buildings that get a full roof + shape
  trimSimple: 3,       // farther buildings that get only the roof line
  signBudget: 2,
  lightBudget: 6,
  treeBudget: 8,
  // Street Mode cruise only. These do not scale the distances above.
  crawl: 12,           // extra close-up while |v| is under this (m/s), on the ground
  crawlRadius: 30      // extra close-up inside this distance (m)
};
