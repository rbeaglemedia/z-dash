/* CREW DATA — ported from char.html (CHARFIT 71fb2b1). Pure skeleton + clips.
   Axes: metres, x right, y up, z forward (car nose +z), same frame sitPose / petFk were fitted to the real Z.
   Look is NOT in this file. world/crew.js is the renderer and can be replaced by a fuller body later.
   Saves: localStorage 'zdash.char.v1' and 'zdash.pet.v1' (same keys as char.html). */
(function(){'use strict';
/* NEONCHAR phase 1. Units/axes match world.html zModel: metres, x right, y up, z forward (car nose +z).
   ONE shared skeleton (same joints + bone lengths for both bodies) so every animation lines up; male/female differ only in
   shape (widths/thickness), hair and outfit. Saved to localStorage 'zdash.char.v1' for world.html to read later. */
const KEY='zdash.char.v1',H=1.75;
const HAIRS=['short','spiky','bob','long','ponytail','buns'];
/* Bob: one bright neon colour per character; only saturated neon picks, no dark/dull options */
const OUTFITS=['#3ee6ff','#ff3df2','#7cff4f','#ffb020','#ff4d5e','#b48cff','#fff04d','#ffffff'];
const GLOWS=OUTFITS;
const DEF={v:1,gender:'female',hair:'ponytail',outfit:'#ff3df2',glow:'#ff3df2'};
function load(){try{const o=JSON.parse(localStorage.getItem(KEY)||'null');if(o&&(o.v===1||o.v===2)){const c=Object.assign({},DEF,o);if(o.v===2&&o.colors){if(o.colors.eye)c.glow=o.colors.eye;if(o.colors.shirt)c.outfit=o.colors.shirt;}if(o.v===1&&!GLOWS.includes(c.glow))c.glow=DEF.glow;if(!c.outfit)c.outfit=c.glow;return c;}}catch(e){}return Object.assign({},DEF);}
let C=load();
function save(){C.updated=Date.now();try{localStorage.setItem(KEY,JSON.stringify(C));}catch(e){}}

/* ---------- 370Z geometry (copied read-only from world.html zModel: ST body stations, RF roofline, doors) ---------- */
const ST=[[2.125,.70,.28,.56],[2.02,.84,.22,.62],[1.80,.90,.20,.70],[1.50,.925,.20,.78],[1.15,.92,.20,.80],[.80,.89,.22,.79],[.55,.88,.22,.80],
 [0,.87,.22,.84],[-.55,.88,.22,.88],[-1.05,.91,.22,.93],[-1.40,.925,.22,.95],[-1.75,.91,.24,.96],[-2.0,.86,.28,.95],[-2.125,.78,.32,.93]];
const RF=[[.55,.935,.80],[.05,1.251,.66],[-.3,1.247,.60],[-.5,1.234,.58],[-.7,1.215,.57],[-.95,1.205,.54],[-1.2,1.175,.52],[-1.4,1.115,.50],[-1.6,1.045,.50],[-1.72,.995,.55]]; // real Z (world.html 370Z GLB) interior underside + liner .055
const lerp=(a,b,t)=>a+(b-a)*t,clamp=(v,a,b)=>v<a?a:v>b?b:v,ease=t=>t*t*(3-2*t);
const rfAt=z=>{for(let i=0;i<RF.length-1;i++){const a=RF[i],b=RF[i+1];if(z<=a[0]&&z>=b[0]){const t=(a[0]-z)/(a[0]-b[0]);return[lerp(a[1],b[1],t),lerp(a[2],b[2],t)];}}return null;};
const DOOR={z0:.55,z1:-.78,sill:.25,x:.9,wing:1}; // real Z door opening (wing-style door swings up and out); sill top y .25
/* Interior (derived from the shell above + real 370Z packaging): left-hand drive, driver centre x=-0.37,
   seat cushion top y=0.34, seat H-point z=-0.42, floor y=0.14, pedals z≈+0.55, headliner = roof - 0.055 m. */
const SEAT={x:-.35,hy:.375,hz:-.17,cushion:.345,floor:.15,back:28,liner:.055,head:38,
 bz0:-.40,bDeg:17,cushFz:.05,cushFy:.455}; // real Z seat: back face from (z-.40,y.345) at 17deg, cushion pan rises to (z.05,y.455)
const WHEEL={x:-.365,y:.83,z:.06,r:.155}; // real Z steering rim (slice of world.html GLB): centre, radius; grips at 9 and 3
const CARGO={floor:.79,z0:-.92,z1:-1.80,hw:.55,lipZ:-1.62,lipY:.96}; // real Z hatch cargo floor + rear lip
const CAR={x:0,z:0,on:false};
const WIN={belt:.89,top:1.17,slope:1.7,z0:.62,z1:-.50,x0:.70,x1:.80}; // real Z side window opening (passenger door card + glass stay in place)
const WING={x0:.95,x1:2.0,y0:.44,y1:.60,z0:-.10,z1:.85}; // real Z passenger wing door when raised: thin slab out the side
const HATCH_HINGE=-.90; // with the hatch up there is no roof aft of this

/* ---------- shared skeleton: bone lengths as fractions of height (standard anthropometry) ---------- */
const B={leg:.530*H,thigh:.245*H,shin:.247*H,ankle:.038*H,foot:.15*H,spine:.17*H,chest:.115*H,neck:.045*H,head:.14*H,uarm:.186*H,farm:.146*H,hand:.09*H};
/* ragdoll-ready skeleton data: parent hierarchy, segment mass fractions (Dempster/Winter), joint limits (deg).
   fk() applies LIMITS to every pose, so physics/ragdoll can later drive the same joints with the same constraints. */
const SKEL=[{j:'pel',p:null,m:.142},{j:'waist',p:'pel',m:.139},{j:'chest',p:'waist',m:.216},{j:'neck',p:'chest',m:.012},{j:'head',p:'neck',m:.069},
 ...['L','R'].flatMap(k=>[{j:'hip'+k,p:'pel',m:0},{j:'knee'+k,p:'hip'+k,m:.100},{j:'ank'+k,p:'knee'+k,m:.0465},{j:'toe'+k,p:'ank'+k,m:.0145},
  {j:'sh'+k,p:'chest',m:0},{j:'el'+k,p:'sh'+k,m:.028},{j:'wr'+k,p:'el'+k,m:.016},{j:'hand'+k,p:'wr'+k,m:.006}])];
const LIMITS={hip:[-35,125],knee:[0,150],ank:[-30,45],sh:[-60,180],el:[0,150],lean:[-40,50],head:[-40,40],twist:[-50,50],roll:[-20,20],ao:[-30,90]};
function limit(p){const q=Object.assign({},p),c=(k,L)=>{if(q[k]!=null)q[k]=clamp(q[k],L[0],L[1]);};
 for(const k of['L','R']){c('hip'+k,LIMITS.hip);c('knee'+k,LIMITS.knee);c('ank'+k,LIMITS.ank);c('sh'+k,LIMITS.sh);c('el'+k,LIMITS.el);c('ao'+k,LIMITS.ao);}
 c('lean',LIMITS.lean);c('head',LIMITS.head);c('twist',LIMITS.twist);c('roll',LIMITS.roll);return q;}
const SH={male:{sh:.130*H,hip:.088*H,waist:.085*H,chest:.115,torsoD:.24,limb:1,neckW:.06},
          female:{sh:.114*H,hip:.098*H,waist:.072*H,chest:.10,torsoD:.21,limb:.86,neckW:.05}};
/* pose = {px,py,pz,yaw, lean(+fwd), hipL,hipR (+fwd), kneeL,kneeR (flex), shL,shR (+fwd), elL,elR (flex), armOut, legOut, head} angles deg */
const R=Math.PI/180;
function fk(p,shape){p=limit(p);const cy=Math.cos(p.yaw*R),sy=Math.sin(p.yaw*R);
 const W=(lx,ly,lz)=>[p.px+lx*cy+lz*sy,p.py+ly,p.pz-lx*sy+lz*cy]; // local: x right of body, z body-forward
 const J={};const pel=[0,0,0];
 const rl=(p.roll||0)*R,up=[Math.sin(rl),Math.cos(p.lean*R)*Math.cos(rl),Math.sin(p.lean*R)];pel[0]=p.sway||0;J.pel=W(...pel);const add=(a,d,l)=>[a[0]+d[0]*l,a[1]+d[1]*l,a[2]+d[2]*l];
 const waist=add(pel,up,B.spine*.5),chest=add(pel,up,B.spine),nk=add(chest,up,B.chest),hd=add(nk,[0,Math.cos((p.lean+p.head)*R),Math.sin((p.lean+p.head)*R)],B.neck);
 const top=add(hd,[0,Math.cos((p.lean+p.head)*R),Math.sin((p.lean+p.head)*R)],B.head);
 J.waist=W(...waist);J.chest=W(...chest);J.neck=W(...nk);J.head=W(...add(hd,[0,Math.cos((p.lean+p.head)*R),Math.sin((p.lean+p.head)*R)],B.head*.5));J.top=W(...top);J.chin=W(...hd);
 for(const s of[-1,1]){const k=s<0?'L':'R';
  const hip=[pel[0]+s*.09*H*.5*1.1,-.02+s*Math.sin(rl)*.05,0];const ha=p['hip'+k]*R,ka=(p['hip'+k]-p['knee'+k])*R,lo=(p.legOut||0)*R*s;
  const kn=[hip[0]+Math.sin(lo)*B.thigh,hip[1]-Math.cos(ha)*B.thigh*Math.cos(lo),hip[2]+Math.sin(ha)*B.thigh];
  const an=[kn[0]+Math.sin(lo)*B.shin*.6,kn[1]-Math.cos(ka)*B.shin,kn[2]+Math.sin(ka)*B.shin];
  const fa=ka+(90-(p['ank'+k]||0))*R;const toe=[an[0],an[1]-Math.cos(fa)*B.foot,an[2]+Math.sin(fa)*B.foot];
  J['hip'+k]=W(...hip);J['knee'+k]=W(...kn);J['ank'+k]=W(...an);J['toe'+k]=W(...toe);
  const shp=add(nk,[s*shape.sh,0,0],1);shp[1]-=.035;if(p.grip&&p.grip.includes(k))gripIK(p,k,s,shp);let sa=(p['sh'+k]+0)*R,ea=(p['sh'+k]+p['el'+k])*R,ao=((p['ao'+k]??p.armOut??0)+6)*R*s;
  const lean=p.lean*R;const rot=(v)=>v; // arms hang in world-down frame
  const el=[shp[0]+Math.sin(ao)*B.uarm,shp[1]-Math.cos(sa)*B.uarm*Math.cos(ao),shp[2]+Math.sin(sa)*B.uarm];
  const wr=[el[0]+Math.sin(ao)*B.farm*.5,el[1]-Math.cos(ea)*B.farm,el[2]+Math.sin(ea)*B.farm];
  const hn=[wr[0],wr[1]-Math.cos(ea)*B.hand*.8,wr[2]+Math.sin(ea)*B.hand*.8];
  const tw=(p.twist||0)*R,ct=Math.cos(tw),st=Math.sin(tw),T=v=>[nk[0]+(v[0]-nk[0])*ct+(v[2]-nk[2])*st,v[1],nk[2]-(v[0]-nk[0])*st+(v[2]-nk[2])*ct];
  J['sh'+k]=W(...T(shp));J['el'+k]=W(...T(el));J['wr'+k]=W(...T(wr));J['hand'+k]=W(...T(hn));
  J['wst'+k]=W(...add(waist,[s*shape.waist,0,0],1));J['hp'+k]=W(...[pel[0]+s*shape.hip,-.01,0]);}
 return J;}

/* wheel grip IK: solve shoulder/elbow/arm-out so the wrist sits just behind the real rim at 9 (L) / 3 (R) o'clock.
   Same joint chain + limits as fk, so physics can drive it later. Local frame: x right, y up, z body-forward (yaw 0). */
function gripIK(p,k,s,shp){const tx=WHEEL.x+s*(WHEEL.r-.012)-p.px,ty=WHEEL.y+.002-p.py,tz=WHEEL.z-.045-p.pz,a=B.uarm,b=B.farm;
 const dx=tx-shp[0],ao=Math.asin(clamp(dx/(a+.5*b),-.5,.5));p['ao'+k]=clamp(ao/R*s-6,LIMITS.ao[0],LIMITS.ao[1]);const ca=Math.cos(ao);
 let dy=ty-shp[1],dz=tz-shp[2];for(let it=0;it<3;it++){const d=Math.min(Math.hypot(dy,dz),a+b-.002),ph=Math.atan2(dz,-dy),al=Math.acos(clamp((a*a+d*d-b*b)/(2*a*d),-1,1)),bd=Math.PI-Math.acos(clamp((a*a+b*b-d*d)/(2*a*b),-1,1));
  const sa=ph-al,ea=sa+bd,ey=-Math.cos(sa)*a*ca-Math.cos(ea)*b,ez=Math.sin(sa)*a-0+Math.sin(ea)*b;p['sh'+k]=sa/R;p['el'+k]=bd/R;
  dy+= (ty-shp[1])-ey;dz+=(tz-shp[2])-ez;}}
/* ---------- animations (shared by both bodies) ---------- */
const P0={px:0,py:B.leg,pz:0,yaw:0,lean:0,head:0,hipL:0,hipR:0,kneeL:0,kneeR:0,ankL:0,ankR:0,shL:0,shR:0,elL:8,elR:8,armOut:0,legOut:0};
function mix(a,b,t){const o={};for(const k in a)o[k]=lerp(a[k],b[k]??a[k],t);return o;}
function legH(p){// pelvis height so lowest foot touches ground (inverse of fk vertical chain)
 const h=k=>Math.cos(p['hip'+k]*R)*B.thigh+Math.cos((p['hip'+k]-p['knee'+k])*R)*B.shin+B.ankle;return Math.max(h('L'),h('R'))+.02;}
function gait(t,run){const s=Math.sin(t*Math.PI*2),c=Math.cos(t*Math.PI*2),A=run?42:26;const p=Object.assign({},P0);
 p.hipL=A*s;p.hipR=-A*s;p.kneeL=(run?70:38)*Math.max(0,-c)+ (run?20:6);p.kneeR=(run?70:38)*Math.max(0,c)+(run?20:6);
 p.shL=-(run?55:24)*s;p.shR=(run?55:24)*s;p.elL=p.elR=run?85:18;p.lean=run?12:3;p.head=run?-6:-2;
 // foot pitch over each leg's cycle (+ = toe up): heel strike -> flat -> push-off -> swing
 const fp=ph=>{const u=((ph-.25)%1+1)%1,T=run?[18,0,-45,-8]:[15,0,-35,-5];if(u<.12)return lerp(T[0],T[1],ease(u/.12));if(u<.36)return T[1];if(u<.5)return lerp(T[1],T[2],ease((u-.36)/.14));if(u<.75)return lerp(T[2],T[3],ease((u-.5)/.25));return lerp(T[3],T[0],ease((u-.75)/.25));};
 for(const[k,ph]of[['L',t],['R',t+.5]]){const ka=p['hip'+k]-p['knee'+k];p['ank'+k]=ka-fp(ph);}
 p.sway=(run?.012:.022)*Math.sin(t*Math.PI*2);p.roll=(run?3:5)*Math.sin(t*Math.PI*2);p.twist=-(run?10:6)*s;
 p.py=B.leg;const J=fk(p,SH.female);p.py-=Math.min(J.toeL[1],J.toeR[1],J.ankL[1]-B.ankle*.7,J.ankR[1]-B.ankle*.7);return p;}
function idle(t){const p=Object.assign({},P0),b=Math.sin(t*Math.PI*2);p.lean=1+b*.8;p.shL=2+b*2;p.shR=2-b*2;p.elL=p.elR=10;p.hipL=3;p.hipR=-2;p.kneeL=5;p.kneeR=2;p.head=Math.sin(t*Math.PI*4)*1.5;p.py=legH(p)-.02+b*.004;return p;}
// seated: world-space pelvis = SEAT H-point, torso reclined SEAT.back, hips flexed, knees bent, feet on pedals
function sitPose(t){const p=Object.assign({},P0);p.px=CAR.x+SEAT.x;p.pz=CAR.z+SEAT.hz;p.py=SEAT.hy;p.yaw=0;p.lean=-SEAT.back;
 p.hipL=p.hipR=120;p.kneeL=p.kneeR=100;p.ankL=p.ankR=0;p.legOut=4; // hips forward, knees up off the real cushion pan, heels on the floor
 if(seatHands==='lap'){p.shL=p.shR=18;p.elL=p.elR=62;p.armOut=10;}else{p.grip='LR';}
 p.head=SEAT.head+Math.sin((t||0)*Math.PI*2)*1.2;p.roll=Math.sin((t||0)*Math.PI*2)*.8;return p;}
let seatHands='wheel';
/* seated emotes: upper body only, hips stay on the cushion, arms kept inside the cabin (checked in fitCheck) */
function sitWave(t){const p=sitPose(t);const w=Math.sin(t*Math.PI*2*3);p.grip=seatHands==='lap'?null:'L';p.shR=72;p.aoR=4;p.elR=88+w*22;p.head=SEAT.head-2;p.twist=-2;p.roll=2;return p;}
function sitDance(t){const b=t*8,k=Math.floor(b),f=b-k,hit=Math.sin(Math.PI*f),s=k%2?1:-1,p=sitPose(t);
 // hands stay on the real wheel; on the 'up' beats one hand pops off for a fist pump between the wheel and the headliner
 const up=(k%4===2||k%4===3),free=up?(s<0?'L':'R'):null;p.grip=seatHands==='lap'?null:(free?(free==='L'?'R':'L'):'LR');
 if(free){p['sh'+free]=62+hit*6;p['el'+free]=112;p['ao'+free]=-14;}
 p.twist=free?s*4*ease(Math.min(1,f*3)):0;p.roll=s*2;p.head=SEAT.head-hit*4;p.lean=-SEAT.back+hit*1.5;return p;}
/* get in (t 0..1): walk up outside the open left door -> face rear-quarter, duck + sit onto sill -> swing in -> settle. Get out = reverse. */
const GI=[ // [t, pose builder]  low-coupe technique: back to the seat, bottom in first, head ducks in last
 [0,  ()=>Object.assign(gait(0,false),{px:CAR.x-1.3,pz:CAR.z+.9,yaw:180})],
 [.18,()=>Object.assign(gait(.5,false),{px:CAR.x-1.2,pz:CAR.z-.15,yaw:200})],
 [.32,()=>{const p=idle(0);return Object.assign(p,{px:CAR.x-1.15,pz:CAR.z+SEAT.hz,yaw:270})}], // back to the seat, outside the sill
 [.52,()=>Object.assign({},P0,{px:CAR.x-.80,pz:CAR.z+SEAT.hz,py:.52,yaw:270,lean:52,head:-30,hipL:85,hipR:85,kneeL:95,kneeR:95,shL:40,shR:40,elL:30,elR:30,armOut:8})], // sit onto seat edge, head stays outside
 [.70,()=>Object.assign(sitPose(0),{px:CAR.x-.55,py:.41,yaw:320,lean:46,head:-40,hipL:90,hipR:80,kneeL:70,kneeR:95,legOut:10})], // duck + swing in
 [.86,()=>Object.assign(sitPose(0),{px:CAR.x+SEAT.x-.04,py:SEAT.hy+.01,lean:-SEAT.back+24,head:-32})], // settle in, head still ducked under the header
 [1,  ()=>sitPose(0)]];
function getIn(t){let i=0;while(i<GI.length-2&&t>GI[i+1][0])i++;const a=GI[i],b=GI[i+1],u=ease(clamp((t-a[0])/(b[0]-a[0]),0,1));
 const pa=a[1](),pb=b[1]();let dy=pb.yaw-pa.yaw;if(dy>180)dy-=360;if(dy<-180)dy+=360;const p=mix(pa,pb,u);p.yaw=pa.yaw+dy*u;return p;}
function dance(t){const b=t*8,k=Math.floor(b),f=b-k,e=f<.35?ease(f/.35):1,hit=Math.sin(Math.PI*f),p=idle(0),s=k%2?1:-1,ps=k%2?-1:1;
 const K=[ // 8-count: sway, sway, arm wave, arm wave, spin-pose, hit, body roll, pose
  {sway:.06,roll:8,twist:15,shL:40,shR:-10,aoL:30,aoR:10,elL:90,elR:20,head:-5},{sway:-.06,roll:-8,twist:-15,shR:40,shL:-10,aoR:30,aoL:10,elR:90,elL:20,head:5},
  {sway:.04,roll:6,shL:170,aoL:20,elL:20,shR:20,elR:60,twist:10},{sway:-.04,roll:-6,shR:170,aoR:20,elR:20,shL:20,elL:60,twist:-10},
  {twist:40,shL:90,aoL:70,elL:10,shR:90,aoR:70,elR:10,hipL:20,kneeL:35,head:-10},{lean:10,shL:60,shR:60,aoL:40,aoR:40,elL:110,elR:110,kneeL:25,kneeR:25,head:12},
  {lean:-8,roll:10,sway:.07,shL:120,shR:120,aoL:30,aoR:30,elL:70,elR:70},{shL:175,aoL:15,elL:5,shR:-20,aoR:35,elR:10,roll:-10,sway:-.05,hipR:15,kneeR:25,head:-8}];
 const a=Object.assign({},p,K[(k+7)%8]),c=Object.assign({},p,K[k%8]);const q=mix(Object.assign({sway:0,roll:0,twist:0,aoL:0,aoR:0},a),Object.assign({sway:0,roll:0,twist:0,aoL:0,aoR:0},c),e);
 q.kneeL+=8*hit;q.kneeR+=8*hit;q.py=legH(q)-.02-.03*hit;return q;}
const ANIMS={idle:{len:3.2,f:t=>idle(t),car:0},walk:{len:1.1,f:t=>Object.assign(gait(t,false),{pz:0}),car:0},run:{len:.68,f:t=>gait(t,true),car:0},
 sit:{len:4,f:t=>sitPose(t),car:1},getin:{len:3.4,f:t=>getIn(t),car:1,once:1},getout:{len:3.4,f:t=>getIn(1-t),car:1,once:1},dance:{len:4.2,f:t=>dance(t),car:0},sitwave:{len:2.4,f:t=>sitWave(t),car:1},sitdance:{len:4.2,f:t=>sitDance(t),car:1}};

/* ===================== NEONPET phase 1 =====================
   Same split as the character: RIG (data) -> CLIPS (pose logic) -> petFk (joints, metres, car/world axes) -> renderer.
   A future detailed or skinned pet only needs a new renderer that reads the same joint names. Saved to 'zdash.pet.v1'. */
const PETKEY='zdash.pet.v1';
const PET_RIG={ // dims in metres: len shoulder-hip, leg, head radius, body radius, ear, tail
 fox:   {n:'FOX',len:.26,leg:.16,head:.088,body:.068,ear:'point',earL:.075,tail:'brush',tailL:.26,tailR:.042,snout:.05},
 cat:   {n:'CAT',len:.22,leg:.14,head:.084,body:.058,ear:'point',earL:.05,tail:'up',tailL:.26,tailR:.02,snout:.02},
 dragon:{n:'DRAGON PUP',len:.25,leg:.13,head:.092,body:.072,ear:'horn',earL:.06,tail:'taper',tailL:.28,tailR:.03,snout:.045,wings:1},
 robo:  {n:'ROBO-DOG',len:.26,leg:.15,head:.088,body:.07,ear:'antenna',earL:.08,tail:'stub',tailL:.07,tailR:.026,snout:.04}};
const PET_COLORS=OUTFITS;
const PDEF={v:1,type:'fox',glow:'#ffb020',spot:'hatch'}; // spot: 'hatch' (default ride spot, Bob) | 'seat'
function pload(){try{const o=JSON.parse(localStorage.getItem(PETKEY)||'null');if(o&&o.v===1&&PET_RIG[o.type])return Object.assign({},PDEF,o,{glow:PET_COLORS.includes(o.glow)?o.glow:PDEF.glow});}catch(e){}return Object.assign({},PDEF);}
let PC=pload();function psave(){PC.updated=Date.now();try{localStorage.setItem(PETKEY,JSON.stringify(PC));}catch(e){}}
const PP0={tailCurl:0,earFold:0,tailDown:0,fold:0,pitch:0,x:.55,y:0,z:.2,yaw:-30,ph:0,amp:0,sit:0,bob:0,tuck:0,wag:0,tilt:0,look:0,pawUp:0,flap:0};
const pp=o=>Object.assign({},PP0,o);
const SEATP={x:.37,y:.415,z:-.10}; // real Z passenger cushion pan (y .38 at z -.25) // passenger cushion, mirror of the driver seat
function bez(a,c,b,u){return a.map((v,i)=>(1-u)*(1-u)*v+2*u*(1-u)*c[i]+u*u*b[i]);}
let fitSpot=null;const spotName=()=>fitSpot||(PC.spot==='seat'?'seat':'hatch'),SPOT=()=>spotName()==='seat'?SEATP:HATCHP;
function hopRear(t,type){type=type||'fox';const land=pp({x:0,y:0,z:HATCHP.z,yaw:0});land.y=CARGO.floor+.006-petLow(land,type);
 const A=[0,petLow(pp({}),type)*-1,-2.75],Cc=[0,1.78,-2.3],Bp=[land.x,land.y,land.z]; /* hatch mode: jumps in over the bumper through the open hatch */
 if(t<.08)return pp({x:A[0],y:A[1],z:A[2],yaw:0,wag:Math.sin(t*60)*.6,look:10});
 if(t<.4){const u=ease((t-.08)/.32),q=bez(A,Cc,Bp,u);return pp({x:q[0],y:q[1],z:q[2],yaw:0,tuck:Math.sin(Math.PI*u),tilt:-10*Math.sin(Math.PI*u),earFold:clamp((u-.5)/.2,0,1)});}
 const u=ease(clamp((t-.4)/.15,0,1)),T=trunkQ(type),o={};for(const k in land)o[k]=lerp(land[k],T[k]??land[k],u);o.yaw=lerp(0,90,u);return o;}
function hopIn(t,type){if(spotName()==='hatch')return hopRear(t,type); // goes in first through the open driver door, over the driver seat, onto the passenger seat
 const A=[-1.2,0,-.05],Cc=[-1.0,1.35,-.05],Bp=[SEATP.x,SEATP.y,SEATP.z]; // arc stays under the real door-opening header
 if(t<.08)return pp({x:A[0]-.05,z:A[2]+.15,yaw:150+t*400,wag:Math.sin(t*60)*.6,look:10});
 if(t<.32){const u=ease((t-.08)/.24),q=bez(A,Cc,Bp,u);return pp({x:q[0],y:q[1],z:q[2],yaw:lerp(-140,-270,u)+360,tuck:Math.sin(Math.PI*u),bob:0,tilt:-10*Math.sin(Math.PI*u)});}
 const u=ease(clamp((t-.32)/.25,0,1));return pp({x:SEATP.x,y:SEATP.y,z:SEATP.z,yaw:lerp(90,0,u),sit:u,bob:t<.38?-.02*Math.sin((t-.32)/.06*Math.PI):0,wag:Math.sin(t*40)*.5});}
const PET_CLIPS={
 idle:  {len:3.2,f:t=>pp({bob:.004*Math.sin(t*Math.PI*2),wag:.35*Math.sin(t*Math.PI*4),look:20*Math.sin(t*Math.PI*2)})},
 sit:   {len:3.2,f:t=>pp({sit:1,wag:.3*Math.sin(t*Math.PI*4),tilt:8*Math.sin(t*Math.PI*2)})},
 follow:{len:1.1,f:t=>pp({x:.5,z:-.1,yaw:0,ph:t*2,amp:.8,bob:.01*Math.abs(Math.sin(t*Math.PI*4)),wag:.5*Math.sin(t*Math.PI*4)})},
 trot:  {len:.68,f:t=>pp({x:.5,z:-.25,yaw:0,ph:t*2,amp:1.25,bob:.03*Math.abs(Math.sin(t*Math.PI*4)),tuck:.25,wag:.3*Math.sin(t*Math.PI*8)})},
 dance: {len:4.2,f:t=>{const b=t*8,k=Math.floor(b),f=b-k,h=Math.sin(Math.PI*f),s=k%2?1:-1,up=k%8>=4&&k%8<=6; // same 8-count as her dance
   return pp({x:.6,z:.3,yaw:-30+s*22,bob:.055*h,tuck:.4*h,sit:up?.7:0,pawUp:up?1:0,tilt:s*14,wag:s*.9,flap:h});}},
 hopin: {len:3.4,f:(t,type)=>hopIn(t,type),car:1,once:1},
 hopout:{len:3.4,f:(t,type)=>{const r=1-t,q=hopIn(r,type);if(spotName()==='hatch'){if(r>=.08&&r<.4)q.yaw+=180*ease(clamp((.4-r)/.14,0,1));}else if(r>=.08&&r<.32)q.yaw+=180;return q;},car:1,once:1},
 ride:  {len:4,f:(t,type)=>spotName()==='hatch'?trunkQ(type,{bob:.003*Math.sin(t*Math.PI*6),look:35*Math.sin(t*Math.PI*2),wag:.3*Math.sin(t*Math.PI*4)}):pp({x:SPOT().x,y:SPOT().y,z:SPOT().z,yaw:0,sit:1,bob:.004*Math.sin(t*Math.PI*6),look:35*Math.sin(t*Math.PI*2),wag:.3*Math.sin(t*Math.PI*4)}),car:1},
 ridedance:{len:4.2,f:(t,type)=>{const b=t*8,k=Math.floor(b),f=b-k,h=Math.sin(Math.PI*f),s=k%2?1:-1;if(spotName()==='hatch')return trunkQ(type,{bob:.004*h,tilt:s*10,look:s*20,pawUp:k%4>=2?.4:0,wag:s*.8,flap:h});return pp({x:SPOT().x,y:SPOT().y,z:SPOT().z,yaw:0,sit:1,bob:.02*h,tilt:s*14,pawUp:k%4>=2?1:0,wag:s*.8,flap:h});},car:1},
 flyride:{len:2,f:(t,type)=>flyQ(t,type),car:1}};
/* TAKEOFF (for when flying starts): passenger door pops, pet is flung out, hangs on the door-frame top by its front paws
   ~1 s flapping in the wind, scrambles back in, squeezes between the seats into the back hatch spot, door shuts. */
const HATCHP={x:-.02,y:CARGO.floor,z:-1.12}; // real Z cargo floor, centred, well back of the seat backs (y is per-pet, see trunkQ)
const TK={door:t=>t<.12?0:t<.18?ease((t-.12)/.06):t<.8?1:t<.93?1-ease((t-.8)/.13):0};
const petLow=(q,type)=>{const J=petFk(q,type);let m=9;for(const[a,b,r]of petParts(type))m=Math.min(m,J[a][1]-r,J[b][1]-r);return m;};
const _tq={},_fq={};
/* trunk ride: lying down (legs tucked, chin low) on the real cargo floor, under the closed hatch glass */
function trunkQ(type,o){type=type||'fox';if(!_tq[type]){const q=pp({x:HATCHP.x,y:0,z:HATCHP.z,yaw:90,tuck:1,pitch:-6,tailDown:.6}); /* lies across the cargo floor, side-on to the chase cam */q.y=CARGO.floor+.006-petLow(q,type);_tq[type]=q;}return Object.assign({},_tq[type],o||{});}
/* flying ride (hatch open): stands up tall at the open hatch, facing back out of the car, a front paw on the rear lip, ears/tail in the wind */
function flyBase(type){if(_fq[type])return _fq[type];let best=null;
 for(let pi=0;pi<=40;pi+=4)for(let z=-1.30;z>=-1.48;z-=.02){const q=pp({x:0,y:0,z,yaw:180,pitch:pi,pawUp:.8});const J=petFk(q,type);
  q.y=CARGO.floor+.006-petLow(q,type);const J2=petFk(q,type);
  const pw=J2.pawFL,e=Math.hypot(pw[2]-(CARGO.lipZ+.035),pw[1]-(CARGO.lipY+.03));if(!best||e<best[0])best=[e,q];}
 return _fq[type]=best[1];}
function flyQ(t,type){type=type||'fox';const q=Object.assign({},flyBase(type)),w=Math.sin(t*Math.PI*2*5);q.tilt=6*w;q.wag=.9*Math.sin(t*Math.PI*2*3);q.look=12*Math.sin(t*Math.PI*2*.5);q.flap=.6+.4*w;q.ph=0;return q;}
/* in Neon World: hatch = hatch-open fraction (0..1). Pet stays lying until the hatch is well open, and is back down before it shuts. */
const flyMix=h=>ease(clamp((h-.55)/.35,0,1));
function rideFor(t,type,hatch){const a=PET_CLIPS.ride.f(t,type),u=flyMix(hatch||0);if(u<=0)return a;const b=flyQ(t,type),o={};for(const k in a)o[k]=lerp(a[k],b[k]??a[k],u);o.yaw=lerp(90,180,u);return o;}
/* TAKEOFF hang: the real Z doors swing UP like wings, so the raised passenger door's lower edge ends up roughly level (y~.55)
   sticking out sideways from the A-pillar. The pet is flung out, grabs that edge ~.3 m out from the body and dangles. */
const DOORLIP={x:1.15,y:.548,z:.865}; // just behind the raised door's lower edge (edge plane X~.72-.80)
function tkHang(t,type){const fl=Math.sin(t*90),q=pp({x:0,y:0,z:0,yaw:180,pitch:72,pawUp:1,ph:t*14,amp:1.3,wag:fl*1.2,tilt:fl*10,flap:.5+.5*Math.sin(t*120),look:0});
 const J=petFk(q,type),pw=[(J.pawFL[0]+J.pawFR[0])/2,(J.pawFL[1]+J.pawFR[1])/2,(J.pawFL[2]+J.pawFR[2])/2];
 q.x=DOORLIP.x-pw[0]+Math.sin(t*50)*.01;q.y=DOORLIP.y-pw[1];q.z=DOORLIP.z-pw[2];return q;} // front paws hooked over the raised door's lower edge
/* hop-in to the hatch: land on the passenger seat (same flight as before), then the same seat->console->gap->bulkhead->trunk path TAKEOFF uses */
function hopHatch(t){const land=(()=>{fitSpot=fitSpot;const o=pp({x:SEATP.x,y:SEATP.y,z:SEATP.z,yaw:90});return o;})();
 if(t<.36){const u=ease((t-.32)/.04);const o=pp({x:SEATP.x,y:SEATP.y,z:SEATP.z,yaw:90,tuck:.4*u});o.bob=-.02*Math.sin(u*Math.PI);return o;}
 const S1=pp({x:SEATP.x,y:SEATP.y,z:SEATP.z,yaw:-120,tuck:.4});
 if(t<.42){const u=ease((t-.36)/.06),o={};for(const k in land)o[k]=lerp(land[k],S1[k],u);o.yaw=lerp(90,-120,u);return o;}
 return takeoff(.76+.24*clamp((t-.42)/.58,0,1),'fox',1);}
function fling(F,u,t,type){const mixq=(a,b,v)=>{const o={};for(const k in a)o[k]=lerp(a[k],b[k]??a[k],v);return o;};
 /* real Z with the passenger door swung up: the door card + belt stay, so she flings the pet out over the belt line through the window opening, across the top of the raised door, round its front edge */
 const D1=pp({x:.38,y:.66,z:-.12,yaw:90,tuck:.6}),D1b=pp({x:.73,y:.977,z:-.05,yaw:90,tuck:1,wag:0,fold:1,tailDown:1}),D2=pp({x:1.1,y:.86,z:.5,yaw:120,tuck:.4}),D3=pp({x:1.15,y:.8,z:1.02,yaw:180,tuck:.3,pitch:40}),H=tkHang(t,type);let o;
 const seg=[[F,D1,.05],[D1,D1b,.03],[D1b,D2,.03],[D2,D3,.02],[D3,H,0]],n=seg.length,k=Math.min(n-1,Math.floor(u*n)),v=ease(u*n-k);
 o=mixq(seg[k][0],seg[k][1],v);o.y+=seg[k][2]*Math.sin(Math.PI*v);return o;}
function takeoff(t,type,noStart){type=type||'fox';const ride=PET_CLIPS.ride.f(0,type),hat=trunkQ(type);
 const mixq=(a,b,u)=>{const o={};for(const k in a)o[k]=lerp(a[k],b[k]??a[k],u);return o;};
 const B0=pp({x:0,y:CARGO.floor+.005,z:-1.02,yaw:0,tuck:.3,earFold:1}),G=pp({x:.04,y:.53,z:-.45,yaw:0,tuck:.75,fold:1}),
  S1=pp({x:.30,y:SEATP.y+.022,z:SEATP.z-.04,yaw:-100,tuck:.4,tailCurl:1}),S2=pp({x:.30,y:SEATP.y+.022,z:SEATP.z-.04,yaw:-90,tuck:.3}),
  O1=pp({x:.97,y:.16,z:.3,yaw:-160,tuck:.3,pitch:10}),G0=pp({x:.0,y:.57,z:-.28,yaw:-180,tuck:.3,fold:1}),
  G1=pp({x:.0,y:.51,z:-.58,yaw:-180,tuck:.3,fold:1,tailDown:1}),B1=pp({x:0,y:CARGO.floor+.005,z:-1.02,yaw:-180,tuck:.3}),H0=Object.assign({},hat,{yaw:-180});
 const arc=(a,b,u,h)=>{const o=mixq(a,b,ease(u));o.y+=h*Math.sin(Math.PI*u);return o;};
 if(!noStart&&spotName()==='hatch'&&t<.28){
  if(t<.06)return ride;
  if(t<.12)return arc(ride,B0,(t-.06)/.06,.02);                         // get up, trot forward to the bulkhead edge
  if(t<.18){const Bq=pp({x:0,y:.848,z:-.9,yaw:0,tuck:.85,tailDown:.3,earFold:1});return t<.15?arc(B0,Bq,(t-.12)/.03,.02):arc(Bq,G,(t-.15)/.03,.02);}                 // hop down between the seat backs onto the console
  return fling(G,(t-.18)/.1,t,type);} // flung out the open passenger door
 if(t<.08)return ride;
 if(t<.28)return fling(ride,(t-.08)/.2,t,type);
 if(t<.6)return tkHang(t,type);                                          // dangling from the raised door ~0.9 s
 if(t<.76){const u=1-ease((t-.6)/.16),o=fling(S1,u,.6,type);o.yaw=(o.yaw||0)+180*clamp((u-.58)/.1,0,1)*clamp((1-u)/.05,0,1);o.y-=.03*Math.max(0,1-Math.abs(u-.4)/.12);if(u<.3)o.yaw=lerp(S1.yaw+360,90,u/.3);o.tailCurl=clamp(Math.min((u+.1)/.1,(.6-u)/.1),0,1);o.tailDown=clamp(Math.min((u-.05)/.08,(.68-u)/.08),0,1);return o;} // climbs back the way it went: up onto the raised door, back in over the belt line, onto the passenger seat
 if(t<.8)return mixq(S1,S2,ease((t-.76)/.04));                           // turn round on the seat
 if(t<.85)return arc(S2,G0,(t-.8)/.05,.04);                              // onto the console
 if(t<.9)return mixq(G0,G1,ease((t-.85)/.05));                           // back between the seat backs
 if(t<.95){const Bm=pp({x:0,y:.865,z:-.87,yaw:-180,tuck:.6,pitch:-10,tailDown:1,earFold:1});if(t<.925){const u=(t-.9)/.025,o=arc(G1,Bm,u,0);o.y=lerp(G1.y,Bm.y,Math.sin(Math.PI/2*Math.min(1,u*1.6)));return o;}return arc(Bm,B1,(t-.925)/.025,.02);} // up through the gap between the bulkhead lip and the roof, onto the cargo floor                               // hop up over the bulkhead onto the cargo floor
 const u=ease((t-.95)/.05),o=mixq(B1,H0,u);o.yaw=lerp(-180,-360,u);o.wag=Math.sin(t*40)*.4;return o;} // walk back and lie down, facing forward
PET_CLIPS.takeoff={len:2.8,f:(t,type)=>takeoff(t,type),car:1,once:1,door:TK.door};
const PET_AUTO={idle:'idle',walk:'follow',run:'trot',sit:'ride',getin:'hopin',getout:'hopout',dance:'dance',sitwave:'ride',sitdance:'ridedance'};
function petFk(q,type){const R0=PET_RIG[type],cy=Math.cos(q.yaw*R),sy=Math.sin(q.yaw*R),cpi=Math.cos((q.pitch||0)*R),spi=Math.sin((q.pitch||0)*R),pv=R0.leg;
 const W=v0=>{const dy=v0[1]-pv,dz=v0[2],v=[v0[0],pv+dy*cpi+dz*spi,-dy*spi+dz*cpi];return[q.x+v[0]*cy+v[2]*sy,q.y+v[1],q.z-v[0]*sy+v[2]*cy];},J={},L=R0.len,lg=R0.leg;
 const hy=lg*(1-.35*q.tuck)+q.bob,hipY=hy-q.sit*lg*.72,shY=hy+q.sit*lg*.12+q.pawUp*.03;
 const S=[0,shY,L/2-q.sit*.03],Hp=[0,hipY,-L/2+q.sit*.05];J.S=W(S);J.Hp=W(Hp);
 const lk=q.look*R,tl=q.tilt*R,hd=[Math.sin(lk)*.05,shY+.075+.02*q.sit,S[2]+Math.cos(lk)*.05];J.head=W(hd);
 const fw=[Math.sin(lk),0,Math.cos(lk)],sd=[Math.cos(lk),0,-Math.sin(lk)];J.fw=W([hd[0]+fw[0],hd[1],hd[2]+fw[2]]);
 J.snout=W([hd[0]+fw[0]*R0.head*.95,hd[1]-.022,hd[2]+fw[2]*R0.head*.95]);
 for(const s of[-1,1]){const k=s<0?'L':'R',ex=s*R0.head*.62*Math.cos(tl)-.0*s,ey=R0.head*.7+s*Math.sin(tl)*R0.head*.4;
  const base=[hd[0]+sd[0]*ex,hd[1]+ey,hd[2]+sd[2]*ex-.01];J['ear'+k]=W(base);
  const eL=R0.earL*(1-.65*(q.earFold||0)),tip=R0.ear==='antenna'?[base[0]+sd[0]*s*.005,base[1]+eL,base[2]-.01]:[base[0]+sd[0]*s*.018,base[1]+eL,base[2]-(R0.ear==='horn'?.035:.005)];J['earT'+k]=W(tip);
  J['eye'+k]=W([hd[0]+fw[0]*R0.head*.8+sd[0]*s*R0.head*.38,hd[1]+.012,hd[2]+fw[2]*R0.head*.8+sd[2]*s*R0.head*.38]);
  for(const[fr,top,off]of[['F',S,0],['B',Hp,.5]]){const ph=(q.ph+off+(s>0?.5:0))*Math.PI*2,sw=Math.sin(ph)*q.amp*.085,lift=Math.max(0,Math.cos(ph))*q.amp*.045;
   const tx=s*R0.body*.65;let foot=[tx,lift+lg*.5*q.tuck,top[2]+sw];
   if(fr==='B'&&q.sit>0){foot=[lerp(foot[0],s*R0.body*.9,q.sit),lerp(foot[1],0,q.sit),lerp(foot[2],top[2]+.09,q.sit)];}
   if(fr==='F'&&q.pawUp>0){foot=[lerp(foot[0],s*.035,q.pawUp),lerp(foot[1],top[1]-.04,q.pawUp),lerp(foot[2],top[2]+.08,q.pawUp)];}
   const t3=[tx,top[1]-.01,top[2]];const kn=[(t3[0]+foot[0])/2,(t3[1]+foot[1])/2,(t3[2]+foot[2])/2+(fr==='F'?-.012:.02)+(fr==='B'?q.sit*.06:0)];
   J['leg'+fr+k]=W(t3);J['knee'+fr+k]=W(kn);J['paw'+fr+k]=W(foot);}
  if(R0.wings){J['wing'+k]=W([s*.03,shY+.02,S[2]-.04]);J['wingT'+k]=W([s*(.13-.03*q.flap)*(1-.75*(q.fold||0)),shY+.09+.05*q.flap,S[2]-.1]);}}
 const w=q.wag,up=(R0.tail==='up'?1:R0.tail==='stub'?.6:.35)*(1-(q.tailDown||0));
 const t1=[w*.06,hipY+.05+up*.06,Hp[2]-.07],t2=[w*.13,hipY+.04+up*.17,Hp[2]-R0.tailL*(1-up*.4)];{const c=q.tailCurl||0;if(c){for(let i=0;i<3;i++)t2[i]=lerp(t2[i],t1[i]+(i===1?.03:i===2?-.03:0),c);}}J.tail0=W([0,hipY+.01,Hp[2]-.02]);J.tail1=W(t1);J.tail2=W(t2);
 return J;}
/* bounding radius per joint, used by the fit check (and later by physics) */
function petParts(type){const r=PET_RIG[type],P=[['S','Hp',r.body],['S','head',.03],['head','head',r.head],['head','snout',r.head*.45],['tail0','tail1',r.tailR],['tail1','tail2',r.tailR*(r.tail==='brush'?1.2:.6)]];
 for(const k of['L','R']){P.push(['ear'+k,'earT'+k,r.ear==='antenna'?.007:.018]);for(const f of['F','B']){P.push(['leg'+f+k,'knee'+f+k,.024]);P.push(['knee'+f+k,'paw'+f+k,.02]);}if(r.wings)P.push(['wing'+k,'wingT'+k,.02]);}return P;}

/* PET REACTIONS: NEONPET.react(name) -> true if accepted. Each is a short additive layer on top of the ride pose at its ride
   spot, weight ramps in 0.15 and out 0.2 of the clip so it always blends back to ride. Higher priority interrupts lower; each name
   has its own cooldown. 'takeoff' plays the full TAKEOFF clip (2.8 s, the door sequence). */
const sn=Math.sin,PI=Math.PI;
const REACT={
 nos:      {len:.9, pri:3,cd:1500,d:u=>({bob:.03*Math.abs(sn(u*PI*6)),pitch:-8,wag:sn(u*60)*1.2,tuck:.2})},
 speed:    {len:1.2,pri:1,cd:2500,d:u=>({pitch:-12,tuck:.12,wag:sn(u*80)*.3,look:-10})},
 jump:     {len:.7, pri:3,cd:800, d:u=>({bob:.07*sn(PI*u),tuck:.6*sn(PI*u),sit:-.5*sn(PI*u)})},
 land_soft:{len:.6, pri:2,cd:600, d:u=>({pitch:-6*sn(PI*u),tuck:.2*sn(PI*u),wag:sn(u*30)*.6})},
 land_hard:{len:1.0,pri:4,cd:1200,d:u=>({pitch:-12*sn(PI*Math.min(1,u*3)),tilt:12*sn(u*25)*(1-u),look:25*sn(u*12)*(1-u),tuck:.08*(1-u)})},
 drift_l:  {len:1.0,pri:2,cd:700, d:u=>({x:.05*sn(PI*u),tilt:15*sn(PI*u),yaw:25*sn(PI*u),wag:-.8*sn(PI*u)})},
 drift_r:  {len:1.0,pri:2,cd:700, d:u=>({x:-.05*sn(PI*u),tilt:-15*sn(PI*u),yaw:-25*sn(PI*u),wag:.8*sn(PI*u)})},
 crash:    {len:1.5,pri:5,cd:2000,d:u=>({yaw:360*ease(Math.min(1,u*1.6)),bob:.015*sn(Math.min(1,u*1.6)*PI),tilt:20*sn(u*30)*(1-u),tuck:.15*sn(PI*u)})},
 takeoff:  {len:2.8,pri:5,cd:3000,full:'takeoff'},
 idle:     {len:1.5,pri:0,cd:4000,d:u=>({look:40*sn(u*2*PI),tilt:10*sn(u*4*PI),wag:.4*sn(u*12)})},
 dance:    {len:1.5,pri:1,cd:1500,d:u=>({bob:.02*Math.abs(sn(u*PI*6)),tilt:14*Math.sign(sn(u*PI*6)),pawUp:sn(u*PI*3)>0?1:0,wag:sn(u*PI*6)*.8,flap:Math.abs(sn(u*PI*6))})}};
function reactPose(name,u,type){const r=REACT[name];if(r.full)return PET_CLIPS[r.full].f(u,type);const base=PET_CLIPS.ride.f(0,type),d=r.d(u);if(spotName()==='hatch'){if(d.bob)d.bob*=.4;delete d.tuck;if(d.pitch)d.pitch*=.5;delete d.pawUp;delete d.sit;d.earFold=.8;d.tailCurl=.6;}const w=Math.min(1,u/.15,(1-u)/.2);
 const o=Object.assign({},base);for(const k in d)o[k]=(o[k]||0)+d[k]*Math.max(0,w);if(d.tuck||d.pitch)o.y+=.025*Math.max(0,w); // brace pose rides up off the floor a touch so folded legs never sink in
 o.sit=clamp(o.sit,0,1);o.pawUp=clamp(o.pawUp,0,1);o.tuck=clamp(o.tuck,0,1);return o;}
let RS=null;const rLast={};
const NEONPET={REACT,reactPose,rideFor,flyMix,trunkQ,flyQ,react(name,now){const r=REACT[name];if(!r)return false;now=now??performance.now();if(rLast[name]!=null&&now-rLast[name]<r.cd)return false;
  if(RS&&now-RS.t0<RS.len*1000&&REACT[RS.name].pri>r.pri)return false;rLast[name]=now;RS={name,t0:now,len:r.len};return true;},
 get active(){return RS&&performance.now()-RS.t0<RS.len*1000?RS.name:null},reset(){RS=null;for(const k in rLast)delete rLast[k];}};
window.CREWDATA={
  KEY,PETKEY,GLOWS,PET_COLORS,HAIRS,DEF,PDEF,SKEL,LIMITS,B,SH,ANIMS,
  fk,sitPose,gripIK,PET_RIG,PET_CLIPS,petFk,petParts,rideFor,flyMix,trunkQ,flyQ,flyBase,
  REACT,reactPose,NEONPET,SEAT,WHEEL,CARGO,HATCHP,DOORLIP,TK,
  get char(){return C;},get pet(){return PC;},
  reload(){C=load();PC=pload();return {char:C,pet:PC};}
};
})();
