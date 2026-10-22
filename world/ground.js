'use strict';
// off-road: only while fully rolling (0.3 s after any touchdown / skim / kick), never on roofs
function offRoadK(){if(P.gy>0.3||(P.gT||0)<0.3)return 1;return surfaceAt(P.x,P.z)==='paved'?1:TUNE.offRoad;}
