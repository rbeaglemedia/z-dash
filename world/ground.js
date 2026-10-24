'use strict';
// off-road: only while fully rolling (0.3 s after any touchdown / skim / kick), never on roofs
function offRoadK(){if(P.gy>0.3||(P.gT||0)<0.3)return 1;return surfaceAt(P.x,P.z)==='paved'?1:TUNE.offRoad;}
// Four ground surfaces. offRoadK() stays the grass drag scalar; this names the surface for feel + HUD.
// roof (grounded, deck height) wins over the runway box; runway uses Bob's strip, not surfaceAt's narrower paved test.
function surfaceKindAt(x,z,y){
  if(P.ground&&((y||P.y)||0)>0.8)return 'roof';
  if(Math.abs(x)<=18&&z>=-50&&z<=1520&&(y||0)<0.6)return 'runway';
  return surfaceAt(x,z)==='paved'?'road':'grass';
}
// The sky and the ground gradient are reused in boot.js. This file used to
// cache them by assigning CanvasGradient.addColorStop. That assignment throws
// on some phones, and a non-finite horizon (NaN) makes the real call throw
// too. Either throw stops requestAnimationFrame, so the canvas stays blank
// and only the HTML buttons remain. Do not put that wrapper back.
