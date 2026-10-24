'use strict';
// Neon World lane traffic. Every car is the loaded 370Z. Distances are metres. Speeds are m/s.
// Bob's rows (Oct 24): lane centre, two lengths in town, three on fast roads,
// stop for a busy crossing or NOS apron, roll at 4 m/s when that box is empty,
// crawl a corner tighter than 7 m, merge only at a crossing, town 10–15,
// fast roads 16–20, match his Z and leave one extra length, keep 30 cars.
window.TRAFFIC_TUNE = {
  simCap: 12,          // simulated cars near the player (spacing along the lane)
  dotCap: 18,          // extra cheap far cars (lights only, no collision)
  fullDist: 150,       // full 370Z model
  boxDist: 400,        // simple car + glowing lights
  dotDist: 800,        // headlight / taillight dots; nothing past this
  simRadius: 185,      // keep simulated cars inside this horizontal radius
  recycle: 240,        // respawn a simulated car once it is farther than this
  dotInner: 210,       // far-dot cars stay outside the simulated pocket
  speedMin: 10,        // m/s, town cruise on street and lane
  speedMax: 15,
  fastMin: 16,         // m/s, highway, bridge, and tunnel
  fastMax: 20,
  highwayAdd: 6,       // m/s. towdrive from v33 still adds this. It must stay a number: a missing one makes truck speed NaN and the city never draws.
  gap: 12.75,          // metres, town centre to centre (8.5 bumper + one 4.25 length)
  gapTownBumper: 8.5,
  gapFastBumper: 12.75,
  leadExtra: 4.25,     // one extra length when his Z is the lead
  stopDist: 18,        // metres before a crossing or apron where braking starts
  crossBox: 6,         // metres, half-size of the crossing box
  rollMs: 4,           // m/s through an empty crossing or apron
  laneHold: 0.3,       // metres, stay this close to the lane centre
  minRadius: 7,        // metres, crawl instead of cutting tighter than this
  crawl: 2.2,          // m/s on a corner tighter than minRadius
  carL: 4.25,          // metres, the 370Z the player drives
  carW: 1.85,
  carH: 1.32,
  turnP: 0.32,         // chance to leave the straight road at a crossing
  towFrac: 0.5,        // rollback trucks cruise at this fraction of a Z's roll
  hopP: 0.4,           // chance a Z catching a tow truck in its lane jumps the bed
  hopLane: 0,          // no mid-block lane change; a merge waits for a crossing
  hopVy: 6.2,          // m/s, scripted launch off the bed (ballistic, no damage)
  spritePx: 160,       // baked once per paint x view; the mesh is not redrawn per car
  bakePerFrame: 0,     // a drive never bakes. The menu fills the whole grid first.
  warmMs: 48,          // menu frames spend up to this long on the next photos
  cacheMax: 1512,      // 9 paints x 24 headings x 7 camera heights, kept for the whole drive
  yawStep: Math.PI / 12, // 15° sprite yaw (was 22.5°)
  yawHold: 0.62,       // keep the current photo until the heading is this far across a bucket
  elevHold: 0.22,      // radians. camera-height bucket. slip and pitch do not change the photo
  bandHold: 12,        // metres past a sprite/box/lights edge before the picture changes
  cornerFrac: 0.58,    // cornering speed as a fraction of the car's cruise roll
  cornerDist: 18,      // metres before a turn where the car starts braking
  accel: 5.5,          // m/s² back up to cruise after the corner
  brake: 6.8,          // m/s² easing into a corner or a car ahead
  blendMin: 0.65,      // seconds, smooth turn / lane-change
  blendMax: 0.85,
  arcLead: 4.5,        // metres before the crossing where the corner arc begins
  rampGrab: 3.5,       // metres, a street ramp close enough to climb on purpose
  // ZTR.PAINTS, hex from the Garage catalog (same paints level 4 rolls)
  paints: [
    {id:'cyan', paint:'#1aa6c8', glow:'#3ee6ff', grid:'#9b5cff'},
    {id:'pink', paint:'#e0359f', glow:'#ff4fd8', grid:'#3ee6ff'},
    {id:'lime', paint:'#3cc24a', glow:'#7dff6b', grid:'#ff4fd8'},
    {id:'purple', paint:'#6a33d6', glow:'#c08bff', grid:'#3ee6ff'},
    {id:'gold', paint:'#d9a514', glow:'#ffe14d', grid:'#ff4fd8'},
    {id:'tuner-orange', paint:'#ff7a1a', glow:'#ffe14d', grid:'#ff9a3d'},
    {id:'blackout', paint:'#121318', glow:'#3a7bff', grid:'#3a7bff'},
    {id:'gunmetal', paint:'#5c6068', glow:'#ff2a3d', grid:'#ff2a3d'},
    {id:'red40', paint:'#8a0f1a', glow:'#ff2a3d', grid:'#ffe14d'}
  ]
};
