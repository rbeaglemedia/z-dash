'use strict';
const ZV={yawOff:0,yawSign:1,rollSign:1,win:7,ty:0.6,maxPx:560,res:1,every:1,lowT:0,frame:0,cv:null,camDist:Math.hypot(10,2)};  // sprite window (m across), target height. cv is the player's own 2D cache (never the live WebGL canvas). camDist locks the chase-cam sprite size.
function drawZ(){if(window.NOZ)return;const X=window.ZD&&ZD.Xray;if(!X||!X.ready||!ZGL.ensure())return;
  ZGL.set(P.tf);if(window.GARAGEZ)GARAGEZ.apply(X);
  const c0=camS(P.x,P.y+ZV.ty,P.z);if(c0[2]<1)return;const sc=scr(c0);ZV.scr=[sc[0]/W,sc[1]/H];
  const d0=(typeof FLYCAM!=='undefined'&&FLYCAM.orbit)?FLYCAM.orbit.d:(ZV.camDist||Math.hypot(FLYCAM.back||10,FLYCAM.up||2));
  const f=H*0.9,px=Math.round(clamp(f/d0*ZV.win,40,ZV.maxPx)),rp=Math.max(32,Math.round(px*ZV.res/16)*16);
  const dx=cam.x-P.x,dz=cam.z-P.z,dy=cam.y-(P.y+ZV.ty),hd=Math.hypot(dx,dz),ca=Math.atan2(dx,dz);
  const relYaw=Math.atan2(Math.sin(ca-P.yaw),Math.cos(ca-P.yaw)),elev=Math.atan2(dy,hd)-P.pitch*Math.cos(relYaw);
  const dist=ZV.win/(2*Math.tan(13*Math.PI/180));
  ZV.frame++;if(fps<50){ZV.lowT+=1/Math.max(fps,1);if(ZV.lowT>2)ZV.every=2;}else if(fps>58){ZV.lowT=0;ZV.every=1;}   // adaptive: slow GPU -> redraw the car sprite every 2nd frame (same look)
  if(!ZV.cv){ZV.cv=document.createElement('canvas');ZV.cvg=ZV.cv.getContext('2d',{alpha:true});}
  if(ZV.frame%ZV.every===0||ZV.lastPx!==rp||X._w!==rp||X._h!==rp){X.render(ctx,0,0,rp,rp,{xray:false,showroom:!(window.GARAGEZ&&GARAGEZ.on),yaw:ZV.yawOff+ZV.yawSign*relYaw,pitch:elev,dist,tx:0,ty:ZV.ty,fov:26,drl:1,noDraw:true,kid:KID,st:{t:performance.now()/1000,throttle:30+P.thr*70}});
    const src=X.canvas;if(ZV.cv.width!==src.width||ZV.cv.height!==src.height){ZV.cv.width=src.width;ZV.cv.height=src.height;}
    ZV.cvg.setTransform(1,0,0,1,0,0);ZV.cvg.clearRect(0,0,ZV.cv.width,ZV.cv.height);ZV.cvg.drawImage(src,0,0);}
  ZV.lastPx=rp;ctx.save();ctx.translate(sc[0],sc[1]);ctx.rotate((P.bank+(P.ebRoll||0)-cam.roll)*ZV.rollSign);ctx.drawImage(ZV.cv,0,0,ZV.cv.width,ZV.cv.height,-px/2,-px/2,px,px);ctx.restore();
  const cb=Math.cos(P.bank),sb=Math.sin(P.bank),cp=Math.cos(P.pitch),sp=Math.sin(P.pitch),cy=Math.cos(P.yaw),sy=Math.sin(P.yaw);
  const T=([x,y,z])=>{let X2=x*cb-y*sb,Y=x*sb+y*cb,Z=z;let Y2=Y*cp+Z*sp,Z2=-Y*sp+Z*cp;return[P.x+X2*cy+Z2*sy,P.y+Y2,P.z-X2*sy+Z2*cy];};
  ctx.globalCompositeOperation='lighter';
  for(const x of[-.48,.48]){const p=proj(...T([x,.30,-2.16]));if(!p)continue;const fl=.85+Math.random()*.3,r=Math.max(2,f/d0*(.10+P.thr*.18+(P.nosT?.28:0))*fl);
    const g=ctx.createRadialGradient(p[0],p[1],0,p[0],p[1],r);g.addColorStop(0,P.nosT?'rgba(255,255,255,.95)':'rgba(160,245,255,.85)');g.addColorStop(.4,P.nosT?'rgba(62,230,255,.8)':'rgba(62,230,255,.45)');g.addColorStop(1,'rgba(62,230,255,0)');
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(p[0],p[1],r,0,7);ctx.fill();
    if(TUNE.jetEngines){const q=proj(...T([x,.30,-2.16-(1.5+P.thr*3)*fl*P.tf]));if(q){ctx.strokeStyle='#3ee6ff';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);ctx.stroke();}}}
  ctx.globalCompositeOperation='source-over';}
