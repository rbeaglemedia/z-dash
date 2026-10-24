'use strict';
const ZV={yawOff:0,yawSign:1,rollSign:1,win:7,ty:0.6,maxPx:560,res:1,every:1,lowT:0,highT:0,frame:0,cv:null,camDist:Math.hypot(10,2),flameCv:null,nosFlameCv:null};  // sprite window (m across), target height. cv is the player's own 2D cache (never the live WebGL canvas). camDist locks the chase-cam sprite size.
// 370Z SUPERCHARGER exits in the sprite model (+X nose, +Y up). Each row is the nozzle, then a point up the pipe, so the flame runs out the tip.
const ZTIP=[[-2.0648,0.2984,0.3958,-1.8477,0.2992,0.3317],[-2.0643,0.2972,-0.3945,-1.8477,0.2992,-0.3316]];
function zFlameCvs(){if(ZV.flameCv)return;const bake=(nos)=>{const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d'),r=g.createRadialGradient(32,32,0,32,32,32);r.addColorStop(0,nos?'rgba(255,255,255,.95)':'rgba(160,245,255,.85)');r.addColorStop(.4,nos?'rgba(62,230,255,.8)':'rgba(62,230,255,.45)');r.addColorStop(1,'rgba(62,230,255,0)');g.fillStyle=r;g.fillRect(0,0,64,64);return c;};ZV.flameCv=bake(0);ZV.nosFlameCv=bake(1);}
function drawZ(){if(window.NOZ)return;const X=window.ZD&&ZD.Xray;if(!X||!X.ready||!ZGL.ensure())return;
  ZGL.set(P.tf);if(window.GARAGEZ)GARAGEZ.apply(X);
  const c0=camS(P.x,P.y+ZV.ty,P.z);if(c0[2]<1)return;const sc=scr(c0);ZV.scr=[sc[0]/W,sc[1]/H];
  const d0=(typeof FLYCAM!=='undefined'&&FLYCAM.orbit)?FLYCAM.orbit.d:(ZV.camDist||Math.hypot(FLYCAM.back||10,FLYCAM.up||2));
  const f=H*0.9,px=Math.round(clamp(f/d0*ZV.win,40,ZV.maxPx));ZV.dispPx=px;const rp=(typeof zSpriteBudget==='function')?zSpriteBudget(px*(ZV.res||1)):Math.max(32,Math.round(px*(ZV.res||1)/16)*16);
  const dx=cam.x-P.x,dz=cam.z-P.z,dy=cam.y-(P.y+ZV.ty),hd=Math.hypot(dx,dz),ca=Math.atan2(dx,dz);
  const relYaw=Math.atan2(Math.sin(ca-P.yaw),Math.cos(ca-P.yaw)),elev=Math.atan2(dy,hd)-P.pitch*Math.cos(relYaw);
  const dist=ZV.win/(2*Math.tan(13*Math.PI/180));
  ZV.frame++;
  // Open air on the phone sits near 57fps, inside the old 50–58 gap, so this skip never
  // armed and a one-frame recovery flipped straight back. Every 2nd frame is the same
  // sprite. Stay there until the rate is actually above 115.
  if(fps<58){ZV.highT=0;ZV.lowT+=1/Math.max(fps,1);if(ZV.lowT>1)ZV.every=2;}
  else if(fps>115){ZV.highT+=1/Math.max(fps,1);if(ZV.highT>0.5){ZV.lowT=0;ZV.every=1;}}
  else ZV.highT=0;
  // Traffic bakes share this GL buffer and zero _w/_h. That is not a player-size change.
  // The blit stays at the city budget (pixelRatio 1). A short GL buffer is not cached.
  // A connected #zCar (or the GL canvas itself, once the FPS branch inserts it)
  // is the same picture: same side, same rect, no 2D copy.
  const layer=(typeof zCarLayer==='function')?zCarLayer(X):null;
  if(ZV.frame%ZV.every===0||ZV.lastPx!==rp){const opts={xray:false,showroom:!(window.GARAGEZ&&GARAGEZ.on),yaw:ZV.yawOff+ZV.yawSign*relYaw,pitch:elev,dist,tx:0,ty:ZV.ty,fov:26,drl:1,kid:KID,st:{t:performance.now()/1000,throttle:30+P.thr*70}};
    if(typeof zPaintCar==='function'&&zPaintCar(X,rp,opts,!layer))ZV.lastPx=rp;}
  const roll=(P.bank+(P.ebRoll||0)-cam.roll)*ZV.rollSign;
  if(layer){if(typeof zResPlaceCar==='function')zResPlaceCar(layer,sc[0],sc[1],px,roll);}
  else if(ZV.cv&&ZV.cv.width>=rp-1&&ZV.cv.height>=rp-1){ctx.save();ctx.translate(sc[0],sc[1]);ctx.rotate(roll);ctx.drawImage(ZV.cv,0,0,ZV.cv.width,ZV.cv.height,-px/2,-px/2,px,px);ctx.restore();}
  zFlameCvs();const yaw=ZV.yawOff+ZV.yawSign*relYaw,pit=elev,cy=Math.cos(yaw),sy=Math.sin(yaw),cP=Math.cos(pit),sP=Math.sin(pit);
  const tx=0,ty=ZV.ty,ex=tx+cy*cP*dist,ey=ty+sP*dist,ez=sy*cP*dist;let zx=ex-tx,zy=ey-ty,zz=ez,zl=Math.hypot(zx,zy,zz)||1;zx/=zl;zy/=zl;zz/=zl;
  let xx=zz,xy=0,xz=-zx,xl=Math.hypot(xx,xz);if(xl<1e-6){zz+=1e-4;zl=Math.hypot(zx,zy,zz);zx/=zl;zy/=zl;zz/=zl;xx=zz;xz=-zx;xl=Math.hypot(xx,xz);}xx/=xl;xz/=xl;
  const yx=zy*xz-zz*xy,yy=zz*xx-zx*xz,yz=zx*xy-zy*xx,fov=1/Math.tan(13*Math.PI/180),cr=Math.cos(roll),sr=Math.sin(roll);
  const spPt=(x,y,z)=>{const dx=x-ex,dy=y-ey,dz=z-ez,vx=dx*xx+dy*xy+dz*xz,vy=dx*yx+dy*yy+dz*yz,vz=dx*zx+dy*zy+dz*zz;if(vz>=-0.05)return null;const nx=vx*fov/-vz,ny=vy*fov/-vz,lx=nx*px/2,ly=-ny*px/2;return[sc[0]+lx*cr-ly*sr,sc[1]+lx*sr+ly*cr];};
  ctx.globalCompositeOperation='lighter';const nos=P.nosT?1:0,img=nos?ZV.nosFlameCv:ZV.flameCv;
  for(const t of ZTIP){const p=spPt(t[0],t[1],t[2]);if(!p)continue;let dx=t[0]-t[3],dy=t[1]-t[4],dz=t[2]-t[5],dl=Math.hypot(dx,dy,dz)||1;dx/=dl;dy/=dl;dz/=dl;const fl=.85+Math.random()*.3,r=Math.max(2,f/d0*(.10+P.thr*.18+(nos?.28:0))*fl);
    ctx.drawImage(img,p[0]-r,p[1]-r,r*2,r*2);
    if(TUNE.jetEngines){const len=(1.5+P.thr*3)*fl*P.tf,q=spPt(t[0]+dx*len,t[1]+dy*len,t[2]+dz*len);if(q){ctx.strokeStyle='#3ee6ff';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);ctx.stroke();}}}
  ctx.globalCompositeOperation='source-over';}
function zCarSide(){
  const d0=(typeof ZV!=='undefined'&&ZV&&ZV.camDist)||Math.hypot(10,2);
  const HH=(typeof H!=='undefined'&&H)||window.innerHeight||800;
  const maxPx=(ZV&&ZV.maxPx)||560,win=(ZV&&ZV.win)||7;
  const px=Math.round(Math.max(40,Math.min(maxPx,HH*0.9/d0*win)));
  return (typeof zSpriteBudget==='function')?zSpriteBudget(px*(ZV.res||1)):Math.max(32,Math.round(px/16)*16);
}
// Warm the car shaders at the real blit size. A 64px pass left the shared GL
// canvas small, and the next drawImage showed that bitmap stretched.
function zWarmGpu(){
  try{
    const X=window.ZD&&ZD.Xray;
    if(!X||!X.ready||typeof ZGL==='undefined'||!ZGL.ensure())return false;
    ZGL.set(typeof P!=='undefined'&&P?P.tf:0);
    const side=zCarSide();
    const opts={xray:false,showroom:true,yaw:0.6,pitch:0.15,dist:12,tx:0,ty:(ZV&&ZV.ty)||0.6,fov:26,drl:1,kid:(typeof KID!=='undefined'?KID:null),st:{t:0,throttle:40}};
    if(typeof zPaintCar!=='function'||!zPaintCar(X,side,opts))return false;
    ZV.lastPx=side;
    return true;
  }catch(e){return false;}
}
