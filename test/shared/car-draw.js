'use strict';
const ZV={yawOff:0,yawSign:1,rollSign:1,win:7,ty:0.6,maxPx:560,res:1,every:1,lowT:0,highT:0,frame:0,cv:null,camDist:Math.hypot(10,2),flameCv:null,nosFlameCv:null,drew:0,carEma:0,carN:0,hold:0,carMs:0,switches:0};  // sprite window (m across), target height. The player sees the WebGL canvas itself. camDist locks the chase-cam sprite size.
// ?nocarskip=1 draws the car sprite every frame so a phone can tell a blank
// readback from the every-other-frame skip. Absent the flag, pacing is unchanged.
const Z_NOCARSKIP=/[?&]nocarskip=1/.test(location.search);
window.Z_NOCARSKIP=Z_NOCARSKIP;
if(Z_NOCARSKIP)ZV.every=1;
// 370Z SUPERCHARGER exits in the sprite model (+X nose, +Y up). Each row is the nozzle, then a point up the pipe, so the flame runs out the tip.
const ZTIP=[[-2.0648,0.2984,0.3958,-1.8477,0.2992,0.3317],[-2.0643,0.2972,-0.3945,-1.8477,0.2992,-0.3316]];
function zFlameCvs(){if(ZV.flameCv)return;const bake=(nos)=>{const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d'),r=g.createRadialGradient(32,32,0,32,32,32);r.addColorStop(0,nos?'rgba(255,255,255,.95)':'rgba(160,245,255,.85)');r.addColorStop(.4,nos?'rgba(62,230,255,.8)':'rgba(62,230,255,.45)');r.addColorStop(1,'rgba(62,230,255,0)');g.fillStyle=r;g.fillRect(0,0,64,64);return c;};ZV.flameCv=bake(0);ZV.nosFlameCv=bake(1);}
function drawZ(){ZV.drew=0;if(window.NOZ){zHideCar();return;}const X=window.ZD&&ZD.Xray;if(!X||!X.ready||!ZGL.ensure()){zHideCar();return;}
  ZGL.set(P.tf);if(window.GARAGEZ)GARAGEZ.apply(X);
  const c0=camS(P.x,P.y+ZV.ty,P.z);if(c0[2]<1){zHideCar();return;}const sc=scr(c0);ZV.scr=[sc[0]/W,sc[1]/H];
  const d0=(typeof FLYCAM!=='undefined'&&FLYCAM.orbit)?FLYCAM.orbit.d:(ZV.camDist||Math.hypot(FLYCAM.back||10,FLYCAM.up||2));
  const f=H*0.9,px=Math.round(clamp(f/d0*ZV.win,40,ZV.maxPx)),rp=Math.max(32,Math.round(px*ZV.res/16)*16);
  const dx=cam.x-P.x,dz=cam.z-P.z,dy=cam.y-(P.y+ZV.ty),hd=Math.hypot(dx,dz),ca=Math.atan2(dx,dz);
  const relYaw=Math.atan2(Math.sin(ca-P.yaw),Math.cos(ca-P.yaw)),elev=Math.atan2(dy,hd)-P.pitch*Math.cos(relYaw);
  const dist=ZV.win/(2*Math.tan(13*Math.PI/180));
  ZV.frame++;
  // The WebGL canvas is the sprite the player sees. Nothing copies it into the
  // city canvas. A skipped frame leaves that canvas where it is and only moves it.
  ZV.drew=ZV.frame%ZV.every===0||ZV.lastPx!==rp;
  if(ZV.drew){const tCar=performance.now();X.render(ctx,0,0,rp,rp,{xray:false,showroom:!(window.GARAGEZ&&GARAGEZ.on),yaw:ZV.yawOff+ZV.yawSign*relYaw,pitch:elev,dist,tx:0,ty:ZV.ty,fov:26,drl:1,noDraw:true,kid:KID,st:{t:performance.now()/1000,throttle:30+P.thr*70}});
    ZV.carMs=performance.now()-tCar;
    if(window.perfAdd)window.perfAdd('carGl',ZV.carMs);}
  else ZV.carMs=0;
  if(window.Z_PERF&&window.Z_PERF.on&&!ZV.drew)window.Z_PERF.skipN=(window.Z_PERF.skipN||0)+1;
  ZV.lastPx=rp;const roll=(P.bank+(P.ebRoll||0)-cam.roll)*ZV.rollSign;
  // Layers first, then the car, so the car stays under the flame and HUD canvases.
  if(typeof zEnsureLayers==='function')zEnsureLayers();
  zPlaceCar(X,sc,px,roll);
  const tFl=window.perfAdd?performance.now():0;
  const holdCtx=ctx;
  if(typeof zFlameCtx!=='undefined'&&zFlameCtx){zFlameCtx.setTransform(DPR,0,0,DPR,0,0);zFlameCtx.clearRect(0,0,W,H);zFlameCtx.globalAlpha=1;zFlameCtx.globalCompositeOperation='source-over';zFlameCtx.shadowBlur=0;ctx=zFlameCtx;}
  try{
  zFlameCvs();const yaw=ZV.yawOff+ZV.yawSign*relYaw,pit=elev,cy=Math.cos(yaw),sy=Math.sin(yaw),cP=Math.cos(pit),sP=Math.sin(pit);
  const tx=0,ty=ZV.ty,ex=tx+cy*cP*dist,ey=ty+sP*dist,ez=sy*cP*dist;let zx=ex-tx,zy=ey-ty,zz=ez,zl=Math.hypot(zx,zy,zz)||1;zx/=zl;zy/=zl;zz/=zl;
  let xx=zz,xy=0,xz=-zx,xl=Math.hypot(xx,xz);if(xl<1e-6){zz+=1e-4;zl=Math.hypot(zx,zy,zz);zx/=zl;zy/=zl;zz/=zl;xx=zz;xz=-zx;xl=Math.hypot(xx,xz);}xx/=xl;xz/=xl;
  const yx=zy*xz-zz*xy,yy=zz*xx-zx*xz,yz=zx*xy-zy*xx,fov=1/Math.tan(13*Math.PI/180),cr=Math.cos(roll),sr=Math.sin(roll);
  const spPt=(x,y,z)=>{const dx=x-ex,dy=y-ey,dz=z-ez,vx=dx*xx+dy*xy+dz*xz,vy=dx*yx+dy*yy+dz*yz,vz=dx*zx+dy*zy+dz*zz;if(vz>=-0.05)return null;const nx=vx*fov/-vz,ny=vy*fov/-vz,lx=nx*px/2,ly=-ny*px/2;return[sc[0]+lx*cr-ly*sr,sc[1]+lx*sr+ly*cr];};
  ctx.globalCompositeOperation='lighter';const nos=P.nosT?1:0,img=nos?ZV.nosFlameCv:ZV.flameCv;
  for(const t of ZTIP){const p=spPt(t[0],t[1],t[2]);if(!p)continue;let dx=t[0]-t[3],dy=t[1]-t[4],dz=t[2]-t[5],dl=Math.hypot(dx,dy,dz)||1;dx/=dl;dy/=dl;dz/=dl;const fl=.85+Math.random()*.3,r=Math.max(2,f/d0*(.10+P.thr*.18+(nos?.28:0))*fl);
    ctx.drawImage(img,p[0]-r,p[1]-r,r*2,r*2);
    if(TUNE.jetEngines){const len=(1.5+P.thr*3)*fl*P.tf,q=spPt(t[0]+dx*len,t[1]+dy*len,t[2]+dz*len);if(q){ctx.strokeStyle='#3ee6ff';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);ctx.stroke();}}}
  ctx.globalCompositeOperation='source-over';
  }finally{if(ctx!==holdCtx)ctx=holdCtx;}
  if(tFl)window.perfAdd('flame',performance.now()-tFl);}
function zHideCar(){const el=document.getElementById('zCar');if(el)el.style.visibility='hidden';}
function zPlaceCar(X,sc,px,roll){
  const el=X&&X.canvas;if(!el||typeof cv==='undefined')return;
  if(typeof zEnsureLayers==='function')zEnsureLayers();
  ZV.live=1;
  el.id='zCar';el.setAttribute('aria-hidden','true');
  const parent=cv.parentElement||document.body;
  const flame=document.getElementById('zFlame');
  // Keep #c, #zCar, #zFlame, #zTop. A first insert used to land the car above the HUD.
  if(el.parentNode!==parent||(flame&&el.nextElementSibling!==flame)){
    if(flame&&flame.parentNode===parent)parent.insertBefore(el,flame);
    else parent.insertBefore(el,cv.nextSibling);
  }
  const rect=cv.getBoundingClientRect(),host=(cv.parentElement||cv).getBoundingClientRect();
  const sx=rect.width/Math.max(1,W),sy=rect.height/Math.max(1,H),w=px*sx,h=px*sy;
  el.style.position='absolute';
  el.style.left=(rect.left-host.left+(sc[0]-px/2)*sx)+'px';
  el.style.top=(rect.top-host.top+(sc[1]-px/2)*sy)+'px';
  el.style.width=w+'px';el.style.height=h+'px';
  el.style.right='auto';el.style.bottom='auto';
  el.style.margin='0';el.style.padding='0';
  el.style.transformOrigin='50% 50%';
  el.style.transform='rotate('+roll+'rad)';
  el.style.visibility='visible';
  el.style.pointerEvents='none';
  el.style.background='transparent';
}
// A 120 Hz panel presents a frame that finishes under ~8.3 ms at full rate, and
// the next slot (16.6 ms, about 60 FPS) when it misses. Skipping the car on
// every other frame is the fast slot. The 70–90 reading is those two slots
// averaged. Testing that average against 90 turns the car back on, every frame
// misses, and the meter falls through the 50s. Decide from the car frame only,
// and keep a gap around the 8.3 ms slot so the 70–90 band cannot change its mind.
// Highest alpha among the sprite center and four mid-edge points. A cleared
// readback is 0 across the body; one transparent window is not.
function zFlickA(g,cv){
  if(!g||!cv||cv.width<4||cv.height<4)return -1;
  const w=cv.width,h=cv.height,pts=[[w>>1,h>>1],[w>>2,h>>1],[w-(w>>2),h>>1],[w>>1,h>>2],[w>>1,h-(h>>2)]];
  let max=0;
  for(let i=0;i<pts.length;i++){
    const d=g.getImageData(pts[i][0],pts[i][1],1,1).data;
    if(d[3]>max)max=d[3];
    if(max>16)break;
  }
  return max;
}
function zFlickCar(X){
  if(!ZV.cv||!ZV.cvg)return;
  if(!ZV.glHook&&X&&X.canvas){
    ZV.glHook=1;
    X.canvas.addEventListener('webglcontextlost',function(){if(window.flickNote)window.flickNote('car','gl-lost','');});
  }
  const a=zFlickA(ZV.cvg,ZV.cv);
  ZV.flickA=a;
  const p=window.Z_PERF;
  if(!ZV.drew)p.skipN=(p.skipN||0)+1;
  if(!(a>=0)||a>=8)return;
  const why=[];
  if(!ZV.drew)why.push('skip');
  if(p.glResizeFrame&&p.glResizeFrame===p.opened)why.push('gl-resize');
  if(p.cacheResizeFrame&&p.cacheResizeFrame===p.opened)why.push('cache-resize');
  if(p.trafficBakeAt&&performance.now()-p.trafficBakeAt<100)why.push('traffic-bake');
  try{const gl=X&&X.renderer&&X.renderer.getContext&&X.renderer.getContext();if(gl&&gl.isContextLost())why.push('gl-lost');}catch(e){}
  if(window.flickNote)window.flickNote('car',why.length?why.join('+'):'readback-empty','a'+a+' '+(ZV.cv.width+'x'+ZV.cv.height));
}
function zRate(frameMs,drew){
  if(Z_NOCARSKIP){ZV.every=1;return 1;}
  if(!drew||!(frameMs>0))return ZV.every;
  const ms=Math.min(40,frameMs);
  ZV.carEma=ZV.carN?ZV.carEma+(ms-ZV.carEma)*0.2:ms;
  ZV.carN++;
  if(ZV.carN<=6)return ZV.every;
  if(ZV.every===1){
    if(ZV.carEma>8.6){ZV.hold+=ms;if(ZV.hold>500){ZV.every=2;ZV.hold=0;ZV.switches++;}}
    else ZV.hold=0;
  }else if(ZV.carEma<7.2){
    ZV.hold+=ms;if(ZV.hold>700){ZV.every=1;ZV.hold=0;ZV.switches++;}}
  else ZV.hold=0;
  return ZV.every;
}
// One tiny render so the car shaders and lights compile before the first flying frame.
// noDraw keeps it off the city canvas. The sprite the player sees is unchanged.
function zWarmGpu(){
  try{
    const X=window.ZD&&ZD.Xray;
    if(!X||!X.ready||typeof ZGL==='undefined'||!ZGL.ensure())return false;
    ZGL.set(typeof P!=='undefined'&&P?P.tf:0);
    X.render(ctx,0,0,64,64,{xray:false,showroom:true,yaw:0.6,pitch:0.15,dist:12,tx:0,ty:0.6,fov:26,drl:1,noDraw:true,kid:(typeof KID!=='undefined'?KID:null),st:{t:0,throttle:40}});
    return true;
  }catch(e){return false;}
}
