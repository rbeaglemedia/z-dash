'use strict';
// ===== PHYSICS: GROUND (split from shared/physics.js) =====
// Ground driving: surfaces via offRoadK() (grass / buildings / roads / runways), NOS + wings-out on the ground,
// e-brake drifting, particles, NOS tiers, wreck card. step() in world/phys-air.js calls groundStep() when P.ground.
// Per-surface feel. Road multipliers are all 1 so arcade / street / e-brake stay bit-identical there.
// Grass drag stays inside offRoadK() (dragMul 1) so it is not applied twice. Roof braking is 1.15x.
function surfaceFeel(kind){
  if(kind==='runway')return{d:0.85,a:1.06,g:1.08,b:1,rum:0};
  if(kind==='roof')return{d:0.95,a:1,g:1.12,b:1.15,rum:0};
  if(kind==='grass')return{d:1,a:1,g:0.78,b:1,rum:1};
  return{d:1,a:1,g:1,b:1,rum:0};
}
// Street Mode hard ceiling: 28 m/s, or 38.6 m/s only while NOS is actually burning under throttle.
function streetMaxV(T,nz,tu){return(T.streetMaxSpeed||28)*(nz&&tu?1.38:1);}
function streetCeil(T,nz,tu){if(P.driveMode!=='street'||P.wreck)return;const cap=streetMaxV(T,nz,tu);if(P.v>cap)P.v=cap;}
function streetThrottle(){return!!((typeof B!=='undefined'&&B.tup)||(typeof K!=='undefined'&&K.KeyE));}
// cityMove (half-pipe, loop, river banks) runs after groundStep and can add speed. Clamp again once it returns.
function armStreetCeil(){if(armStreetCeil.ok||typeof cityMove!=='function')return;armStreetCeil.ok=1;
  const orig=cityMove,wrapped=function(px,pz,py,dt){const r=orig(px,pz,py,dt);streetCeil(TUNE,!P.wreck&&!!P.nosBurn,streetThrottle());return r;};
  wrapped._street=1;cityMove=wrapped;
  if(typeof step==='function'&&!step._street){const origStep=step,wrappedStep=function(dt){const r=origStep(dt);if(P.ground||P.driveMode==='street')streetCeil(TUNE,!P.wreck&&!!P.nosBurn,streetThrottle());return r;};wrappedStep._street=1;step=wrappedStep;}}
function groundStep(dt,T,I,I0,nz,vT,vr,wf,ge,cbank,g,CL){
    let ebDone=false;
    const street=P.driveMode==='street';
    armStreetCeil();
    if(street&&!P.wreck)streetCeil(T,nz,!!I.tu);
    const kind=surfaceKindAt(P.x,P.z,P.y);P.surface=kind;const Sf=surfaceFeel(kind);
    if(P.wreck){P.wreck.t+=dt;P.v=Math.max(0,P.v-Math.max(T.wreckFric,P.v*1.2)*dt);if(P.v>2)fxBurst('spark',3);if(P.wreck.t<4)fxBurst('smoke',P.wreck.t<1.5?2:1);if(P.wreck.t>T.wreckCard&&!P.wreck.card){P.wreck.card=1;showWreck(true);}P.ebK=0;P.ebSlip=0;P.donutK=0;P.ebRoll=0;}
    else{const ofr=offRoadK();P.offK=ofr;
      if(I.eb||(P.ebK||0)>0.001||(P.donutK||0)>0.001||Math.abs(P.ebSlip||0)>0.002||Math.abs(P.ebRoll||0)>0.002){ebGround(dt,T,I,ofr,vT,nz);ebDone=true;}
      else if(street){const streetMax=T.streetMaxSpeed||28,thrCurve=I.tu?Math.pow(clamp(P.thr,0,1),1.35):0,vStreet=streetMax*(nz&&I.tu?1.38:thrCurve);
        const nosOn=!!(P.nosBurn||(I.nos&&(P.nosTank||0)>0));
        if(P.wings===0&&!I.tu&&!nosOn){const k=clamp(P.v/streetMax,0,1),decel=(4+1.6*k)*Sf.d;P.v=Math.max(0,P.v-decel*dt);}
        else if(I.tu&&vStreet>P.v){const accRate=(T.streetAccel||6.4)*ofr*Sf.a*(0.55+0.45*(1-clamp(P.v/streetMax,0,1)));P.v+=accRate*dt;}
        else{const coastDecel=(T.streetCoastDecel||4.6)+P.v*0.08+T.groundFric*(ofr<1?1+2*(1-ofr):1)*Sf.d;P.v=Math.max(0,P.v-coastDecel*dt);}
        if(I.brk&&!I.eb)P.v=Math.max(0,P.v-(T.streetBrake||15.5)*Sf.b*dt);
        P.v=Math.max(0,P.v-Math.sin(P.pitch)*T.gravityK*dt);}
      else P.v+=(vT-P.v)*(vT>P.v?T.groundAccel*ofr*Sf.a:T.momentum*Sf.d)*dt-Math.sin(P.pitch)*T.gravityK*dt-(I.brk?T.groundBrake*Sf.b*dt:0)-T.groundFric*(ofr<1?1+2*(1-ofr):1)*Sf.d*dt;
      if(!ebDone&&I.nos&&(P.nosTank||0)>0)P.v+=(street?9:8)*dt;
      if(!ebDone&&P.wings===1&&P.v<T.rotateSpeed&&!(kind==='runway'&&I.tu))P.v=Math.max(0,P.v-P.v*0.12*dt);}
    P.gT=(P.gT||0)+dt;
    if(!ebDone){const yM=Sf.g*(P.wings===1?0.85:1);
      if(street&&!P.wreck){const streetMax=T.streetMaxSpeed||28;P.v=clamp(P.v,0,streetMax*(nz&&I.tu?1.38:1));P.gam=0;const stScale=Math.min(1,P.v/2.6)*(1-0.28*clamp(P.v/streetMax,0,1));P.yaw+=I.lr*0.6*T.groundSteer*stScale*dt*yM;P.hd=P.yaw;if(P.ebRoll){P.ebRoll*=Math.max(0,1-10*dt);if(Math.abs(P.ebRoll)<1e-3)P.ebRoll=0;}}
      else{P.v=clamp(P.v,0,T.maxSpeed*T.nosBoost*1.1);P.gam=0;P.yaw+=I.lr*0.6*TUNE.groundSteer*dt*Math.min(1,P.v/5)*yM;P.hd=P.yaw;if(P.ebRoll){P.ebRoll*=Math.max(0,1-10*dt);if(Math.abs(P.ebRoll)<1e-3)P.ebRoll=0;}}}
    if(Sf.rum&&P.v>4){const amp=22*Math.min(1,P.v/12);P.susV=(P.susV||0)+Math.sin((P.simT||0)*90)*amp*dt;}
    wingScrape(dt,I);
    if(!ebDone&&!P.wreck)trackLay(dt,I);
    if(street&&!P.wreck)streetCeil(T,nz,!!I.tu);
    const rr=P.v>=T.rotateSpeed&&P.wings;if(rr&&!P.rotOK)toast('PULL UP!');P.rotOK=rr;
    if(rr&&!P.wreck&&!(I.climb<0)&&g*CL(P.pitch)*(vr<1?vr*vr+T.floatLift*vr*(1-vr):vr*vr)*wf*ge*cbank>g){P.ground=false;P.y=P.gy+0.001;P.toT=P.simT;P.slowLaunch=P.v<T.roughSpeed;P.lift0=1;ebAirHandoff();toast(P.slowLaunch?'TOO SLOW!':'LIFT OFF!');}
}
let bz=12345;const brn=()=>(bz=(bz*16807)%2147483647)/2147483647;
const NOS_TIERS=['n-stock','n-big','n-race','n-legend'];function nosTierIdx(){if(window.NOS_TIER_OVERRIDE!=null)return window.NOS_TIER_OVERRIDE;try{const s=JSON.parse(localStorage.getItem('zdash.kid.v1')||'null');const i=NOS_TIERS.indexOf(s&&s.eq&&s.eq.nos);return i<0?0:i;}catch(e){return 0;}}
// --- sparks + black smoke particles ---
const FX=[];function fxBurst(k,n){const fx=Math.sin(P.yaw),fz=Math.cos(P.yaw);for(let i=0;i<n;i++){const r=brn,sp=k==='spark';
  FX.push({k,x:P.x-fx*1.6+(r()-.5)*1.6,y:sp?.15:.6,z:P.z-fz*1.6+(r()-.5)*1.6,vx:fx*P.v*(sp?.5:.1)+(r()-.5)*(sp?8:2),vy:sp?1+r()*4:1+r()*1.5,vz:fz*P.v*(sp?.5:.1)+(r()-.5)*(sp?8:2),life:sp?.35+r()*.4:1.6+r()*1.2,t:0,s:sp?0:1+r()});}
  if(FX.length>600)FX.splice(0,FX.length-600);}
// Wings-out ground drift: wingtip scrape when the bank, body roll, or e-brake slip is already high. Does not write ebSlip.
function wingScrape(dt,I){if(P.wings!==1||!P.ground)return;
  const hot=Math.abs(P.ebSlip||0)>0.25||Math.abs(P.bank||0)>0.4||Math.abs(P.ebRoll||0)>0.08;
  if(!hot||Math.abs(I.lr)<0.4)return;P._wingFx=(P._wingFx||0)+dt;if(P._wingFx<0.12)return;P._wingFx=0;fxBurst('spark',3);}
function fxStep(dt){for(let i=FX.length-1;i>=0;i--){const f=FX[i];f.t+=dt;if(f.t>f.life){FX.splice(i,1);continue;}f.x+=f.vx*dt;f.y+=f.vy*dt;f.z+=f.vz*dt;
  if(f.k==='spark'){f.vy-=9.8*dt;if(f.y<0){f.y=0;f.vy*=-.3;}f.vx*=.98;f.vz*=.98;}else{f.vy*=.99;f.vx*=.97;f.vz*=.97;f.s+=dt*(f.k==='tire'?2.1:2.2);if(f.k==='tire'&&!f.air&&f.y<0.15)f.y=0.15;}}}
function drawFX(){for(const f of FX){if(f.k==='nos'||f.k==='flame'||f.k==='exhaust'||f.nos||f.exhaust)continue;const p=proj(f.x,f.y,f.z);if(!p)continue;const a=1-f.t/f.life,sc=H*0.9/p[2];
  if(f.k==='spark'){const q=proj(f.x-f.vx*.03,f.y-f.vy*.03,f.z-f.vz*.03);if(!q)continue;ctx.strokeStyle=`rgba(255,${180+Math.round(60*a)},60,${a})`;ctx.lineWidth=Math.max(1.5,sc*.06);ctx.shadowColor='#ffb020';ctx.shadowBlur=8;ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);ctx.stroke();ctx.shadowBlur=0;}
  else if(f.k==='tire')continue;
  else{if(p[2]<4)continue;ctx.fillStyle=`rgba(18,14,22,${.75*a})`;ctx.strokeStyle=`rgba(120,110,130,${.35*a})`;ctx.lineWidth=1;ctx.beginPath();ctx.arc(p[0],p[1],Math.min(18,Math.max(3,sc*f.s*.8)),0,7);ctx.fill();ctx.stroke();}}}
// Ground e-brake: loose rear, tighter path, drift angle. Plain ground brake never comes through here.
function ebDamp(cur,to,tau,dt){return cur+(to-cur)*(1-Math.exp(-dt/Math.max(0.03,tau)));}
function ebAirHandoff(){
  const holding=(typeof B!=='undefined'&&B.ebLatch)||(typeof K!=='undefined'&&K.KeyB);
  if(holding)return;
  if((P.ebK||0)>0.001||Math.abs(P.ebSlip||0)>0.01||(P.donutK||0)>0.001){P.yaw=P.hd;P.ebSlip=0;P.ebK=0;P.donutK=0;P.ebRoll=0;}}
function ebWheel(side){
  const lx=side*ZDM.wx,lz=ZDM.rAx,yaw=P.yaw||0,cy=Math.cos(yaw),sy=Math.sin(yaw);
  if(P.ground)return[P.x+lx*cy+lz*sy,(P.gy||0)+0.05,P.z-lx*sy+lz*cy];
  const b=(P.roll?P.roll.b0:(P.bank||0))+(P.ebRoll||0),cb=Math.cos(b),sb=Math.sin(b),cp=Math.cos(P.pitch||0),sp=Math.sin(P.pitch||0),ly=-0.22;
  const X2=lx*cb-ly*sb,Y=lx*sb+ly*cb,Y2=Y*cp+lz*sp,Z2=-Y*sp+lz*cp;
  return[P.x+X2*cy+Z2*sy,P.y+Y2,P.z-X2*sy+Z2*cy];}
// Garage neon track marks. Fixed ring per wheel — ebMarks never allocates and never shifts.
const MAX_SKID=256;
const TR_COL={'tr-cyan':['#3ee6ff','#e9fbff'],'tr-pink':['#ff4fd8','#ffe6fa'],'tr-lime':['#7dff6b','#ecffe8'],'tr-purple':['#9b5cff','#efe6ff'],'tr-gold':['#ffe14d','#fffbe0'],'tr-red':['#ff2a3d','#ffe5e8']};
const TR_STYLE={id:'tr-match',outer:'#3ee6ff',core:'#e9fbff',rainbow:0};
let trRaw=null,trId='tr-match',trAt=-1e9;
function trackCore(hex){if(typeof hex!=='string'||!/^#[0-9a-fA-F]{6}$/.test(hex))return '#f7fdff';const n=parseInt(hex.slice(1),16),r=(n>>16)&255,g=(n>>8)&255,b=n&255,m=c=>Math.min(255,Math.round(c+(255-c)*0.78)),h=v=>v.toString(16).padStart(2,'0');return '#'+h(m(r))+h(m(g))+h(m(b));}
function trackKid(){if(window.KID)return window.KID;try{if(typeof KID!=='undefined'&&KID)return KID;}catch(e){}return null;}
function trackIdNow(){const kid=trackKid();if(kid&&kid.trackColor)return String(kid.trackColor);
  const now=typeof performance!=='undefined'?performance.now():0;let s=null;try{s=localStorage.getItem('zdash.kid.v1');}catch(e){}
  if(s!==trRaw||now-trAt>500){trRaw=s;trAt=now;trId='tr-match';if(s){try{const o=JSON.parse(s),id=o&&o.eq&&o.eq.tracks;if(typeof id==='string'&&id)trId=id;}catch(e){}}}
  return trId;}
function trackRainbow(){const k=trackKid();if(k&&k.paint==='rainbow')return true;return !!(window.GZ&&GZ.rb);}
function trackMarkStyle(){const id=trackIdNow(),kid=trackKid(),glow=(kid&&kid.glow)||'#3ee6ff',pair=TR_COL[id];
  TR_STYLE.id=id;TR_STYLE.rainbow=(id==='tr-rainbow'||(id==='tr-match'&&trackRainbow()))?1:0;
  if(pair){TR_STYLE.outer=pair[0];TR_STYLE.core=pair[1];}
  else if(/^#[0-9a-fA-F]{6}$/.test(id)){TR_STYLE.outer=id;TR_STYLE.core=trackCore(id);}
  else{TR_STYLE.outer=glow;TR_STYLE.core=trackCore(glow);}
  return TR_STYLE;}
function makeRing(){const slots=new Array(MAX_SKID);for(let i=0;i<MAX_SKID;i++)slots[i]={x:0,y:0,z:0,t:0,air:0,brk:0};const ring={slots,head:0,n:0};
  ring.view=new Proxy(ring,{get(r,p){if(p==='length')return r.n;if(typeof p==='string'&&/^\d+$/.test(p)){const i=+p;if(i<0||i>=r.n)return undefined;return r.slots[(r.head-r.n+i+MAX_SKID)%MAX_SKID];}return r[p];},
    set(r,p,v){if(p==='length'){if(+v===0){r.n=0;r.head=0;}return true;}r[p]=v;return true;}});return ring;}
const RING={L:makeRing(),R:makeRing()};
const SKID={L:RING.L.view,R:RING.R.view};
function trackClear(){RING.L.n=RING.L.head=0;RING.R.n=RING.R.head=0;}
function skidPush(ring,x,y,z,t,air,brk){const s=ring.slots[ring.head];s.x=x;s.y=y;s.z=z;s.t=t;s.air=air?1:0;s.brk=brk?1:0;ring.head=(ring.head+1)%MAX_SKID;if(ring.n<MAX_SKID)ring.n++;}
function trackWant(I){if((P.ebK||0)>=0.06)return P.v>0.8;if(!P.ground||!I)return false;if(P.nosBurn&&P.v>2)return true;if(I.brk&&P.v>4)return true;return Math.abs(I.lr||0)>0.65&&P.v>18;}
function trackLay(dt,I){if(!trackWant(I))return;const now=P.simT||0,air=!P.ground,step=air?0.45:0.28,brk=I&&I.brk?1:0;
  for(const side of[-1,1]){const ring=side<0?RING.L:RING.R,w=ebWheel(side),prev=ring.n?ring.slots[(ring.head-1+MAX_SKID)%MAX_SKID]:null;
    if(prev&&Math.hypot(w[0]-prev.x,w[2]-prev.z)<=step)continue;skidPush(ring,w[0],w[1],w[2],now,air,brk);}}
function ebMarks(dt){trackLay(dt,null);}
const SK_XY=[new Float32Array(MAX_SKID*4),new Float32Array(MAX_SKID*4),new Float32Array(MAX_SKID*4)];
const SK_MV=[new Uint8Array(MAX_SKID*2),new Uint8Array(MAX_SKID*2),new Uint8Array(MAX_SKID*2)];
const SK_N=[0,0,0],SK_Z=[1e9,1e9,1e9],SK_CS=[0,0,0],SK_SN=[0,0,0],SK_HN=[0,0,0],SK_AL=[0,0,0];
const SK_AGE_A=[0.92,0.55,0.24];
function skidBucketPush(b,x,y,mv,z,hue,al){const n=SK_N[b];if(n>=MAX_SKID*2)return;const xy=SK_XY[b];xy[n*2]=x;xy[n*2+1]=y;SK_MV[b][n]=mv;SK_N[b]=n+1;if(z<SK_Z[b])SK_Z[b]=z;SK_CS[b]+=Math.cos(hue);SK_SN[b]+=Math.sin(hue);SK_HN[b]++;SK_AL[b]+=al;}
function drawSkids(){const t0=typeof performance!=='undefined'?performance.now():0;const life=(TUNE.eBrakeSkidLife||4.5),now=P.simT||0;
  if(!RING.L.n&&!RING.R.n){if(window.TRACK_MARKS){TRACK_MARKS.lastMs=0;TRACK_MARKS.lastStrokes=0;}return;}
  const style=trackMarkStyle();for(let b=0;b<3;b++){SK_N[b]=0;SK_Z[b]=1e9;SK_CS[b]=SK_SN[b]=SK_HN[b]=SK_AL[b]=0;}
  for(const ring of[RING.L,RING.R]){let prev=null,prevB=-1;const base=(ring.head-ring.n+MAX_SKID)%MAX_SKID;
    for(let i=0;i<ring.n;i++){const s=ring.slots[(base+i)%MAX_SKID],age=(now-s.t)/life;if(age<0||age>=1){prev=null;prevB=-1;continue;}
      const p=proj(s.x,s.y,s.z);if(!p||p[2]<1.5){prev=null;prevB=-1;continue;}
      const b=age<0.34?0:age<0.67?1:2,gap=!prev||prevB!==b||s.air!==prev.air||Math.hypot(s.x-prev.x,s.z-prev.z)>((s.air||prev.air)?8.5:2.8);
      skidBucketPush(b,p[0],p[1],gap?1:0,p[2],s.t*1.7,Math.pow(1-age,0.45));prev=s;prevB=b;}}
  let strokes=0;const Hh=typeof H==='number'?H:390;ctx.save();ctx.lineCap='round';ctx.lineJoin='round';ctx.shadowBlur=0;
  for(let b=0;b<3;b++){const n=SK_N[b];if(n<2)continue;ctx.beginPath();const xy=SK_XY[b],mv=SK_MV[b];
    for(let i=0;i<n;i++){const x=xy[i*2],y=xy[i*2+1];if(mv[i]||i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}
    const z=SK_Z[b]<1e8?SK_Z[b]:8,w=Math.max(2.2,Math.min(14,(Hh*0.9/z)*0.28));
    let outer=style.outer,core=style.core,al=SK_AGE_A[b];
    if(style.rainbow&&SK_HN[b]>0){const hue=Math.atan2(SK_SN[b],SK_CS[b])*180/Math.PI;outer=`hsl(${(hue+360)%360},100%,62%)`;core=`hsl(${(hue+360)%360},100%,90%)`;al=Math.max(0.16,SK_AL[b]/SK_HN[b]);}
    ctx.globalAlpha=al;ctx.strokeStyle=outer;ctx.lineWidth=w*2.1;ctx.stroke();ctx.strokeStyle=core;ctx.lineWidth=Math.max(1.2,w*0.72);ctx.stroke();strokes+=2;}
  ctx.restore();
  if(window.TRACK_MARKS){TRACK_MARKS.lastStrokes=strokes;TRACK_MARKS.lastMs=(typeof performance!=='undefined'?performance.now():t0)-t0;}}
window.TRACK_MARKS={getStyle:trackMarkStyle,clear:trackClear,MAX:MAX_SKID,count(){return RING.L.n+RING.R.n;},size(side){return(side==='R'?RING.R:RING.L).n;},lastStrokes:0,lastMs:0};
function ebGround(dt,T,I,ofr,vT,nz){
  const want=!!I.eb;
  P.ebK=ebDamp(P.ebK||0,want?1:0,want?T.eBrakeIn:T.eBrakeOut,dt);
  P.donutK=ebDamp(P.donutK||0,want&&I.tu?1:0,0.16,dt);
  const eb=P.ebK,dk=P.donutK,mph=P.v*2.2369362920544;
  const slow=clamp((T.eBrakePivotMph-mph)/Math.max(1,T.eBrakePivotMph),0,1);
  const hard=clamp((Math.abs(I.lr)-0.12)/0.88,0,1),piv=slow*hard;
  const street=P.driveMode==='street';
  const decel=lerp(street?(T.streetEBrakeDecel||10.5):T.eBrakeDecel,street?(T.streetEBrakePivotDecel||13.5):T.eBrakePivotDecel,piv);
  const fric=T.groundFric*(ofr<1?1+2*(1-ofr):1),grav=Math.sin(P.pitch)*T.gravityK;
  const streetMax=(T.streetMaxSpeed||28)*((P.surface==='grass')?0.78:1);
  const vTarget=street?(nz&&I.tu?streetMax*1.38:streetMax*Math.pow(clamp(P.thr,0,1),1.35)):vT;
  const drive=P.v<vTarget?(T.streetAccel||6.4)*ofr*(0.55+0.45*(1-clamp(P.v/(T.streetMaxSpeed||28),0,1))):-((T.streetCoastDecel||4.6)+P.v*0.08);
  const normal=street?(drive-grav-fric-((!want&&I.brk)?(T.streetBrake||15.5):0)):((vT-P.v)*(vT>P.v?T.groundAccel*ofr:T.momentum)-grav-fric-((!want&&I.brk)?T.groundBrake:0));
  const coast=-grav-fric-decel;
  const donutV=street?(T.streetEBrakeDonutV||12.5):T.eBrakeDonutV;
  const donut=P.v<donutV?(donutV-P.v)*T.eBrakeDonutSpool:0;
  const acc=lerp(normal,lerp(coast,donut,dk),Math.max(eb,dk));
  let vNext=P.v+acc*dt;if(street&&acc>0&&vNext>vTarget)vNext=vTarget;
  P.v=clamp(vNext,0,street?streetMax*(nz&&I.tu?1.38:1):T.maxSpeed*T.nosBoost*1.1);P.gam=0;
  const base=Math.min(1,P.v/5),scale=base+(Math.max(base,T.eBrakePivotYaw)-base)*piv;
  const yawRate=I.lr*0.6*T.groundSteer*scale*lerp(1,T.eBrakeSteer,eb);
  P.hd=(P.hd||0)+yawRate*dt;
  const slip0=T.eBrakeSlipMph0||18;
  const slipK=clamp((mph-slip0)/Math.max(1,T.eBrakeSlipFullMph-slip0),0,1);
  const steerK=Math.min(1,Math.abs(I.lr)/Math.max(0.05,T.eBrakeSlipSteer));
  const sign=Math.abs(I.lr)>0.04?Math.sign(I.lr):0;
  const slipSlow=street?(T.streetEBrakeSlipSlow||15):T.eBrakeSlipSlow,slipMax=street?(T.streetEBrakeSlipMax||29):T.eBrakeSlipMax,donutSlip=street?(T.streetEBrakeDonutSlip||38):T.eBrakeDonutSlip;
  const slipDrift=(slipSlow+(slipMax-slipSlow)*slipK)*D;
  const slipT=lerp(slipDrift,donutSlip*D,dk)*sign*steerK*eb;
  const align=street?(T.streetEBrakeAlign||5.2):T.eBrakeAlign;
  P.ebSlip=ebDamp(P.ebSlip||0,slipT,1/(want?T.eBrakeSlipIn:align),dt);
  const cap=(slipMax+6)*D;P.ebSlip=clamp(P.ebSlip,-cap,cap);
  P.yaw=P.hd+P.ebSlip;
  const roll=street?(T.streetEBrakeRoll||4.8):T.eBrakeRoll;
  P.ebRoll=ebDamp(P.ebRoll||0,-sign*roll*D*Math.min(1,Math.abs(I.lr))*eb*(0.45+0.55*Math.min(1,mph/32)),0.1,dt);
  ebMarks(dt);}
function showWreck(on){const e=document.getElementById('kWreck');if(e)e.classList.toggle('hidden',!on);}
setTimeout(armStreetCeil,0);
