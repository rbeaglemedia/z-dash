'use strict';
// ===== PHYSICS =====
function step(dt){P.simT=(P.simT||0)+dt;const T=TUNE,g=9.8;
  if(P._lv!==P.v||P._ly!==P.y||P.gam==null){P.gam=P.ground?0:clamp(P.pitch,-1.3,1.3);P.hd=P.yaw;P.q=0;if(P.wreck){P.wreck=null;showWreck(false);}P.gy=CITY.probe(P.x,P.z,P.y).fl;}  /* state set from outside (tests/teleport): path = nose */
  const I0=input();P._climb=I0.climb;const I=P.wreck?{hard:0,lr:0,climb:0,nos:0,brk:0,eb:0,tu:0}:I0;
  P.thr=clamp(P.thr+(I.tu?T.thrUp:-T.thrDown)*dt,0,1);
  if(I.hard&&!P.roll&&!(TL.hardT>0))startRoll(I.hard);TL.hardT=I.hard?1:Math.max(0,(TL.hardT||0)-dt*4);
  if(P.roll){P.roll.t+=dt/T.rollTime;const e=P.roll.t>=1?1:(1-Math.cos(Math.PI*P.roll.t))/2;P.bank=P.roll.b0+P.roll.d*2*Math.PI*e;if(P.roll.t>=1){P.bank=P.roll.b0;P.roll=null;P.rolls=(P.rolls||0)+1;}}
  else{const tb=I.lr*T.maxBank*D;if(I.lr&&!P.ground)P.bank+=clamp(tb-P.bank,-T.bankRate*D*dt,T.bankRate*D*dt);else P.bank-=P.bank*Math.min(1,T.autoLevel*dt);}
  const vr=Math.max(0,P.v/T.liftFullSpeed),alpha=P.pitch-(P.ground?0:P.gam);P.aoa=alpha;
  // --- pitch with inertia (angular velocity P.q) ---
  if(!P.flip){P.q+=(I.climb*T.pitchRate*D*(!P.ground&&P.gam<0&&vr>1&&I.climb>0?T.pullBoost:1)-P.q)*Math.min(1,T.pitchResp*dt);
    if(!P.ground)P.q+=(-alpha*T.pitchStab*(I.climb<0?T.pushStab*(1-0.85*clamp((-I.climb-0.5)*2,0,1)):(I.climb>0&&vr>0.8?1-(1-T.pullStab)*clamp((I.climb-0.5)*2,0,1):1))*Math.min(4,vr*vr)-(I.climb?0:P.pitch*T.autoLevel*0.3))*dt;
    else if(!I.climb||P.pitch<0)P.q+=(-P.pitch*T.gSpring-P.q*T.gDamp)*dt;}
  if(false&&!P.ground&&!P.flip&&P.y>8&&((P.pitch>T.flipPitch*D&&P.v<T.flipSpeed)||(alpha>(T.alphaStall+2)*D&&P.v<T.flipSpeed))){P.flip={t:0};P.flips=(P.flips||0)+1;P.rec=1;toast('STALL!');navigator.vibrate&&navigator.vibrate([40,40,80]);}
  if(P.flip){P.flip.t+=dt;P.q=-T.flipRate*D;P.bank-=P.bank*Math.min(1,3*dt);if(P.pitch<=-T.flipDive*D||P.flip.t>T.flipTime){P.flip=null;P.q*=.3;toast('PULL UP!');}}
  else if(P.rec&&P.pitch>-5*D&&P.v>T.stallSpeed+4){P.rec=0;P.recs=(P.recs||0)+1;toast('RECOVERED!');}
  const wasStall=P.stall;P.stall=!P.ground&&P.v<T.stallSpeed;if(P.stall&&!wasStall)toast('LOW SPEED: NOSE SINKING');
  if(P.stall&&!P.floating)P.q-=T.stallSink*3*D*(1-P.v/T.stallSpeed)*dt*((P.y-P.gy)<T.geH?(P.y-P.gy)/T.geH:1);
  // --- buffeting: smoothed random turbulence, stronger the closer to stall (speed or AoA) ---
  {let kb=P.ground||P.roll||P.flip||P.tf<.5?0:clamp((T.roughSpeed-P.v)/(T.roughSpeed-T.stallSpeed*.8),0,1)+clamp((alpha/D-T.alphaStall*.7)/(T.alphaStall*.6),0,1);
   const fz0=P.floating;if(fz0)kb*=(P.y-P.gy)/T.floatH;
   P.tbq=(P.tbq||0)+((brn()-.5)*2-(P.tbq||0))*Math.min(1,8*dt);P.tbb=(P.tbb||0)+((brn()-.5)*2-(P.tbb||0))*Math.min(1,6*dt);
   if(kb>0){P.q+=P.tbq*T.buffet*D*kb*dt*3;P.bank+=P.tbb*T.buffet*D*kb*dt*1.5;}P.buf=kb;}
  P.pitch+=P.q*dt;P.bank=clamp(P.bank,-T.maxBank*D,T.maxBank*D);  /* never rolls over */
  {const pmax=(P.ground?(P.v>=T.rotateSpeed&&P.tf>=1&&P.wings?T.rotPitchMax:T.groundPitchMax):T.maxPitch)*D,pmin=(P.ground?-T.dipDeg*1.5:-T.maxDive)*D;
   if(P.pitch>pmax){P.pitch=pmax;P.q=Math.min(P.q,0);}if(P.pitch<pmin){P.pitch=pmin;P.q=Math.max(P.q,0);}}
  const nz=!P.wreck&&(P.nosBurn||false);{const N=T.nosPerTier*(nosTierIdx()+1),ch=1/N,rate=ch/T.nosChunkT,pr=!!P._nosP;P._nosP=!!I0.nos;if(I0.nos&&!pr&&P.nosTank+1e-6>=ch)P.nosLeft=(P.nosLeft||0)+ch;
    const burn=P.nosTank>1e-6&&((P.nosLeft||0)>1e-6||I0.nos);if(burn){const u=Math.min(P.nosTank,rate*dt);P.nosTank-=u;P.nosLeft=Math.max(0,(P.nosLeft||0)-u);}P.nosBurn=burn;
    P.nosTank=Math.min(1,P.nosTank+T.nosFill*dt);}P.nosT=P.nosBurn?1:0;  /* bottle refills on the ground only: one bottle per flight */const vT=T.maxSpeed*(nz&&I.tu?T.nosBoost:P.thr);
  const wf=P.tf*P.tf*(3-2*P.tf),cbank=Math.cos(P.roll?P.roll.b0:P.bank);
  const CL=a=>{const d=a/D;let c=clamp((d+T.alpha0)/T.alphaL,-.6,T.clMax);if(d>T.alphaStall)c*=Math.max(.35,1-(d-T.alphaStall)/12);return c;};
  const ge=(P.y-P.gy)<T.geH?1+T.geLift*(1-Math.max(0,(P.y-P.gy))/T.geH):1;
  if(P.ground){
    let ebDone=false;
    if(P.wreck){P.wreck.t+=dt;P.v=Math.max(0,P.v-Math.max(T.wreckFric,P.v*1.2)*dt);if(P.v>2)fxBurst('spark',3);if(P.wreck.t<4)fxBurst('smoke',P.wreck.t<1.5?2:1);if(P.wreck.t>T.wreckCard&&!P.wreck.card){P.wreck.card=1;showWreck(true);}P.ebK=0;P.ebSlip=0;P.donutK=0;P.ebRoll=0;}
    else{const ofr=offRoadK();P.offK=ofr;
      if(I.eb||(P.ebK||0)>0.001||(P.donutK||0)>0.001||Math.abs(P.ebSlip||0)>0.002||Math.abs(P.ebRoll||0)>0.002){ebGround(dt,T,I,ofr,vT);ebDone=true;}
      else P.v+=(vT-P.v)*(vT>P.v?T.groundAccel*ofr:T.momentum)*dt-Math.sin(P.pitch)*T.gravityK*dt-(I.brk?T.groundBrake*dt:0)-T.groundFric*(ofr<1?1+2*(1-ofr):1)*dt;}
    P.gT=(P.gT||0)+dt;
    if(!ebDone){P.v=clamp(P.v,0,T.maxSpeed*T.nosBoost*1.1);P.gam=0;P.yaw+=I.lr*0.6*TUNE.groundSteer*dt*Math.min(1,P.v/5);P.hd=P.yaw;if(P.ebRoll){P.ebRoll*=Math.max(0,1-10*dt);if(Math.abs(P.ebRoll)<1e-3)P.ebRoll=0;}}
    const rr=P.v>=T.rotateSpeed&&P.wings;if(rr&&!P.rotOK)toast('PULL UP!');P.rotOK=rr;
    if(rr&&!P.wreck&&!(I.climb<0)&&g*CL(P.pitch)*(vr<1?vr*vr+T.floatLift*vr*(1-vr):vr*vr)*wf*ge*cbank>g){P.ground=false;P.y=P.gy+0.001;P.toT=P.simT;P.slowLaunch=P.v<T.roughSpeed;P.lift0=1;ebAirHandoff();toast(P.slowLaunch?'TOO SLOW!':'LIFT OFF!');}
  }else{P.rotOK=false;P.gT=0;
    const cl=CL(alpha),lk=Math.max(T.closedLift,wf),dq=vr<1?vr*vr+T.floatLift*vr*(1-vr):vr*vr,L=g*cl*dq*lk*ge*(P.gam<0&&I.climb>0&&vr>0.95?1+T.pullLift*I.climb*clamp(-P.gam*5,0,1):1)*(I.climb>0.5&&vr>0.8?1+T.pullLift2*clamp((I.climb-0.5)*2,0,1)*clamp((vr-0.8)*5,0,1):1),slip=Math.sin(P.yaw-P.hd);
    const drag=T.ovK*Math.max(0,P.v-T.ovV)**2+T.cd*P.v*P.v+T.cdi*cl*cl*dq*g*lk+T.bankDrag*(P.gam<0?T.diveBankDrag:1)*(1/Math.max(.3,Math.abs(cbank))-1)+T.slipDrag*g*Math.abs(slip)*Math.min(4,vr*vr);
    const along=(I.tu?T.airThrust*P.thr:0)+(nz&&I.tu?T.airNos:0)-drag-g*Math.sin(P.gam)*(P.gam>0?T.climbG:T.diveG)-(I.brk?T.airBrake*Math.max(0,Math.cos(P.gam)):0)+Math.min(drag+T.swoopMax,T.swoopK*Math.max(0,L*cbank/g-Math.cos(P.gam))*clamp(vr-0.8,0,1)*(P.gam<T.swoopGam*D?1:0));  /* swoop: pulling out of a dive at speed carries energy */  /* air brake can't hold her up in a vertical fall */
    let nrm=clamp(L*cbank-g*Math.cos(P.gam),-T.maxNz,(P.gam<-0.3&&I.climb>0)?T.maxNz+(T.pullNz-T.maxNz)*clamp((I.climb-0.3)/0.7,0,1):T.maxNz);if(P.simT-(P.toT||-9)<T.liftT)nrm=Math.min(nrm,T.liftAccel);
    if(P.gam<-T.hpPath*D)P.hpDebt=(P.hpDebt||0)+T.hpDrag*Math.max(0,L*cbank/g-T.hpG)*dt;let pay=0;if(P.hpDebt>0&&P.gam>0){pay=Math.min(P.hpDebt,T.hpPay*dt,Math.max(0,P.v-T.liftFullSpeed*0.6));P.hpDebt-=pay;}if((P.y-P.gy)<3)P.hpDebt=0;P.lift=clamp(L/g,0,1);P.v=clamp(P.v+along*dt-pay,T.minFlySpeed,T.maxSpeed*T.nosBoost*1.1);P.gam=clamp(P.gam+nrm/Math.max(P.v,3)*dt,-T.maxDive*D,1.45);
    if(P.wings&&P.tf>.9&&(P.y-P.gy)<T.floatH&&cbank>.5&&P.v<T.floatV&&(P.floating||-P.v*Math.sin(P.gam)<T.floatEnter)){const k=Math.max(0,(P.y-P.gy))/T.floatH,smax=T.floatSinkLow+(T.floatSink-T.floatSinkLow)*k;P.floating=1;if(P.v>0.5&&P.v*Math.sin(P.gam)<-smax)P.gam=-Math.asin(Math.min(1,smax/P.v));if(P.v<=0.5)P.gam=-1.2;}else P.floating=0;  /* FLOAT ZONE: near the ground with wings open she floats down slowly */
    P.yaw+=9.8*Math.tan(clamp(P.roll?P.roll.b0:P.bank,-1.3,1.3))/Math.max(P.v,15)*T.turnK*dt*1.6;
    {let dh=P.yaw-P.hd;dh=Math.atan2(Math.sin(dh),Math.cos(dh));P.hd+=dh*Math.min(1,T.slideK*dt);dh=Math.atan2(Math.sin(P.yaw-P.hd),Math.cos(P.yaw-P.hd));if(Math.abs(dh)>T.slipMax*D){P.hd=P.yaw-Math.sign(dh)*T.slipMax*D;dh=Math.sign(dh)*T.slipMax*D;}P.slip=dh;}}
  const hv=P.v*Math.cos(P.ground?0:P.gam),vy=P.ground?0:P.v*Math.sin(P.gam);P.vs=vy;
  const px0=P.x,pz0=P.z,py0=P.y;P.x+=Math.sin(P.hd)*hv*dt;P.z+=Math.cos(P.hd)*hv*dt;if(P.floating&&vy>-T.floatSinkLow&&vy<0.2&&!(P.rebT!=null)){P.vs=-T.floatSinkLow;P.y-=T.floatSinkLow*dt;}else P.y+=vy*dt;
  {const pr=cityMove(px0,pz0,py0,dt),gy=pr.fl;  /* FLY3CITY: roofs + ramps are ground at a height; same touchDown rules */
   if(!P.ground&&P.y<=gy){touchDown(-P.vs);if(P.ground&&gy>0.5){const pd=CITY.padAt(P.x,P.z,gy);if(pd&&!pd.hit){pd.hit=1;P.roofs=(P.roofs||0)+1;kToast('ROOFTOP!');}}}
   else if(P.ground){if(P.y-gy>0.45&&!pr.st){const sl=P.gsl||0;P.ground=false;P.toT=P.simT;P.gam=Math.max(0,sl);P.gT=0;ebAirHandoff();if(sl>0.02){P.pitch=Math.max(P.pitch,sl);P.ramps=(P.ramps||0)+1;toast('RAMP JUMP!');}else toast('OFF THE EDGE!');}
     else{const dd=Math.hypot(P.x-px0,P.z-pz0);P.gsl=dd>1e-4?Math.atan2(gy-P.y,dd):0;P.y=gy;}}}
  P.susV=(P.susV||0)+(-(P.sus||0)*140-(P.susV||0)*8)*dt;P.sus=(P.sus||0)+P.susV*dt;
  fxStep(dt);
  wheelA-=(P.ground||P.tf<1?P.v:P.v*.2)*dt/ZDM.wr;
  const tfT=P.wings?1:0,pt=P.tf;P.tf=clamp(P.tf+Math.sign(tfT-P.tf)*dt/T.transformTime,0,1);if(pt===1&&P.tf<1)toast('WINGS IN');if(pt===0&&P.tf>0)toast('WINGS OUT!');
  if(P.y>3000){P.gam=Math.min(P.gam,0);P.pitch=Math.min(P.pitch,0);}
  P._lv=P.v;P._ly=P.y;}
let bz=12345;const brn=()=>(bz=(bz*16807)%2147483647)/2147483647;
const NOS_TIERS=['n-stock','n-big','n-race','n-legend'];function nosTierIdx(){if(window.NOS_TIER_OVERRIDE!=null)return window.NOS_TIER_OVERRIDE;try{const s=JSON.parse(localStorage.getItem('zdash.kid.v1')||'null');const i=NOS_TIERS.indexOf(s&&s.eq&&s.eq.nos);return i<0?0:i;}catch(e){return 0;}}
function touchDown(s){const T=TUNE,pd=P.pitch/D,cb=Math.cos(P.bank);P.y=P.gy;P.butter=false;P.floating=0;if(P.toT!=null&&P.simT-P.toT<T.liftT&&s<=T.softSink){P.ground=true;P.gam=0;P.hd=P.yaw;P.susV=0;return;}if(P.rebT!=null&&P.simT-P.rebT<2&&s<T.bumpSink){P.ground=true;P.gam=0;P.hd=P.yaw;P.rebT=null;P.susV=-s*.4;P.bank=0;P.pitch=Math.max(P.pitch,-T.dipDeg*D);if(s>4)fxBurst('spark',8);return;}P.rebT=null;{const pa=Math.asin(Math.min(1,s/Math.max(P.v,1)))/D;if(s>T.softSink&&pa<T.skimDeg&&P.v>T.skimSpeed&&Math.cos(P.bank)>0.3&&!(P.wings&&P._climb<0)){P.v*=T.skimKeep;const vy=Math.min(T.skimMax,T.skimK*s);P.ground=false;P.y=P.gy+0.02;P.gam=Math.asin(vy/P.v);P.pitch=Math.max(P.pitch,P.gam+3*D);P.q=Math.max(P.q,0);P.rebT=null;P.skims=(P.skims||0)+1;P.susV=-s*.3;fxBurst('spark',8);toast('SKIM!');navigator.vibrate&&navigator.vibrate(30);return;}}const paR=Math.asin(Math.min(1,s/Math.max(P.v,0.01))),ik=T.impactKeep*Math.pow(Math.cos(clamp(paR,0,Math.PI/2)),T.impactExp);P.impactPath=paR/D;P.impactKeep=ik;P.ground=true;P.gam=0;P.hd=P.yaw;P.landSink=s;
  if(cb<0||(P.v>=T.crashSlowV?(paR/D>T.crashPathDeg||pd<-T.crashNoseDeg):s>T.crashSink)){P.hards=(P.hards||0)+1;P.landKmh=P.v*3.6;P.v*=ik;P.bank=0;P.roll=null;P.flip=null;P.pitch=-T.dipDeg*D;P.q=0;P.susV=-s*.5;P.hd=P.yaw;{const vy=Math.min(T.hardRebMax,T.hardRebK*s);if(vy>0.8){P.ground=false;P.y=P.gy+0.02;P.gam=Math.atan2(vy,Math.max(P.v,0.1));P.v=Math.hypot(P.v,vy);P.rebT=P.simT;P.rebV=vy;}else P.ground=true;}fxBurst('spark',30);fxBurst('smoke',6);toast('HARD HIT!');navigator.vibrate&&navigator.vibrate([120,60,200]);return;}
  P.bank=0;
  if(s<=T.softSink&&pd>=-5){P.pitch=Math.max(0,P.pitch);P.lands++;P.landKmh=P.v*3.6;P.v*=.97;P.susV=-s*.3;P.butter=P.landKmh<T.butterKmh&&s<=T.butterSink&&pd>=-5;toast(P.butter?'BUTTER LANDING!':'TOUCHDOWN');return;}
  if(s<=T.bumpSink&&pd>=-10){P.bumps=(P.bumps||0)+1;P.landKmh=P.v*3.6;P.v*=Math.min(.9,ik);P.pitch=Math.min(P.pitch,0)-1.5*D;P.susV=-s*.5;fxBurst('spark',6);toast('BUMP!');navigator.vibrate&&navigator.vibrate(40);return;}
  P.roughs=(P.roughs||0)+1;P.landKmh=P.v*3.6;P.v*=Math.min(T.roughKeep,ik);P.pitch=-T.dipDeg*D;{const vy=Math.min(T.rebMax,T.rebK*s,P.v*0.5);if(vy>0.8){P.ground=false;P.y=P.gy+0.02;P.gam=Math.asin(vy/Math.max(P.v,vy+0.01));P.rebT=P.simT;P.rebV=vy;}}P.q=-.5;P.susV=-s*.6;fxBurst('spark',25);toast('ROUGH LANDING!');navigator.vibrate&&navigator.vibrate([60,30,60]);}
// --- sparks + black smoke particles ---
const FX=[];function fxBurst(k,n){const fx=Math.sin(P.yaw),fz=Math.cos(P.yaw);for(let i=0;i<n;i++){const r=brn,sp=k==='spark';
  FX.push({k,x:P.x-fx*1.6+(r()-.5)*1.6,y:sp?.15:.6,z:P.z-fz*1.6+(r()-.5)*1.6,vx:fx*P.v*(sp?.5:.1)+(r()-.5)*(sp?8:2),vy:sp?1+r()*4:1+r()*1.5,vz:fz*P.v*(sp?.5:.1)+(r()-.5)*(sp?8:2),life:sp?.35+r()*.4:1.6+r()*1.2,t:0,s:sp?0:1+r()});}
  if(FX.length>600)FX.splice(0,FX.length-600);}
function fxStep(dt){for(let i=FX.length-1;i>=0;i--){const f=FX[i];f.t+=dt;if(f.t>f.life){FX.splice(i,1);continue;}f.x+=f.vx*dt;f.y+=f.vy*dt;f.z+=f.vz*dt;
  if(f.k==='spark'){f.vy-=9.8*dt;if(f.y<0){f.y=0;f.vy*=-.3;}f.vx*=.98;f.vz*=.98;}else{f.vy*=.99;f.vx*=.97;f.vz*=.97;f.s+=dt*(f.k==='tire'?3.4:2.2);if(f.k==='tire'&&f.y<0.15)f.y=0.15;}}}
function drawFX(){for(const f of FX){const p=proj(f.x,f.y,f.z);if(!p)continue;const a=1-f.t/f.life,sc=H*0.9/p[2];
  if(f.k==='spark'){const q=proj(f.x-f.vx*.03,f.y-f.vy*.03,f.z-f.vz*.03);if(!q)continue;ctx.strokeStyle=`rgba(255,${180+Math.round(60*a)},60,${a})`;ctx.lineWidth=Math.max(1.5,sc*.06);ctx.shadowColor='#ffb020';ctx.shadowBlur=8;ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);ctx.stroke();ctx.shadowBlur=0;}
  else if(f.k==='tire'){ctx.fillStyle=`rgba(226,228,234,${.5*a})`;ctx.beginPath();ctx.arc(p[0],p[1],Math.max(3,sc*f.s*1.15),0,7);ctx.fill();}
  else{ctx.fillStyle=`rgba(18,14,22,${.75*a})`;ctx.strokeStyle=`rgba(120,110,130,${.35*a})`;ctx.lineWidth=1;ctx.beginPath();ctx.arc(p[0],p[1],Math.max(3,sc*f.s*.8),0,7);ctx.fill();ctx.stroke();}}}
// Ground e-brake: loose rear, tighter path, drift angle. Plain ground brake never comes through here.
function ebDamp(cur,to,tau,dt){return cur+(to-cur)*(1-Math.exp(-dt/Math.max(0.03,tau)));}
function ebAirHandoff(){if((P.ebK||0)>0.001||Math.abs(P.ebSlip||0)>0.01||(P.donutK||0)>0.001){P.yaw=P.hd;P.ebSlip=0;P.ebK=0;P.donutK=0;P.ebRoll=0;}}
function ebWheel(side){const yaw=P.yaw,cy=Math.cos(yaw),sy=Math.sin(yaw),lx=side*ZDM.wx,lz=ZDM.rAx;return[P.x+lx*cy+lz*sy,(P.gy||0)+0.05,P.z-lx*sy+lz*cy];}
const SKID={L:[],R:[]};
function ebMarks(dt){const T=TUNE,eb=P.ebK||0;if(eb<0.08||!P.ground||P.v<0.8)return;const now=P.simT||0;
  for(const side of[-1,1]){const w=ebWheel(side),arr=side<0?SKID.L:SKID.R,last=arr[arr.length-1];
    if(!last||Math.hypot(w[0]-last.x,w[2]-last.z)>0.28){arr.push({x:w[0],y:w[1],z:w[2],t:now});if(arr.length>640)arr.shift();}}
  const mph=P.v*2.236936,rate=(T.eBrakeSmoke||12)*(0.4+0.6*Math.min(1,mph/30))*(1+(P.donutK||0)*((T.eBrakeDonutSmoke||2.4)-1));
  P._ebFx=(P._ebFx||0)+rate*dt;const n=Math.min(8,P._ebFx|0);P._ebFx-=n;if(!n)return;
  const hx=Math.sin(P.hd),hz=Math.cos(P.hd);
  for(let i=0;i<n;i++){const w=ebWheel(i&1?1:-1),r=brn;FX.push({k:'tire',x:w[0],y:0.22,z:w[2],vx:-hx*Math.min(P.v,12)*0.12+(r()-.5)*1.4,vy:0.8+r()*1.6,vz:-hz*Math.min(P.v,12)*0.12+(r()-.5)*1.4,life:0.55+r()*0.55,t:0,s:0.8+r()*((P.donutK||0)>0.5?1.6:0.9)});}
  if(FX.length>600)FX.splice(0,FX.length-600);}
function drawSkids(){const life=TUNE.eBrakeSkidLife||3.6,now=P.simT||0;if(!SKID.L.length&&!SKID.R.length)return;ctx.save();ctx.lineCap='round';ctx.lineJoin='round';
  for(const arr of[SKID.L,SKID.R]){while(arr.length&&now-arr[0].t>life)arr.shift();
    for(let i=1;i<arr.length;i++){const a=arr[i-1],b=arr[i];if(Math.hypot(b.x-a.x,b.z-a.z)>2.8)continue;const al=clamp(1-(now-b.t)/life,0,1);if(al<=0.02)continue;
      const p=proj(a.x,a.y,a.z),q=proj(b.x,b.y,b.z);if(!p||!q)continue;const w=Math.max(1.2,(H*0.9/((p[2]+q[2])*0.5))*0.16);
      ctx.strokeStyle=`rgba(255,120,180,${(0.22*al).toFixed(3)})`;ctx.lineWidth=w*2.4;ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);ctx.stroke();
      ctx.strokeStyle=`rgba(236,236,242,${(0.82*al).toFixed(3)})`;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);ctx.stroke();}}
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
