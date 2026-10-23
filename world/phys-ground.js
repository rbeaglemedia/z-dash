'use strict';
// ===== PHYSICS: GROUND (split from shared/physics.js) =====
// Ground driving: surfaces via offRoadK() (grass / buildings / roads / runways), NOS + wings-out on the ground,
// e-brake drifting, particles, NOS tiers, wreck card. step() in world/phys-air.js calls groundStep() when P.ground.
function groundStep(dt,T,I,I0,nz,vT,vr,wf,ge,cbank,g,CL){
    let ebDone=false;
    if(P.wreck){P.wreck.t+=dt;P.v=Math.max(0,P.v-Math.max(T.wreckFric,P.v*1.2)*dt);if(P.v>2)fxBurst('spark',3);if(P.wreck.t<4)fxBurst('smoke',P.wreck.t<1.5?2:1);if(P.wreck.t>T.wreckCard&&!P.wreck.card){P.wreck.card=1;showWreck(true);}P.ebK=0;P.ebSlip=0;P.donutK=0;P.ebRoll=0;}
    else{const ofr=offRoadK();P.offK=ofr;
      if(I.eb||(P.ebK||0)>0.001||(P.donutK||0)>0.001||Math.abs(P.ebSlip||0)>0.002||Math.abs(P.ebRoll||0)>0.002){ebGround(dt,T,I,ofr,vT);ebDone=true;}
      else P.v+=(vT-P.v)*(vT>P.v?T.groundAccel*ofr:T.momentum)*dt-Math.sin(P.pitch)*T.gravityK*dt-(I.brk?T.groundBrake*dt:0)-T.groundFric*(ofr<1?1+2*(1-ofr):1)*dt;}
    P.gT=(P.gT||0)+dt;
    if(!ebDone){P.v=clamp(P.v,0,T.maxSpeed*T.nosBoost*1.1);P.gam=0;P.yaw+=I.lr*0.6*TUNE.groundSteer*dt*Math.min(1,P.v/5);P.hd=P.yaw;if(P.ebRoll){P.ebRoll*=Math.max(0,1-10*dt);if(Math.abs(P.ebRoll)<1e-3)P.ebRoll=0;}}
    const rr=P.v>=T.rotateSpeed&&P.wings;if(rr&&!P.rotOK)toast('PULL UP!');P.rotOK=rr;
    if(rr&&!P.wreck&&!(I.climb<0)&&g*CL(P.pitch)*(vr<1?vr*vr+T.floatLift*vr*(1-vr):vr*vr)*wf*ge*cbank>g){P.ground=false;P.y=P.gy+0.001;P.toT=P.simT;P.slowLaunch=P.v<T.roughSpeed;P.lift0=1;ebAirHandoff();toast(P.slowLaunch?'TOO SLOW!':'LIFT OFF!');}
}
let bz=12345;const brn=()=>(bz=(bz*16807)%2147483647)/2147483647;
const NOS_TIERS=['n-stock','n-big','n-race','n-legend'];function nosTierIdx(){if(window.NOS_TIER_OVERRIDE!=null)return window.NOS_TIER_OVERRIDE;try{const s=JSON.parse(localStorage.getItem('zdash.kid.v1')||'null');const i=NOS_TIERS.indexOf(s&&s.eq&&s.eq.nos);return i<0?0:i;}catch(e){return 0;}}
// --- sparks + black smoke particles ---
const FX=[];function fxBurst(k,n){const fx=Math.sin(P.yaw),fz=Math.cos(P.yaw);for(let i=0;i<n;i++){const r=brn,sp=k==='spark';
  FX.push({k,x:P.x-fx*1.6+(r()-.5)*1.6,y:sp?.15:.6,z:P.z-fz*1.6+(r()-.5)*1.6,vx:fx*P.v*(sp?.5:.1)+(r()-.5)*(sp?8:2),vy:sp?1+r()*4:1+r()*1.5,vz:fz*P.v*(sp?.5:.1)+(r()-.5)*(sp?8:2),life:sp?.35+r()*.4:1.6+r()*1.2,t:0,s:sp?0:1+r()});}
  if(FX.length>600)FX.splice(0,FX.length-600);}
function fxStep(dt){for(let i=FX.length-1;i>=0;i--){const f=FX[i];f.t+=dt;if(f.t>f.life){FX.splice(i,1);continue;}f.x+=f.vx*dt;f.y+=f.vy*dt;f.z+=f.vz*dt;
  if(f.k==='spark'){f.vy-=9.8*dt;if(f.y<0){f.y=0;f.vy*=-.3;}f.vx*=.98;f.vz*=.98;}else{f.vy*=.99;f.vx*=.97;f.vz*=.97;f.s+=dt*(f.k==='tire'?2.1:2.2);if(f.k==='tire'&&!f.air&&f.y<0.15)f.y=0.15;}}}
function drawFX(){for(const f of FX){const p=proj(f.x,f.y,f.z);if(!p)continue;const a=1-f.t/f.life,sc=H*0.9/p[2];
  if(f.k==='spark'){const q=proj(f.x-f.vx*.03,f.y-f.vy*.03,f.z-f.vz*.03);if(!q)continue;ctx.strokeStyle=`rgba(255,${180+Math.round(60*a)},60,${a})`;ctx.lineWidth=Math.max(1.5,sc*.06);ctx.shadowColor='#ffb020';ctx.shadowBlur=8;ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);ctx.stroke();ctx.shadowBlur=0;}
  else if(f.k==='tire'){ctx.fillStyle=f.air?`rgba(130,235,255,${(0.38*a).toFixed(3)})`:`rgba(226,228,234,${.42*a})`;ctx.beginPath();ctx.arc(p[0],p[1],Math.max(3,sc*f.s*0.72),0,7);ctx.fill();}
  else{ctx.fillStyle=`rgba(18,14,22,${.75*a})`;ctx.strokeStyle=`rgba(120,110,130,${.35*a})`;ctx.lineWidth=1;ctx.beginPath();ctx.arc(p[0],p[1],Math.max(3,sc*f.s*.8),0,7);ctx.fill();ctx.stroke();}}}
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
const SKID={L:[],R:[]};
function ebMarks(dt){const T=TUNE,eb=P.ebK||0;if(eb<0.08||P.v<0.8)return;const now=P.simT||0,maxStep=P.ground?0.28:0.45;
  for(const side of[-1,1]){const w=ebWheel(side),arr=side<0?SKID.L:SKID.R,last=arr[arr.length-1];
    if(!last||Math.hypot(w[0]-last.x,w[2]-last.z)>maxStep){arr.push({x:w[0],y:w[1],z:w[2],t:now,air:P.ground?0:1});if(arr.length>640)arr.shift();}}
  const mph=P.v*2.236936,rate=(T.eBrakeSmoke||12)*(0.4+0.6*Math.min(1,mph/30))*(1+(P.donutK||0)*((T.eBrakeDonutSmoke||2.4)-1));
  P._ebFx=(P._ebFx||0)+rate*dt;const n=Math.min(8,P._ebFx|0);P._ebFx-=n;if(!n)return;
  const hx=Math.sin(P.hd),hz=Math.cos(P.hd),air=!P.ground;
  for(let i=0;i<n;i++){const w=ebWheel(i&1?1:-1),r=brn;FX.push({k:'tire',air:air?1:0,x:w[0],y:air?w[1]:0.22,z:w[2],vx:-hx*Math.min(P.v,12)*0.12+(r()-.5)*1.4,vy:0.8+r()*1.6,vz:-hz*Math.min(P.v,12)*0.12+(r()-.5)*1.4,life:0.55+r()*0.55,t:0,s:0.8+r()*((P.donutK||0)>0.5?1.6:0.9)});}
  if(FX.length>600)FX.splice(0,FX.length-600);}
function drawSkids(){const life=TUNE.eBrakeSkidLife||3.6,now=P.simT||0;if(!SKID.L.length&&!SKID.R.length)return;ctx.save();ctx.lineCap='round';ctx.lineJoin='round';
  for(const arr of[SKID.L,SKID.R]){while(arr.length&&now-arr[0].t>life)arr.shift();
    for(let i=1;i<arr.length;i++){const a=arr[i-1],b=arr[i];const maxSeg=(a.air||b.air)?8.5:2.8;if(Math.hypot(b.x-a.x,b.z-a.z)>maxSeg)continue;const al=clamp(1-(now-b.t)/life,0,1);if(al<=0.02)continue;const vis=Math.pow(al,0.4);
      const p=proj(a.x,a.y,a.z),q=proj(b.x,b.y,b.z);if(!p||!q)continue;const w=Math.max(2.2,(H*0.9/((p[2]+q[2])*0.5))*0.28);
      if(a.air||b.air){ctx.strokeStyle=`rgba(62,230,255,${(0.55*vis).toFixed(3)})`;ctx.lineWidth=w*2.5;ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);ctx.stroke();
        ctx.strokeStyle=`rgba(255,79,216,${(0.88*vis).toFixed(3)})`;ctx.lineWidth=w*1.3;ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);ctx.stroke();
        ctx.strokeStyle=`rgba(235,252,255,${(0.96*vis).toFixed(3)})`;ctx.lineWidth=w*0.65;ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);ctx.stroke();}
      else{ctx.strokeStyle=`rgba(255,120,180,${(0.5*vis).toFixed(3)})`;ctx.lineWidth=w*2.2;ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);ctx.stroke();
        ctx.strokeStyle=`rgba(244,244,250,${(0.95*vis).toFixed(3)})`;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);ctx.stroke();}}}
  ctx.restore();}
function ebGround(dt,T,I,ofr,vT){
  const want=!!I.eb;
  P.ebK=ebDamp(P.ebK||0,want?1:0,want?T.eBrakeIn:T.eBrakeOut,dt);
  P.donutK=ebDamp(P.donutK||0,want&&I.tu?1:0,0.16,dt);
  const eb=P.ebK,dk=P.donutK,mph=P.v*2.2369362920544;
  const slow=clamp((T.eBrakePivotMph-mph)/Math.max(1,T.eBrakePivotMph),0,1);
  const hard=clamp((Math.abs(I.lr)-0.12)/0.88,0,1),piv=slow*hard;
  const decel=lerp(T.eBrakeDecel,T.eBrakePivotDecel,piv);
  const fric=T.groundFric*(ofr<1?1+2*(1-ofr):1),grav=Math.sin(P.pitch)*T.gravityK;
  const normal=(vT-P.v)*(vT>P.v?T.groundAccel*ofr:T.momentum)-grav-fric-((!want&&I.brk)?T.groundBrake:0);
  const coast=-grav-fric-decel;
  const donut=P.v<T.eBrakeDonutV?(T.eBrakeDonutV-P.v)*T.eBrakeDonutSpool:0;
  const acc=lerp(normal,lerp(coast,donut,dk),Math.max(eb,dk));
  P.v=clamp(P.v+acc*dt,0,T.maxSpeed*T.nosBoost*1.1);P.gam=0;
  const base=Math.min(1,P.v/5),scale=base+(Math.max(base,T.eBrakePivotYaw)-base)*piv;
  const yawRate=I.lr*0.6*T.groundSteer*scale*lerp(1,T.eBrakeSteer,eb);
  P.hd=(P.hd||0)+yawRate*dt;
  const slip0=T.eBrakeSlipMph0||18;
  const slipK=clamp((mph-slip0)/Math.max(1,T.eBrakeSlipFullMph-slip0),0,1);
  const steerK=Math.min(1,Math.abs(I.lr)/Math.max(0.05,T.eBrakeSlipSteer));
  const sign=Math.abs(I.lr)>0.04?Math.sign(I.lr):0;
  const slipDrift=(T.eBrakeSlipSlow+(T.eBrakeSlipMax-T.eBrakeSlipSlow)*slipK)*D;
  const slipT=lerp(slipDrift,T.eBrakeDonutSlip*D,dk)*sign*steerK*eb;
  P.ebSlip=ebDamp(P.ebSlip||0,slipT,1/(want?T.eBrakeSlipIn:T.eBrakeAlign),dt);
  const cap=(T.eBrakeSlipMax+6)*D;P.ebSlip=clamp(P.ebSlip,-cap,cap);
  P.yaw=P.hd+P.ebSlip;
  P.ebRoll=ebDamp(P.ebRoll||0,-sign*T.eBrakeRoll*D*Math.min(1,Math.abs(I.lr))*eb*(0.45+0.55*Math.min(1,mph/32)),0.1,dt);
  ebMarks(dt);}
function showWreck(on){const e=document.getElementById('kWreck');if(e)e.classList.toggle('hidden',!on);}
