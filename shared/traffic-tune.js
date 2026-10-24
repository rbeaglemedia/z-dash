'use strict';
// Neon World lane traffic. Every car is the loaded 370Z. Distances are metres. Speeds are m/s.
// Sources, and only these:
//   lanes and crossings — CITY.ROADS (world/city.js)
//   pace — this file, a calm city band. Not a copied roll.
//   count — 12 near cars plus 18 far dots, the Neon World cap
//   size — the 370Z the player drives
//   paints — the Garage colors for that Z
//   meeting the player — slow down and stay in the lane
//   tow trucks — world/towdrive.js, same lanes, slower, no shove
window.TRAFFIC_TUNE = {
  simCap: 12,          // simulated cars near the player (spacing along the lane)
  dotCap: 18,          // extra cheap far cars (lights only, no collision)
  fullDist: 150,       // full 370Z model
  boxDist: 400,        // simple car + glowing lights
  dotDist: 800,        // headlight / taillight dots; nothing past this
  simRadius: 185,      // keep simulated cars inside this horizontal radius
  recycle: 240,        // respawn a simulated car once it is farther than this
  dotInner: 210,       // far-dot cars stay outside the simulated pocket
  speedMin: 10,        // m/s, Neon World city cruise. The old 13–19 band is gone.
  speedMax: 15,
  highwayAdd: 3,       // m/s extra on highway, bridge, and tunnel lanes
  gap: 11,             // metres, centre to centre, same direction
  carL: 4.25,          // metres, the 370Z the player drives
  carW: 1.85,
  carH: 1.32,
  turnP: 0.32,         // chance to leave the straight road at a crossing
  towFrac: 0.5,        // rollback trucks cruise at this fraction of a Z's pace
  hopP: 0.4,           // chance a Z catching a tow truck in its lane hops the bed
  hopLane: 0.5,        // of the ones that do not hop, this fraction changes lanes (the rest follow)
  hopVy: 6.2,          // m/s, scripted launch off the bed (ballistic, no damage)
  liveCap: 0,          // 0 = no per-frame GL readback. A live photo every frame misses 110fps.
  livePx: 512,
  spritePx: 320,       // photo of the low-poly Z. 160 was too coarse. Paid once per angle.
  bakePerFrame: 1,
  cacheMax: 280,       // 9 paints x 24 yaw at the chase elevation, plus steer and elev misses
  yawStep: Math.PI / 12,
  elevStep: 0.1,       // rad. Chase sits near atan2(2, 10). The photo uses that bin, not a flat side view.
  steerStep: 0.15,     // rad. Front wheels in the photo yaw about the upright axle.
  // Chassis pose on the photo. Same spring as the player (phys-air step). No second mesh, no wings.
  susK: 140,
  susD: 8,
  susLo: -0.18,        // metres the body may squat
  susHi: 0.10,
  susBrake: -0.07,     // spring target while braking, so the squat is the same spring as a landing
  rollGain: 0.28,      // body lean from yaw rate
  rollMax: 0.42,       // rad, about 24 degrees. The old cap was 0.16 (about 9).
  noseBrake: 0.30,     // rad, brake dive drawn on the sprite
  noseAccel: 0.10,     // rad, nose up while speeding up
  pitchDraw: 0.95,     // sprite squash per radian. 0.10 was invisible.
  wheelR: 0.33,        // metres, ZDM.wr. The tyre is the mesh in the well, not a camera card.
  cornerFrac: 0.58,    // cornering speed as a fraction of the car's cruise roll
  cornerDist: 18,      // metres before a turn where the car starts braking
  accel: 5.5,          // m/s² back up to cruise after the corner
  brake: 6.8,          // m/s² easing into a corner or a car ahead
  blendMin: 0.65,      // seconds, smooth turn / lane-change
  blendMax: 0.85,
  arcLead: 4.5,        // metres before the crossing where the corner arc begins
  rampGrab: 3.5,       // metres, a street ramp close enough to climb on purpose
  // Garage colors for this Z.
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
