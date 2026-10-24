'use strict';
// ===== SMOOTH LANDINGS (NEON WORLD): visual pose layer. touchDown() snaps pitch to the nose-dip, bank to 0 and the path heading to the nose in one frame
// (gameplay rules, unchanged). The drawn car + chase camera now blend height / pitch / roll from the real contact pose over VP.dur with ease-out; physics untouched.
const VP={dur:0.35,t:1,p0:0,b0:0,y0:0,cp:null,cb:0,cy:0,lp:null,lb:0,ly:0,lx:0,lz:0,lg:false,st:0,snaps:0};
function visPose(){const dt=clamp((P.simT||0)-VP.st,0,0.1);VP.st=P.simT||0;
  if(VP.cp==null||Math.hypot(P.x-VP.lx,P.z-VP.lz)>40||(!P.simT)){VP.cp=P.pitch;VP.cb=P.bank;VP.cy=P.y;VP.t=1;}
  else if(Math.abs(P.pitch-VP.lp)>2.5*D||Math.abs(P.bank-VP.lb)>2.5*D||Math.abs(P.y-VP.ly)>Math.max(0.6,Math.abs(P.vs)*dt*2+0.2)||(P.ground&&!VP.lg)){VP.p0=VP.cp;VP.b0=VP.cb;VP.y0=VP.cy;VP.t=0;VP.snaps++;}
  if(VP.t<1&&dt>0)VP.t=Math.min(1,VP.t+dt/VP.dur);const k=1-Math.pow(1-VP.t,3);
  if(VP.t>=1){VP.cp=P.pitch;VP.cb=P.bank;VP.cy=P.y;}else if(dt>0){VP.cp=VP.p0+(P.pitch-VP.p0)*k;VP.cb=VP.b0+(P.bank-VP.b0)*k;VP.cy=VP.y0+(P.y-VP.y0)*k;}
  VP.lp=P.pitch;VP.lb=P.bank;VP.ly=P.y;VP.lx=P.x;VP.lz=P.z;VP.lg=P.ground;return VP;}
function visApply(){visPose();const s=[P.pitch,P.bank,P.y];P.pitch=VP.cp;P.bank=VP.cb;P.y=VP.cy;return s;}
function visRestore(s){P.pitch=s[0];P.bank=s[1];P.y=s[2];}
