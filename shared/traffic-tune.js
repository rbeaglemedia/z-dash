'use strict';
// Z TAKEOVER level 4 civilian traffic (jr.html ZTR + wTraffic + WT.bumpTraffic).
// Neon World pool only. Do not put this in shared/tune.js (split-ebrake owns that file).
const TRAFFIC_TUNE={
  cap:24,                 // fixed active pool (Bob: 20-30)
  v0:13,vSpan:6,          // wTraffic(): v = 13 + random*6 m/s
  W:1.85,L:4.25,H:1.32,   // ZTR: her real Z, what she sees is what she hits
  laneW:3.4,              // same as CITY.ROADS.laneW and WT.lane
  gap:11,                 // min same-lane spacing, m (car length + a little)
  spawnMin:28,spawnMax:185,despawn:250,
  sprite:78,              // real 370Z blit inside this distance
  dot:150,                // past this, a dot
  bumpSlow:0.95,          // WT.bumpTraffic: clip a car, keep going, never a reset
  bumpKick:0.5,           // m, shove apart (wKnock's twitch, not a spin into a building)
  bumpCool:0.6,           // s, W4S.l4.cool so bumps don't stack
  straightP:0.72,
  // ZTR.PAINTS in order, window = ZTR.WINS[i % WINS.length]. Hex from the Garage catalog.
  paints:[
    {id:'cyan',paint:'#1aa6c8',glow:'#3ee6ff',grid:'#9b5cff',win:'win-smoke'},
    {id:'pink',paint:'#e0359f',glow:'#ff4fd8',grid:'#3ee6ff',win:'win-clear'},
    {id:'lime',paint:'#3cc24a',glow:'#7dff6b',grid:'#ff4fd8',win:'win-ice'},
    {id:'purple',paint:'#6a33d6',glow:'#c08bff',grid:'#3ee6ff',win:'win-smoke'},
    {id:'gold',paint:'#d9a514',glow:'#ffe14d',grid:'#ff4fd8',win:'win-purple'},
    {id:'tuner-orange',paint:'#ff7a1a',glow:'#ffe14d',grid:'#ff9a3d',win:'win-smoke'},
    {id:'blackout',paint:'#121318',glow:'#3a7bff',grid:'#3a7bff',win:'win-clear'},
    {id:'gunmetal',paint:'#5c6068',glow:'#ff2a3d',grid:'#ff2a3d',win:'win-ice'},
    {id:'red40',paint:'#8a0f1a',glow:'#ff2a3d',grid:'#ffe14d',win:'win-smoke'}
  ],
  wins:{
    'win-smoke':{color:'#5a6470',op:0.55},
    'win-clear':{color:'#cfe6f5',op:0.28},
    'win-ice':{color:'#8fe3ff',op:0.5,glow:'#3ee6ff'},
    'win-purple':{color:'#8a4dff',op:0.6,glow:'#9b5cff'}
  }
};
window.TRAFFIC_TUNE=TRAFFIC_TUNE;
