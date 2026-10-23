'use strict';
let fps=60,fpsAcc=0,fpsN=0;
function render(){const _vs=visApply();
  // chase cam: smoothed behind the plane
  if(FLYCAM.orbit){const o=FLYCAM.orbit,tx=P.x,ty=P.y+.6,tz=P.z,ay=P.yaw+o.az;cam.x=tx+Math.sin(ay)*Math.cos(o.el)*o.d;cam.z=tz+Math.cos(ay)*Math.cos(o.el)*o.d;cam.y=ty+Math.sin(o.el)*o.d;
    const dx=tx-cam.x,dy=ty-cam.y,dz=tz-cam.z;cam.yaw=Math.atan2(dx,dz);cam.pitch=Math.atan2(-dy,Math.hypot(dx,dz));cam.roll=0;}else{
  const back=FLYCAM.back,up=FLYCAM.up,ty=P.y+ZV.ty,cp=Math.cos(P.pitch);
  let aim=P.yaw;if((P.ebK||0)>0.02){const dh=Math.atan2(Math.sin((P.hd||0)-P.yaw),Math.cos((P.hd||0)-P.yaw));aim=P.yaw+dh*P.ebK;}
  cam.x=P.x-Math.sin(aim)*cp*back;cam.z=P.z-Math.cos(aim)*cp*back;cam.y=Math.max(1,ty-Math.sin(P.pitch)*back+up);
  {const dx=P.x-cam.x,dy=ty-cam.y,dz=P.z-cam.z;cam.yaw=Math.atan2(dx,dz);cam.pitch=Math.atan2(-dy,Math.hypot(dx,dz));}cam.roll=0;} /* locked chase cam: behind on heading+pitch, car dead centre, horizon level */
  // sky + horizon
  ctx.fillStyle='#05020c';ctx.fillRect(0,0,W,H);
  const rl=cam.roll;cam.roll=0;const hz=proj(cam.x+Math.sin(cam.yaw)*1e5,cam.y,cam.z+Math.cos(cam.yaw)*1e5);cam.roll=rl;const hy=hz?hz[1]:H/2;
  ctx.save();ctx.translate(W/2,H/2);ctx.rotate(cam.roll);ctx.translate(-W/2,-H/2);
  const g=ctx.createLinearGradient(0,hy-H,0,hy);g.addColorStop(0,'#05020c');g.addColorStop(.7,'#2a0636');g.addColorStop(1,'#ff2a3d');ctx.fillStyle=g;ctx.fillRect(-W,hy-H*2,W*3,H*2);
  const gg=ctx.createLinearGradient(0,hy,0,hy+H);gg.addColorStop(0,'#1a0410');gg.addColorStop(1,'#020203');ctx.fillStyle=gg;ctx.fillRect(-W,hy,W*3,H*2);
  ctx.strokeStyle='#ff5a66';ctx.lineWidth=2;ctx.shadowColor='#ff2a3d';ctx.shadowBlur=14;ctx.beginPath();ctx.moveTo(-W,hy);ctx.lineTo(W*2,hy);ctx.stroke();ctx.shadowBlur=0;ctx.restore();
  // grid
  const S=40,N=22,gx=Math.round(cam.x/S)*S,gz=Math.round(cam.z/S)*S;ctx.globalAlpha=.55;
  for(let i=-N;i<=N;i++){line([gx+i*S,0,gz-N*S],[gx+i*S,0,gz+N*S],'#7a1a8a',1);line([gx-N*S,0,gz+i*S],[gx+N*S,0,gz+i*S],'#7a1a8a',1);}
  ctx.globalAlpha=1;
  // towers (far to near)
  drawCityGround();if(!RWXRAY.on)drawRunway();const items=[];cityItems(items);if(window.TRAFFIC)TRAFFIC.collect(items);for(const r of rings)items.push([(r.x-cam.x)**2+(r.z-cam.z)**2,'r',r]);items.sort((a,b)=>b[0]-a[0]);
  for(const[d,k,o]of items){if(d>2200*2200)continue;ctx.globalAlpha=clamp(1.4-Math.sqrt(d)/1800,0.15,1);
    if(k==='t'){ctx.globalAlpha=1;if(o.draw)o.draw(Math.sqrt(d));else drawBldg(o,Math.sqrt(d));}
    else{ctx.shadowColor='#ffb020';ctx.shadowBlur=8;let prev=null;for(let i=0;i<=16;i++){const a=i/16*Math.PI*2,px=o.x+Math.cos(o.yaw)*Math.cos(a)*o.r,pz=o.z+Math.sin(o.yaw)*Math.cos(a)*o.r,p=[px,o.y+Math.sin(a)*o.r,pz];if(prev)line(prev,p,'#ffb020',3);prev=p;}ctx.shadowBlur=0;}}
  ctx.globalAlpha=1;farFlush();drawTunnelInside();
  // shadow on ground
  const sh=proj(P.x,(P.ground?P.y:P.gy||0)+0.35,P.z);if(sh){ctx.fillStyle='rgba(255,42,61,.25)';ctx.beginPath();ctx.ellipse(sh[0],sh[1],Math.max(2,900/sh[2]),Math.max(1,300/sh[2]),0,0,7);ctx.fill();}
  if(RWXRAY.on)drawRunway();drawSkids();P.y+=P.sus||0;if(window.CREW)CREW.update();drawZ();P.y-=P.sus||0;drawWaterline();drawFX();
  visRestore(_vs);drawHud(hudDt);}
let last=performance.now(),hudDt=1/60;
function loop(t){const dt=Math.min(0.05,(t-last)/1000);last=t;fpsAcc+=dt;fpsN++;if(fpsAcc>0.5){fps=fpsN/fpsAcc;fpsAcc=0;fpsN=0;}
  hudDt=dt;if(flying&&!paused)step(dt);if(window.TOWDRIVE&&!paused)TOWDRIVE.update(dt);if(window.TRAFFIC&&!paused)TRAFFIC.update(dt);if(window.SOCCER)SOCCER.frame(dt);render();requestAnimationFrame(loop);}
requestAnimationFrame(loop);
document.getElementById('ready').addEventListener('click',async()=>{goFull();TL.a0=screenAngle();orientFix();await allowTilt();tiltCenter();flying=true;document.getElementById('kOver').classList.add('hidden');document.getElementById('kMenuB').classList.remove('hidden');toast('FLY!');});

document.getElementById('kWrR').addEventListener('click',()=>{reset();kToast('BACK ON THE RUNWAY');});document.getElementById('kWrH').addEventListener('click',()=>{location.href='jr.html';});
// On-screen TILT button removed. Pause-menu ⊙ TILT CENTER still calls tiltCenter(); tilt input itself is unchanged.
window.FLY={VP,visPose,CITY,CDRAW,P,TUNE,TL,FLYCAM,cam,proj,FX,showWreck,get fps(){return fps;}};
