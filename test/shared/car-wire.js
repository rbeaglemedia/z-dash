'use strict';
// ===== Neon Z: 2010 Nissan 370Z coupe, real proportions (L 4.25, W 1.85, H 1.32, WB 2.55 m). x right, y up, z forward.
// Every flight part is a remade Z part (no bolt-ons). tf: 0 = car, 1 = plane.
const lerp=(a,b,t)=>a+(b-a)*t, L3=(p,q,t)=>[lerp(p[0],q[0],t),lerp(p[1],q[1],t),lerp(p[2],q[2],t)];
const ease=t=>t*t*(3-2*t);
const ZDM={len:4.25,hw:0.925,h:1.32,fAx:1.175,rAx:-1.375,wr:0.33,wx:0.80};
// body stations: z, half-width at shoulder, sill y, shoulder y (fenders flare at wheel stations)
const ST=[[2.125,.70,.28,.56],[2.02,.84,.22,.62],[1.80,.90,.20,.70],[1.50,.925,.20,.78],[1.15,.92,.20,.80],[.80,.89,.22,.79],[.55,.88,.22,.80],
  [0,.87,.22,.84],[-.55,.88,.22,.88],[-1.05,.91,.22,.93],[-1.40,.925,.22,.95],[-1.75,.91,.24,.96],[-2.0,.86,.28,.95],[-2.125,.78,.32,.93]];
// greenhouse (roofline): z, y, half-width. windshield base -> roof peak -> fastback hatch -> spoiler lip
const RF=[[.55,.82,.80],[.05,1.20,.66],[-.25,1.32,.60],[-.65,1.29,.57],[-1.05,1.17,.52],[-1.45,1.04,.48],[-1.72,.97,.62]];
const rfAt=z=>{for(let i=0;i<RF.length-1;i++){const[a,b]=[RF[i],RF[i+1]];if(z<=a[0]&&z>=b[0]){const t=(a[0]-z)/(a[0]-b[0]);return[lerp(a[1],b[1],t),lerp(a[2],b[2],t)];}}return null;};
let wheelA=0;
function zModel(tf){const S=[],R='#ff5a66',C='#3ee6ff',A='#ffb020',Wt='#e9e3e4';const seg=(p,q,c,w)=>S.push([p,q,c||R,w||1.6]);
  const poly=(pts,c,w,open)=>{for(let i=0;i<pts.length-(open?1:0);i++)seg(pts[i],pts[(i+1)%pts.length],c,w);};
  const tD=ease(clamp(tf*1.6,0,1)), tH=ease(clamp(tf*1.6-0.6,0,1));
  const doorZ0=.55,doorZ1=-.78; const inDoor=z=>z<doorZ0&&z>doorZ1;
  // longitudinal rails: sill, mid, shoulder (sides skip the door span once the doors swing out), hood centre crease
  for(const sx of[-1,1]){for(const[k,f]of[[2,1],['m',1],[3,1]]){const pts=ST.map(r=>[sx*r[1]*(k===2?.96:1),k==='m'?lerp(r[2],r[3],.55):r[k],r[0]]);
      for(let i=0;i<pts.length-1;i++){const zm=(pts[i][2]+pts[i+1][2])/2;if(tD>.02&&inDoor(zm)&&k!==3)continue;seg(pts[i],pts[i+1],R,k===3?2:1.3);}}}
  // cross-section ribs (front/rear ends + door jambs + bumpers)
  for(const r of ST){if(r[0]<.6&&r[0]>-.9)continue;const[z,hw,y0,y1]=r;poly([[-hw,y0,z],[hw,y0,z],[hw,y1,z],[-hw*.6,y1+.02,z],[hw*.6,y1+.02,z]].slice(0,4).concat([[-hw,y1,z]]),R,1);}
  // hood: long, with two creases running to the windshield; nose
  for(const x of[-.42,.42])seg([x*.9,.6,2.06],[x,.81,.6],R,1.2);seg([-.7,.56,2.125],[.7,.56,2.125],R,2);
  // greenhouse: A-pillars, roof rails, fastback, windshield & hatch glass
  for(const sx of[-1,1]){const rp=RF.map(([z,y,h])=>[sx*h,y,z]);poly(rp,R,2,true);}
  for(const[z,y,h]of[RF[0],RF[2],RF[RF.length-2]])seg([-h,y,z],[h,y,z],R,1.3);
  poly([[-.74,.86,.5],[.74,.86,.5],[.62,1.17,.05],[-.62,1.17,.05]],C,1.2); // windshield glass
  // ROOF centre spine
  seg([0,1.2,.05],[0,1.32,-.25]);seg([0,1.32,-.25],[0,1.2,-.9]);
  // wheel arches (flared)
  for(const sx of[-1,1])for(const az of[ZDM.fAx,ZDM.rAx]){const pts=[];for(let i=0;i<=10;i++){const a=Math.PI*i/10;pts.push([sx*.93,.33+Math.sin(a)*.43,az+Math.cos(a)*.45]);}poly(pts,R,1.8,true);}
  // boomerang headlights (sweep back along fender top, hook down) and taillights (sweep forward along rear haunch)
  for(const sx of[-1,1]){poly([[sx*.50,.62,2.06],[sx*.80,.70,1.86],[sx*.90,.78,1.42],[sx*.88,.70,1.48],[sx*.84,.60,1.82],[sx*.62,.55,2.04]],'#ffffff',1.6);
    poly([[sx*.40,.90,-2.1],[sx*.78,.93,-2.02],[sx*.92,.95,-1.62],[sx*.90,.88,-1.66],[sx*.80,.72,-1.98],[sx*.70,.82,-2.06]],'#ff2a3d',2.4);}
  // DOORS -> WINGS. Door local (u 0 hinge..1 rear edge, h 0 sill..1 window top). Car: on the body side; plane: swung out flat.
  const dl=doorZ0-doorZ1, door=[[0,0],[1,0],[1,.62],[.97,.66],[.08,.62],[0,.5]], win=[[.04,.66],[.94,.68],[.72,1],[.22,1]];
  for(const sx of[-1,1]){const P=(u,h)=>{const z=doorZ0-u*dl,y=h<=.62?lerp(.24,.84,h/.62):lerp(.84,(rfAt(z)||[1.2])[0]-.04,(h-.62)/.38),x=h<=.62?.9:lerp(.88,(rfAt(z)||[0,.6])[1]+.04,(h-.62)/.38);
      return L3([sx*x,y,z],[sx*(1.0+u*2.4),.74,doorZ0-.2-h*1.25],tD);};
    poly(door.map(([u,h])=>P(u,h)),R,2.4);poly(win.map(([u,h])=>P(u,h)),C,1.5);seg(P(.8,.45),P(.92,.45),Wt,1.2);}
  // REAR HATCH (fastback glass) -> TAIL FIN, flips up vertical. hatch local s -1..1 across, l 0 top..1 bottom
  const Hc=(s2,l)=>{const z=lerp(-.9,-1.68,l),r=rfAt(z);return L3([s2*r[1]*.92,r[0]+.01,z],[0,1.0+(s2+1)*.85,-1.25-1.0*l-(s2+1)*.3],tH);};
  poly([Hc(-1,0),Hc(1,0),Hc(1,1),Hc(-1,1)],R,2.4);poly([Hc(-.75,.1),Hc(.75,.1),Hc(.75,.85),Hc(-.75,.85)],C,1.2);
  // REAR SPOILER (hatch lip) -> HORIZONTAL STABILIZER
  const sp=(x,y,z)=>L3([x*.66,y,z],[x*1.9,1.02,z-.3],tH);poly([sp(-1,.99,-1.70),sp(1,.99,-1.70),sp(1,.97,-1.92),sp(-1,.97,-1.92)],A,2);
  // grille / front bumper intake (just a grille, no prop)
  poly([[-.45,.30,2.11],[.45,.30,2.11],[.38,.47,2.12],[-.38,.47,2.12]],C,1.3);
  // TWIN EXHAUSTS (one each side) = thrust glow; jet preset (stub) = long flames
  for(const x of[-.48,.48]){const c=[x,.3,-2.13],pts=[];for(let i=0;i<6;i++){const a=i/6*Math.PI*2;pts.push([x+Math.cos(a)*.06,.3+Math.sin(a)*.06,-2.13]);}poly(pts,A,1.6);
    const fl=.85+Math.random()*.3,len=TUNE.jetEngines?(1.5+P.thr*3)*fl*tD:(.15+P.thr*.6+(P.nosT?.9:0))*fl;
    if(len>.05)seg(c,[x,.3,-2.13-len],P.nosT?'#ffffff':C,TUNE.jetEngines?4:(P.nosT?4:2+P.thr*2));}
  // WHEELS: 5-spoke, 18in -> LANDING GEAR (tuck under body)
  for(const sx of[-1,1])for(const az of[ZDM.fAx,ZDM.rAx]){const c=L3([sx*ZDM.wx,ZDM.wr,az],[sx*.5,.17,az*.8],tD),r=lerp(ZDM.wr,.17,tD),ri=r*.66,tire=[],rim=[];
    for(let i=0;i<10;i++){const a=i/10*Math.PI*2;tire.push([c[0],c[1]+Math.sin(a)*r,c[2]+Math.cos(a)*r]);rim.push([c[0]+sx*.02,c[1]+Math.sin(a)*ri,c[2]+Math.cos(a)*ri]);}
    poly(tire,Wt,1.6);if(tD<.9){poly(rim,'#9aa0aa',1);for(let k=0;k<5;k++){const a=wheelA+k*1.2566;seg([c[0]+sx*.03,c[1],c[2]],[c[0]+sx*.02,c[1]+Math.sin(a)*ri,c[2]+Math.cos(a)*ri],'#9aa0aa',1.3);}}}
  return S;}
