'use strict';
// Z TAKEOVER level 4 civilian traffic (jr.html ZTR + wTraffic), retuned for Neon World roads.
// All cars are the one loaded Nissan 370Z. Distances are metres. Speeds are m/s.
// Level 4 wTraffic rolls 13 + random * 6. Highway adds highwayAdd on top of that roll.
window.TRAFFIC_TUNE = {
  simCap: 12,          // simulated cars near the player (collision, spacing)
  dotCap: 18,          // extra cheap far cars (lights only, no collision)
  fullDist: 150,       // full 370Z model
  boxDist: 400,        // simple car + glowing lights
  dotDist: 800,        // headlight / taillight dots; nothing past this
  simRadius: 185,      // keep simulated cars inside this horizontal radius
  recycle: 240,        // respawn a simulated car once it is farther than this
  dotInner: 210,       // far-dot cars stay outside the simulated pocket
  speedMin: 13,
  speedMax: 19,
  highwayAdd: 4,
  gap: 11,             // metres, centre to centre, same direction
  carL: 4.25,          // ZTR.L, the real Z the player drives
  carW: 1.85,          // ZTR.W
  carH: 1.32,
  turnP: 0.32,         // chance to leave the straight road at a crossing
  towFrac: 0.5,        // rollback trucks cruise at this fraction of a Z's roll
  hopP: 0.4,           // chance a Z catching a tow truck in its lane jumps the bed
  hopLane: 0.5,        // of the ones that do not jump, this fraction changes lanes (the rest follow)
  hopVy: 6.2,          // m/s, scripted launch off the bed (ballistic, no damage)
  bumpKeep: 0.92,      // WANTED bumpTraffic: heavy Z keeps this fraction of speed (never a reset, no speed floor)
  bumpDrop: 0,         // unused: the old subtract-a-floor stall is gone; wrecks use bumpKeep only
  bumpYaw: 0.045,      // rad, small sideways kick
  spritePx: 160,       // baked once per paint x view; the mesh is not redrawn per car
  bakePerFrame: 1,
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
