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
  near: 40,            // street-band window grids (streetWinDist)
  nearDist: 40,
  streetWinDist: 40,   // window grids while 12–48 m/s on the ground
  streetDist: 70,      // lanes, curbs, crosswalks, lamps in that street band
  mid: 130,            // simpler roof line only, then culled
  roadDist: 70,        // lane / curb length around the camera
  crossDist: 70,       // nearest crosswalk
  lightDist: 70,
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
  // Three speed bands. Other modules and tests read these names.
  crawlSpeedMax: 12,   // on the ground and slower than this: crawl close-up
  streetSpeedMax: 48,  // on the ground up to this: street set. At/above, or airborne: no detail
  crawlDetailDist: 30, // crawl close-up radius (m)
  // Purpose storefronts: Street Mode under storefrontMaxSpeed, or on foot.
  storefronts: true,
  storefrontMaxSpeed: 12,
  storefrontDist: 48,
  storefrontMaxSegs: 260
};
